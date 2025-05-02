'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-header-bg)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--color-highlight)] tracking-wide">
          TEST COMPANY
        </Link>

        <button
          className="md:hidden text-[var(--color-highlight)]"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <nav className="hidden md:flex gap-6 text-sm text-[var(--color-link)] font-medium">
          <Link href="/" className="hover:text-[var(--color-link-hover)] transition">Home</Link>
          <Link href="/services" className="hover:text-[var(--color-link-hover)] transition">Services</Link>
          <Link href="/gallery" className="hover:text-[var(--color-link-hover)] transition">Gallery</Link>
          <Link href="/blog" className="hover:text-[var(--color-link-hover)] transition">Blog</Link>
          <Link href="/contact" className="hover:text-[var(--color-link-hover)] transition">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {!session?.user ? (
            <>
              <Link href="/login" className="text-sm text-[var(--color-link)] hover:text-[var(--color-link-hover)]">Login</Link>
              <Link href="/register" className="text-sm text-[var(--color-link)] hover:text-[var(--color-link-hover)]">Register</Link>
            </>
          ) : (
            <>
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/client'}>
                <UserCircle2 className="w-6 h-6 text-[var(--color-link)] hover:text-[var(--color-link-hover)]" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-header-bg)] border-t border-[var(--color-border)] px-4 pb-4">
          <nav className="flex flex-col gap-4 py-4 text-sm text-[var(--color-link)] font-medium">
            <Link href="/" className="hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Home</Link>
            <Link href="/services" className="hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Services</Link>
            <Link href="/gallery" className="hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Gallery</Link>
            <Link href="/blog" className="hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Blog</Link>
            <Link href="/contact" className="hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Contact</Link>
          </nav>

          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-4">
            {!session?.user ? (
              <>
                <Link href="/login" className="text-sm text-[var(--color-link)] hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Login</Link>
                <Link href="/register" className="text-sm text-[var(--color-link)] hover:text-[var(--color-link-hover)]" onClick={closeMenu}>Register</Link>
              </>
            ) : (
              <>
                <Link href={session.user.role === 'ADMIN' ? '/admin' : '/client'} onClick={closeMenu}>
                  <UserCircle2 className="w-6 h-6 text-[var(--color-link)] hover:text-[var(--color-link-hover)]" />
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/login' });
                    closeMenu();
                  }}
                  className="text-sm text-[var(--color-accent)] hover:underline text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
