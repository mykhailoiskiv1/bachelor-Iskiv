import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const latestProjects = await prisma.project.findMany({
      where: { deletedAt: null, published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        category: true,
        imagePaths: true,
        slug: true,
      },
    });

    return NextResponse.json(latestProjects);
  } catch (error) {
    console.error('[PROJECT_PREVIEW_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load preview projects' }, { status: 500 });
  }
}
