'use client'

import ClientsApproval from '@/components/admin/clients/ClientsApproval'

export default function AdminClientApprovalsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Client Approvals
      </h1>
      <ClientsApproval />
    </div>
  )
}
