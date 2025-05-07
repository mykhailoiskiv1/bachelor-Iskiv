'use client'

import Link from 'next/link'
import { Menu, X, LogOut, Home, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Logout failed')
    }
  }

  return (
    <header className="bg-[var(--color-header-bg)] text-[var(--color-text-primary)] shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/admin" className="text-xl font-semibold">
          Admin Panel
        </Link>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-[var(--color-accent)]">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/admin" className="flex items-center gap-1 text-sm hover:underline">
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            <Home size={16} className="mr-1" /> Visit Site
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-red-600 hover:underline"
          >
            <LogOut size={16} className="mr-1" /> Logout
          </button>
        </nav>
      </div>

      {open && (
        <nav className="md:hidden px-4 pb-3 flex flex-col gap-2 bg-[var(--color-header-bg)]">
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="text-sm text-blue-600"
          >
            <Home size={16} className="inline mr-1" /> Visit Site
          </a>

          <button
            onClick={() => {
              setOpen(false)
              handleLogout()
            }}
            className="text-left text-sm text-red-600"
          >
            <LogOut size={16} className="inline mr-1" /> Logout
          </button>
        </nav>
      )}
    </header>
  )
}
