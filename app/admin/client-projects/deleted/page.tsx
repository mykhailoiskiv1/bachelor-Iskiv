'use client'

import useSWR from 'swr'
import axios from 'axios'
import { RotateCw, Eye } from 'lucide-react'
import Link from 'next/link'

type DeletedClientProject = {
  id: number
  name: string
  status: string
  deletedAt: string
  client: {
    name: string | null
    email: string
  }
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DeletedClientProjectsPage() {
  const { data: projects, mutate } = useSWR<DeletedClientProject[]>('/api/admin/client-projects/deleted', fetcher)

  const handleRestore = async (id: number) => {
    await axios.put(`/api/admin/client-projects/${id}/restore`)
    mutate()
  }

  if (!projects) return <p className="p-6">Loading...</p>
  if (projects.length === 0) return <p className="p-6">No deleted projects found.</p>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-6">
        Deleted Client Projects
      </h1>

      <ul className="space-y-4">
        {projects.map(project => (
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
              <p className="text-sm text-gray-400">
                Deleted: {new Date(project.deletedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/client-projects/${project.id}`}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm transition flex items-center gap-1"
              >
                <Eye size={16} /> View
              </Link>
              <button
                onClick={() => handleRestore(project.id)}
                className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm transition flex items-center gap-1"
              >
                <RotateCw size={16} /> Restore
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
