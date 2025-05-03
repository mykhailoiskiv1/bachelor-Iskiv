'use client'

import { useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

type EditServiceModalProps = {
  service: {
    id: number
    title: string
    category: string
    description: string
    icon: string
    isFeatured: boolean
    isHot: boolean
    sortOrder: number
  }
  onClose: () => void
  onUpdated: () => void
}

export default function EditServiceModal({ service, onClose, onUpdated }: EditServiceModalProps) {
  const [formData, setFormData] = useState(service)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(`/api/admin/services/${service.id}`, formData)
      onUpdated()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to update service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center text-[var(--color-text-primary)]">
          Edit Service
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="icon"
            placeholder="Icon (e.g. Hammer)"
            value={formData.icon}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="isHot"
                checked={formData.isHot}
                onChange={handleChange}
              />
              Hot 🔥
            </label>
          </div>

          <input
            type="number"
            name="sortOrder"
            placeholder="Sort Order"
            value={formData.sortOrder}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
