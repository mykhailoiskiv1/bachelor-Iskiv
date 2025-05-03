import AdminHeader from './AdminHeader'
import AdminBreadcrumbs from '../AdminBreadcrumbs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-1 p-4 bg-[var(--color-background)]">
        <AdminBreadcrumbs />
        {children}
      </main>
    </div>
  )
}
