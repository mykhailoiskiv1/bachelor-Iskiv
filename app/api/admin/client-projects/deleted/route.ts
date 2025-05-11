import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const deletedProjects = await prisma.clientProject.findMany({
    where: {
      deletedAt: { not: null },
    },
    include: {
      client: {
        select: { name: true, email: true },
      },
    },
    orderBy: { deletedAt: 'desc' },
  })

  return NextResponse.json(deletedProjects)
}
