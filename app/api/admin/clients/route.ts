import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT', isConfirmed: false },
    select: { id: true, email: true, name: true, address: true }
  });

  return NextResponse.json(clients);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: 'Client ID required' }, { status: 400 });

  await prisma.user.update({
    where: { id },
    data: { isConfirmed: true }
  });

  return NextResponse.json({ message: 'Client confirmed' });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, address } = await req.json();

  if (!id || !name || !address) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const updatedClient = await prisma.user.update({
    where: { id },
    data: { name, address },
    select: { id: true, name: true, address: true, email: true }
  });

  return NextResponse.json(updatedClient);
}
