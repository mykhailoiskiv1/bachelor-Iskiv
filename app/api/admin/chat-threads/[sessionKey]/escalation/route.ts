import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ sessionKey: string }> } // 👈 Підкреслюємо, що params — Promise
) {
  const { sessionKey } = await context.params; // ✅ треба await

  const contact = await prisma.aiChatEscalation.findUnique({
    where: { sessionKey },
  });

  if (!contact) {
    return NextResponse.json(null);
  }

  return NextResponse.json(contact);
}
