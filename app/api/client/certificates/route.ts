import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const certificates = await prisma.certificate.findMany({
    where: { clientId: session.user.id },
    orderBy: { issuedDate: 'desc' }
  })

  return NextResponse.json(certificates)
}
