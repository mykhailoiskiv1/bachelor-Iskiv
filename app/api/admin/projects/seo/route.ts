import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import openai from '@/lib/api/openai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, content } = body

    let projectTitle = title
    let projectContent = content

    // Якщо title та content не передані — спробуємо знайти по id
    if ((!title || !content) && id) {
      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
        select: { title: true, content: true },
      })

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }

      projectTitle = project.title
      projectContent = project.content
    }

    if (!projectTitle || !projectContent) {
      return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
    }

    const prompt = `
Generate SEO metadata for a construction project.
Title: ${projectTitle}
Content: ${projectContent.slice(0, 800)}

Return format:
SEO Title: ...
SEO Description: ...
SEO Keywords: keyword1, keyword2, ...
    `

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    })

    const response = completion.choices[0].message?.content ?? ''
    const [seoTitleLine, seoDescriptionLine, seoKeywordsLine] = response.split('\n')

    const seoTitle = seoTitleLine?.replace('SEO Title:', '').trim()
    const seoDescription = seoDescriptionLine?.replace('SEO Description:', '').trim()
    const seoKeywords = seoKeywordsLine?.replace('SEO Keywords:', '').trim()

    return NextResponse.json({ seoTitle, seoDescription, seoKeywords })
  } catch (error) {
    console.error('[SEO_GENERATION_ERROR]', error)
    return NextResponse.json({ error: 'Failed to generate SEO' }, { status: 500 })
  }
}
