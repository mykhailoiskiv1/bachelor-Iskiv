'use client'

import { useRouter } from 'next/navigation'

export const useRoleRedirect = () => {
  const router = useRouter()

  return (role: string) => {
    if (role === 'ADMIN') router.push('/admin')
    else if (role === 'CLIENT') router.push('/client')
    else router.push('/')
  }
}
