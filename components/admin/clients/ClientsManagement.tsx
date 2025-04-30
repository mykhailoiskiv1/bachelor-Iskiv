'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'

interface Client {
  id: string
  name: string
  email: string
  address: string
  isConfirmed: boolean
  isActive: boolean
}

const fetcher = (url: string) => axios.get<Client[]>(url).then(res => res.data)

export default function ClientsManagement() {
  const { data: clients, error, mutate } = useSWR('/api/admin/clients/all', fetcher)
  const [search, setSearch] = useState('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const filteredClients = clients?.filter(c =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEditSubmit = async () => {
    if (editingClient) {
      await axios.put('/api/admin/clients/all', {
        id: editingClient.id,
        name: editingClient.name,
        address: editingClient.address
      })
      setEditingClient(null)
      mutate()
    }
  }

  const handleBlockToggle = async (client: Client) => {
    await axios.patch('/api/admin/clients/block', {
      id: client.id,
      action: client.isActive ? 'block' : 'unblock'
    })
    mutate()
  }

  const handleResetPassword = async (id: string) => {
    const res = await axios.patch('/api/admin/clients/reset-password', { id })
    alert(`Temporary password: ${res.data.tempPassword}`)
  }

  if (error) return <p className="text-red-600">Failed to load clients.</p>
  if (!clients) return <p>Loading clients...</p>

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Clients Management</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-4 w-full max-w-md"
      />
      {filteredClients!.map(client => (
        <div key={client.id} className="border p-4 rounded mb-3">
          {editingClient?.id === client.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editingClient.name || ''}
                onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                className="border p-1 rounded w-full"
              />
              <input
                type="text"
                value={editingClient.address || ''}
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
                <p><strong>{client.name || 'No Name'}</strong> ({client.email})</p>
                <p className="text-sm text-gray-500">{client.address || 'No Address'}</p>
                <p className="text-sm">
                  Status: {client.isConfirmed ? '✅ Confirmed' : '⏳ Pending'} | 
                  {client.isActive ? ' 🟢 Active' : ' 🔴 Blocked'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingClient(client)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleBlockToggle(client)}
                  className={`px-3 py-1 rounded text-white ${client.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {client.isActive ? 'Block' : 'Unblock'}
                </button>
                <button
                  onClick={() => handleResetPassword(client.id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
