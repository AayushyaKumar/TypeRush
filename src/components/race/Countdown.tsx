"use client"
import { useRaceStore } from "@/store/raceStore"

export default function Countdown() {
  const { countdown } = useRaceStore()

  // Dynamic visual settings based on seconds left
  const colorMap: Record<number, { text: string; bg: string; border: string; label: string }> = {
    3: { 
      text: "text-rose-500 dark:text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]", 
      bg: "bg-rose-500/5 dark:bg-rose-500/10",
      border: "border-rose-500/35",
      label: "RACERS... READY YOUR FINGERS" 
    },
    2: { 
      text: "text-amber-500 dark:text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]", 
      bg: "bg-amber-500/5 dark:bg-amber-500/10",
      border: "border-amber-500/35",
      label: "RACERS... GET READY" 
    },
    1: { 
      text: "text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]", 
      bg: "bg-yellow-500/5 dark:bg-yellow-500/10",
      border: "border-yellow-500/35",
      label: "RACERS... GOING IN 1" 
    },
    0: { 
      text: "text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110", 
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20 animate-ping absolute",
      border: "border-emerald-500/50",
      label: "🏁 RACE IS LIVE! GO! GO! GO! 🏁" 
    }
  }

  const current = colorMap[countdown ?? 3] || colorMap[3]

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] animate-fade-in relative">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold mb-8">
        {current.label}
      </p>

      <div className="relative flex items-center justify-center w-56 h-56">
        {/* Glowing concentric background rings */}
        <div className={`absolute inset-0 rounded-full border-2 ${current.border} ${current.bg} transition-all duration-300`} />
        <div className={`absolute inset-4 rounded-full border border-dashed ${current.border} opacity-50`} />

        {/* Countdown counter text */}
        <div 
          key={countdown} 
          className={`text-8xl font-black tabular-nums select-none z-10 transition-all duration-300 transform scale-in-out`}
        >
          {countdown === 0 ? "GO!" : countdown}
        </div>
      </div>
    </div>
  )
}