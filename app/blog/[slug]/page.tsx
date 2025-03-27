import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
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