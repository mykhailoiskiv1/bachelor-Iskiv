import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return {}

  return {
    title: post.title,
    description: post.content.slice(0, 150),
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return notFound()

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">{post.title}</h1>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={800}
        height={400}
        className="rounded-xl mx-auto"
      />
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </article>
  )
}
