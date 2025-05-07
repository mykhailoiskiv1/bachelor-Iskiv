import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const deletedInvoices = await prisma.invoice.findMany({
        where: { deletedAt: { not: null } },
        orderBy: { deletedAt: 'desc' },
        select: {
            id: true,
            title: true,
            projectName: true,
            deletedAt: true,
        },
    })

    return NextResponse.json(deletedInvoices)
}
