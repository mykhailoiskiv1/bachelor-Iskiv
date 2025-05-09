'use client'

import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import {
  Newspaper,
  Folder,
  FileText,
  CheckCircle,
  UserCog,
  MessageSquare,
  Settings,
  FileCheck,
  ShieldCheck,
  Bell,
} from 'lucide-react'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const Tile = ({
  href,
  icon: Icon,
  label,
  notificationCount,
}: {
  href: string
  icon: React.ElementType
  label: string
  notificationCount?: number
}) => (
  <Link
    href={href}
    className="relative group bg-white border-l-4 border-[var(--color-accent)] shadow-sm hover:shadow-md rounded-xl px-5 py-6 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:scale-[1.02]"
  >
    <Icon className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
    <span className="text-lg font-medium text-[var(--color-text-primary)]">{label}</span>

    {notificationCount && notificationCount > 0 && (
      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
        {notificationCount}
      </span>
    )}
  </Link>
)

export default function AdminDashboardPage() {
  const { data: pending } = useSWR('/api/admin/clients', fetcher)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-10 text-[var(--color-text-primary)]">Welcome, Admin</h1>

      <h2 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-3">Content & Projects</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Tile href="/admin/blog" icon={Newspaper} label="Manage Blog" />
        <Tile href="/admin/projects" icon={Folder} label="Manage Projects" />
        <Tile href="/admin/invoices" icon={FileText} label="Invoices" />
        <Tile href="/admin/client-projects" icon={Folder} label="Client Projects" />
      </div>

      <h2 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-3">Clients & Moderation</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Tile href="/admin/clients-approval" icon={CheckCircle} label="Client Approvals" notificationCount={pending?.length} />
        <Tile href="/admin/manage-clients" icon={UserCog} label="Manage Clients" />
        <Tile href="/admin/reviews" icon={MessageSquare} label="Moderate Reviews" />
      </div>

      <h2 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-3">Services & Documents</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Tile href="/admin/services" icon={Settings} label="Services" />
        <Tile href="/admin/certificates" icon={FileCheck} label="Certificates" />
        <Tile href="/admin/warranties" icon={ShieldCheck} label="Warranties" />
      </div>

      <h2 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-3">Communication</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Tile href="/admin/notifications" icon={Bell} label="Notifications" />
      </div>
    </div>
  )
}
