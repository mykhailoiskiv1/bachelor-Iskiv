'use client';

import { useState } from 'react';
import axios from 'axios';

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  location?: string;
  completionDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published: boolean;
};

type Props = {
  project: Project;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditProjectModal({ project, onClose, onUpdated }: Props) {
  const [formData, setFormData] = useState(project);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`/api/admin/projects/${project.id}`, formData);
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this project?')) return;
    setLoading(true);
    try {
      await axios.put(`/api/admin/projects/${project.id}`);
      onUpdated();
      onClose();
      alert('Project published!');
    } catch (err) {
      console.error('Publish failed', err);
      alert('Failed to publish project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-[90%] max-w-2xl space-y-4"
      >
        <h2 className="text-xl font-semibold">Edit Project</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content (for SEO)"
          className="w-full border p-2 rounded"
        />
        <input
          name="location"
          value={formData.location ?? ''}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="completionDate"
          value={formData.completionDate?.slice(0, 10) ?? ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="seoTitle"
          value={formData.seoTitle ?? ''}
          onChange={handleChange}
          placeholder="SEO Title"
          className="w-full border p-2 rounded"
        />
        <input
          name="seoDescription"
          value={formData.seoDescription ?? ''}
          onChange={handleChange}
          placeholder="SEO Description"
          className="w-full border p-2 rounded"
        />
        <input
          name="seoKeywords"
          value={formData.seoKeywords ?? ''}
          onChange={handleChange}
          placeholder="SEO Keywords"
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
          />
          <span>Published</span>
        </label>

        <div className="flex justify-between flex-wrap gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
