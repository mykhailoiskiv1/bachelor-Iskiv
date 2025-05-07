'use client';

import { useEffect, useState } from 'react';

type ProfileData = {
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string;
};

export default function ProfileEditForm() {
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/client/profile');
      const data = await res.json();
      setFormData({
        name: data.name ?? '',
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email
      });
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/client/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert('Error updating profile');
    }
  };

  if (loading) return <p className="py-8 text-center">Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border-t pt-12">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full border border-gray-300 bg-gray-100 p-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name ?? ''}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address ?? ''}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone ?? ''}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-[var(--color-accent)] text-white px-4 py-2 text-sm hover:opacity-90 transition"
      >
        Save Changes
      </button>

      {success && <p className="text-sm text-green-600 mt-2">Saved successfully!</p>}
    </form>
  );
}
