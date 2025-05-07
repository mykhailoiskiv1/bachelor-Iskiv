import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await context.params
    const invoiceId = parseInt(id, 10)

    if (isNaN(invoiceId)) {
        return new NextResponse('Invalid invoice ID', { status: 400 })
    }

    const body = await req.json()
    const { title, projectName, totalAmount } = body

    if (!title || !projectName || isNaN(totalAmount)) {
        return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    try {
        const updated = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                title,
                projectName,
                totalAmount,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('[INVOICE_UPDATE_ERROR]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
