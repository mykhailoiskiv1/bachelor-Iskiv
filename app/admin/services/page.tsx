'use client'

import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import ServiceList from '@/components/admin/services/ServiceList'
import AddServiceModal from '@/components/admin/services/AddServiceModal'
import DeletedServicesList from '@/components/admin/services/DeletedServicesList'
import { Plus, Trash2, X } from 'lucide-react'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeletedModal, setShowDeletedModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { data: categories } = useSWR<string[]>('/api/admin/services/categories', fetcher)

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center sm:text-left">
          Manage Services
        </h1>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <button
            onClick={() => setShowDeletedModal(true)}
            className="flex items-center gap-2 border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full text-sm transition"
          >
            <Trash2 size={16} />
            Show Deleted
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <ServiceList key={refreshKey} search={search} category={category} />

      {showDeletedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowDeletedModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-red-600">Deleted Services</h2>
            <DeletedServicesList />
          </div>
        </div>
      )}

      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
