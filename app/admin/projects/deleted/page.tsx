'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import type { Project } from '@/types/project'
import { RotateCcw, Trash2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DeletedProjectsPage() {
  const { data: projects, mutate } = useSWR<Project[]>('/api/admin/projects/deleted', fetcher)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const handleRestore = async (id: number) => {
    if (!confirm('Restore this project?')) return
    setProcessingId(id)
    const res = await fetch(`/api/admin/projects/${id}/restore`, { method: 'PATCH' })
    if (res.ok) mutate()
    else alert('Restore failed')
    setProcessingId(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this project?')) return
    setProcessingId(id)
    const res = await fetch(`/api/admin/projects/${id}/delete`, { method: 'DELETE' })
    if (res.ok) mutate()
    else alert('Delete failed')
    setProcessingId(null)
  }

  if (!projects) {
    return <p className="text-center text-gray-500 py-10">Loading deleted projects...</p>
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Deleted Projects</h1>
        <Link href="/admin/projects">
          <button className="text-sm text-blue-600 hover:underline">← Back to Projects</button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No deleted projects found.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col justify-between">
              <div>
                <img
                  src={project.imagePaths?.[0] || '/placeholder.png'}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded mb-3 border"
                />
                <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                <p className="text-sm text-gray-500">{project.category}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Deleted: {new Date(project.deletedAt!).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleRestore(project.id)}
                  disabled={processingId === project.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={processingId === project.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
