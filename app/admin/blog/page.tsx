'use client'

import useSWR from 'swr'
import axios from 'axios'
import PostItem from '@/components/admin/blog/PostItem'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  category: string
  imagePath: string
  createdAt: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminBlogPage() {
  const { data: posts, isLoading, error } = useSWR<Post[]>('/api/admin/blog/posts', fetcher)

  if (isLoading) return <p className="text-center py-10">Loading posts...</p>
  if (error || !posts) return <p className="text-center text-red-600 py-10">Failed to load posts</p>

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)]">
          Blog Management
        </h1>
        <Link href="/admin/blog/create">
          <button className="bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:bg-[var(--color-button-hover-bg)] px-4 py-2 rounded">
            + New Post
          </button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      )}
    </main>
  )
}
