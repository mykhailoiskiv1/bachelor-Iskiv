import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const archived = await prisma.project.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        deletedAt: true,
      },
    });

    return NextResponse.json(archived);
  } catch (error) {
    console.error('[GET_ARCHIVED_PROJECTS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load archived projects' }, { status: 500 });
  }
}
