import { Room, Player, PlayerPublic } from "./types"

const rooms = new Map<string, Room>()

export function generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  // no confusing chars
    let code = ""
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    // make sure it's unique
    return rooms.has(code) ? generateRoomCode() : code
}

export function createRoom(passage: string, roomCode?: string): Room {
    const code = roomCode ?? generateRoomCode()
    const room: Room = {
        id: code,
        passage,
        status: "waiting",
        players: new Map(),
        startedAt: null,
        placementCounter: 0,
        countdownTimer: null,
        gracePeriodTimer: null,
        raceLimitTimer: null,
        idleTimer: null,
        cleanupTimer: null,
    }
    rooms.set(code, room)
    return room
}

export function getRoom(code: string): Room | undefined {
    return rooms.get(code)
}

export function deleteRoom(code: string): void {
    const room = rooms.get(code)
    if (room) {
        if (room.countdownTimer) clearTimeout(room.countdownTimer)
        if (room.gracePeriodTimer) clearTimeout(room.gracePeriodTimer)
        if (room.raceLimitTimer) clearTimeout(room.raceLimitTimer)
        if (room.idleTimer) clearTimeout(room.idleTimer)
        if (room.cleanupTimer) clearTimeout(room.cleanupTimer)
        rooms.delete(code)
    }
}

export function addPlayer(room: Room, player: Player): void {
    room.players.set(player.socketId, player)
}

export function removePlayer(room: Room, socketId: string): void {
    room.players.delete(socketId)
}

export function getPublicPlayers(room: Room): PlayerPublic[] {
    return [...room.players.values()].map(p => ({
        userId: p.userId,
        displayName: p.displayName,
        progress: p.progress,
        wpm: p.wpm,
        placement: p.placement,
        isReady: p.isReady,
        finishedAt: p.finishedAt,
    }))
}

export function findRoomBySocketId(socketId: string): Room | undefined {
    for (const room of rooms.values()) {
        if (room.players.has(socketId)) return room
    }
    return undefined
}