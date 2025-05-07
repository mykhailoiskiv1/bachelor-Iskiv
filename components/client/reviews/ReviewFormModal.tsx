'use client'

import { useState } from 'react'

type Props = {
  onClose: () => void
}

export default function ReviewFormModal({ onClose }: Props) {
  const [form, setForm] = useState({ clientName: '', rating: 5, content: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      alert('Review submitted for moderation!')
      setForm({ clientName: '', rating: 5, content: '' })
      onClose()
    } else {
      alert('Error submitting review')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] text-center">
          Leave a Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Your Name"
            value={form.clientName}
            onChange={e => setForm({ ...form, clientName: e.target.value })}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />

          <select
            value={form.rating}
            onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          >
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>

          <textarea
            placeholder="Your Review"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-button-bg)] text-[var(--color-button-text)] py-2 rounded-full text-sm hover:bg-[var(--color-button-hover-bg)] transition"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
