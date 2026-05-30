"use client"
import { Socket } from "socket.io-client"
import { useRaceStore } from "@/store/raceStore"
import { useState, useEffect, useRef } from "react"

interface Props {
  roomCode: string
  socket:   Socket | null
}

export default function Lobby({ roomCode, socket }: Props) {
  const { players, myUserId } = useRaceStore()
  const [ready, setReady]     = useState(false)
  const [copied, setCopied]   = useState(false)
  const [idleSeconds, setIdleSeconds] = useState(0)
  const idleRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    idleRef.current = setInterval(() => {
      setIdleSeconds(s => s + 1)
    }, 1000)

    return () => {
      if (idleRef.current) clearInterval(idleRef.current)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIdleSeconds(0)
    }, 0)
    return () => clearTimeout(timer)
  }, [players.length])

  const handleReady = () => {
    socket?.emit("player_ready", { roomCode })
    setReady(true)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const IDLE_TIMEOUT_S = 5 * 60
  const remainingS = Math.max(0, IDLE_TIMEOUT_S - idleSeconds)
  const showIdleWarning = remainingS <= 60 && players.length < 2
  const formatRemaining = () => {
    const m = Math.floor(remainingS / 60)
    const s = remainingS % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="max-w-md mx-auto py-10 animate-fade-in">
      {/* room code card */}
      <div className="glass-panel text-center mb-8 bg-card/60">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-3">Room Code</p>
        <button
          onClick={copyCode}
          className="text-5xl font-mono font-extrabold tracking-widest text-primary hover:opacity-85 transition-opacity relative group cursor-pointer"
          title="Click to copy"
        >
          {roomCode}
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          {copied ? "✅ Copied to Clipboard!" : "Click the code to copy and share"}
        </p>
      </div>

      {/* idle timeout warning */}
      {showIdleWarning && (
        <div className="mb-6 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-2xl text-center">
          <p className="text-sm text-destructive font-semibold">
            ⏱️ Room will close in <span className="font-mono font-bold">{formatRemaining()}</span> if no race starts
          </p>
        </div>
      )}

      {/* player list */}
      <div className="glass-panel p-0 overflow-hidden mb-6 border-border/60">
        <div className="px-5 py-3.5 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/20 flex justify-between">
          <span>Racers Joined</span>
          <span>{players.length} / 6</span>
        </div>
        
        {players.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            Waiting for racers to connect...
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {players.map((p) => {
              const isMe = p.userId === myUserId
              return (
                <div
                  key={p.userId}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    isMe ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      p.isReady ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/35"
                    }`} />
                    <span className="text-sm font-semibold text-foreground">
                      {p.displayName}
                      {isMe && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
                      )}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    p.isReady
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {p.isReady ? "Ready" : "Waiting"}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* need 2 players warning */}
      {players.length < 2 && (
        <div className="text-center mb-6 bg-secondary/35 rounded-xl p-3.5 border border-border/45">
          <p className="text-xs text-muted-foreground leading-relaxed">
            ⚠️ Needs at least <strong>2 racers</strong> to begin the race. Share the code to invite friends!
          </p>
        </div>
      )}

      {/* ready button */}
      <button
        onClick={handleReady}
        disabled={ready || players.length < 2}
        className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
          ready
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
            : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/10"
        } disabled:opacity-40 disabled:pointer-events-none`}
      >
        {ready ? "✓ Ready — Waiting for Host to Start" : "Let's Race! (I'm Ready)"}
      </button>
    </div>
  )
}