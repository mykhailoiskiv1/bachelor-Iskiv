'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labelMap: Record<string, string> = {
  client: 'Dashboard',
  profile: 'Profile',
  settings: 'Settings',
  security: 'Security',
  support: 'Support',
  documents: 'Documents',
  notifications: 'Notifications',
  invoices: 'Invoices',
  projects: 'Projects'
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length < 2 || !segments.includes('client')) return null;

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = labelMap[segment] || segment;
    const isLast = index === segments.length - 1;

    return isLast ? (
      <span key={href} className="text-[var(--color-text-primary)]">
        {label}
      </span>
    ) : (
      <Link
        key={href}
        href={href}
        className="text-[var(--color-accent)] hover:underline whitespace-nowrap"
      >
        {label} <span className="mx-2 text-gray-400">/</span>
      </Link>
    );
  });

  return (
    <div className="px-4 sm:px-6 pt-4 pb-2 text-sm max-w-5xl mx-auto">
      <nav className="flex flex-wrap justify-center sm:justify-start items-center gap-x-1 gap-y-2 text-center sm:text-left">
        {breadcrumbs}
      </nav>
    </div>
  );
}