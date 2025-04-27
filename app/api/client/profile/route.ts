import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
    select: { name: true, address: true, phone: true, email: true }
  })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email ?? undefined },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone
    },
    select: { name: true, address: true, phone: true, email: true }
  })

  return NextResponse.json(updatedUser)
}
