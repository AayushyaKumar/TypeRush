export type Difficulty = "easy" | "medium" | "hard"

/** Word count targets per difficulty */
export const DIFFICULTY_WORD_COUNT: Record<Difficulty, number> = {
  easy:   100,
  medium: 150,
  hard:   200,
}

/** Time limits (ms) per difficulty */
export const DIFFICULTY_TIME_MS: Record<Difficulty, number> = {
  easy:   6  * 60 * 1000,  // 6 min
  medium: 7  * 60 * 1000,  // 7 min
  hard:   8 * 60 * 1000,  // 10 min
}

export interface Passage {
  id: string
  text: string
  wordCount: number
  difficulty: Difficulty
  category: string
}

export interface PassageFilters {
  difficulty?: Difficulty
}

/**
 * Fetch a list of passages from the API, with optional filters.
 */
export async function fetchPassages(filters?: PassageFilters): Promise<Passage[]> {
  const params = new URLSearchParams()
  if (filters?.difficulty) params.set("difficulty", filters.difficulty)
  const qs = params.toString()
  const res = await fetch(`/api/passages${qs ? `?${qs}` : ""}`)
  if (!res.ok) throw new Error("Failed to fetch passages")
  return res.json()
}

/**
 * Fetch a single random passage from the API.
 */
export async function fetchRandomPassage(filters?: PassageFilters): Promise<Passage> {
  const params = new URLSearchParams()
  if (filters?.difficulty) params.set("difficulty", filters.difficulty)
  const qs = params.toString()
  const res = await fetch(`/api/passages/random${qs ? `?${qs}` : ""}`)
  if (!res.ok) throw new Error("Failed to fetch random passage")
  return res.json()
}