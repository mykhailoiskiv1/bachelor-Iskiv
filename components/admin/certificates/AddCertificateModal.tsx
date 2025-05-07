'use client'

import { useState } from 'react'
import axios from 'axios'
import { X, Loader2 } from 'lucide-react'

interface AddCertificateModalProps {
  onClose: () => void
  onCreated: () => void
  clients: { id: string; email: string; name: string | null }[]
}

export default function AddCertificateModal({ onClose, onCreated, clients }: AddCertificateModalProps) {
  const [form, setForm] = useState({ clientId: '', title: '', fileUrl: '', issuedDate: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/admin/certificates', form)
      onCreated()
      onClose()
    } catch (err) {
      console.error('Error adding certificate:', err)
      alert('Failed to add certificate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center text-[var(--color-text-primary)]">
          Add Certificate
        </h2>

        <select
          name="clientId"
          value={form.clientId}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name ? `${client.name} (${client.email})` : client.email}
            </option>
          ))}
        </select>

        <input
          name="title"
          placeholder="Certificate Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          name="fileUrl"
          placeholder="PDF URL"
          value={form.fileUrl}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <input
          name="issuedDate"
          type="date"
          value={form.issuedDate}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-opacity-90 text-white py-2 rounded-full flex justify-center items-center gap-2 transition"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? 'Creating...' : 'Create Certificate'}
        </button>
      </form>
    </div>
  )
}
