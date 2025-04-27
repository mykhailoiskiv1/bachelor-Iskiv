import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const certificates = await prisma.certificate.findMany({
    include: { client: { select: { email: true, name: true } } },
    orderBy: { issuedDate: 'desc' }
  })

  return NextResponse.json(certificates)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clientId, fileUrl, title, issuedDate } = await req.json()

  if (!clientId || !fileUrl || !title || !issuedDate) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const certificate = await prisma.certificate.create({
    data: { clientId, fileUrl, title, issuedDate: new Date(issuedDate) }
  })

  return NextResponse.json(certificate, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 })
  }

  await prisma.certificate.delete({ where: { id } })

  return NextResponse.json({ message: 'Certificate deleted' })
}
