import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true, address: true, isConfirmed: true, isActive: true }
  })

  return NextResponse.json(clients)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, name, address } = await req.json()

  if (!id || !name || !address) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const updatedClient = await prisma.user.update({
    where: { id },
    data: { name, address },
    select: { id: true, name: true, address: true, email: true, isConfirmed: true, isActive: true }
  })

  return NextResponse.json(updatedClient)
}
