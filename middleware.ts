import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/services/auth'

export async function middleware(request: NextRequest) {
  // Define public paths that don't require authentication
  const publicPaths = [
    '/login', 
    '/signup', 
    '/forgot-password', 
    '/reset-password',
    '/verify-email'
  ]
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // For protected routes, let the backend handle authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}