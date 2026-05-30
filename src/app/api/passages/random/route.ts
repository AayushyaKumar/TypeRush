import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Difficulty } from "@/lib/passages"

/**
 * Map a difficulty level to an approximate word-count range in the DB.
 *   easy   → ~100 words  (80–120)
 *   medium → ~150 words  (120–180)
 *   hard   → ~200 words  (170–250)
 */
function difficultyRange(d: Difficulty): { gte: number; lte: number } {
  if (d === "easy")   return { gte: 80,  lte: 120 }
  if (d === "medium") return { gte: 120, lte: 180 }
  return { gte: 170, lte: 250 }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const difficulty = searchParams.get("difficulty") as Difficulty | null
  const category   = searchParams.get("category")

  // Build where clause from optional filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { isActive: true }

  if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
    where.wordCount = difficultyRange(difficulty)
  }
  if (category) where.category = category

  // Count matching passages
  const count = await prisma.passage.count({ where })

  if (count === 0) {
    // Fallback: return any active passage rather than a 404
    const fallbackCount = await prisma.passage.count({ where: { isActive: true } })
    if (fallbackCount === 0) {
      return NextResponse.json(
        { error: "No passages found" },
        { status: 404 }
      )
    }
    const skip = Math.floor(Math.random() * fallbackCount)
    const passage = await prisma.passage.findFirst({
      where: { isActive: true },
      skip,
    })
    return NextResponse.json(passage)
  }

  // Pick a random offset
  const skip = Math.floor(Math.random() * count)
  const passage = await prisma.passage.findFirst({ where, skip })

  return NextResponse.json(passage)
}
