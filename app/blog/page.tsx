// app/blog/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Metadata } from 'next'

// (необов'язково) SEO
export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'List of all blog posts',
}

export default async function BlogPage() {
  // Завантажимо усі пости з БД
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded hover:bg-gray-50">
            {/* Використовуємо query-параметр ?slug=... */}
            <Link
              href={{
                pathname: '/blog/post',
                query: { slug: post.slug },
              }}
              className="text-xl font-semibold hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
