import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categories = await prisma.service.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      category: true,
    },
    distinct: ['category'],
  })

  const uniqueCategories = categories.map(c => c.category).filter(Boolean)

  return NextResponse.json(uniqueCategories)
}
