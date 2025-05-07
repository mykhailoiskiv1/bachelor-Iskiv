import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma';
import { ReviewStatus } from '@/prisma/prisma/generated/client';


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const status = req.nextUrl.searchParams.get('status') as
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | undefined;

    const reviews = await prisma.review.findMany({
        where: status ? { status } : {},
        orderBy: { createdAt: 'desc' },
      });
      

  return NextResponse.json(reviews);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, action, reply } = await req.json() as {
    id: number;
    action: 'APPROVE' | 'REJECT' | 'REPLY';
    reply?: string;
  };

  if (!id || !action) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const data =
    action === 'REPLY'
      ? { companyReply: reply }
      : { status: action === 'APPROVE' ? ReviewStatus.APPROVED : ReviewStatus.REJECTED };

  const updated = await prisma.review.update({ where: { id }, data });
  return NextResponse.json(updated);
}
