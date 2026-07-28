import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function middleware(request: Request) {
  const session = await auth()
  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/portal') || pathname.startsWith('/intake')) {
    if (!session) return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  if (pathname.startsWith('/admin')) {
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/portal/:path*', '/admin/:path*', '/intake/:path*'] }
