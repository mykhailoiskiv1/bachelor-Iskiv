'use client'

import useSWR from 'swr'
import Link from 'next/link'
import type { Project } from '@/types/project'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminProjectList() {
  const { data: projects, mutate } = useSWR<Project[]>('/api/admin/projects', fetcher)

  const handleSoftDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) mutate()
    else alert('Failed to delete')
  }

  const handlePublish = async (id: number) => {
    if (!confirm('Publish this project?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'PUT' })
    if (res.ok) {
      mutate()
      alert('Project published!')
    } else {
      alert('Failed to publish')
    }
  }

  if (!projects) return <p className="text-center py-10">Loading...</p>

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Link href="/admin/projects/deleted">
            <button className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 w-full sm:w-auto">
              Deleted Projects
            </button>
          </Link>
          <Link href="/admin/projects/create">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto">
              + New Project
            </button>
          </Link>
        </div>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-4 border rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex gap-4">
              <img
                src={project.imagePaths?.[0] || '/placeholder.png'}
                alt={project.title}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                  <p className="text-sm text-gray-500">{project.category}</p>
                </div>
                <span
                  className={`mt-2 text-xs px-2 py-1 rounded w-fit ${project.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {project.published ? 'Published' : 'Unpublished'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Link href={`/admin/projects/${project.id}/edit`}>
                <button className="text-sm px-4 py-1.5 border rounded hover:bg-gray-50">
                  Edit
                </button>
              </Link>

              <Link href={`/admin/projects/${project.id}/images`}>
                <button className="text-sm px-4 py-1.5 border rounded hover:bg-gray-50">
                  Images
                </button>
              </Link>

              {!project.published && (
                <button
                  onClick={() => handlePublish(project.id)}
                  className="text-sm px-4 py-1.5 border border-green-600 text-green-700 rounded hover:bg-green-100"
                >
                  Publish
                </button>
              )}

              <button
                onClick={() => handleSoftDelete(project.id)}
                className="text-sm px-4 py-1.5 text-red-600 border border-red-600 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
