import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req }) as JWT
  const pathname = req.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
