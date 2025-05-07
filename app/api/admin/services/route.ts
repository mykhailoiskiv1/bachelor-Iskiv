import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const services = await prisma.service.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { title, category, description, icon, isFeatured, isHot, sortOrder } = data;

        if (!title || !category) {
            return NextResponse.json({ error: 'Title and category are required.' }, { status: 400 });
        }

        const newService = await prisma.service.create({
            data: { title, category, description, icon, isFeatured, isHot, sortOrder },
        });

        return NextResponse.json({ message: 'Service created successfully', service: newService }, { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
