'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { Loader2, Pencil, Check, X } from 'lucide-react'

interface Client {
  id: string
  name: string | null
  email: string
  address: string | null
}

const fetcher = (url: string) => axios.get<Client[]>(url).then(res => res.data)

export default function ClientsApproval() {
  const { data: clients, mutate } = useSWR('/api/admin/clients', fetcher)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const approveClient = async (id: string) => {
    setLoadingId(id)
    await axios.patch('/api/admin/clients', { id })
    mutate()
    setLoadingId(null)
  }

  const handleEditSubmit = async () => {
    if (editingClient) {
      await axios.put('/api/admin/clients', {
        id: editingClient.id,
        name: editingClient.name,
        address: editingClient.address
      })
      setEditingClient(null)
      mutate()
    }
  }

  if (!clients) return <div className="text-center py-10">Loading clients...</div>

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mb-6 text-center sm:text-left">
        Pending Client Approvals
      </h1>

      {clients.length === 0 ? (
        <p className="text-center text-gray-500">All clients confirmed 🎉</p>
      ) : (
        <ul className="grid gap-4">
          {clients.map(client => (
            <li
              key={client.id}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition"
            >
              {editingClient?.id === client.id ? (
                <div className="grid gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingClient.name || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={editingClient.address || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingClient(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm flex items-center gap-2"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">
                      {client.name || 'No name'} <span className="text-gray-500">({client.email})</span>
                    </p>
                    <p className="text-gray-500">{client.address || 'No address'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveClient(client.id)}
                      disabled={loadingId === client.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                      {loadingId === client.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setEditingClient(client)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
