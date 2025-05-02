import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToGCS } from '@/lib/gcs/gcs';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    if (!title || !category || !content || !description || !file) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;

    const imageUrl = await uploadImageToGCS(buffer, filename, file.type, 'projects');

    const newProject = await prisma.project.create({
      data: {
        title,
        slug: slugify(title, { lower: true }),
        description,
        content,
        category,
        imagePaths: [imageUrl],
        published: false,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[PROJECTS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
