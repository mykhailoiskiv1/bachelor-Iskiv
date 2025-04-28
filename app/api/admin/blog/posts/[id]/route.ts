import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
  }
}

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
        category,
        content,
        seoTitle,
        seoDescription,
        slug: slugify(title, { lower: true }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Post not found or update failed' }, { status: 500 });
  }
}
