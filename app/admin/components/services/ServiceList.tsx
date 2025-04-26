'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';
import EditServiceModal from './EditServiceModal';

type Service = {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  isFeatured: boolean;
  isHot: boolean;
  sortOrder: number;
  createdAt: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ServiceList() {
  const { data: services, error, mutate } = useSWR<Service[]>('/api/admin/services', fetcher);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      setLoadingId(id);
      await axios.delete(`/api/admin/services/${id}`);
      mutate();
    } catch (err) {
      console.error('Failed to delete service:', err);
      alert('Failed to delete service.');
    } finally {
      setLoadingId(null);
    }
  };

  if (error) return <div>Failed to load services</div>;
  if (!services) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Services List</h2>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul className="space-y-2">
          {services.map(service => (
            <li key={service.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{service.title}</p>
                <p className="text-sm text-gray-500">{service.category}</p>
                {service.isFeatured && <span className="text-blue-500 mr-2">Featured</span>}
                {service.isHot && <span className="text-red-500">🔥 Hot</span>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={loadingId === service.id}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  {loadingId === service.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdated={mutate}
        />
      )}
    </div>
  );
}
