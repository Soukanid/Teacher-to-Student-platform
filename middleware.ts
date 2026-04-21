// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Check for your custom admin cookie
  const adminCookie = request.cookies.get('admin_access')

  // 2. Define the paths
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isLoginPage = request.nextUrl.pathname === '/login'

  // 3. LOGIC: If trying to access dashboard without the secret cookie
  if (isDashboardPage && !isLoginPage) {
    if (!adminCookie || adminCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 4. LOGIC: If already logged in, don't let them go back to the login page
  if (isLoginPage && adminCookie?.value === 'true') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run this middleware on dashboard routes
  matcher: ['/dashboard/:path*', '/login'],
}
