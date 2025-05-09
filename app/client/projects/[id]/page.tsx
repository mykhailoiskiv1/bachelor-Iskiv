'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type HistoryEntry = {
  id: number
  status: string
  startDate: string
  endDate: string | null
}

type Project = {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string | null
  history: HistoryEntry[]
}

export default function ClientProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/client/projects/${id}`)
      .then(res => {
        if (res.status === 401) {
          router.push('/login')
          return null
        }
        return res.json()
      })
      .then(data => setProject(data))
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) return <p className="p-6">Loading...</p>
  if (error || !project) return <p className="p-6 text-red-600">{error || 'Project not found'}</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-[var(--color-text-primary)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <Link
          href="/client/projects"
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="mb-6 space-y-1 text-sm text-gray-700">
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Start:</strong> {project.startDate}</p>
        <p><strong>End:</strong> {project.endDate ?? 'Ongoing'}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-[var(--color-text-secondary)]">Status History</h2>
        {project.history.length === 0 ? (
          <p className="text-sm text-gray-500">No status history yet.</p>
        ) : (
          <ul className="space-y-4">
            {project.history.map(entry => (
              <li
                key={entry.id}
                className="border-l-4 border-[var(--color-accent)] pl-4 py-2 bg-white rounded shadow-sm"
              >
                <p className="font-semibold">{entry.status}</p>
                <p className="text-sm text-gray-600">
                  {entry.startDate} → {entry.endDate ?? 'Present'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
