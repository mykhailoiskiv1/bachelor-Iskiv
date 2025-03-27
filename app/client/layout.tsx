import type { ReactNode } from 'react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <section className="p-4">
      {children}
    </section>
  )
}
