import { createServer } from "http"
import { Server } from "socket.io"
import { createClient } from "redis"
import { createAdapter } from "@socket.io/redis-adapter"
import * as dotenv from "dotenv"
import {
    ClientToServerEvents,
    ServerToClientEvents,
    PlayerPublic,
    Room,
} from "./types"
import {
    createRoom,
    getRoom,
    deleteRoom,
    addPlayer,
    removePlayer,
    getPublicPlayers,
    findRoomBySocketId,
} from "./rooms"
import { getRandomPassage } from "./passages"

dotenv.config()

const httpServer = createServer()

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// ── Redis adapter (enables multi-instance broadcasting) ──────────
async function connectRedis() {
    const pubClient = createClient({ url: process.env.REDIS_URL })
    const subClient = pubClient.duplicate()

    pubClient.on("error", (err) => console.error("Redis pub error:", err))
    subClient.on("error", (err) => console.error("Redis sub error:", err))

    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient))
    console.log("Redis adapter connected")
}

// ── constants ─────────────────────────────────────────────────────
const ROOM_IDLE_TIMEOUT_MS = 5 * 60_000   // 5 min waiting room idle timeout
const GRACE_PERIOD_MS      = 30_000        // 30s after first finisher
const ROOM_CLEANUP_MS      = 60_000        // 60s after race ends before deletion

// ── helpers ───────────────────────────────────────────────────────
function broadcastRoomUpdate(room: Room) {
    io.to(room.id).emit("room_update", {
        players: getPublicPlayers(room),
    })
}

/**
 * Start (or reset) the idle timer for a room in "waiting" status.
 * If no race starts within ROOM_IDLE_TIMEOUT_MS, the room is closed.
 */
function resetIdleTimer(room: Room) {
    if (room.idleTimer) {
        clearTimeout(room.idleTimer)
        room.idleTimer = null
    }

    // only set idle timer when room is in waiting state
    if (room.status !== "waiting") return

    room.idleTimer = setTimeout(() => {
        // only close if still waiting
        if (room.status !== "waiting") return

        console.log(`Room ${room.id} timed out (idle for ${ROOM_IDLE_TIMEOUT_MS / 1000}s)`)

        io.to(room.id).emit("room_closed", {
            reason: "Room closed due to inactivity. No race was started within 5 minutes.",
        })

        // give clients a moment to receive the event before cleanup
        setTimeout(() => deleteRoom(room.id), 2000)
    }, ROOM_IDLE_TIMEOUT_MS)
}

function startCountdown(room: Room) {
    room.status = "countdown"

    // clear idle timer — race is starting
    if (room.idleTimer) {
        clearTimeout(room.idleTimer)
        room.idleTimer = null
    }

    broadcastRoomUpdate(room)

    let secondsLeft = 3

    const tick = () => {
        io.to(room.id).emit("countdown", { secondsLeft })

        if (secondsLeft === 0) {
            startRace(room)
            return
        }

        secondsLeft--
        room.countdownTimer = setTimeout(tick, 1000)
    }

    tick()
}

// Dynamic race time limit based on passage word count
function getRaceTimeLimitMs(passage: string): number {
    const wordCount = passage.split(/\s+/).length
    if (wordCount <= 70) return 3 * 60_000      // 3 minutes for ~50 words
    if (wordCount <= 120) return 5 * 60_000     // 5 minutes for ~100 words
    return 8 * 60_000                            // 8 minutes for ~150+ words
}

function startRace(room: Room) {
    room.status = "active"
    room.startedAt = Date.now()

    const timeLimitMs = getRaceTimeLimitMs(room.passage)

    io.to(room.id).emit("race_start", {
        passage: room.passage,
        startedAt: room.startedAt,
    })

    // absolute time limit — race ends after the configured timeout
    room.raceLimitTimer = setTimeout(() => {
        console.log(`Race time limit reached in room ${room.id}`)
        endRace(room)
    }, timeLimitMs)

    console.log(`Race started in room ${room.id} (${timeLimitMs / 1000}s limit)`)
}

function endRace(room: Room) {
    if (room.status === "finished") return   // guard double-fire

    room.status = "finished"

    if (room.gracePeriodTimer) {
        clearTimeout(room.gracePeriodTimer)
        room.gracePeriodTimer = null
    }
    if (room.raceLimitTimer) {
        clearTimeout(room.raceLimitTimer)
        room.raceLimitTimer = null
    }

    // rank any unfinished players by progress, then WPM
    const unfinished = [...room.players.values()]
        .filter(p => p.placement === null)
        .sort((a, b) => b.progress - a.progress || b.wpm - a.wpm)

    unfinished.forEach(p => {
        room.placementCounter++
        p.placement = room.placementCounter
    })

    const results: PlayerPublic[] = getPublicPlayers(room)
        .sort((a, b) => (a.placement ?? 99) - (b.placement ?? 99))

    io.to(room.id).emit("race_end", { results })

    console.log(`Race ended in room ${room.id}`)

    // clean up room after 60s
    room.cleanupTimer = setTimeout(() => deleteRoom(room.id), ROOM_CLEANUP_MS)
}

