'use client';

import React from 'react';
import { useSession , signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReviewsModeration from '../../components/admin/reviews/ReviewsModeration';
import AddServiceForm from '../../components/admin/services/AddServiceForm';
import ServiceList from '../../components/admin/services/ServiceList';
import DeletedServicesList from '../../components/admin/services/DeletedServicesList';
import ClientsApproval from '../../components/admin/clients/ClientsApproval';
import ClientsManagement from '../../components/admin/clients/ClientsManagement';
import AdminCertificatesPage from '../../components/admin/certificates/page';
import AdminWarrantiesPage from '../../components/admin/warranties/page';
import AdminNotificationsPage from '../../components/admin/notifications/page';


export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/blog/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('Uploaded image URL:', data.url);
  };


  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <ClientsApproval />
      <ReviewsModeration />
      <AddServiceForm />
      <ServiceList />
      <DeletedServicesList />
      <ClientsManagement />
      <AdminCertificatesPage />
      <AdminWarrantiesPage />
      <AdminNotificationsPage />
      <input type="file" onChange={handleFileChange} />

    </main>
  );
}
