'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import EditServiceModal from './EditServiceModal'
import { Pencil, Trash2 } from 'lucide-react'

type Service = {
  id: number
  title: string
  category: string
  description: string
  icon: string
  isFeatured: boolean
  isHot: boolean
  sortOrder: number
  createdAt: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

type ServiceListProps = {
  search: string
  category: string
}

export default function ServiceList({ search, category }: ServiceListProps) {
  const { data: services, error, mutate } = useSWR<Service[]>('/api/admin/services', fetcher)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      setLoadingId(id)
      await axios.delete(`/api/admin/services/${id}`)
      mutate()
    } catch (err) {
      console.error('Failed to delete service:', err)
      alert('Failed to delete service.')
    } finally {
      setLoadingId(null)
    }
  }

  const filtered = services?.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category ? service.category === category : true
    return matchesSearch && matchesCategory
  }) || []

  if (error) return <div className="text-red-500">Failed to load services</div>
  if (!services) return <div>Loading...</div>

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">Services</h2>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No services found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div
              key={service.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              onClick={() => setEditingService(service)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-1">{service.category}</p>
                <p className="text-xs text-gray-400">{service.description}</p>

                <div className="mt-2 space-x-2 text-xs">
                  {service.isFeatured && (
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Featured</span>
                  )}
                  {service.isHot && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">🔥 Hot</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingService(service)
                  }}
                  className="text-yellow-600 hover:text-yellow-700"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(service.id)
                  }}
                  className="text-red-600 hover:text-red-700"
                  disabled={loadingId === service.id}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdated={mutate}
        />
      )}
    </div>
  )
}
