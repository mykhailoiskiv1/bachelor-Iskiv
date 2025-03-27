// app/blog/post/page.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  title: string
  slug: string
  content: string
  imageUrl: string
  createdAt: string
}

export default function BlogPostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Якщо slug відсутній – йдемо на /404
    if (!slug) {
      router.replace('/404')
      return
    }

    // Завантажуємо дані через API-роут
    fetch(`/api/blog?slug=${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          router.replace('/404')
          return
        }
        const data = await res.json()
        setPost(data.post)
        setLoading(false)
      })
      .catch(() => {
        // Якщо fetch зламався, теж на /404
        router.replace('/404')
      })
  }, [slug, router])

  if (loading) {
    return <p className="p-4">Loading post...</p>
  }

  if (!post) {
    return <p className="p-4">No post found</p>
  }

  return (
    <article className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">{post.title}</h1>
      <img
        src={post.imageUrl}
        alt={post.title}
        className="block mx-auto rounded"
        style={{ maxWidth: '100%' }}
      />
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </article>
  )
}
