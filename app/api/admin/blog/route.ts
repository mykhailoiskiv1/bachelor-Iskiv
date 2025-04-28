import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadImageToGCS } from '@/lib/gcs';
import openai from '@/lib/openai';
import slugify from 'slugify';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const file = formData.get('image') as File;

  if (!title || !content || !category || !file) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${file.name}`;
    const imagePath = await uploadImageToGCS(buffer, filename, file.type);

    const seoPrompt = `Generate a SEO-friendly title and meta description for a blog post with the following content:\nTitle: ${title}\nContent: ${content}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: seoPrompt }],
      max_tokens: 200,
    });

    const seoResult = completion.choices[0].message.content ?? '';
    const [seoTitle, seoDescription] = seoResult.split('\n').map(line => line.replace(/^.*?:\s*/, ''));

    const post = await prisma.post.create({
      data: {
        title,
        slug: slugify(title, { lower: true }),
        category,
        content,
        imagePath,
        seoTitle: seoTitle ?? '',
        seoDescription: seoDescription ?? '',
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
