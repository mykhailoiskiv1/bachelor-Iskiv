'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ReviewsModeration from './components/reviews/ReviewsModeration';
import AddServiceForm from './components/services/AddServiceForm';
import ServiceList from './components/services/ServiceList';
import DeletedServicesList from './components/services/DeletedServicesList';
import ClientsApproval from './components/ClientsApproval';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <ClientsApproval />
      <ReviewsModeration />
      <AddServiceForm />
      <ServiceList />
      <DeletedServicesList />
    </main>
  );
}
