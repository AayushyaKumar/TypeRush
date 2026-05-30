"use client"
import { useEffect, useRef, useState, useCallback } from "react"

interface FinishResult {
  wpm: number
  accuracy: number
  timeMs: number
  errors: number
  timedOut?: boolean
}

interface Props {
  passage: string
  onFinish: (result: FinishResult) => void
  onProgress?: (progress: number, wpm: number) => void
  timeLimitMs?: number
  difficulty?: "easy" | "medium" | "hard"
}

export default function TypingInput({ passage, onFinish, onProgress, timeLimitMs, difficulty }: Props) {
  // Easy passages are shorter — show 4 fewer lines to avoid lots of empty space
  const heightClass = difficulty === "easy" ? "h-[11rem] sm:h-[16rem]" : "h-[14rem] sm:h-[24rem]"
  const [typed, setTyped] = useState("")
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [liveWpm, setLiveWpm] = useState(0)
  const [liveAcc, setLiveAcc] = useState(100)
  const [isFocused, setIsFocused] = useState(true)
  const [errorsCount, setErrorsCount] = useState(0)

  const startTimeRef = useRef<number | null>(null)
  const totalErrors = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const passageBoxRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    inputRef.current?.focus()
    if (document.activeElement === inputRef.current) {
      setIsFocused(true)
    } else {
      setIsFocused(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Smoothly scroll the passage box so the cursor line stays in the upper quarter,
  // leaving 4-5 upcoming lines visible below.
  useEffect(() => {
    const cursor = cursorRef.current
    const box = passageBoxRef.current
    if (!cursor || !box) return

    const boxRect = box.getBoundingClientRect()
    const cursorRect = cursor.getBoundingClientRect()

    // Cursor position relative to the scrollable container's content
    const cursorOffsetTop = cursorRect.top - boxRect.top + box.scrollTop

    // Target: keep cursor ~28% from the top so plenty of lines are visible below
    const targetScrollTop = Math.max(0, cursorOffsetTop - boxRect.height * 0.42)

    // Animate scrollTop with rAF for a smooth, spring-like feel
    const start = box.scrollTop
    const delta = targetScrollTop - start
    if (Math.abs(delta) < 2) return

    const duration = 180
    const startTime = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      box.scrollTop = start + delta * ease
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [typed])

  const calcWpm = useCallback((charsTyped: number, elapsedMs: number) => {
    if (elapsedMs < 3000 || charsTyped < 5) return 0
    return Math.round((charsTyped / 5) / (elapsedMs / 60_000))
  }, [])

  const calcAccuracy = useCallback(() => {
    const totalWords = passage.trim().split(/\s+/).length
    const errors     = totalErrors.current
    if (totalWords === 0) return 100
    return Math.max(0, Math.round(((totalWords - errors) / totalWords) * 100))
  }, [passage])

  const finishRace = useCallback((timedOut: boolean) => {
    if (finishedRef.current) return
    finishedRef.current = true

    if (timerRef.current) clearInterval(timerRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setFinished(true)

    const finalElapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
    onFinish({
      wpm: calcWpm(typed.length, finalElapsed),
      accuracy: calcAccuracy(),
      timeMs: finalElapsed,
      errors: totalErrors.current,
      timedOut,
    })
  }, [typed, calcWpm, calcAccuracy, onFinish])

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current!)
    }, 100)

    if (timeLimitMs) {
      timeoutRef.current = setTimeout(() => {
        finishRace(true)
      }, timeLimitMs)
    }
  }, [timeLimitMs, finishRace])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished || finishedRef.current) return

    const value = e.target.value

    if (value.length > passage.length) return

    // Start the timer on the very first keypress (correct or wrong)
    if (!started) {
      setStarted(true)
      startTimer()
    }

    const isDeleting = value.length < typed.length

    // Block forward typing when there's an active error — only allow backspace
    if (!isDeleting) {
      const newCharIndex = value.length - 1
      const newChar = value[newCharIndex]
      const expectedChar = passage[newCharIndex]

      if (newChar !== expectedChar) {
        // Count the error
        totalErrors.current += 1
        setErrorsCount(totalErrors.current)

        // Show error state for feedback, but DO NOT advance typed
        setHasError(true)

        // Recalculate acc based on current typed (unchanged length)
        const acc = calcAccuracy()
        setLiveAcc(acc)

        return // ← block: cursor stays, user must backspace
      }
    }

    setTyped(value)

    const correctSoFar = value === passage.slice(0, value.length)
    setHasError(!correctSoFar)

    const nowMs = Date.now()
    const elapsedMs = nowMs - (startTimeRef.current ?? nowMs)
    const wpm = calcWpm(value.length, elapsedMs)
    const acc = calcAccuracy()

    setLiveWpm(wpm)
    setLiveAcc(acc)

    const progress = value.length / passage.length
    onProgress?.(progress, wpm)

    if (value === passage) {
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      finishedRef.current = true
      setFinished(true)
      const finalElapsed = nowMs - startTimeRef.current!
      onFinish({
        wpm: calcWpm(passage.length, finalElapsed),
        accuracy: calcAccuracy(),
        timeMs: finalElapsed,
        errors: totalErrors.current,
        timedOut: false,
      })
    }
  }

  const chars = passage.split("").map((char, i) => {
    if (i < typed.length) {
      if (typed[i] === char) {
        return { char, state: "correct" as const }
      } else {
        return { char, state: "incorrect" as const }
      }
    } else if (i === typed.length) {
      return { char, state: "cursor" as const }
    }
    return { char, state: "pending" as const }
  })

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const ds = Math.floor((ms % 1000) / 100)
    return `${m}:${String(s % 60).padStart(2, "0")}.${ds}`
  }

  const remainingMs = timeLimitMs ? Math.max(0, timeLimitMs - elapsed) : null
  const isLowTime = remainingMs !== null && remainingMs < 30_000 && started

  // Calculate percentage progress
  const progressPct = (typed.length / passage.length) * 100

  return (
    <div className="flex flex-col gap-8">
      {/* ── Visual mini racetrack ── */}
      <div className="relative w-full h-10 bg-secondary/35 rounded-xl border border-border/40 overflow-hidden flex items-center px-4">
        <span className="text-xs text-muted-foreground select-none font-bold mr-2">🏁</span>
        
        {/* Track Line */}
        <div className="flex-grow h-1.5 bg-border rounded-full relative">
          <div className="absolute top-0 left-0 h-full bg-primary/30 rounded-full" style={{ width: `${progressPct}%` }} />
          
          {/* Animated 🏎️ Emoji marker */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 text-lg select-none"
            style={{ left: `${progressPct}%` }}
          >
            🏎️
          </div>
        </div>

        <span className="text-xs text-muted-foreground select-none font-bold ml-2">🏁</span>
      </div>

      {/* ── Stat Cards Panel ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* WPM Card */}
        <div className="border border-border/60 rounded-2xl bg-card/40 p-3 sm:p-4 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block tabular-nums">
            {liveWpm}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1 block">WPM</span>
        </div>

        {/* Accuracy Card */}
        <div className="border border-border/60 rounded-2xl bg-card/40 p-3 sm:p-4 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground block tabular-nums">
            {liveAcc}%
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1 block">Accuracy</span>
        </div>

        {/* Time Elapsed Card */}
        <div className="border border-border/60 rounded-2xl bg-card/40 p-3 sm:p-4 text-center shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground block tabular-nums">
            {formatTime(elapsed)}
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1 block">Elapsed Time</span>
        </div>

        {/* Remaining Time or Errors Card */}
        {remainingMs !== null ? (
          <div className={`border border-border/60 rounded-2xl bg-card/40 p-3 sm:p-4 text-center shadow-sm transition-colors ${
            isLowTime ? "bg-destructive/10 border-destructive/30" : ""
          }`}>
            <span className={`text-2xl sm:text-3xl font-extrabold block tabular-nums ${
              isLowTime ? "text-destructive animate-pulse" : "text-foreground"
            }`}>
              {formatTime(remainingMs)}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 block ${
              isLowTime ? "text-destructive/80" : "text-muted-foreground"
            }`}>Remaining</span>
          </div>
        ) : (
          <div className="border border-border/60 rounded-2xl bg-card/40 p-3 sm:p-4 text-center shadow-sm">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground block tabular-nums">
              {errorsCount}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1 block">Errors</span>
          </div>
        )}
      </div>

      {/* ── Passage display text ── */}
      {/* Fixed 3-line viewport — scrolls programmatically, no scrollbar */}
      <div
        ref={passageBoxRef}
        className={`no-scrollbar relative font-mono text-base sm:text-lg md:text-xl leading-relaxed px-4 sm:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6 rounded-2xl border cursor-text select-none transition-colors duration-300 whitespace-pre-wrap overflow-y-scroll ${heightClass} ${
          hasError
            ? "border-destructive bg-destructive/5 dark:bg-destructive/10 animate-error-shake"
            : "border-border bg-card/50 hover:bg-card/75 dark:bg-card/25"
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* click-to-start overlay */}
        {!started && !isFocused && (
          <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-background/80 backdrop-blur-[2px] transition-all duration-200">
            <span className="text-xs font-semibold border border-dashed border-border rounded-xl px-5 py-2.5 bg-card shadow-lg text-muted-foreground animate-bounce">
              Click Here to Start Typing
            </span>
          </div>
        )}

        {/* characters */}
        <div className="tracking-wide">
          {chars.map(({ char, state }, i) => {
            if (state === "correct") {
              return (
                <span key={i} className="text-emerald-500 dark:text-emerald-400 opacity-90">
                  {char}
                </span>
              )
            }
            if (state === "incorrect") {
              return (
                <span key={i} className="text-destructive bg-destructive/10 rounded-md px-0.5 font-bold">
                  {char === " " ? "·" : char}
                </span>
              )
            }
            if (state === "cursor") {
              return (
                <span key={i} ref={cursorRef} className="relative">
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-primary animate-caret-pulse" />
                  <span className="text-muted-foreground/50 underline decoration-primary decoration-2 underline-offset-4">{char}</span>
                </span>
              )
            }
            return (
              <span key={i} className="text-muted-foreground opacity-60">
                {char}
              </span>
            )
          })}
        </div>
      </div>

      {/* ── error hint ── */}
      {hasError && (
        <p className="text-sm font-semibold text-destructive text-center -mt-4 animate-pulse">
          ⚠️ Fix error before typing forward (Backspace)
        </p>
      )}

      {/* hidden input that captures all keystrokes */}
      <input
        ref={inputRef}
        className="opacity-0 absolute -z-10"
        value={typed}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={(e) => e.preventDefault()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type the passage here"
      />
    </div>
  )
}