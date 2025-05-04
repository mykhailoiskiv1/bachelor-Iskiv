'use client'

import useSWR from 'swr'
import axios from 'axios'
import type { Service } from '@/types/service'

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function ServicesList() {
  const { data: services, error } = useSWR<Service[]>('/api/public/services', fetcher)

  if (error) return <p className="text-center text-red-500">Failed to load services.</p>

  if (!services) {
    return (
      <div className="space-y-10 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-1/3 bg-gray-200 rounded" />
            <ul className="space-y-2 pl-3 border-l border-gray-200">
              {[...Array(4)].map((_, j) => (
                <li key={j} className="relative pl-4">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  const grouped = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div className="space-y-12">
      <nav className="flex flex-wrap gap-4 mb-10 text-sm">
        {Object.keys(grouped).map(category => (
          <a
            key={category}
            href={`#${category}`}
            className="text-[var(--color-accent)] underline hover:no-underline"
          >
            {category}
          </a>
        ))}
      </nav>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} id={category} className="space-y-3">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] border-b pb-1">
            {category}
          </h2>
          <ul className="space-y-2 pl-3 border-l border-[var(--color-border)]">
            {items.map(service => (
              <li key={service.id} className="relative group pl-4">
                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
                <span className="font-medium text-[var(--color-text-primary)]">{service.title}</span>
                {service.description && (
                  <span className="ml-2 text-sm text-[var(--color-text-secondary)]">– {service.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
