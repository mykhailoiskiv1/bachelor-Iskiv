'use client'

import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Client } from '@/types'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function CreateClientProjectPage() {
  const router = useRouter()
  const { data: clients } = useSWR<Client[]>('/api/admin/clients/all', fetcher)

  const [form, setForm] = useState({
    name: '',
    status: '',
    startDate: '',
    endDate: '',
    clientId: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post('/api/admin/client-projects', form)
      router.push('/admin/client-projects')
    } catch (err) {
      console.error(err)
      setError('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  if (!clients) return <p className="p-6">Loading clients...</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Create Client Project</h1>
        <Link href="/admin/client-projects" className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name ?? client.email}
              </option>
            ))}
          </select>
        </div>

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
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-5 py-2 rounded-full shadow text-sm disabled:opacity-50"
        >
          <Save size={16} /> {loading ? 'Saving...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}
