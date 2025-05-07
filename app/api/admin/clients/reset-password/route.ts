import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
  }

  const tempPassword = 'Temp1234!'
  const hashedPassword = await bcrypt.hash(tempPassword, 10)

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  })

  return NextResponse.json({ message: 'Password reset', tempPassword })
}
