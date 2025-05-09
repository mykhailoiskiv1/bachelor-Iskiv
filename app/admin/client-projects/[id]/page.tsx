'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

type HistoryEntry = {
  id: number
  status: string
  startDate: string
  endDate: string | null
  createdAt: string
}

type Project = {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
  client: {
    name: string | null
    email: string
  }
  history: HistoryEntry[]
}

export default function AdminViewClientProjectPage() {
  const { id } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const [newStatus, setNewStatus] = useState('')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')

  useEffect(() => {
    axios.get(`/api/admin/client-projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddStatus = async () => {
    if (!newStatus || !newStartDate) return

    await axios.post(`/api/admin/client-projects/${id}/history`, {
      status: newStatus,
      startDate: newStartDate,
      endDate: newEndDate || null,
    })

    const res = await axios.get(`/api/admin/client-projects/${id}`)
    setProject(res.data)
    setNewStatus('')
    setNewStartDate('')
    setNewEndDate('')
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error || !project) return <p className="p-6 text-red-600">{error || 'Project not found.'}</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {project.name}
        </h1>
        <Link href="/admin/client-projects" className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="mb-8 text-gray-700 space-y-1">
        <p><strong>Client:</strong> {project.client.name ?? 'No Name'} ({project.client.email})</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Start:</strong> {project.startDate}</p>
        <p><strong>End:</strong> {project.endDate ?? '—'}</p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-[var(--color-text-secondary)]">Add Status Update</h2>
        <div className="grid sm:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Status"
            className="border rounded px-3 py-2"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={newStartDate}
            onChange={e => setNewStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={newEndDate}
            onChange={e => setNewEndDate(e.target.value)}
          />
          <button
            onClick={handleAddStatus}
            className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 text-[var(--color-text-secondary)]">Status History</h2>
        {project.history.length === 0 ? (
          <p className="text-sm text-gray-500">No history entries yet.</p>
        ) : (
          <ul className="space-y-3">
            {project.history.map(entry => (
              <li key={entry.id} className="border-l-4 border-[var(--color-accent)] pl-4 py-2 bg-white rounded shadow-sm">
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
