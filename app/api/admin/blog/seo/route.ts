import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
  }

  const prompt = `
Generate a concise SEO Title, Meta Description, and a list of SEO Keywords for the following blog post.
Title: "${title}"
Content: "${content.slice(0, 500)}"

Return in this format:
SEO Title: ...
SEO Description: ...
SEO Keywords: keyword1, keyword2, keyword3, ...
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    const aiResponse = completion.choices[0].message?.content ?? '';

    const seoTitleRegex = /SEO Title:\s*(.+)/;
    const seoTitleMatch = seoTitleRegex.exec(aiResponse);
    const seoDescriptionRegex = /SEO Description:\s*(.+)/;
    const seoDescriptionMatch = seoDescriptionRegex.exec(aiResponse);
    const seoKeywordsRegex = /SEO Keywords:\s*(.+)/;
    const seoKeywordsMatch = seoKeywordsRegex.exec(aiResponse);

    return NextResponse.json({
      seoTitle: seoTitleMatch?.[1] ?? '',
      seoDescription: seoDescriptionMatch?.[1] ?? '',
      seoKeywords: seoKeywordsMatch?.[1] ?? '',
    });

  } catch (err) {
    console.error('OpenAI Error:', err);
    return NextResponse.json({ error: 'Failed to generate SEO data' }, { status: 500 });
  }
}
