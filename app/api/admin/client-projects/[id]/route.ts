import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function extractIdFromUrl(url: string): number | null {
  const segments = url.split('/')
  const index = segments.findIndex((s) => s === 'client-projects')
  const id = segments[index + 1]
  return id ? parseInt(id) : null
}

export async function GET(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const project = await prisma.clientProject.findUnique({
    where: { id },
    include: {
      client: true,
      history: { orderBy: { startDate: 'desc' } },
    },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(project)
}

export async function PUT(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  const data = await req.json()

  const updated = await prisma.clientProject.update({
    where: { id },
    data: {
      name: data.name,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })

  await prisma.clientProjectHistory.deleteMany({
    where: { clientProjectId: id },
  })

  const deleted = await prisma.clientProject.delete({
    where: { id },
  })

  return NextResponse.json(deleted)
}
