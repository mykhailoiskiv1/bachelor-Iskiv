import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const threads = await prisma.aiChatThread.findMany({
    where: { isEscalated: true },
    orderBy: { createdAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      escalation: true, 
    },
  });

  const result = threads.map(thread => {
    const hasAdminReply = thread.messages.some(m => m.sender === 'ADMIN');
    const lastMessage = thread.messages.at(-1)?.content ?? '';

    return {
      sessionKey: thread.sessionKey,
      createdAt: thread.createdAt.toISOString(),
      messageCount: thread.messages.length,
      hasAdminReply,
      lastMessage,
      contactName: thread.escalation?.name ?? null,
      contactEmail: thread.escalation?.email ?? null,
    };
  });

  return NextResponse.json(result);
}
