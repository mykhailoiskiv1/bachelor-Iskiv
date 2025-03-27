import type { ReactNode } from 'react'

export default function ClientLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <section className="p-4">
      {children}
    </section>
  )
}
