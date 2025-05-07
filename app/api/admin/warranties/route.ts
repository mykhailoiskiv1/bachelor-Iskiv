import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const warranties = await prisma.warranty.findMany({
        include: {
            client: {
                select: { email: true, name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(warranties)
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clientId, projectName, startDate, durationMonths } = await req.json()

    if (!clientId || !projectName || !startDate || !durationMonths) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const newWarranty = await prisma.warranty.create({
        data: {
            clientId,
            projectName,
            startDate: new Date(startDate),
            durationMonths: Number(durationMonths),
            projectId: 0
        },
        include: {
            client: { select: { email: true, name: true } }
        }
    })


    return NextResponse.json(newWarranty, { status: 201 })
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.warranty.delete({
        where: { id }
    })

    return NextResponse.json({ message: 'Warranty deleted' })
}
