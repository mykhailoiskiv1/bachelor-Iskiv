'use client';

import useSWR from 'swr';
import axios from 'axios';
import type { Review } from '@/types/review';
import { useState } from 'react';

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function ReviewsModeration() {
  const { data: reviews, error, mutate } = useSWR('/api/admin/reviews?status=PENDING', fetcher);
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});

  if (error) return <p className="text-red-600">Failed to load.</p>;
  if (!reviews) return <p>Loading reviews...</p>;

  const act = async (id: number, action: 'APPROVE' | 'REJECT' | 'REPLY') => {
    await axios.put('/api/admin/reviews', { id, action, reply: replyMap[id] });
    mutate();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews Moderation Panel</h2>

      {reviews.length === 0 && <p>No pending reviews 🎉</p>}

      {reviews.map((r: Review) => (
        <div key={r.id} className="border rounded-xl p-4 mb-4 shadow">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{r.clientName} ★{r.rating}</p>
              <p className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString()}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => act(r.id, 'APPROVE')} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
              <button onClick={() => act(r.id, 'REJECT')} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
            </div>
          </div>

          <p className="my-2">{r.content}</p>

          <div className="flex gap-2">
            <input
              placeholder="Reply..."
              className="flex-1 px-2 py-1 border rounded"
              value={replyMap[r.id] ?? ''}
              onChange={e => setReplyMap({ ...replyMap, [r.id]: e.target.value })}
            />
            <button
              onClick={() => act(r.id, 'REPLY')}
              className="px-3 py-1 rounded bg-blue-600 text-white"
              disabled={!replyMap[r.id]}
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
