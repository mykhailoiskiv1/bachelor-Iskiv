import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const { title, category, content, seoTitle, seoDescription } = await req.json();

  if (!title || !category || !content) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug: slugify(title, { lower: true }),
        category,
        content,
        seoTitle,
        seoDescription,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
