import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import openai from '@/lib/api/openai';
import slugify from 'slugify';

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true, content: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newSlug = slugify(project.title, { lower: true });

    const prompt = `
Regenerate SEO for the following project:

Title: ${project.title}
Content: ${project.content.slice(0, 800)}

Return format:
SEO Title: ...
SEO Description: ...
SEO Keywords: keyword1, keyword2, ...
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    const aiResponse = completion.choices[0].message?.content ?? '';
    const [seoTitleLine, seoDescriptionLine, seoKeywordsLine] = aiResponse.split('\n');

    const seoTitle = seoTitleLine?.replace('SEO Title:', '').trim();
    const seoDescription = seoDescriptionLine?.replace('SEO Description:', '').trim();
    const seoKeywords = seoKeywordsLine?.replace('SEO Keywords:', '').trim();

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        slug: newSlug,
        seoTitle,
        seoDescription,
        seoKeywords,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Slug and SEO regenerated', updated });
  } catch (error) {
    console.error('[REGEN_SLUG_SEO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to regenerate' }, { status: 500 });
  }
}
