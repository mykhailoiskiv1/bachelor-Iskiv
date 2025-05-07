import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CLIENT') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      clientId: session.user.id,
      deletedAt: null,
    },
    orderBy: {
      issuedDate: 'desc',
    },
  })

  return NextResponse.json(invoices)
}
