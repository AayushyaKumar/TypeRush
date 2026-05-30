"use client"
import { useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"
import { useRaceEvents } from "@/hooks/useRaceEvents"
import { useRaceStore } from "@/store/raceStore"
import Lobby from "@/components/race/Lobby"
import RaceTrack from "@/components/race/RaceTrack"
import Results from "@/components/race/Results"
import Countdown from "@/components/race/Countdown"

export default function RoomPage() {
  const params       = useParams()
  const searchParams = useSearchParams()
  const router       = useRouter()
  const code         = (params.code as string).toUpperCase()
  const displayName  = searchParams.get("name") || "Guest"
  const userId       = searchParams.get("uid")  || "guest"

  const { socket, isConnected } = useSocket()
  const { status, setMyUserId, reset, closedReason, infoMessage } = useRaceStore()

  // wire all socket events to the store
  useRaceEvents(socket)

  // join the room once connected
  useEffect(() => {
    if (!socket || !isConnected) return
    setMyUserId(userId)
    socket.emit("join_room", { roomCode: code, userId, displayName })

    return () => {
      socket.emit("leave_room", { roomCode: code })
      reset()
    }
  }, [socket, isConnected])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-sm">Connecting to server...</p>
      </div>
    )
  }

  // ── room closed state ────────────────────────────────────────────
  if (status === "closed") {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span className="text-2xl">⏱</span>
          </div>
          <h2 className="text-2xl font-medium mb-2">Room Closed</h2>
          <p className="text-gray-400 text-sm">
            {closedReason || "This room has been closed."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/race")}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Create or join a room
          </button>
          <button
            onClick={() => router.push("/practice")}
            className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Practice solo instead
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* transient info banner */}
      {infoMessage && (
        <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300 text-center animate-in fade-in duration-300">
          {infoMessage}
        </div>
      )}

      {status === "waiting"   && <Lobby   roomCode={code} socket={socket} />}
      {status === "countdown" && <Countdown />}
      {status === "active"    && <RaceTrack roomCode={code} socket={socket} />}
      {status === "finished"  && <Results roomCode={code} />}
    </main>
  )
}