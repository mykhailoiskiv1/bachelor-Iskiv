// app/api/blog/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'No slug provided' }, { status: 400 })
  }

  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ post })
}
