import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    include: { client: { select: { email: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clientId, title, message } = await req.json();

  if (!clientId || !title || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      clientId,
      title,
      message
    }
  });

  return NextResponse.json(notification, { status: 201 });
}
