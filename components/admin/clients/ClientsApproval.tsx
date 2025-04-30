'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'

interface Client {
  id: string
  name: string
  email: string
  address: string
}

const fetcher = (url: string) => axios.get<Client[]>(url).then(res => res.data)

export default function ClientsApproval() {
  const { data: clients, error, mutate } = useSWR('/api/admin/clients', fetcher)
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

  if (error) return <p className="text-red-600">Failed to load clients.</p>
  if (!clients) return <p>Loading clients...</p>

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Pending Client Approvals</h2>
      {clients.length === 0 ? (
        <p>All clients confirmed 🎉</p>
      ) : (
        clients.map((client: Client) => (
          <div key={client.id} className="border p-4 rounded mb-3">
            {editingClient?.id === client.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="border p-1 rounded w-full"
                />
                <input
                  type="text"
                  value={editingClient.address}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="border p-1 rounded w-full"
                />
                <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                  Save
                </button>
                <button onClick={() => setEditingClient(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>{client.name}</strong> ({client.email})</p>
                  <p className="text-sm text-gray-500">{client.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveClient(client.id)}
                    disabled={loadingId === client.id}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    {loadingId === client.id ? 'Confirming...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setEditingClient(client)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
