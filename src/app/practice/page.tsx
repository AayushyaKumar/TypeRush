"use client"
import { useState, useEffect, useCallback } from "react"
import TypingInput from "@/components/ui/TypingInput"
import {
  fetchRandomPassage,
  type Passage,
  type Difficulty,
  type PassageFilters,
  DIFFICULTY_TIME_MS,
  DIFFICULTY_WORD_COUNT,
} from "@/lib/passages"

interface Result {
  wpm: number
  accuracy: number
  timeMs: number
  errors: number
  timedOut?: boolean
}

const DIFFICULTIES: {
  value: Difficulty
  label: string
  words: number
  timeMin: number
  icon: string
  color: string
  glow: string
  badge: string
}[] = [
  {
    value: "easy",
    label: "Easy",
    words: DIFFICULTY_WORD_COUNT.easy,
    timeMin: DIFFICULTY_TIME_MS.easy / 60_000,
    icon: "🌿",
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    value: "medium",
    label: "Medium",
    words: DIFFICULTY_WORD_COUNT.medium,
    timeMin: DIFFICULTY_TIME_MS.medium / 60_000,
    icon: "⚡",
    color: "text-amber-400",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    value: "hard",
    label: "Hard",
    words: DIFFICULTY_WORD_COUNT.hard,
    timeMin: DIFFICULTY_TIME_MS.hard / 60_000,
    icon: "🔥",
    color: "text-rose-400",
    glow: "shadow-rose-500/20",
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
]

export default function PracticePage() {
  const [passage, setPassage] = useState<Passage | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [loading, setLoading] = useState(false)

  const loadPassage = useCallback(async (filters?: PassageFilters) => {
    setLoading(true)
    try {
      const p = await fetchRandomPassage(filters)
      setPassage(p)
    } catch (err) {
      console.error("Failed to load passage:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPassage({ difficulty })
    }, 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFinish = async (r: Result) => {
    setResult(r)
    await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        passageId: passage!.id,
        wpm: r.wpm,
        accuracy: r.accuracy,
        timeMs: r.timeMs,
        errors: r.errors,
      }),
    }).catch(() => {})
  }

  const retry = (newPassage = false) => {
    setResult(null)
    if (newPassage) loadPassage({ difficulty })
  }

  const timeLimitMs = DIFFICULTY_TIME_MS[difficulty]
  const activeDiff  = DIFFICULTIES.find(d => d.value === difficulty)!

  if (!passage || loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="h-8 w-40 bg-secondary rounded-xl" />
          <div className="h-8 w-72 bg-secondary rounded-xl" />
        </div>
        <div className="glass-panel space-y-4">
          <div className="h-5 bg-secondary rounded-lg w-3/4" />
          <div className="h-5 bg-secondary rounded-lg w-full" />
          <div className="h-5 bg-secondary rounded-lg w-5/6" />
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Practice Arena</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Sharpen your typing speed solo.</p>
        </div>

        {/* ── Difficulty Selector ── */}
        <div className="flex w-full sm:w-auto gap-1 sm:gap-2 bg-card/50 backdrop-blur-sm border border-border p-1.5 sm:p-2 rounded-2xl shadow-sm">
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.value
            return (
              <button
                key={d.value}
                onClick={() => {
                  setDifficulty(d.value)
                  setResult(null)
                  loadPassage({ difficulty: d.value })
                }}
                className={`flex-1 sm:flex-initial flex flex-col items-center gap-0.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                  active
                    ? `bg-card shadow-lg ${d.glow} border-border ${d.color}`
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span className="text-sm sm:text-base leading-none">{d.icon}</span>
                <span className="leading-none mt-1 text-[10px] sm:text-xs">{d.label}</span>
                <span className="text-[8px] sm:text-[9px] leading-none opacity-70 mt-0.5">
                   {d.timeMin}m
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {result ? ( 
        /* ── Results Panel ── */
        <div className="glass-panel border-primary/20 text-center max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-12 space-y-6 sm:space-y-8 animate-fade-in shadow-primary/5">
          {result.timedOut && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-2xl text-sm font-semibold">
              ⏱️ Time&apos;s up! You ran out of time.
            </div>
          )}

          <div>
            <div className="text-5xl sm:text-7xl font-extrabold tracking-tight text-primary drop-shadow-[0_4px_12px_rgba(var(--primary),0.15)]">
              {result.wpm}
            </div>
            <div className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-widest font-bold mt-2">
              Words Per Minute (WPM)
            </div>
          </div>

          {/* Difficulty badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border ${activeDiff.badge}`}>
              {activeDiff.icon} {activeDiff.label} · {activeDiff.words} words · {activeDiff.timeMin} min limit
            </span>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-y border-border/60 max-w-md mx-auto">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{result.accuracy}%</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Accuracy</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{(result.timeMs / 1000).toFixed(1)}s</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Time Elapsed</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{result.errors}</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Errors Made</div>
            </div>
          </div>

          {/* Dynamic feedback */}
          <div className="text-xs sm:text-sm font-medium text-muted-foreground bg-secondary/50 rounded-xl p-3 sm:p-4 max-w-md mx-auto">
            {result.timedOut
              ? "⏱ Focus on precision next time, speed will follow!"
              : result.wpm >= 80
                ? "👑 Incredible! Keyboard Legend tier. You write faster than 95% of typists."
                : result.wpm >= 60
                  ? "⚡ Superb speed! You are a Keyboard Speedster."
                  : result.wpm >= 40
                    ? "👍 Well done! Adept typing speed. Try to crack 60 WPM next."
                    : "💪 Keep on practicing. Accuracy builds speed over time!"}
          </div>

          {/* Actions */}
          <div className="flex flex-col xs:flex-row justify-center gap-2 sm:gap-3 max-w-sm mx-auto w-full">
            <button
              onClick={() => retry(false)}
              className="flex-1 w-full px-5 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-secondary cursor-pointer transition-all"
            >
              Replay Passage
            </button>
            <button
              onClick={() => retry(true)}
              className="flex-1 w-full px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 cursor-pointer shadow-lg shadow-primary/10 transition-all"
            >
              New Passage →
            </button>
          </div>
        </div>
      ) : (
        /* ── Typing Viewport ── */
        <div className="glass-panel">
          <TypingInput
            key={passage.id}
            passage={passage.text}
            onFinish={handleFinish}
            timeLimitMs={timeLimitMs}
            difficulty={difficulty}
          />
        </div>
      )}

      {/* ── Passage Info Footer ── */}
      {!result && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground px-2">
          <div className="flex flex-wrap gap-1.5 sm:gap-3">
            <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border text-[10px] sm:text-[11px] ${activeDiff.badge}`}>
              {activeDiff.icon} {activeDiff.label}
            </span>
            <span className="bg-secondary px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold text-[10px] sm:text-xs">
              {passage.wordCount} words
            </span>
            <span className="bg-secondary px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold text-[10px] sm:text-xs">
              ⏱️ {activeDiff.timeMin}m limit
            </span>
          </div>
          <button
            onClick={() => retry(true)}
            className="font-semibold hover:text-primary transition-colors cursor-pointer text-left sm:text-right self-start sm:self-auto"
          >
            Skip Passage →
          </button>
        </div>
      )}
    </main>
  )
}