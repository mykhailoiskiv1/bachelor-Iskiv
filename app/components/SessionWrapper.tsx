'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type Props = {
    readonly children: ReactNode
}

export default function SessionWrapper({ children }: Props) {
    return <SessionProvider>{children}</SessionProvider>
}
