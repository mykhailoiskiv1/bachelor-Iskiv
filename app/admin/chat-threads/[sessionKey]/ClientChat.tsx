'use client';

import { useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

type Message = {
  sender: 'CLIENT' | 'AI' | 'ADMIN';
  content: string;
  timestamp: string;
};

export default function ClientChat({ sessionKey }: { sessionKey: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/admin/chat-threads/${sessionKey}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
  }, [sessionKey]);

  useEffect(() => {
    socket.connect();
    socket.emit('join', sessionKey);
    socket.on('new-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('new-message');
      socket.disconnect();
    };
  }, [sessionKey]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    await fetch(`/api/admin/chat-threads/${sessionKey}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: reply.trim() }),
    });
    setReply('');
    setLoading(false);
  };
  type Contact = {
    name: string | null;
    email: string;
    message: string | null;
    createdAt: string;
  };

  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetch(`/api/admin/chat-threads/${sessionKey}/escalation`)
      .then((r) => r.json())
      .then((data) => setContact(data));
  }, [sessionKey]);

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="flex flex-col w-full max-w-3xl h-[85vh] bg-white rounded-2xl border border-[var(--color-border)] shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b bg-[var(--color-background)]">
          <Link href="/admin/chat-threads" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-base font-medium text-[var(--color-text-primary)] truncate">
            Chat {sessionKey.slice(0, 8)}…
          </h2>
          <div className="w-5" />
        </div>
        {contact && (
          <div className="bg-white border-y border-[var(--color-border)] px-4 py-3 text-sm text-gray-700">
            <p><strong>Contact info:</strong></p>
            <p><strong>Email:</strong> {contact.email}</p>
            {contact.name && <p><strong>Name:</strong> {contact.name}</p>}
            {contact.message && <p><strong>Message:</strong> {contact.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Submitted: {new Date(contact.createdAt).toLocaleString()}
            </p>
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-4 bg-[var(--color-background-light)] space-y-4"
        >
          {messages.map((m, idx) => {
            const isAdmin = m.sender === 'ADMIN';
            return (
              <div
                key={idx}
                className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words text-sm leading-relaxed ${isAdmin ? 'bg-[var(--color-accent)] text-white ml-auto' : 'bg-white text-gray-800 mr-auto'
                  }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold opacity-70">{m.sender}</span>
                  <span className="opacity-50">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {m.content}
              </div>
            );
          })}
          <div ref={containerRef} />
        </div>

        <div className="px-4 py-3 bg-white border-t flex items-center gap-3">
          <textarea
            rows={1}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply…"
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleReply()}
            className="flex-1 resize-none px-4 py-2 border border-[var(--color-border)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <button
            onClick={handleReply}
            disabled={loading || !reply.trim()}
            className="p-3 bg-[var(--color-accent)] text-white rounded-full hover:bg-opacity-90 transition disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
