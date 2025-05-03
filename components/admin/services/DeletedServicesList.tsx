'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

type DeletedService = {
  id: number
  title: string
  category: string
  deletedAt: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DeletedServicesList() {
  const { data: services, error, mutate } = useSWR<DeletedService[]>('/api/admin/services/deleted', fetcher)
  const [restoringId, setRestoringId] = useState<number | null>(null)

  const handleRestore = async (id: number) => {
    try {
      setRestoringId(id)
      await axios.patch(`/api/admin/services/${id}/restore`)
      mutate()
    } catch (err) {
      console.error('Failed to restore service:', err)
      alert('Failed to restore service.')
    } finally {
      setRestoringId(null)
    }
  }

  if (error) return <div className="text-red-500">Failed to load deleted services</div>
  if (!services) return <div>Loading...</div>

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Deleted Services</h2>

      {services.length === 0 ? (
        <p className="text-gray-500">No deleted services.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.category}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Deleted at: {new Date(service.deletedAt).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleRestore(service.id)}
                  disabled={restoringId === service.id}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  <RotateCcw size={16} className={restoringId === service.id ? 'animate-spin' : ''} />
                  {restoringId === service.id ? 'Restoring...' : 'Restore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
