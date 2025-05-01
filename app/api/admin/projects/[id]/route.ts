import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';
import { getSignedUrl } from '@/lib/gcs/getSignedUrl';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const signedImagePaths = await Promise.all(
      project.imagePaths.map((path) => getSignedUrl(path))
    );

    return NextResponse.json({ ...project, imagePaths: signedImagePaths });
  } catch (error) {
    console.error('[PROJECT_GET_ERROR]', error);
    return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const data = await req.json();

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        slug: slugify(data.title, { lower: true }),
        description: data.description,
        content: data.content,
        category: data.category,
        location: data.location ?? null,
        videoUrl: data.videoUrl ?? null,
        completionDate: data.completionDate ? new Date(data.completionDate) : null,
        tags: (() => {
          if (!data.tags) return [];
          return Array.isArray(data.tags)
            ? data.tags
            : data.tags.split(',').map((tag: string) => tag.trim());
        })(),
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        published: data.published ?? false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PROJECT_PATCH_ERROR]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function PUT(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { published: true },
    });

    return NextResponse.json({ message: 'Project published', updated });
  } catch (error) {
    console.error('[PROJECT_PUT_ERROR]', error);
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 });
  }
}

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
    const deleted = await prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: 'Project soft deleted', deleted });
  } catch (error) {
    console.error('[PROJECT_DELETE_ERROR]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}