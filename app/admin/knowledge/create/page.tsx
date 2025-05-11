'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function CreateKnowledgeBasePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/admin/knowledge-base', { title, content });
      router.push('/admin/knowledge');
    } catch (err) {
      console.error('Error creating knowledge entry:', err);
      setError('Failed to create entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Add Knowledge Entry</h1>
        <Link href="/admin/knowledge" className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border rounded px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Content"
          className="w-full border rounded px-4 py-2 min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
}
