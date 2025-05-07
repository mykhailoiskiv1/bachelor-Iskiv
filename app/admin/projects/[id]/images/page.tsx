'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import type { Project } from '@/types/project'
import { UploadCloud } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProjectImageManager() {
  const { id } = useParams()
  const projectId = Number(id)

  const [files, setFiles] = useState<File[]>([])
  const { data: project, mutate, isLoading } = useSWR<Project>(`/api/admin/projects/${projectId}`, fetcher)

  const handleUpload = async () => {
    if (!files.length) return alert('Please select images')

    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    const res = await fetch(`/api/admin/projects/${projectId}/images`, {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      alert('Images uploaded')
      setFiles([])
      mutate()
    } else {
      const err = await res.json()
      alert(err.error ?? 'Upload failed')
    }
  }

  if (isLoading) return <p className="text-center py-10">Loading project...</p>
  if (!project) return <p className="text-center text-red-500 py-10">Project not found.</p>

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Manage Images for “{project.title}”</h1>

      <div className="space-y-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setFiles(Array.from(e.target.files || []))}
          className="w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded inline-flex items-center gap-2"
        >
          <UploadCloud size={18} /> Upload Selected
        </button>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-2">Existing Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.imagePaths.map((url, idx) => (
            <img
              key={idx}
              src={url} // using direct path
              alt={`img-${idx}`}
              className="rounded border aspect-square object-cover"
            />
          ))}
        </div>
      </div>
    </main>
  )
}
