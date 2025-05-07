'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';

export default function ClientHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        <Link href="/" className="text-xl font-bold text-accent hover:opacity-80">
          Dream Construction
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/client" className="hover:underline">Dashboard</Link>
          <Link href="/client/notifications" className="flex items-center gap-1 hover:underline">
            <Bell className="w-4 h-4" /> Notifications
          </Link>
          <Link href="/" className="hover:underline text-[var(--color-accent)] font-medium">
            Main Website
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3 text-sm">
          <Link href="/client" className="block hover:underline" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/client/notifications" className="block hover:underline" onClick={() => setMenuOpen(false)}>
            Notifications
          </Link>
          <Link href="/" className="block hover:underline text-[var(--color-accent)] font-medium" onClick={() => setMenuOpen(false)}>
            Main Website
          </Link>
        </div>
      )}
    </header>
  );
}
