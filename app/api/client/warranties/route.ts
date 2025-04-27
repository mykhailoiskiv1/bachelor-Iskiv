import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const warranties = await prisma.warranty.findMany({
    where: { clientId: session.user.id },
    select: {
      id: true,
      projectName: true,
      startDate: true,
      durationMonths: true,
      createdAt: true
    },
    orderBy: { startDate: 'desc' }
  });

  return NextResponse.json(warranties);
}
