'use client';

import { useState } from 'react';

export default function ProfileSupport() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(false);
    setError('');

    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    const res = await fetch('/api/client/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (res.ok) {
      setSent(true);
      setMessage('');
    } else {
      setError('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border-t pt-12 max-w-xl">
      <h2 className="text-2xl font-semibold mb-6">Contact Support</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Your Message</label>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 p-2 text-sm"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-[var(--color-accent)] text-white px-4 py-2 text-sm hover:opacity-90 transition"
      >
        Send Message
      </button>

      {sent && <p className="text-sm text-green-600 mt-2">Message sent successfully!</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}
