'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Якщо сесія завантажується або користувач не авторизований
    if (status === 'loading') return <div>Loading...</div>
    if (!session || session.user.role !== 'ADMIN') {
        router.push('/') // Перенаправлення для неадміністраторів
        return null
    }

    return (
        <div>
            <h1>Welcome to Admin Dashboard</h1>
        </div>
    )
}
