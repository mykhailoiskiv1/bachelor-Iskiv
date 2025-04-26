import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split('/').pop();
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const data = await req.json();

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data,
    });

    return NextResponse.json({ message: 'Service updated', service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split('/').pop();
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    await prisma.service.update({
      where: { id: serviceId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: 'Service soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
