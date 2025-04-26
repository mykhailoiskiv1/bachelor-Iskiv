import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, companyReply } = await req.json();

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updatedReview = await prisma.review.update({
    where: { id: parseInt(params.id) },
    data: { status, companyReply },
  });

  return NextResponse.json(updatedReview);
}
