'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

type Thread = {
  sessionKey: string;
  createdAt: string;
  lastMessage: string;
  messageCount: number;
  hasAdminReply: boolean;
  contactName?: string | null;
  contactEmail?: string | null;
};

export default function ChatList({ threads }: { threads: Thread[] }) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () =>
      threads.filter(
        (t) =>
          t.sessionKey.includes(filter) ||
          t.lastMessage.toLowerCase().includes(filter.toLowerCase()) ||
          t.contactEmail?.toLowerCase().includes(filter.toLowerCase()) ||
          t.contactName?.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, threads]
  );

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Escalated Chats
        </h1>
        <input
          type="text"
          placeholder="Search name, email, session or message…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
        />
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((thread) => (
            <div
              key={thread.sessionKey}
              className="bg-white border border-[var(--color-border)] rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs text-[var(--color-text-secondary)]">Chat</p>
                <p className="text-[var(--color-text-primary)] font-semibold truncate">
                  {thread.contactName
                    ? thread.contactName
                    : thread.contactEmail
                    ? thread.contactEmail
                    : `Session ${thread.sessionKey.slice(0, 6)}…`}
                </p>

                <div className="flex justify-between text-sm">
                  <span>Messages</span>
                  <span className="font-semibold">{thread.messageCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last</span>
                  <span className="truncate max-w-[60%] text-[var(--color-text-primary)]">
                    {thread.lastMessage}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Replied</span>
                  <span
                    className={
                      thread.hasAdminReply
                        ? 'text-green-600'
                        : 'text-red-500'
                    }
                  >
                    {thread.hasAdminReply ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <Link
                href={`/admin/chat-threads/${thread.sessionKey}`}
                className="mt-4 inline-block text-center bg-[var(--color-accent)] text-white px-3 py-2 rounded-lg hover:bg-[var(--color-accent-dark)] transition"
              >
                View Chat
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-[var(--color-text-secondary)]">
            No chats found.
          </p>
        )}
      </section>
    </main>
  );
}
