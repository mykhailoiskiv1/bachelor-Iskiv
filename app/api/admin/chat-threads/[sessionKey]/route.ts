import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ sessionKey: string }> }
) {
  const { sessionKey } = await context.params;

  const thread = await prisma.aiChatThread.findUnique({
    where: { sessionKey },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  const messages = thread.messages.map(m => ({
    sender: m.sender,
    content: m.content,
    timestamp: m.createdAt.toISOString(),
  }));

  return NextResponse.json({ sessionKey, messages });
}
