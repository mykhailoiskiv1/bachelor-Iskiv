import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

function extractIdFromUrl(url: string): number | null {
  const segments = url.split('/')
  const index = segments.findIndex(s => s === 'client-projects')
  const id = segments[index + 1]
  return id ? parseInt(id) : null
}

export async function PUT(req: NextRequest) {
  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const restored = await prisma.clientProject.update({
    where: { id },
    data: { deletedAt: null },
  })

  return NextResponse.json(restored)
}
