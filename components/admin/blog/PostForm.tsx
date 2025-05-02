'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type PostFormProps = {
  initialData?: {
    title: string;
    category: string;
    content: string;
    imagePath: string;
  };
  mode?: 'create' | 'edit';
  postId?: string;
  onSuccess?: () => void;
};

export default function PostForm({
  initialData,
  mode = 'create',
  postId,
  onSuccess,
}: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    content: initialData?.content || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      let imagePath = initialData?.imagePath || '';

      if (image) {
        const imageForm = new FormData();
        imageForm.append('file', image);
        const uploadRes = await axios.post('/api/admin/blog/upload', imageForm);
        imagePath = uploadRes.data.url;
      }

      if (mode === 'edit' && postId) {
        await axios.put(`/api/admin/blog/${postId}`, {
          ...form,
          imagePath,
        });
        alert('Post updated successfully!');
      } else {
        const res = await axios.post('/api/admin/blog/posts', {
          ...form,
          imagePath,
        });

        if (res.status === 201) alert('Post created successfully!');
      }

      onSuccess?.();
      router.push('/admin/blog/posts');
    } catch (err) {
      console.error('[POST_FORM_ERROR]', err);
      alert('Failed to submit post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded mb-8">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full border p-2 rounded"
        rows={6}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
        {...(mode === 'create' ? { required: true } : {})}
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : mode === 'edit' ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
}
