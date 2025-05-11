'use client'

import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import { Trash2, FilePlus, Eye, Pencil, Archive } from 'lucide-react'
import { ClientProjectWithClient } from '@/types'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminClientProjectsPage() {
  const { data: projects, mutate } = useSWR<ClientProjectWithClient[]>('/api/admin/client-projects', fetcher)

  const handleSoftDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await axios.delete('/api/admin/client-projects', { data: { id } })
    mutate()
  }

  if (!projects) return <p>Loading...</p>
  if (projects.length === 0) return <p>No projects found.</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
          Client Projects
        </h1>
        <div className="flex gap-3">
          <Link
            href="/admin/client-projects/deleted"
            className="flex items-center gap-1 border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full text-sm"
          >
            <Archive size={16} />
            Deleted
          </Link>
          <Link
            href="/admin/client-projects/create"
            className="flex items-center gap-1 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow"
          >
            <FilePlus size={16} />
            New
          </Link>
        </div>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-500">
                Client: {project.client?.name ?? 'Unknown'} ({project.client?.email})
              </p>
              <p className="text-sm text-gray-500">
                Status: {project.status}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <Link
                href={`/admin/client-projects/${project.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <Eye size={16} />
                View
              </Link>
              <Link
                href={`/admin/client-projects/${project.id}/edit`}
                className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <button
                onClick={() => handleSoftDelete(project.id)}
                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
