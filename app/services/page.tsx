import { Metadata } from 'next'
import ServicesList from '@/components/public/services/ServicesList'
import Header from '@/components/layout/Header'
import FooterMinimal from '@/components/layout/FooterMinimal'

export const metadata: Metadata = {
  title: 'Our Services | Construction Company',
  description: 'Explore all services offered by our construction team — from building and plumbing to electrical works.',
}

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4 text-center sm:text-left">
          Our Services
        </h1>
        <p className="text-gray-600 mb-10 text-center sm:text-left">
          We provide a wide range of construction, renovation, plumbing, and electrical services.
        </p>

        <ServicesList />
      </main>

      <FooterMinimal />
    </>
  )
}
