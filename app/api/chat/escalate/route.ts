import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get('chat_session_key')?.value;

  if (!sessionKey) {
    return NextResponse.json(
      { error: 'Session key not found' },
      { status: 400 }
    );
  }

  const thread = await prisma.aiChatThread.findUnique({
    where: { sessionKey },
  });

  if (!thread) {
    return NextResponse.json(
      { error: 'Chat thread not found' },
      { status: 404 }
    );
  }

  if (thread.isEscalated) {
    return NextResponse.json({ message: 'Already escalated' });
  }

  await prisma.aiChatThread.update({
    where: { sessionKey },
    data: { isEscalated: true },
  });

  return NextResponse.json({ success: true });
}
