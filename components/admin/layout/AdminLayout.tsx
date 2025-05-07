'use client'

import AdminHeader from './AdminHeader'
import AdminBreadcrumbs from '../AdminBreadcrumbs'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-4 bg-[var(--color-background)]">
        <AdminBreadcrumbs />
        {children}
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}
