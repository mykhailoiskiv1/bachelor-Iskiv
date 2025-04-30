'use client';

import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  client: {
    email: string;
    name: string | null;
  };
};

type Client = {
  id: string;
  email: string;
  name: string | null;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminNotificationsPage() {
  const { data: notifications, mutate } = useSWR<Notification[]>('/api/admin/notifications', fetcher);
  const { data: clients } = useSWR<Client[]>('/api/admin/clients/all', fetcher);

  const [form, setForm] = useState({ clientId: '', title: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.title || !form.message) {
      alert('Please fill in all fields');
      return;
    }
    await axios.post('/api/admin/notifications', form);
    setForm({ clientId: '', title: '', message: '' });
    mutate();
  };

  if (!notifications || !clients) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Notifications</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded">
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name ? `${client.name} (${client.email})` : client.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Send Notification
        </button>
      </form>

      <ul className="space-y-4">
        {notifications.map(note => (
          <li key={note.id} className="border p-4 rounded">
            <h2 className="font-semibold">{note.title}</h2>
            <p>{note.message}</p>
            <p className="text-sm text-gray-500">
              To: {note.client.name ?? 'No Name'} ({note.client.email})
            </p>
            <p className="text-xs text-gray-400">Sent: {new Date(note.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
