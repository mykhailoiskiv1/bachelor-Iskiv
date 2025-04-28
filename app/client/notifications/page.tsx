'use client';

import useSWR from 'swr';
import axios from 'axios';

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ClientNotificationsPage() {
  const { data: notifications, error } = useSWR<Notification[]>('/api/client/notifications', fetcher);

  if (error) return <p className="text-red-600">Failed to load notifications.</p>;
  if (!notifications) return <p>Loading notifications...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Notifications</h1>

      {notifications.length === 0 ? (
        <p>You have no notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(note => (
            <li key={note.id} className="border p-4 rounded">
              <h2 className="font-semibold">{note.title}</h2>
              <p>{note.message}</p>
              <p className="text-xs text-gray-400 mt-2">Received: {new Date(note.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
