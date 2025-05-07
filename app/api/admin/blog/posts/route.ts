import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content, category, imagePath } = await req.json();

  if (!title || !content || !category || !imagePath) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')


  const prompt = `
Generate a concise SEO title and meta description for a blog post.
Title: "${title}"
Content: "${content.slice(0, 500)}"
Return format:
SEO Title: ...
SEO Description: ...
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message?.content ?? '';
    const [seoTitleLine, seoDescriptionLine] = aiResponse.split('\n');
    const seoTitle = seoTitleLine?.replace('SEO Title:', '').trim();
    const seoDescription = seoDescriptionLine?.replace('SEO Description:', '').trim();

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        category,
        content,
        imagePath,
        seoTitle: seoTitle || '',
        seoDescription: seoDescription || '',
        published: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('OpenAI or Database Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
