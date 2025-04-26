import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const { clientName, rating, content } = await req.json();

  if (!clientName || !rating || !content || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { clientName, rating, content },
  });

  return NextResponse.json(review, { status: 201 });
}
