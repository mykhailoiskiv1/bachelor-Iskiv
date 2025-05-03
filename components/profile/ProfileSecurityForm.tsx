'use client';

import { useState } from 'react';

export default function ProfileSecurityForm() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const res = await fetch('/api/client/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
    });

    if (res.ok) {
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      const data = await res.json();
      setError(data.error || 'Unknown error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 border-t pt-12 max-w-md">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[var(--color-accent)] text-white px-4 py-2 text-sm hover:opacity-90 transition"
      >
        Save Password
      </button>

      {success && <p className="text-sm text-green-600 mt-2">Password updated successfully!</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </form>
  );
}