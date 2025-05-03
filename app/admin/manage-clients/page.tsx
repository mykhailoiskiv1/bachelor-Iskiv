'use client'

import ClientsManagement from '@/components/admin/clients/ClientsManagement'

export default function AdminClientsManagePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Manage Clients
      </h1>
      <ClientsManagement />
    </div>
  )
}
