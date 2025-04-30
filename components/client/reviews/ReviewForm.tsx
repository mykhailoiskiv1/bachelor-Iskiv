'use client';
import { useState } from 'react';

export default function ReviewForm() {
  const [form, setForm] = useState({ clientName: '', rating: 5, content: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('Review submitted for moderation!');
      setForm({ clientName: '', rating: 5, content: '' });
    } else {
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input placeholder="Your Name" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="border p-2 rounded" />
      <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="border p-2 rounded">
        {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
      </select>
      <textarea placeholder="Your Review" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="border p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Review</button>
    </form>
  );
}
