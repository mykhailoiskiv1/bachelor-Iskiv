'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import AddCertificateModal from '@/components/admin/certificates/AddCertificateModal'
import { Plus } from 'lucide-react'

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
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async (id: number) => {
    await axios.delete('/api/admin/certificates', { data: { id } })
    mutate()
  }

  if (error) return <p className="text-red-600">Failed to load certificates.</p>
  if (!certificates || !clients) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Manage Certificates</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow transition"
        >
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <ul className="space-y-4">
        {certificates.map(cert => (
          <li key={cert.id} className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-[var(--color-text-primary)]">{cert.title}</h2>
              <p className="text-sm text-gray-500">
                Client: {cert.client.name ?? 'No Name'} ({cert.client.email})<br />
                Issued: {new Date(cert.issuedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={cert.fileUrl}
                target="_blank"
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
              >
                View
              </a>
              <button
                onClick={() => handleDelete(cert.id)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <AddCertificateModal
          onClose={() => setShowModal(false)}
          onCreated={mutate}
          clients={clients}
        />
      )}
    </div>
  )
}
