import { authOptions } from '@/lib/auth'
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    const { id, action } = await req.json()
  
    if (!id || !['block', 'unblock'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  
    const isActive = action === 'unblock'
  
    await prisma.user.update({
      where: { id },
      data: { isActive }
    })
  
    return NextResponse.json({ message: `Client ${action}ed` })
  }
  