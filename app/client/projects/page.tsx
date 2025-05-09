'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientProjectWithClient } from '@/types'
import Link from 'next/link'

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<ClientProjectWithClient[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/client/projects')
      .then(res => {
        if (res.status === 401) {
          router.push('/login')
          return null
        }
        return res.json()
      })
      .then(data => setProjects(data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!projects || projects.length === 0) return <p className="p-6">No projects found.</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-semibold mb-8">Your Projects</h1>

      <ul className="space-y-6">
        {projects.map(project => (
          <li
            key={project.id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">{project.name}</h2>
              <Link
                href={`/client/projects/${project.id}`}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                View Details →
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Status: <strong>{project.status}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Start: {project.startDate} — End: {project.endDate ?? 'Ongoing'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
