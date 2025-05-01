import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
      select: { deletedAt: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!existing.deletedAt) {
      return NextResponse.json({ error: 'Project is not deleted' }, { status: 400 });
    }

    const restored = await prisma.project.update({
      where: { id: projectId },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Project restored', restored });
  } catch (error) {
    console.error('[PROJECT_RESTORE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to restore project' }, { status: 500 });
  }
}
