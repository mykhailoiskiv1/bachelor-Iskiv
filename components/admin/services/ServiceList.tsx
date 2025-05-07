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

  if (error) return <div className="text-red-500">Failed to load services</div>
  if (!services) return <div>Loading...</div>

  const filtered = services.filter(service =>
    service.title.toLowerCase().includes(search.toLowerCase()) &&
    (category ? service.category === category : true)
  )

  const grouped = filtered.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat}>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3 border-b pb-1">{cat}</h3>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2 hidden sm:table-cell">Description</th>
                  <th className="px-4 py-2 hidden md:table-cell">Flags</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(service => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 border-t border-gray-100 transition"
                  >
                    <td className="px-4 py-2 text-[var(--color-text-primary)] font-medium">
                      {service.title}
                      {service.isHot && <span className="ml-1 text-[var(--color-accent)]">🔥</span>}
                    </td>
                    <td className="px-4 py-2 text-gray-600 hidden sm:table-cell">{service.description}</td>
                    <td className="px-4 py-2 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 text-xs text-gray-600">
                        {service.isFeatured && (
                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Featured</span>
                        )}
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Order: {service.sortOrder}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingService(service)}
                          className="text-yellow-600 hover:text-yellow-700"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={loadingId === service.id}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

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
