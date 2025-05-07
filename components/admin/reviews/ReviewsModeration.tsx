'use client'

import useSWR from 'swr'
import axios from 'axios'
import type { Review } from '@/types/review'
import { useState } from 'react'
import { Check, X as Reject, Send } from 'lucide-react'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

export default function ReviewsModeration() {
  const { data: reviews, error, mutate } = useSWR('/api/admin/reviews?status=PENDING', fetcher)
  const [replyMap, setReplyMap] = useState<Record<number, string>>({})

  const act = async (id: number, action: 'APPROVE' | 'REJECT' | 'REPLY') => {
    await axios.put('/api/admin/reviews', { id, action, reply: replyMap[id] })
    mutate()
  }

  if (error) return <p className="text-red-600">Failed to load reviews.</p>
  if (!reviews) return <p>Loading reviews...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Reviews Moderation Panel</h2>

      {reviews.length === 0 && (
        <p className="text-green-600 text-sm">No pending reviews 🎉</p>
      )}

      {reviews.map((r: Review) => (
        <div key={r.id} className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base font-semibold text-[var(--color-text-primary)]">
                {r.clientName} <span className="text-yellow-500">★{r.rating}</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => act(r.id, 'APPROVE')}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-full"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => act(r.id, 'REJECT')}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-full"
              >
                <Reject size={16} /> Reject
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700">{r.content}</p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Reply..."
              value={replyMap[r.id] ?? ''}
              onChange={(e) => setReplyMap({ ...replyMap, [r.id]: e.target.value })}
              className="flex-1 border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <button
              onClick={() => act(r.id, 'REPLY')}
              disabled={!replyMap[r.id]}
              className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-[var(--color-accent)] hover:bg-opacity-90 rounded-full disabled:opacity-50"
            >
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
