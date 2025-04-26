'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

const fetcher = (url: string) => axios.get<Client[]>(url).then(res => res.data);

export default function ClientsApproval() {
  const { data: clients, error, mutate } = useSWR('/api/admin/clients', fetcher);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const approveClient = async (id: string) => {
    setLoadingId(id);
    await axios.patch('/api/admin/clients', { id });
    mutate();
    setLoadingId(null);
  };

  if (error) return <p className="text-red-600">Failed to load clients.</p>;
  if (!clients) return <p>Loading clients...</p>;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Pending Client Approvals</h2>
      {clients.length === 0 ? (
        <p>All clients confirmed 🎉</p>
      ) : (
        clients.map((client: Client) => (
          <div key={client.id} className="border p-4 rounded mb-3 flex justify-between items-center">
            <div>
              <p><strong>{client.name}</strong> ({client.email})</p>
              <p className="text-sm text-gray-500">{client.address}</p>
            </div>
            <button
              onClick={() => approveClient(client.id)}
              disabled={loadingId === client.id}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              {loadingId === client.id ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
