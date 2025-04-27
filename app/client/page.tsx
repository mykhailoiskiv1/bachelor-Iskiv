'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ClientDashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
        if (status === 'authenticated' && session.user.role !== 'CLIENT') {
            router.push('/')
        }
    }, [status, session, router])

    if (status === 'loading') return <p className="text-center">Loading...</p>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Welcome, {session?.user?.email}</h1>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/client/projects" className="block p-4 border rounded hover:bg-gray-50 transition">
                    <h2 className="text-lg font-semibold">Your Projects</h2>
                    <p className="text-sm text-gray-600">View history and status of your completed and active projects</p>
                </Link>

                <Link href="/client/invoices" className="block p-4 border rounded hover:bg-gray-50 transition">
                    <h2 className="text-lg font-semibold">Invoices</h2>
                    <p className="text-sm text-gray-600">Access payment history and download receipts</p>
                </Link>

                <Link href="/client/documents" className="block p-4 border rounded hover:bg-gray-50 transition">
                    <h2 className="text-lg font-semibold">Certificates & Guarantees</h2>
                    <p className="text-sm text-gray-600">Check your warranty status and certificates</p>
                </Link>

                <Link href="/client/profile" className="block p-4 border rounded hover:bg-gray-50 transition">
                    <h2 className="text-lg font-semibold">Profile & Support</h2>
                    <p className="text-sm text-gray-600">Manage your account and contact support</p>
                </Link>
            </div>
        </div>
    )
}
