import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImageToGCS } from '@/lib/gcs/gcs';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `${Date.now()}-${file.name}`;
        return await uploadImageToGCS(buffer, filename, file.type);
      })
    );

    const existing = await prisma.project.findUnique({
      where: { id },
      select: { imagePaths: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        imagePaths: [...existing.imagePaths, ...uploads],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Images added', updated });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
