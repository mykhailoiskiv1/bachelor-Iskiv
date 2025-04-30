'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'

type Warranty = {
  id: number
  projectName: string
  startDate: string
  durationMonths: number
  client: {
    email: string
    name: string | null
  }
}

type Client = {
  id: string
  email: string
  name: string | null
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminWarrantiesPage() {
  const { data: warranties, error, mutate } = useSWR<Warranty[]>('/api/admin/warranties', fetcher)
  const { data: clients } = useSWR<Client[]>('/api/admin/clients/all', fetcher)

  const [form, setForm] = useState({ clientId: '', projectName: '', startDate: '', durationMonths: 12 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.clientId || !form.projectName || !form.startDate || !form.durationMonths) {
      alert('Please fill in all fields.')
      return
    }

    await axios.post('/api/admin/warranties', form)
    setForm({ clientId: '', projectName: '', startDate: '', durationMonths: 12 })
    mutate()
  }

  const handleDelete = async (id: number) => {
    await axios.delete('/api/admin/warranties', { data: { id } })
    mutate()
  }

  if (error) return <p className="text-red-600">Failed to load warranties.</p>
  if (!warranties || !clients) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Warranties</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded">
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name ? `${client.name} (${client.email})` : client.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Project Name"
          value={form.projectName}
          onChange={(e) => setForm({ ...form, projectName: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          min={1}
          value={form.durationMonths}
          onChange={(e) => setForm({ ...form, durationMonths: parseInt(e.target.value) })}
          className="w-full border p-2 rounded"
          placeholder="Duration in months"
          required
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Warranty
        </button>
      </form>

      <ul className="space-y-4">
        {warranties.map(warranty => {
          const endDate = new Date(warranty.startDate)
          endDate.setMonth(endDate.getMonth() + warranty.durationMonths)

          return (
            <li key={warranty.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{warranty.projectName}</h2>
                <p className="text-sm text-gray-500">
                  Client: {warranty.client.name ?? 'No Name'} ({warranty.client.email})
                </p>
                <p className="text-sm">
                  Start: {new Date(warranty.startDate).toLocaleDateString()} | 
                  End: {endDate.toLocaleDateString()} ({warranty.durationMonths} months)
                </p>
              </div>
              <button
                onClick={() => handleDelete(warranty.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
