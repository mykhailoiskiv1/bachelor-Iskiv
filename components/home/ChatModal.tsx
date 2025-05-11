'use client';

import { useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';
import { X } from 'lucide-react';

type Message = {
  sender: 'CLIENT' | 'AI' | 'SYSTEM';
  content: string;
  timestamp?: string;
};

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const sessionKeyRef = useRef<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/chat/thread');
      const { sessionKey, messages, isEscalated } = await res.json();
      sessionKeyRef.current = sessionKey;
      setMessages(messages);
      setEscalated(isEscalated);
      socket.connect();
      socket.emit('join', sessionKey);
    })();

    socket.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      if (msg.sender === 'AI' || msg.sender === 'SYSTEM') {
        setLoadingAI(false);
      }
      if (msg.sender === 'SYSTEM') {
        setEscalated(true);
        setContactFormVisible(true);
      }
    });

    return () => {
      socket.off('new-message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loadingAI]);

  const handleSend = async () => {
    if (!input.trim() || !sessionKeyRef.current) return;
    const text = input.trim();
    setInput('');
    if (!escalated) {
      setLoadingAI(true);
      await fetch('/api/chat/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: sessionKeyRef.current, content: text }),
      });
    } else {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey: sessionKeyRef.current, sender: 'CLIENT', content: text }),
      });
    }
  };

  const handleEscalate = async () => {
    if (!sessionKeyRef.current) return;
    await fetch('/api/chat/escalate', { method: 'POST' });
    setEscalated(true);
    setContactFormVisible(true);
  };

  const handleContactSubmit = async () => {
    if (!sessionKeyRef.current) return;
    if (!contactEmail.trim()) {
      setContactError('Email is required.');
      return;
    }

    const res = await fetch('/api/chat/escalation-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionKey: sessionKeyRef.current,
        email: contactEmail,
        name: contactName,
      }),
    });

    if (res.ok) {
      setContactSent(true);
      setContactFormVisible(false);
    } else {
      setContactError('Failed to submit contact info.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex flex-col w-full max-w-md h-full sm:h-[80vh] bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Support Chat</h2>
          <button onClick={onClose} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 px-4 py-3 overflow-y-auto space-y-4 bg-[var(--color-background-light)] relative">
          {messages.map((msg, i) => {
            const isClient = msg.sender === 'CLIENT';
            const isSystem = msg.sender === 'SYSTEM';
            return (
              <div
                key={i}
                className={`relative max-w-[75%] break-words px-4 py-2 rounded-xl shadow-sm ${isSystem
                  ? 'bg-yellow-100 text-[var(--color-text-secondary)] self-center italic'
                  : isClient
                    ? 'bg-[var(--color-accent)] text-white self-end rounded-br-none'
                    : 'bg-white text-[var(--color-text-primary)] self-start rounded-bl-none'
                  }`}
              >
                <p className="text-sm leading-snug">{msg.content}</p>
                {msg.timestamp && (
                  <span className={`block text-[10px] mt-1 ${isClient ? 'text-white/80' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {!isSystem && (
                  <span
                    className={`absolute w-3 h-3 bg-transparent bottom-0 ${isClient ? 'right-2' : 'left-2'
                      } transform translate-y-1 rotate-45 border-t-[1px] border-l-[1px] ${isClient ? 'border-[var(--color-accent)]' : 'border-white'
                      }`}
                  />
                )}
              </div>
            );
          })}
          {loadingAI && !escalated && (
            <div className="self-start flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse delay-150">•</span>
              <span className="animate-pulse delay-300">•</span>
            </div>
          )}
        </div>

        {/* Contact Form After Escalation */}
        {escalated && contactFormVisible && !contactSent && (
          <div className="bg-white px-4 py-4 border-t border-[var(--color-border)] space-y-2">
            <p className="text-sm text-[var(--color-text-secondary)]">Please leave your contact so our team can reach out:</p>
            {contactError && <p className="text-sm text-red-600">{contactError}</p>}
            <input
              type="text"
              placeholder="Your name (optional)"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <input
              type="email"
              placeholder="Email address"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleContactSubmit}
              className="w-full bg-[var(--color-accent)] text-white px-4 py-2 rounded text-sm hover:bg-opacity-90 transition"
            >
              Submit Contact
            </button>
          </div>
        )}

        {/* Input + Escalate */}
        <div className="px-4 py-3 bg-[var(--color-background)] border-t border-[var(--color-border)]">
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={escalated ? 'Waiting for admin…' : 'Type your message…'}
              disabled={loadingAI}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none h-10"
            />
            <button
              onClick={handleSend}
              disabled={loadingAI || !input.trim()}
              className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:bg-opacity-90 disabled:opacity-50 transition"
            >
              Send
            </button>
          </div>
          <button
            onClick={handleEscalate}
            disabled={escalated}
            className="mt-2 w-full text-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:text-green-600 transition"
          >
            {escalated ? 'Sent to admin ✔' : 'Escalate to human support'}
          </button>
        </div>
      </div>
    </div>
  );
}
