'use client'

import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import {
  Newspaper,
  Folder,
  Settings,
  Bell,
  CheckCircle,
  UserCog,
  FileCheck,
  ShieldCheck,
  MessageSquare
} from 'lucide-react'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function AdminDashboardPage() {
  const { data: pending } = useSWR('/api/admin/clients', fetcher)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-10 text-[var(--color-text-primary)]">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/blog" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <Newspaper className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Manage Blog</span>
        </Link>

        <Link href="/admin/projects" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <Folder className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Manage Projects</span>
        </Link>

        <Link href="/admin/clients-approval" className="relative bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <CheckCircle className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Client Approvals</span>
          {pending?.length > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </Link>

        <Link href="/admin/manage-clients" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <UserCog className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Manage Clients</span>
        </Link>

        <Link href="/admin/services" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <Settings className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Services</span>
        </Link>

        <Link href="/admin/notifications" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <Bell className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Notifications</span>
        </Link>

        <Link href="/admin/certificates" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <FileCheck className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Certificates</span>
        </Link>

        <Link href="/admin/warranties" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <ShieldCheck className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Warranties</span>
        </Link>

        <Link href="/admin/reviews" className="bg-white shadow hover:shadow-md border rounded-xl p-6 flex items-center gap-4 transition-all group">
          <MessageSquare className="w-8 h-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-medium text-[var(--color-text-primary)]">Moderate Reviews</span>
        </Link>
      </div>
    </div>
  )
}
