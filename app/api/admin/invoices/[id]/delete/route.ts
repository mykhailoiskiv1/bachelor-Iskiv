import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { id } = await context.params
  const invoiceId = Number(id)

  if (isNaN(invoiceId)) {
    return new NextResponse('Invalid ID', { status: 400 })
  }

  try {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('[INVOICE_SOFT_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to soft delete invoice' }, { status: 500 })
  }
}
