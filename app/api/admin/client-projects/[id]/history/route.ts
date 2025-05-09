import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function extractIdFromUrl(url: string) {
  const segments = url.split('/')
  const id = segments[segments.indexOf('client-projects') + 1]
  return parseInt(id)
}

export async function GET(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const history = await prisma.clientProjectHistory.findMany({
    where: {
      clientProjectId: id,
      deletedAt: null,
    },
    orderBy: { startDate: 'desc' },
  })

  return NextResponse.json(history)
}

export async function POST(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const data = await req.json()

  const entry = await prisma.clientProjectHistory.create({
    data: {
      clientProjectId: id,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing history ID' }, { status: 400 })

  const deleted = await prisma.clientProjectHistory.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  return NextResponse.json(deleted)
}
