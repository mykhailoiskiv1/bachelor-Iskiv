import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)

  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { email: session.user.email ?? undefined },
    data: { password: hashedPassword }
  })

  return NextResponse.json({ message: 'Password updated successfully' })
}
