import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { sessionKey, email, name, message } = await req.json();

  if (!sessionKey || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const exists = await prisma.aiChatEscalation.findUnique({ where: { sessionKey } });
  if (exists) {
    return NextResponse.json({ message: 'Already submitted' });
  }

  const record = await prisma.aiChatEscalation.create({
    data: { sessionKey, email, name, message },
  });

  return NextResponse.json({ success: true, record });
}
