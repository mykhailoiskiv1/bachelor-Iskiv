import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  const segments = req.nextUrl.pathname.split('/');
  const serviceId = Number(segments[segments.length - 2]);

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
    console.error('[PATCH] Error restoring service:', error);
    return NextResponse.json({ error: 'Failed to restore service' }, { status: 500 });
  }
}
