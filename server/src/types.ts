export type RaceStatus = "waiting" | "countdown" | "active" | "finished"

export interface Player {
    socketId: string
    userId: string       // NextAuth user id or guest id
    displayName: string
    progress: number       // 0.0 to 1.0 — correct chars only
    wpm: number
    placement: number | null
    finishedAt: number | null
    isReady: boolean
}

export interface Room {
    id: string       // same as the 6-char room code
    passage: string
    status: RaceStatus
    players: Map<string, Player>   // key = socketId
    startedAt: number | null
    placementCounter: number
    countdownTimer: ReturnType<typeof setTimeout> | null
    gracePeriodTimer: ReturnType<typeof setTimeout> | null
    raceLimitTimer: ReturnType<typeof setTimeout> | null
    idleTimer: ReturnType<typeof setTimeout> | null       // lobby idle timeout
    cleanupTimer: ReturnType<typeof setTimeout> | null    // post-race cleanup
}

// ── events CLIENT sends to SERVER ──────────────────────────────
export interface ClientToServerEvents {
    join_room: (payload: {
        roomCode: string
        userId: string
        displayName: string
    }) => void

    player_ready: (payload: { roomCode: string }) => void

    progress_update: (payload: {
        roomCode: string
        progress: number   // 0.0–1.0
        wpm: number
    }) => void

    leave_room: (payload: { roomCode: string }) => void
}

// ── events SERVER sends to CLIENT ──────────────────────────────
export interface ServerToClientEvents {
    room_state: (payload: {
        roomCode: string
        passage: string
        status: RaceStatus
        players: PlayerPublic[]
    }) => void

    countdown: (payload: { secondsLeft: number }) => void

    race_start: (payload: {
        passage: string
        startedAt: number
    }) => void

    room_update: (payload: { players: PlayerPublic[] }) => void

    player_finished: (payload: {
        userId: string
        displayName: string
        placement: number
        wpm: number
        timeMs: number
    }) => void

    race_end: (payload: { results: PlayerPublic[] }) => void

    room_closed: (payload: { reason: string }) => void

    room_info: (payload: { message: string }) => void

    error: (payload: { code: string; message: string }) => void
}

// what we send to clients — never expose internal server state
export interface PlayerPublic {
    userId: string
    displayName: string
    progress: number
    wpm: number
    placement: number | null
    isReady: boolean
    finishedAt: number | null
}