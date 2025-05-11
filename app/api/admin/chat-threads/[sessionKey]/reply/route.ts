import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SOCKET_API_URL = process.env.SOCKET_API_URL!;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ sessionKey: string }> }
) {
  const { sessionKey } = await context.params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const thread = await prisma.aiChatThread.findUnique({ where: { sessionKey } });
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }

  const message = await prisma.aiChatMessage.create({
    data: { threadId: thread.id, sender: 'ADMIN', content },
  });

  await fetch(`${SOCKET_API_URL}/api/emit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId: sessionKey, sender: 'ADMIN', content }),
  });

  return NextResponse.json({ success: true, message });
}
