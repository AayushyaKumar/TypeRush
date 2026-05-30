"use client"
import { useRaceStore } from "@/store/raceStore"
import { useRouter } from "next/navigation"

interface Props {
  roomCode: string
}

export default function Results({ roomCode }: Props) {
  const { finalResults, myUserId } = useRaceStore()
  const router = useRouter()

  const players = finalResults ?? []
  
  // Find top 3 players for the podium
  const first = players.find(p => p.placement === 1)
  const second = players.find(p => p.placement === 2)
  const third = players.find(p => p.placement === 3)

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Race Results</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Room Code: <span className="font-mono font-bold">{roomCode}</span></p>
      </div>

      {/* Podium layout */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 mt-4 sm:mt-6 px-1 sm:px-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center flex-1">
          {second ? (
            <div className="text-center mb-2 animate-bounce" style={{ animationDelay: "0.2s" }}>
              <div className="text-xl sm:text-2xl">🥈</div>
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate max-w-[70px] sm:max-w-[80px]">{second.displayName}</div>
              <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">{second.wpm} WPM</div>
            </div>
          ) : (
            <div className="h-10" />
          )}
          <div className="w-full h-20 sm:h-24 bg-card/45 border-t-2 border-slate-300 rounded-t-xl flex items-center justify-center font-bold text-slate-400 text-sm sm:text-lg shadow-md">
            2nd
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center flex-1">
          {first ? (
            <div className="text-center mb-2 animate-bounce">
              <div className="text-2xl sm:text-3xl">🥇</div>
              <div className="text-[10px] sm:text-xs font-black text-primary truncate max-w-[80px] sm:max-w-[90px]">{first.displayName}</div>
              <div className="text-[9px] sm:text-[11px] font-mono text-primary font-bold">{first.wpm} WPM</div>
            </div>
          ) : (
            <div className="h-10" />
          )}
          <div className="w-full h-28 sm:h-32 bg-primary/10 border-t-4 border-yellow-500 rounded-t-2xl flex items-center justify-center font-black text-yellow-500 text-base sm:text-xl shadow-lg shadow-yellow-500/5">
            1st
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center flex-1">
          {third ? (
            <div className="text-center mb-2 animate-bounce" style={{ animationDelay: "0.4s" }}>
              <div className="text-xl sm:text-2xl">🥉</div>
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate max-w-[70px] sm:max-w-[80px]">{third.displayName}</div>
              <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">{third.wpm} WPM</div>
            </div>
          ) : (
            <div className="h-10" />
          )}
          <div className="w-full h-14 sm:h-18 bg-card/35 border-t border-amber-600/50 rounded-t-lg flex items-center justify-center font-bold text-amber-600 dark:text-amber-500 text-xs sm:text-sm shadow-sm">
            3rd
          </div>
        </div>
      </div>

      {/* leaderboard list */}
      <div className="glass-panel p-0 overflow-hidden mb-6 sm:mb-8 border-border/60">
        <div className="px-4 sm:px-5 py-3.5 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/20">
          Leaderboard Positions
        </div>

        <div className="divide-y divide-border/40">
          {players
            .sort((a, b) => (a.placement ?? 99) - (b.placement ?? 99))
            .map((p) => {
              const isMe = p.userId === myUserId
              return (
                <div
                  key={p.userId}
                  className={`flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 ${
                    isMe ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-extrabold text-muted-foreground w-6 sm:w-8">
                      #{p.placement ?? "—"}
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {p.displayName}
                        {isMe && <span className="ml-1.5 text-xs text-muted-foreground font-normal">(you)</span>}
                      </span>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
                        {p.progress >= 1 ? "Completed Race" : `${Math.round(p.progress * 100)}% Finished`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-primary tabular-nums">{p.wpm}</span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase ml-1">WPM</span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => router.push("/race")}
          className="flex-1 w-full py-3.5 border border-border rounded-xl text-sm font-bold hover:bg-secondary cursor-pointer transition-all"
        >
          ← Back to Arena
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 cursor-pointer shadow-lg shadow-primary/10 transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}