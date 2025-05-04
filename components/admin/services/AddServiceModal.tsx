'use client'

import { useState } from 'react'
import axios from 'axios'
import { Loader2, X } from 'lucide-react'

interface AddServiceModalProps {
  onClose: () => void
  onCreated: () => void
}

export default function AddServiceModal({ onClose, onCreated }: AddServiceModalProps) {
  const [form, setForm] = useState({
    title: '',
    category: 'Building',
    description: '',
    icon: '',
    isFeatured: false,
    isHot: false,
    sortOrder: 0,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? Number(value)
            : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/admin/services', form)
      onCreated()
      onClose()
    } catch (err) {
      console.error('Failed to create service:', err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative animate-fade-in-up space-y-4"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center text-[var(--color-text-primary)]">Add New Service</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Building">Building</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electricity">Electricity</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Icon (e.g., Zap, Wrench)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              name="isHot"
              checked={form.isHot}
              onChange={handleChange}
            />
            Hot 🔥
          </label>
        </div>

        <input
          type="number"
          name="sortOrder"
          value={form.sortOrder}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Sort Order"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-accent)] hover:bg-opacity-90 text-white py-2 rounded-full flex justify-center items-center gap-2 transition"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {loading ? 'Creating...' : 'Create Service'}
        </button>
      </form>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
