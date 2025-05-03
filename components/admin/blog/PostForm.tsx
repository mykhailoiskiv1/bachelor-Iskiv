'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PostForm({
  mode = 'create',
  postId,
  initialData,
}: {
  mode?: 'create' | 'edit'
  postId?: string
  initialData?: {
    title: string
    category: string
    content: string
    imagePath?: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
  }
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    content: initialData?.content || '',
  })
  const [seo, setSeo] = useState({
    title: initialData?.seoTitle || '',
    description: initialData?.seoDescription || '',
    keywords: initialData?.seoKeywords || '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imagePath = initialData?.imagePath || ''

      if (image) {
        const imageForm = new FormData()
        imageForm.append('file', image)
        const uploadRes = await axios.post('/api/admin/blog/upload', imageForm)
        imagePath = uploadRes.data.url
      }

      const payload = {
        ...form,
        imagePath,
        seoTitle: seo.title,
        seoDescription: seo.description,
        seoKeywords: seo.keywords,
      }

      if (mode === 'edit' && postId) {
        await axios.put(`/api/admin/blog/${postId}`, payload)
        alert('Post updated successfully!')
      } else {
        await axios.post('/api/admin/blog/posts', payload)
        alert('Post created successfully!')
      }

      router.push('/admin/blog')
    } catch (err) {
      console.error('[POST_FORM_ERROR]', err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white border rounded-lg p-6 shadow-sm"
    >
      <fieldset disabled={loading} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm"
            {...(mode === 'create' ? { required: true } : {})}
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SEO Keywords</label>
            <textarea
              value={seo.keywords}
              onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <button
            type="button"
            onClick={async () => {
              const res = await axios.post('/api/admin/blog/seo', {
                title: form.title,
                content: form.content,
              })
              setSeo({
                title: res.data.seoTitle,
                description: res.data.seoDescription,
                keywords: res.data.seoKeywords,
              })
            }}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            Generate SEO
          </button>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:bg-[var(--color-button-hover-bg)] px-6 py-2 rounded transition flex items-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {mode === 'edit' ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  )
}
