'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'

type Certificate = {
  id: number
  title: string
  fileUrl: string
  issuedDate: string
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

export default function AdminCertificatesPage() {
  const { data: certificates, error, mutate } = useSWR<Certificate[]>('/api/admin/certificates', fetcher)
  const { data: clients } = useSWR<Client[]>('/api/admin/clients/all', fetcher)

  const [form, setForm] = useState({ clientId: '', title: '', fileUrl: '', issuedDate: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.clientId || !form.title || !form.fileUrl || !form.issuedDate) {
      alert('Please fill in all fields.')
      return
    }

    await axios.post('/api/admin/certificates', form)
    setForm({ clientId: '', title: '', fileUrl: '', issuedDate: '' })
    mutate()
  }

  const handleDelete = async (id: number) => {
    await axios.delete('/api/admin/certificates', { data: { id } })
    mutate()
  }

  if (error) return <p className="text-red-600">Failed to load certificates.</p>
  if (!certificates || !clients) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Certificates</h1>

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
          placeholder="Certificate Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="url"
          placeholder="PDF URL"
          value={form.fileUrl}
          onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          value={form.issuedDate}
          onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Certificate
        </button>
      </form>

      <ul className="space-y-4">
        {certificates.map(cert => (
          <li key={cert.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{cert.title}</h2>
              <p className="text-sm text-gray-500">
                Client: {cert.client.name ?? 'No Name'} ({cert.client.email}) | Issued: {new Date(cert.issuedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={cert.fileUrl} target="_blank" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                View
              </a>
              <button onClick={() => handleDelete(cert.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
