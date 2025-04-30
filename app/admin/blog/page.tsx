'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import PostItem from '../../../components/admin/blog/PostItem';

type Post = {
  id: string;
  title: string;
  category: string;
  imagePath: string;
  createdAt: string;
};


const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminBlogPage() {
  const { data: posts, mutate } = useSWR('/api/admin/blog', fetcher);
  const [form, setForm] = useState({ title: '', category: '', content: '' });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('content', form.content);
    formData.append('image', image);

    setLoading(true);
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);
    if (res.ok) {
      alert('Post created!');
      setForm({ title: '', category: '', content: '' });
      setImage(null);
      mutate();
    } else {
      const error = await res.json();
      alert(`Error: ${error.error}`);
    }
  };

  if (!posts) return <p className="text-center">Loading posts...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Management</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded">
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
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Posts</h2>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <PostItem key={post.id} post={post} />
        ))}

      </div>
    </div>
  );
}
