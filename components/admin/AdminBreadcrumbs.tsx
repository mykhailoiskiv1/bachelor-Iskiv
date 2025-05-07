'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function AdminBreadcrumbs() {
  const pathname = usePathname()

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'admin')

  const breadcrumbs = segments.map((segment, i) => {
    const href = '/admin/' + segments.slice(0, i + 1).join('/')
    const name = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return { name, href }
  })

  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="flex justify-center items-center flex-wrap gap-x-2 text-center">
        <li>
          <Link href="/admin" className="hover:underline text-gray-700 font-medium">
            Admin Panel
          </Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center">
            <ChevronRight size={14} className="mx-1 text-gray-400" />
            <Link href={crumb.href} className="hover:underline">
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
