'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Sparkles } from 'lucide-react'
import axios from 'axios'

type ProjectFormProps = {
  mode?: 'create' | 'edit'
  projectId?: number
  initialData?: {
    title: string
    category: string
    description: string
    content: string
    imagePath?: string
    location?: string
    completionDate?: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    published?: boolean
  }
}

export default function ProjectForm({
  mode = 'create',
  projectId,
  initialData,
}: ProjectFormProps) {
  const router = useRouter()

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    content: initialData?.content ?? '',
    location: initialData?.location ?? '',
    completionDate: initialData?.completionDate?.slice(0, 10) ?? '',
    seoTitle: initialData?.seoTitle ?? '',
    seoDescription: initialData?.seoDescription ?? '',
    seoKeywords: initialData?.seoKeywords ?? '',
  })

  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null)
  }

  const handleGenerateSEO = async () => {
    if (!form.title || !form.content) return alert('Please fill in title and content first')
    setGenerating(true)
    try {
      const res = await axios.post('/api/admin/projects/seo', {
        title: form.title,
        content: form.content,
      })
      const { seoTitle, seoDescription, seoKeywords } = res.data
      setForm((prev) => ({
        ...prev,
        seoTitle,
        seoDescription,
        seoKeywords,
      }))
      alert('SEO fields generated!')
    } catch (err) {
      console.error('[SEO_GENERATE_ERROR]', err)
      alert('Failed to generate SEO')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('content', form.content)
      formData.append('location', form.location)
      formData.append('completionDate', form.completionDate)
      formData.append('seoTitle', form.seoTitle)
      formData.append('seoDescription', form.seoDescription)
      formData.append('seoKeywords', form.seoKeywords)

      if (image) {
        formData.append('image', image)
      } else if (mode === 'create') {
        alert('Please upload an image')
        return
      }

      if (mode === 'edit' && projectId !== undefined) {
        await axios.put(`/api/admin/projects/${projectId}`, {
          ...form,
          imagePath: initialData?.imagePath ?? '',
        })
        alert('Project updated!')
      } else {
        await axios.post('/api/admin/projects', formData)
        alert('Project created!')
      }

      router.push('/admin/projects')
    } catch (err) {
      console.error('[PROJECT_FORM_ERROR]', err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!projectId) return
    setPublishing(true)
    try {
      await axios.put(`/api/admin/projects/${projectId}`)
      alert('Project published!')
    } catch (err) {
      console.error('[PUBLISH_ERROR]', err)
      alert('Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-light text-[var(--color-text-primary)]">
        {mode === 'edit' ? 'Edit Project' : 'Create Project'}
      </h2>

      {[
        ['title', 'Title'],
        ['category', 'Category'],
        ['location', 'Location'],
        ['seoTitle', 'SEO Title'],
        ['seoDescription', 'SEO Description'],
        ['seoKeywords', 'SEO Keywords'],
      ].map(([name, label]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type="text"
            name={name}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleGenerateSEO}
        disabled={generating}
        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded text-sm flex items-center gap-2 transition"
      >
        {generating && <Loader2 className="w-4 h-4 animate-spin" />}
        <Sparkles size={16} />
        Generate SEO
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
        <input
          type="date"
          name="completionDate"
          value={form.completionDate}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
        />
      </div>

      {[
        { name: 'description', label: 'Description', rows: 3 },
        { name: 'content', label: 'Content (for SEO)', rows: 5 },
      ].map(({ name, label, rows }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            name={name}
            rows={rows}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm"
          {...(mode === 'create' ? { required: true } : {})}
        />
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:bg-[var(--color-button-hover-bg)] px-6 py-2 rounded flex items-center gap-2 transition"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'edit' ? 'Update Project' : 'Create Project'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 transition"
          >
            {publishing && <Upload className="w-4 h-4 animate-spin" />}
            Publish
          </button>
        )}
      </div>
    </form>
  )
}
