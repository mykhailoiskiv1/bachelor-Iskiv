import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const deletedProjects = await prisma.project.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        imagePaths: true,
        published: true,
        createdAt: true,
        deletedAt: true,
      },
    })

    return NextResponse.json(deletedProjects)
  } catch (error) {
    console.error('[DELETED_PROJECTS_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch deleted projects' }, { status: 500 })
  }
}
