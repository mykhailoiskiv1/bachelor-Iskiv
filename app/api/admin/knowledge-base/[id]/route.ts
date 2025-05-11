import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const item = await prisma.knowledgeBase.findUnique({
    where: { id: Number(id) },
  });

  return item
    ? NextResponse.json(item)
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { title, content } = await req.json();

  const updated = await prisma.knowledgeBase.update({
    where: { id: Number(id) },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await prisma.knowledgeBase.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
