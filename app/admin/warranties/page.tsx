'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import AddWarrantyModal from '@/components/admin/warranties/AddWarrantyModal'
import { Plus } from 'lucide-react'

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
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async (id: number) => {
    await axios.delete('/api/admin/warranties', { data: { id } })
    mutate()
  }

  if (error) return <p className="text-red-600">Failed to load warranties.</p>
  if (!warranties || !clients) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Manage Warranties</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow transition"
        >
          <Plus size={16} /> Add Warranty
        </button>
      </div>

      <ul className="space-y-4">
        {warranties.map((warranty) => {
          const endDate = new Date(warranty.startDate)
          endDate.setMonth(endDate.getMonth() + warranty.durationMonths)

          return (
            <li
              key={warranty.id}
              className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-[var(--color-text-primary)]">{warranty.projectName}</h2>
                <p className="text-sm text-gray-500">
                  Client: {warranty.client.name ?? 'No Name'} ({warranty.client.email})
                </p>
                <p className="text-sm">
                  Start: {new Date(warranty.startDate).toLocaleDateString()} | End: {endDate.toLocaleDateString()} ({warranty.durationMonths} months)
                </p>
              </div>
              <button
                onClick={() => handleDelete(warranty.id)}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Delete
              </button>
            </li>
          )
        })}
      </ul>

      {showModal && (
        <AddWarrantyModal
          onClose={() => setShowModal(false)}
          onCreated={mutate}
          clients={clients}
        />
      )}
    </div>
  )
}
