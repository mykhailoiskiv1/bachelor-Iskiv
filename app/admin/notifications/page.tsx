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

  if (!notifications || !clients) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)] mb-8">
        Manage Notifications
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-gray-200 rounded-xl bg-white shadow-sm p-6 mb-10"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Choose a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name ? `${client.name} (${client.email})` : client.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            placeholder="Enter message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition text-sm"
        >
          Send Notification
        </button>
      </form>

      <ul className="space-y-4">
        {notifications.map(note => (
          <li
            key={note.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{note.title}</h2>
            <p className="text-sm text-gray-700 mt-1">{note.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              To: {note.client.name ?? 'No Name'} ({note.client.email})
            </p>
            <p className="text-xs text-gray-400">Sent: {new Date(note.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
