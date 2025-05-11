import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const SOCKET_API_URL = process.env.SOCKET_API_URL!;
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

export async function POST(req: NextRequest) {
  const { sessionKey, content } = await req.json();
  if (!sessionKey || !content) {
    return NextResponse.json({ error: 'Missing sessionKey or content' }, { status: 400 });
  }

  const thread = await prisma.aiChatThread.findUnique({ where: { sessionKey } });
  if (!thread || thread.isEscalated) {
    return NextResponse.json({ error: 'Chat not found or already escalated' }, { status: 403 });
  }

  await prisma.aiChatMessage.create({
    data: { threadId: thread.id, sender: 'CLIENT', content },
  });

  const history = await prisma.aiChatMessage.findMany({
    where: { threadId: thread.id },
    orderBy: { createdAt: 'asc' },
  });

  const kbHits = await prisma.knowledgeBase.findMany({
    where: { content: { contains: content } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const systemMessages = [
    {
      role: 'system' as const,
      content: `You are the support chatbot for Dream Construction. Respond very briefly (1–2 sentences) in a professional and friendly tone. Refer to our company as "DreamCon" when appropriate.`,
    },
    ...kbHits.map(kb => ({
      role: 'system' as const,
      content: `Reference: ${kb.title} — ${kb.content.slice(0, 200)}…`,
    })),
  ];

  const messagesForAI = [
    ...systemMessages,
    ...history.map(m => ({
      role: m.sender === 'AI' ? 'assistant' as const : 'user' as const,
      content: m.content,
    })),
    { role: 'user' as const, content },
  ];

  const functions = [
    {
      name: 'escalate',
      description: 'Determines whether the conversation should be escalated to a human agent.',
      parameters: {
        type: 'object',
        properties: {
          escalate: {
            type: 'boolean',
            description: 'True if should escalate to human support',
          },
          notice: {
            type: 'string',
            description: 'System message to send to the user if escalated',
          },
        },
        required: ['escalate', 'notice'],
      },
    },
  ];

  const aiResp = await openai.chat.completions.create({
    model: MODEL,
    messages: messagesForAI,
    temperature: 0.3,
    max_tokens: 150,
    functions,
    function_call: 'auto',
  });

  const fnCall = aiResp.choices[0]?.message.function_call;
  let aiAnswer = aiResp.choices[0]?.message.content?.trim() ?? '';
  let escalated = false;
  let noticeText = '';

  // ✅ If GPT triggered function_call
  if (fnCall?.name === 'escalate') {
    try {
      const args = JSON.parse(fnCall.arguments!);
      if (args.escalate) {
        escalated = true;
        noticeText = args.notice;

        await prisma.aiChatThread.update({
          where: { sessionKey },
          data: { isEscalated: true },
        });

        await prisma.aiChatMessage.create({
          data: {
            threadId: thread.id,
            sender: 'SYSTEM',
            content: noticeText,
          },
        });
      }
    } catch {}
  }

  // ✅ Fallback: якщо GPT не викликав function_call, але написав щось підозріле
  if (!escalated && /we.*(contact|reach out|get back|schedule)/i.test(aiAnswer)) {
    escalated = true;
    noticeText = 'You’ve been transferred to a human agent. Please leave your contact info.';

    await prisma.aiChatThread.update({
      where: { sessionKey },
      data: { isEscalated: true },
    });

    await prisma.aiChatMessage.create({
      data: {
        threadId: thread.id,
        sender: 'SYSTEM',
        content: noticeText,
      },
    });

    aiAnswer = ''; // не дублювати GPT відповідь, SYSTEM вже сказав головне
  }

  // 🧠 Зберегти відповідь AI (якщо не ескалація system-only)
  if (!escalated && aiAnswer) {
    await prisma.aiChatMessage.create({
      data: { threadId: thread.id, sender: 'AI', content: aiAnswer },
    });
  }

  const relay = async (sender: string, msg: string) => {
    await fetch(`${SOCKET_API_URL}/api/emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: sessionKey, sender, content: msg }),
    });
  };

  await relay('CLIENT', content);

  if (escalated) {
    await relay('SYSTEM', noticeText);
  } else if (aiAnswer) {
    await relay('AI', aiAnswer);
  }

  return NextResponse.json({ success: true });
}
