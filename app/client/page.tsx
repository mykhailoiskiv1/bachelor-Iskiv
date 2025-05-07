'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session.user.role !== 'CLIENT') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') return <p className="text-center py-20">Loading...</p>;

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            Welcome, <span className="font-semibold">{session?.user?.email}</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-md">
            Access everything related to your projects, profile, and documents in one place.
          </p>
        </header>

        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: '/client/projects',
              title: 'Your Projects',
              description: 'Track your ongoing and completed construction work.',
            },
            {
              href: '/client/invoices',
              title: 'Invoices',
              description: 'View billing history and download receipts.',
            },
            {
              href: '/client/documents',
              title: 'Certificates & Guarantees',
              description: 'Access warranties and official documents.',
            },
            {
              href: '/client/profile',
              title: 'Profile & Support',
              description: 'Update your data or get assistance.',
            },
            {
              href: '/client/notifications',
              title: 'Notifications',
              description: 'Read updates and company messages.',
            },
          ].map(({ href, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group relative pl-5"
            >
              <div className="absolute left-0 top-0 h-full w-0.5 bg-[var(--color-border)] group-hover:bg-[var(--color-accent)] transition-colors duration-300" />
              <h2 className="text-xl font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                {title}
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {description}
              </p>
              <span className="inline-block mt-2 text-sm font-medium text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition group-hover:translate-x-1">
                Go to section →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-red-600 hover:underline"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}
