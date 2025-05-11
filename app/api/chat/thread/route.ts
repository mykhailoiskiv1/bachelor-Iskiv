import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const cookieStore = await cookies();
  let sessionKey = cookieStore.get('chat_session_key')?.value;
  let isNew = false;

  if (!sessionKey) {
    sessionKey = uuidv4();
    isNew = true;
  }

  const thread =
    (await prisma.aiChatThread.findUnique({ where: { sessionKey } })) ||
    (await prisma.aiChatThread.create({ data: { sessionKey } }));

  const messages = await prisma.aiChatMessage.findMany({
    where: { threadId: thread.id },
    orderBy: { createdAt: 'asc' },
  });

  const res = NextResponse.json({
    sessionKey,
    messages,
    isEscalated: thread.isEscalated,
  });

  if (isNew) {
    res.cookies.set('chat_session_key', sessionKey, {
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }

  return res;
}
