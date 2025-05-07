'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import PostForm from '@/components/admin/blog/PostForm'

type InitialDataType = {
  title: string
  category: string
  content: string
  imagePath: string
}

export default function EditPostPage() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [initialData, setInitialData] = useState<InitialDataType | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/admin/blog/posts/${id}`)
        setInitialData(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load post data.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) return <p className="text-center py-10">Loading...</p>
  if (error || !initialData) return <p className="text-center text-red-600 py-10">{error || 'Not found'}</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)] mb-8">
        Edit Blog Post
      </h1>

      {initialData.imagePath && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Current Image:</p>
          <img src={initialData.imagePath} alt="Post" className="mx-auto w-48 h-48 object-cover rounded" />
        </div>
      )}

      <PostForm mode="edit" postId={id as string} initialData={initialData} />
    </main>
  )
}
