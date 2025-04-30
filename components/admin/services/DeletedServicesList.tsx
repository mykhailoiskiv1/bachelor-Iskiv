'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';

type DeletedService = {
  id: number;
  title: string;
  category: string;
  deletedAt: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DeletedServicesList() {
  const { data: services, error, mutate } = useSWR<DeletedService[]>('/api/admin/services/deleted', fetcher);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const handleRestore = async (id: number) => {
    try {
      setRestoringId(id);
      await axios.patch(`/api/admin/services/${id}/restore`);
      mutate();
    } catch (err) {
      console.error('Failed to restore service:', err);
      alert('Failed to restore service.');
    } finally {
      setRestoringId(null);
    }
  };

  if (error) return <div>Failed to load deleted services</div>;
  if (!services) return <div>Loading...</div>;

  return (
    <div className="space-y-4 mt-10">
      <h2 className="text-xl font-semibold text-red-600">Deleted Services</h2>
      {services.length === 0 ? (
        <p>No deleted services.</p>
      ) : (
        <ul className="space-y-2">
          {services.map(service => (
            <li key={service.id} className="border p-4 rounded flex justify-between items-center bg-gray-100">
              <div>
                <p className="font-bold">{service.title}</p>
                <p className="text-sm text-gray-500">{service.category}</p>
                <p className="text-xs text-gray-400">Deleted at: {new Date(service.deletedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleRestore(service.id)}
                disabled={restoringId === service.id}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {restoringId === service.id ? 'Restoring...' : 'Restore'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
