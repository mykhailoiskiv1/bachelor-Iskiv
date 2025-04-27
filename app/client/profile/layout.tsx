'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/client/profile', label: 'Profile Overview' },
    { href: '/client/profile/settings', label: 'Settings' },
    { href: '/client/profile/support', label: 'Support' },
    { href: '/client/profile/security', label: 'Security' },
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-6">Client Profile</h2>
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`p-2 rounded hover:bg-gray-200 ${
                pathname === link.href ? 'bg-gray-300 font-semibold' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
