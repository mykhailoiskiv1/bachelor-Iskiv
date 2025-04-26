'use client';
import { useEffect, useState } from 'react';
import { Review } from '@/types/review';

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 mb-2 rounded">
          <p className="font-semibold">{review.clientName}</p>
          <p>{'⭐'.repeat(review.rating)}</p>
          <p>{review.content}</p>
          {review.companyReply && (
            <p className="text-sm text-gray-500 mt-2">Reply: {review.companyReply}</p>
          )}
        </div>
      ))}
    </div>
  );
}
