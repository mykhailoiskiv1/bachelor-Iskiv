import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const invoices = await prisma.invoice.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: {
            issuedDate: 'desc',
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    return NextResponse.json(invoices)
}
