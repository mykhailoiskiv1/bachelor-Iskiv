import type { ReactNode } from 'react'

export default function BlogPostLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>{children}</>
  )
}
