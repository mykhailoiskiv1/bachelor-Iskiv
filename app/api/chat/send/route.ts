import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SOCKET_API_URL = process.env.SOCKET_API_URL!;

export async function POST(req: NextRequest) {
  const { sessionKey, sender, content } = await req.json();

  if (!sessionKey || !sender || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const thread = await prisma.aiChatThread.upsert({
      where: { sessionKey },
      update: {},
      create: { sessionKey },
    });

    await prisma.aiChatMessage.create({
      data: {
        threadId: thread.id,
        sender,
        content,
      },
    });

    await fetch(`${SOCKET_API_URL}/api/emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: sessionKey, sender, content }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ /api/chat/send error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
