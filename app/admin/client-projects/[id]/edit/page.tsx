'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

type Project = {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string | null
}

export default function EditClientProjectPage() {
  const { id } = useParams()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [form, setForm] = useState({
    name: '',
    status: '',
    startDate: '',
    endDate: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`/api/admin/client-projects/${id}`)
      .then(res => {
        setProject(res.data)
        setForm({
          name: res.data.name,
          status: res.data.status,
          startDate: res.data.startDate.slice(0, 10),
          endDate: res.data.endDate?.slice(0, 10) || '',
        })
      })
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      await axios.put(`/api/admin/client-projects/${id}`, form)
      router.push(`/admin/client-projects/${id}`)
    } catch (err) {
      console.error(err)
      setError('Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (error || !project) return <p className="p-6 text-red-600">{error || 'Project not found.'}</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Edit Project</h1>
        <Link
          href={`/admin/client-projects/${id}`}
          className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date (optional)</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-5 py-2 rounded-full shadow text-sm disabled:opacity-50"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
