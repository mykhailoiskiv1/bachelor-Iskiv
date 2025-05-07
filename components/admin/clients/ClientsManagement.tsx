'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { Edit, Ban, Check, RotateCcw, Save, X } from 'lucide-react'

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
    <div className="max-w-6xl mx-auto py-10 px-4">
      

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 mb-6 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <ul className="grid gap-4">
        {filteredClients!.map(client => (
          <li
            key={client.id}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
          >
            {editingClient?.id === client.id ? (
              <div className="grid gap-3">
                <input
                  type="text"
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={editingClient.address || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditingClient(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    {client.name || 'No Name'} <span className="text-gray-500">({client.email})</span>
                  </p>
                  <p className="text-gray-500">{client.address || 'No Address'}</p>
                  <p className="text-xs mt-1 text-gray-500">
                    Status: {client.isConfirmed ? '✅ Confirmed' : '⏳ Pending'} | {client.isActive ? '🟢 Active' : '🔴 Blocked'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleBlockToggle(client)}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 text-white ${client.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {client.isActive ? <Ban size={14} /> : <Check size={14} />} {client.isActive ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => handleResetPassword(client.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <RotateCcw size={14} /> Reset Password
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
