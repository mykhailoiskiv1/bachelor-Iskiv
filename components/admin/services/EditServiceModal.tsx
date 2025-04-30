'use client';

import { useState } from 'react';
import axios from 'axios';

type EditServiceModalProps = {
  service: {
    id: number;
    title: string;
    category: string;
    description: string;
    icon: string;
    isFeatured: boolean;
    isHot: boolean;
    sortOrder: number;
  };
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditServiceModal({ service, onClose, onUpdated }: EditServiceModalProps) {
  const [formData, setFormData] = useState(service);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/services/${service.id}`, formData);
      alert('Service updated!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded space-y-4 w-96">
        <h2 className="text-xl font-bold">Edit Service</h2>
        <input name="title" value={formData.title} onChange={handleChange} className="border p-2 w-full"/>
        <input name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full"/>
        <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full"/>
        <input name="icon" value={formData.icon} onChange={handleChange} className="border p-2 w-full"/>
        <label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}/> Featured</label>
        <label><input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange}/> Hot</label>
        <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="border p-2 w-full"/>
        <div className="flex justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