// ── Socket.IO event handlers ──────────────────────────────────────
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // ── join_room ──────────────────────────────────────────────────
    socket.on("join_room", async ({ roomCode, userId, displayName }) => {
        let room = getRoom(roomCode)

        // create room if it doesn't exist
        if (!room) {
            room = createRoom(await getRandomPassage(), roomCode)
            console.log(`Room created: ${room.id}`)
        }

        // don't allow joining a race already in progress
        if (room.status === "active" || room.status === "finished") {
            socket.emit("error", {
                code: "RACE_IN_PROGRESS",
                message: "This race has already started.",
            })
            return
        }

        // don't allow more than 6 players
        if (room.players.size >= 6) {
            socket.emit("error", {
                code: "ROOM_FULL",
                message: "This room is full (max 6 players).",
            })
            return
        }

        // add player to room
        addPlayer(room, {
            socketId: socket.id,
            userId,
            displayName,
            progress: 0,
            wpm: 0,
            placement: null,
            finishedAt: null,
            isReady: false,
        })

        socket.join(room.id)

        // send the new player the full room state
        socket.emit("room_state", {
            roomCode: room.id,
            passage: room.passage,
            status: room.status,
            players: getPublicPlayers(room),
        })

        // tell everyone else a new player joined
        broadcastRoomUpdate(room)

        // start (or reset) the idle timer — gives 5 min before auto-close
        resetIdleTimer(room)

        console.log(`${displayName} joined room ${room.id} (${room.players.size} players)`)
    })

    // ── player_ready ───────────────────────────────────────────────
    socket.on("player_ready", ({ roomCode }) => {
        const room = getRoom(roomCode)
        if (!room) return

        const player = room.players.get(socket.id)
        if (!player) return

        player.isReady = true
        broadcastRoomUpdate(room)

        // start countdown when ALL players are ready (min 2 players)
        const players = [...room.players.values()]
        const allReady = players.length >= 2 && players.every(p => p.isReady)

        if (allReady && room.status === "waiting") {
            startCountdown(room)
        }
    })

    // ── progress_update ────────────────────────────────────────────
    socket.on("progress_update", ({ roomCode, progress, wpm }) => {
        const room = getRoom(roomCode)
        if (!room || room.status !== "active") return

        const player = room.players.get(socket.id)
        if (!player || player.placement !== null) return  // already finished

        player.progress = progress
        player.wpm = wpm

        // check if this player just finished
        if (progress >= 1.0) {
            room.placementCounter++
            player.placement = room.placementCounter
            player.finishedAt = Date.now()

            io.to(room.id).emit("player_finished", {
                userId: player.userId,
                displayName: player.displayName,
                placement: player.placement,
                wpm: player.wpm,
                timeMs: player.finishedAt - room.startedAt!,
            })

            console.log(`${player.displayName} finished in room ${room.id} — place #${player.placement}`)

            // first finisher: start 30s grace period for remaining players
            if (room.placementCounter === 1) {
                room.gracePeriodTimer = setTimeout(() => endRace(room!), GRACE_PERIOD_MS)
            }

            // end race immediately if all players have finished
            const totalPlayers = room.players.size
            const finishedCount = [...room.players.values()].filter(p => p.placement !== null).length
            if (finishedCount >= totalPlayers) endRace(room)
        }

        // broadcast updated positions to everyone
        broadcastRoomUpdate(room)
    })

    // ── leave_room ─────────────────────────────────────────────────
    socket.on("leave_room", ({ roomCode }) => {
        handleLeave(socket.id, roomCode)
    })

    // ── disconnect (browser closed / network drop) ─────────────────
    socket.on("disconnect", () => {
        const room = findRoomBySocketId(socket.id)
        if (room) {
            handleLeave(socket.id, room.id)
        }
        console.log(`Socket disconnected: ${socket.id}`)
    })
})

function handleLeave(socketId: string, roomCode: string) {
    const room = getRoom(roomCode)
    if (!room) return

    const player = room.players.get(socketId)
    if (player) {
        console.log(`${player.displayName} left room ${roomCode} (${room.status})`)
    }

    removePlayer(room, socketId)

    // ── empty room: clean up immediately ──────────────────────────
    if (room.players.size === 0) {
        console.log(`Room ${roomCode} is empty, deleting`)
        deleteRoom(roomCode)
        return
    }

    // ── waiting state: cancel countdown if < 2 players ────────────
    if (room.status === "countdown" && room.players.size < 2) {
        if (room.countdownTimer) {
            clearTimeout(room.countdownTimer)
            room.countdownTimer = null
        }
        room.status = "waiting"

        // reset ready state for remaining players since countdown was cancelled
        for (const p of room.players.values()) {
            p.isReady = false
        }

        io.to(room.id).emit("room_info", {
            message: "A player left during countdown. Waiting for more players...",
        })

        // restart idle timer since we're back to waiting
        resetIdleTimer(room)
    }

    // ── waiting state: reset idle timer ───────────────────────────
    if (room.status === "waiting") {
        resetIdleTimer(room)
    }

    // ── active race: handle player leaving mid-race ───────────────
    if (room.status === "active") {
        const remaining = [...room.players.values()]
        const unfinished = remaining.filter(p => p.placement === null)

        if (unfinished.length === 0) {
            // all remaining players already finished — end race
            endRace(room)
        } else if (unfinished.length === 1 && remaining.length === 1) {
            // only one player left total and they haven't finished
            // give them a "you win" notification and let them keep typing,
            // but also start the grace period so they aren't stuck forever
            io.to(room.id).emit("room_info", {
                message: "All other players left. You win! Finish typing or wait for the timer.",
            })

            // start a shorter grace period (30s) if not already running
            if (!room.gracePeriodTimer) {
                room.gracePeriodTimer = setTimeout(() => endRace(room), GRACE_PERIOD_MS)
            }
        } else if (remaining.length >= 2) {
            // multiple players still here — notify them
            io.to(room.id).emit("room_info", {
                message: `${player?.displayName ?? "A player"} disconnected.`,
            })
        }
    }

    broadcastRoomUpdate(room)
}

// ── start the server ──────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "4000")

connectRedis().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Socket.IO server running on port ${PORT}`)
    })
}).catch(err => {
    console.error("Failed to connect Redis:", err)
    process.exit(1)
})