import { create } from "zustand"

// install zustand first: npm install zustand
export type RaceStatus = "idle" | "waiting" | "countdown" | "active" | "finished" | "closed"

export interface PlayerPublic {
  userId:      string
  displayName: string
  progress:    number
  wpm:         number
  placement:   number | null
  isReady:     boolean
  finishedAt:  number | null
}

interface RaceStore {
  roomCode:        string | null
  passage:         string
  status:          RaceStatus
  players:         PlayerPublic[]
  countdown:       number | null
  myUserId:        string | null
  finalResults:    PlayerPublic[] | null
  closedReason:    string | null       // reason for room closure
  infoMessage:     string | null       // transient info messages

  setRoomCode:     (code: string) => void
  setPassage:      (p: string) => void
  setStatus:       (s: RaceStatus) => void
  setPlayers:      (p: PlayerPublic[]) => void
  setCountdown:    (n: number | null) => void
  setMyUserId:     (id: string) => void
  setFinalResults: (r: PlayerPublic[]) => void
  setClosedReason: (reason: string) => void
  setInfoMessage:  (msg: string | null) => void
  reset:           () => void
}

export const useRaceStore = create<RaceStore>((set) => ({
  roomCode:     null,
  passage:      "",
  status:       "idle",
  players:      [],
  countdown:    null,
  myUserId:     null,
  finalResults: null,
  closedReason: null,
  infoMessage:  null,

  setRoomCode:     (code : string)    => set({ roomCode: code }),
  setPassage:      (p)       => set({ passage: p }),
  setStatus:       (s)       => set({ status: s }),
  setPlayers:      (p)       => set({ players: p }),
  setCountdown:    (n)       => set({ countdown: n }),
  setMyUserId:     (id)      => set({ myUserId: id }),
  setFinalResults: (r)       => set({ finalResults: r }),
  setClosedReason: (reason)  => set({ closedReason: reason, status: "closed" }),
  setInfoMessage:  (msg)     => set({ infoMessage: msg }),
  reset: () => set({
    roomCode: null, passage: "", status: "idle",
    players: [], countdown: null, finalResults: null,
    closedReason: null, infoMessage: null,
  }),
}))