'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientProjectWithClient } from '@/types'
import Link from 'next/link'
import { Eye } from 'lucide-react'

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!projects || projects.length === 0) return <p className="p-6">No projects found.</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-semibold mb-6">My Projects</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-10">
        Below is a list of all your active and completed construction projects with status updates.
      </p>

      <div className="space-y-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-semibold mb-1">{project.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  Status: <strong>{project.status}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(project.startDate)} →{' '}
                  {project.endDate ? formatDate(project.endDate) : 'Ongoing'}
                </p>
              </div>

              <Link
                href={`/client/projects/${project.id}`}
                className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
              >
                <Eye size={16} /> View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
