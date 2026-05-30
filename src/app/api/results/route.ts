import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const results = await prisma.raceResult.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      passage: {
        select: {
          difficulty: true,
          wordCount: true,
        },
      },
    },
  })

  return NextResponse.json(results)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  const body = await req.json()

  const result = await prisma.raceResult.create({
    data: {
      userId: session?.user?.email
        ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id
        : null,
      passageId: body.passageId,
      wpm: body.wpm,
      accuracy: body.accuracy,
      timeMs: body.timeMs,
      errors: body.errors ?? 0,
    },
  })

  return NextResponse.json(result)
}