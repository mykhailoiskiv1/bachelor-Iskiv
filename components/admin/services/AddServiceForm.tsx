import React, { useState } from 'react';
import axios from 'axios';

export default function AddServiceForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Building');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/services', {
        title,
        category,
        description,
        icon,
        isFeatured,
        isHot,
        sortOrder,
      });
      setMessage('Service added successfully!');
      setTitle('');
      setCategory('Building');
      setDescription('');
      setIcon('');
      setIsFeatured(false);
      setIsHot(false);
      setSortOrder(0);
    } catch (err) {
      console.error('Failed to add service:', err);
      setMessage('Failed to add service.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold">Add New Service</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="Electricity">Electricity</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Building">Building</option>
      </select>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Icon (e.g., Wrench, Zap)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="flex items-center space-x-2">
        <label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured((e.target as HTMLInputElement).checked)}
          />
          {' '}Featured
        </label>

        <label>
          <input
            type="checkbox"
            checked={isHot}
            onChange={(e) => setIsHot((e.target as HTMLInputElement).checked)}
          />
          {' '}Hot 🔥
        </label>
      </div>

      <input
        type="number"
        placeholder="Sort Order"
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Service
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
