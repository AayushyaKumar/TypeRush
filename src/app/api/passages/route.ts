import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/passages?difficulty=medium&category=programming&active=true
 *
 * Returns a list of passages with optional filtering.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const difficulty = searchParams.get("difficulty")
  const category = searchParams.get("category")
  const active = searchParams.get("active")

  const where: Record<string, unknown> = {}
  if (difficulty) where.difficulty = difficulty
  if (category) where.category = category
  if (active !== null) where.isActive = active !== "false"

  const passages = await prisma.passage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(passages)
}

/**
 * POST /api/passages
 *
 * Creates a new passage.
 * Body: { text, difficulty?, category? }
 */
export async function POST(req: Request) {
  const body = await req.json()

  if (!body.text || typeof body.text !== "string" || body.text.trim().length < 10) {
    return NextResponse.json(
      { error: "Passage text is required and must be at least 10 characters." },
      { status: 400 }
    )
  }

  const text = body.text.trim()
  const wordCount = text.split(/\s+/).length

  const passage = await prisma.passage.create({
    data: {
      text,
      wordCount,
      difficulty: body.difficulty || "medium",
      category: body.category || "general",
    },
  })

  return NextResponse.json(passage, { status: 201 })
}
