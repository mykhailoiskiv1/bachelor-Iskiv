'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

type PostType = {
  title: string;
  category: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  imagePath: string;
};

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<PostType>({
    title: '',
    category: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    imagePath: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/admin/blog/posts/${id}`);
        const post = res.data;

        setForm({
          title: post.title,
          category: post.category,
          content: post.content,
          seoTitle: post.seoTitle ?? '',
          seoDescription: post.seoDescription ?? '',
          seoKeywords: post.seoKeywords ?? '',
          imagePath: post.imagePath,
        });

        const imgRes = await fetch(`/api/media/${post.imagePath}`);
        const imgData = await imgRes.json();
        setImageUrl(imgData.url);
      } catch (err) {
        console.error('Failed to load post', err);
        alert('Error loading post data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleRegenerateSEO = async () => {
    try {
      const res = await axios.post('/api/admin/blog/seo', {
        title: form.title,
        content: form.content,
      });

      const { seoTitle, seoDescription, seoKeywords } = res.data;

      setForm((prev) => ({
        ...prev,
        seoTitle,
        seoDescription,
        seoKeywords,
      }));

      alert('SEO data successfully regenerated!');
    } catch (err) {
      console.error(err);
      alert('Failed to regenerate SEO.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/api/admin/blog/${id}`, form);
      alert('Post updated successfully!');
      router.push('/admin/blog');
    } catch (err) {
      console.error(err);
      alert('Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading post data...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Blog Post</h1>

      {imageUrl && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Current Image:</p>
          <img src={imageUrl} alt="Post" className="mx-auto w-48 h-48 object-cover rounded" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 border rounded shadow">
        <FormField label="Title" value={form.title} onChange={(val) => setForm({ ...form, title: val })} />
        <FormField label="Category" value={form.category} onChange={(val) => setForm({ ...form, category: val })} />
        <FormTextarea label="Content" value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
        <FormField label="SEO Title" value={form.seoTitle} onChange={(val) => setForm({ ...form, seoTitle: val })} />
        <FormTextarea label="SEO Description" value={form.seoDescription} onChange={(val) => setForm({ ...form, seoDescription: val })} />
        <FormTextarea label="SEO Keywords" value={form.seoKeywords} onChange={(val) => setForm({ ...form, seoKeywords: val })} />

        <button
          type="button"
          onClick={handleRegenerateSEO}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
        >
          Regenerate SEO Data
        </button>

        <button
          type="submit"
          className={`w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={saving}
        >
          {saving ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}

function FormField({ label, value, onChange }: Readonly<{ label: string; value: string; onChange: (val: string) => void }>) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange }: Readonly<{ label: string; value: string; onChange: (val: string) => void }>) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        rows={3}
        required
      />
    </div>
  );
}
