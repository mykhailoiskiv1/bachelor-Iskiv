'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Settings, ShieldCheck, LifeBuoy } from 'lucide-react';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfileSecurityForm from '@/components/profile/ProfileSecurityForm';
import ProfileSupport from '@/components/profile/ProfileSupport';

type ProfileData = {
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string;
};


const tabs = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'support', label: 'Support', icon: LifeBuoy },
];

export default function ProfilePage() {
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<ProfileData | null>(null);


  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/client/profile')
        .then(res => res.json())
        .then(data => setProfile(data));
    }
  }, [status]);

  if (status === 'loading') return <p className="text-center py-20">Loading...</p>;
  if (status === 'unauthenticated') return <p className="text-center text-red-600 py-20">Please log in.</p>;
  if (!profile) return null;

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto space-y-16">
        <nav className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 text-sm text-center sm:text-left">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1 transition hover:underline ${
                activeTab === key ? 'text-[var(--color-accent)] font-medium' : 'text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <section className="space-y-12">
            <header className="text-center">
              <User className="w-8 h-8 mx-auto text-[var(--color-accent)] mb-4" />
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight">Profile Overview</h1>
            </header>
            <div className="border-l-2 border-[var(--color-accent)] pl-4 sm:pl-6 space-y-3">
              <p><span className="font-semibold">Name:</span> {profile.name ?? 'Not set'}</p>
              <p><span className="font-semibold">Email:</span> {profile.email}</p>
              <p><span className="font-semibold">Address:</span> {profile.address ?? 'Not set'}</p>
              <p><span className="font-semibold">Phone:</span> {profile.phone ?? 'Not set'}</p>
            </div>
          </section>
        )}

        {activeTab === 'settings' && <ProfileEditForm />} 
        {activeTab === 'security' && <ProfileSecurityForm />} 
        {activeTab === 'support' && <ProfileSupport />}
      </div>
    </main>
  );
}
