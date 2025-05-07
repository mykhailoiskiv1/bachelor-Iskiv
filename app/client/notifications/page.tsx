'use client';

import useSWR from 'swr';
import axios from 'axios';
import { Bell } from 'lucide-react';

type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ClientNotificationsPage() {
  const { data: notifications, error } = useSWR<Notification[]>('/api/client/notifications', fetcher);

  if (error) return <p className="text-center text-[var(--color-accent)] py-20">Failed to load notifications.</p>;
  if (!notifications) return <p className="text-center py-20">Loading notifications...</p>;

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <Bell className="w-8 h-8 mx-auto text-[var(--color-accent)] mb-4" />
          <h1 className="text-4xl font-light tracking-tight">Your Notifications</h1>
        </header>

        {notifications.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)]">You have no notifications.</p>
        ) : (
          <ul className="space-y-10">
            {notifications.map((note) => (
              <li key={note.id} className="border-l-2 border-[var(--color-accent)] pl-6">
                <h2 className="text-lg font-semibold mb-1">{note.title}</h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{note.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Received: {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
