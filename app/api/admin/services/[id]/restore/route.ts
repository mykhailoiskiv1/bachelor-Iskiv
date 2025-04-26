import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop();
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
        return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    try {
        const restoredService = await prisma.service.update({
            where: { id: serviceId },
            data: { deletedAt: null },
        });

        return NextResponse.json({ message: 'Service restored', service: restoredService });
    } catch (error) {
        console.error('Error restoring service:', error);
        return NextResponse.json({ error: 'Failed to restore service' }, { status: 500 });
    }
}
