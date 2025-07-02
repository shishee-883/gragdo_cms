import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the token from localStorage (client-side only)
  const token = request.cookies.get('token_cms')?.value

  // Check if the user is trying to access a protected route
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login') && 
                          !request.nextUrl.pathname.startsWith('/signup') &&
                          !request.nextUrl.pathname.startsWith('/reset-password') &&
                          !request.nextUrl.pathname.startsWith('/verify')

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access login/signup pages with a token, redirect to dashboard
  if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}