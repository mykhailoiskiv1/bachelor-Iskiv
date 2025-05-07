import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await context.params
  const invoiceId = Number(id)

  if (isNaN(invoiceId)) {
    return new NextResponse('Invalid invoice ID', { status: 400 })
  }

  try {
    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { deletedAt: null },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[INVOICE_RESTORE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to restore invoice' }, { status: 500 })
  }
}
