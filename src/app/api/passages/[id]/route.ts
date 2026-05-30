import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/passages/:id
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params

  const passage = await prisma.passage.findUnique({ where: { id } })

  if (!passage) {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 })
  }

  return NextResponse.json(passage)
}

/**
 * PUT /api/passages/:id
 *
 * Update a passage. Body can include: text, difficulty, category, isActive
 */
export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.text !== undefined) {
    data.text = body.text.trim()
    data.wordCount = (data.text as string).split(/\s+/).length
  }
  if (body.difficulty !== undefined) data.difficulty = body.difficulty
  if (body.category !== undefined) data.category = body.category
  if (body.isActive !== undefined) data.isActive = body.isActive

  try {
    const passage = await prisma.passage.update({ where: { id }, data })
    return NextResponse.json(passage)
  } catch {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 })
  }
}

/**
 * DELETE /api/passages/:id
 *
 * Soft-delete: sets isActive to false rather than removing the row.
 */
export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params

  try {
    const passage = await prisma.passage.update({
      where: { id },
      data: { isActive: false },
    })
    return NextResponse.json(passage)
  } catch {
    return NextResponse.json({ error: "Passage not found" }, { status: 404 })
  }
}
