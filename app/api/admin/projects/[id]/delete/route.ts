import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: 'Project permanently deleted' });
  } catch (error) {
    console.error('[PROJECT_PERMA_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
