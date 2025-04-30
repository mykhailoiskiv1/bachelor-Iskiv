'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { UserCircle2 } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-black">DreamBuild</Link>
          <nav className="hidden md:flex gap-4 text-sm text-gray-700">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!session?.user ? (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
              <Link href="/register" className="text-sm text-gray-700 hover:underline">Register</Link>
            </>
          ) : (
            <>
              <Link href={session.user.role === 'ADMIN' ? '/admin' : '/client'}>
                <UserCircle2 className="w-6 h-6 text-gray-700 hover:text-black" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
