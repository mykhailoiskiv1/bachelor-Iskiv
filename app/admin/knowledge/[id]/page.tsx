'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Trash } from 'lucide-react';

export default function EditKnowledgeBasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/admin/knowledge-base/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch(() => setError('Failed to load entry.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Both fields are required.');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/admin/knowledge-base/${id}`, { title, content });
      router.push('/admin/knowledge');
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await axios.delete(`/api/admin/knowledge-base/${id}`);
      router.push('/admin/knowledge');
    } catch {
      setError('Failed to delete.');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Edit Entry</h1>
        <Link href="/admin/knowledge" className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-4 py-2"
          placeholder="Title"
          disabled={saving}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-4 py-2 min-h-[150px]"
          placeholder="Content"
          disabled={saving}
        />
        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-full text-sm hover:bg-opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 text-sm hover:underline flex items-center gap-1"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
