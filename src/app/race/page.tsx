"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function RacePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [roomCode, setRoomCode] = useState("")

  const displayName = session?.user?.name || "Guest"

  const handleCreate = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    const uid  = session?.user?.id || "guest_" + Math.random().toString(36).slice(2, 8)
    router.push(`/race/${code}?name=${encodeURIComponent(displayName)}&uid=${uid}`)
  }

  const handleJoin = () => {
    if (roomCode.trim().length < 4) return
    const uid  = session?.user?.id || "guest_" + Math.random().toString(36).slice(2, 8)
    router.push(`/race/${roomCode.trim().toUpperCase()}?name=${encodeURIComponent(displayName)}&uid=${uid}`)
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12 sm:py-20 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Multiplayer Arena</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Race against other typists in real-time.
        </p>
      </div>

      <div className="glass-panel space-y-6 shadow-primary/5">
        {/* Create room */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Host a New Race</h3>
          <button
            onClick={handleCreate}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-primary/10"
          >
            Create Private Room
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-grow h-px bg-border" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">or join existing</span>
          <div className="flex-grow h-px bg-border" />
        </div>

        {/* Join room */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Enter Room Code</h3>
          <div className="flex gap-2">
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="CODE"
              maxLength={6}
              className="flex-1 px-4 py-3 border border-border bg-secondary/35 rounded-xl font-mono text-center text-lg font-bold tracking-widest focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleJoin}
              disabled={roomCode.trim().length < 4}
              className="px-6 py-3 bg-secondary hover:bg-border text-foreground font-semibold rounded-xl text-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all border border-border/40"
            >
              Join →
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed max-w-[280px] mx-auto">
        Share the generated 6-letter room code with friends to start the countdown. Minimum 2 racers.
      </p>
    </main>
  )
}