import type { ReactNode } from 'react';
import ClientHeader from '@/components/layout/ClientHeader';
import ClientFooter from '@/components/layout/ClientFooter';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ClientHeader />
      <Breadcrumbs />
      <main className="flex-1">{children}</main>
      <ClientFooter />
    </div>
  );
}
