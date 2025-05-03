'use client'

import { useState } from 'react'
import ServiceList from '@/components/admin/services/ServiceList'
import AddServiceModal from '@/components/admin/services/AddServiceModal'
import DeletedServicesList from '@/components/admin/services/DeletedServicesList'
import { Plus } from 'lucide-react'

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center sm:text-left">
          Manage Services
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm shadow"
        >
          <Plus size={16} /> Add Service
        </button>
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
          <option value="Building">Building</option>
          <option value="Electricity">Electricity</option>
          <option value="Plumbing">Plumbing</option>
        </select>
      </div>

      <ServiceList key={refreshKey} search={search} category={category} />
      <DeletedServicesList />

      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
