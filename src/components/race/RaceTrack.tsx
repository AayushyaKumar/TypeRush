"use client"
import { useCallback } from "react"
import { Socket } from "socket.io-client"
import { useRaceStore } from "@/store/raceStore"
import TypingInput from "@/components/ui/TypingInput"

interface Props {
  roomCode: string
  socket:   Socket | null
}

const VEHICLES = ["🏎️", "🚀", "🏍️", "🚗", "🛸", "⚡"]

/** Per-player lane accent colours (progress fill + ring) */
const LANE_COLORS = [
  { fill: "from-violet-500 to-purple-400",   ring: "border-violet-500/30", text: "text-violet-400" },
  { fill: "from-sky-500 to-cyan-400",         ring: "border-sky-500/30",    text: "text-sky-400"    },
  { fill: "from-rose-500 to-pink-400",        ring: "border-rose-500/30",   text: "text-rose-400"   },
  { fill: "from-amber-500 to-yellow-400",     ring: "border-amber-500/30",  text: "text-amber-400"  },
  { fill: "from-emerald-500 to-teal-400",     ring: "border-emerald-500/30",text: "text-emerald-400"},
  { fill: "from-orange-500 to-red-400",       ring: "border-orange-500/30", text: "text-orange-400" },
]

const PLACEMENT_LABELS: Record<number, { label: string; icon: string; styles: string }> = {
  1: { label: "1st Place",  icon: "🥇", styles: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30"  },
  2: { label: "2nd Place",  icon: "🥈", styles: "bg-slate-400/15  text-slate-300  border-slate-400/30"   },
  3: { label: "3rd Place",  icon: "🥉", styles: "bg-amber-700/15  text-amber-500  border-amber-600/30"   },
}
const DEFAULT_PLACEMENT = { label: "Finished!", icon: "🏁", styles: "bg-primary/15 text-primary border-primary/30" }

function ordinal(n: number) {
  const s = ["th","st","nd","rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

export default function RaceTrack({ roomCode, socket }: Props) {
  const { players, passage, myUserId } = useRaceStore()

  const handleProgress = useCallback((progress: number, wpm: number) => {
    socket?.emit("progress_update", { roomCode, progress, wpm })
  }, [socket, roomCode])

  const handleFinish = useCallback(({ wpm }: {
    wpm: number; accuracy: number; timeMs: number
  }) => {
    socket?.emit("progress_update", { roomCode, progress: 1.0, wpm })
  }, [socket, roomCode])

  const myPlayer    = players.find(p => p.userId === myUserId)
  const myPlacement = myPlayer?.placement ?? null

  // Sort players by progress descending so the leader is shown first
  const sorted = [...players].sort((a, b) => b.progress - a.progress)

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Race Track ── */}
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm shadow-md">
        {/* Header */}
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between bg-secondary/20">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Track Positions</span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live Racing
          </span>
        </div>

        {/* Lanes */}
        <div className="p-5 space-y-5">
          {sorted.map((p, i) => {
            const isMe    = p.userId === myUserId
            const vehicle = VEHICLES[players.indexOf(p) % VEHICLES.length]
            const color   = LANE_COLORS[players.indexOf(p) % LANE_COLORS.length]
            const pct     = Math.round(p.progress * 100)

            return (
              <div key={p.userId} className="space-y-2">
                {/* Racer info row */}
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Position number */}
                    <span className={`text-[11px] font-extrabold w-4 sm:w-5 tabular-nums ${isMe ? "text-primary" : "text-muted-foreground"}`}>
                      {i + 1}
                    </span>

                    {/* Vehicle icon */}
                    <span className="text-base leading-none select-none">{vehicle}</span>

                    {/* Name */}
                    <span className={`font-semibold truncate max-w-[70px] xs:max-w-[120px] sm:max-w-none inline-block align-middle ${isMe ? "text-primary" : "text-foreground"}`}>
                      {p.displayName}
                    </span>
                    {isMe && (
                      <span className="text-[10px] font-normal text-muted-foreground align-middle">
                        (you)
                      </span>
                    )}

                    {/* Finished badge */}
                    {p.placement && (
                      <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                        p.placement === 1
                          ? "bg-yellow-500/15 text-yellow-400 border-yellow-400/30"
                          : p.placement === 2
                            ? "bg-slate-400/15 text-slate-300 border-slate-400/30"
                            : p.placement === 3
                              ? "bg-amber-700/15 text-amber-500 border-amber-600/30"
                              : "bg-primary/10 text-primary border-primary/20"
                      }`}>
                        <span>{p.placement === 1 ? "🥇" : p.placement === 2 ? "🥈" : p.placement === 3 ? "🥉" : "🏁"}</span>
                        <span className="hidden xs:inline">{ordinal(p.placement)}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`font-mono text-xs font-bold tabular-nums ${color.text}`}>{pct}%</span>
                    <span className="font-mono text-muted-foreground text-xs tabular-nums">{p.wpm} WPM</span>
                  </div>
                </div>

                {/* Track lane */}
                <div className={`relative h-9 rounded-xl overflow-hidden border ${color.ring} bg-secondary/20`}>
                  {/* Fill bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${color.fill} opacity-25 transition-all duration-300 rounded-xl`}
                    style={{ width: `${pct}%` }}
                  />

                  {/* Thin bright progress line */}
                  <div
                    className={`absolute top-0 bottom-0 w-0.5 bg-gradient-to-b ${color.fill} opacity-70 transition-all duration-300`}
                    style={{ left: `calc(${pct}% - 1px)` }}
                  />

                  {/* Vehicle marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 text-lg select-none z-10 drop-shadow-sm"
                    style={{ left: `clamp(1.25rem, ${pct}%, calc(100% - 1.25rem))` }}
                  >
                    {vehicle}
                  </div>

                  {/* Finish line */}
                  <div className="absolute right-0 top-0 bottom-0 w-5 flex flex-col overflow-hidden border-l border-border/40"
                    style={{
                      backgroundImage: "conic-gradient(from 0deg, rgba(255,255,255,0.12) 25%, rgba(0,0,0,0.12) 25% 50%, rgba(255,255,255,0.12) 50% 75%, rgba(0,0,0,0.12) 75%)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Finish Banner (shown only after local player finishes) ── */}
      {myPlacement && (
        <div className={`rounded-2xl border px-4 py-4 sm:px-6 sm:py-5 flex items-center gap-3 sm:gap-4 animate-fade-in ${
          (PLACEMENT_LABELS[myPlacement] ?? DEFAULT_PLACEMENT).styles
        }`}>
          <span className="text-3xl sm:text-4xl leading-none select-none">
            {(PLACEMENT_LABELS[myPlacement] ?? DEFAULT_PLACEMENT).icon}
          </span>
          <div>
            <div className="text-base sm:text-lg font-extrabold tracking-tight">
              You finished {(PLACEMENT_LABELS[myPlacement] ?? DEFAULT_PLACEMENT).label}!
            </div>
            <p className="text-xs sm:text-sm opacity-75 mt-0.5">
              {myPlacement === 1
                ? "Amazing! You blazed across the finish line first 🚀"
                : myPlacement === 2
                  ? "So close! Silver position — great race! ⚡"
                  : myPlacement === 3
                    ? "Bronze finish — keep pushing for the podium! 💪"
                    : "Race complete — practice makes perfect! 🏁"}
            </p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <div className="text-2xl font-extrabold tabular-nums">{myPlayer?.wpm} WPM</div>
            <div className="text-xs opacity-60 uppercase tracking-wider mt-0.5">Final Speed</div>
          </div>
        </div>
      )}

      {/* ── Typing Input (hidden once finished) ── */}
      {!myPlacement && (
        <div className="glass-panel">
          <TypingInput
            passage={passage}
            onFinish={handleFinish}
            onProgress={handleProgress}
          />
        </div>
      )}
    </div>
  )
}