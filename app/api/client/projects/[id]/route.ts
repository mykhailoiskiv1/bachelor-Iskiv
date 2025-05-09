import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { NextRequest, NextResponse } from 'next/server'

// Витягуємо ID з URL
function extractIdFromUrl(url: string) {
  const segments = url.split('/')
  const id = segments[segments.indexOf('projects') + 1]
  return parseInt(id)
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = extractIdFromUrl(req.nextUrl.pathname)
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const project = await prisma.clientProject.findFirst({
    where: {
      id,
      clientId: session.user.id,
      deletedAt: null,
    },
    include: {
      history: {
        where: { deletedAt: null },
        orderBy: { startDate: 'desc' },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(project)
}
