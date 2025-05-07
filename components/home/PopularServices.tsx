'use client'

import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import { Loader } from 'lucide-react'
import type { Service } from '@/types/service'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function PopularServices() {
  const { data: services, error } = useSWR<Service[]>('/api/services', fetcher)

  if (error) {
    return (
      <section className="text-center text-[var(--color-accent)] py-10">
        Failed to load services.
      </section>
    )
  }

  if (!services) {
    return (
      <section className="text-center py-10">
        <Loader className="animate-spin inline w-6 h-6 text-[var(--color-accent)]" /> Loading...
      </section>
    )
  }

  return (
    <section className="bg-[var(--color-background)] py-24 px-6 sm:px-8 md:px-12 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto space-y-16">
        <header className="text-left sm:text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-light tracking-tight text-[var(--color-text-primary)] mb-4">
            Our Most Popular Services
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-md">
            Discover services our clients trust most — from efficient plumbing to premium renovations. Selected based on demand and customer feedback.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
          {services.map((service) => (
            <div key={service.id} className="relative pl-5 group">
              <div className="absolute left-0 top-0 h-full w-0.5 bg-[var(--color-border)] group-hover:bg-[var(--color-accent)] transition-colors duration-300" />
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                {service.title}
                {service.isHot && (
                  <span className="text-[var(--color-accent)] text-sm">🔥</span>
                )}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{service.category}</p>
              <Link
                href="/services"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition"
              >
                Learn More
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
