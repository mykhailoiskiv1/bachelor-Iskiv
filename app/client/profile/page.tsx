'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type ProfileData = {
  name: string | null
  address: string | null
  phone: string | null
  email: string
}

export default function ProfilePage() {
  const { status } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/client/profile')
        .then(res => res.json())
        .then(data => setProfile(data))
    }
  }, [status])

  if (status === 'loading' || !profile) {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your profile.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Overview</h1>

      <div className="border p-4 rounded bg-gray-50 space-y-2">
        <p><span className="font-semibold">Name:</span> {profile.name ?? 'Not set'}</p>
        <p><span className="font-semibold">Email:</span> {profile.email}</p>
        <p><span className="font-semibold">Address:</span> {profile.address ?? 'Not set'}</p>
        <p><span className="font-semibold">Phone:</span> {profile.phone ?? 'Not set'}</p>
      </div>

      <div className="flex gap-4">
        <Link href="/client/profile/settings" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Profile
        </Link>
        <Link href="/client/profile/security" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Change Password
        </Link>
      </div>
    </div>
  )
}
