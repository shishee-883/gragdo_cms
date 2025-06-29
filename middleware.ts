import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, refreshAccessToken } from './lib/services/auth'

export async function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth-token')?.value
  const refreshToken = request.cookies.get('refresh-token')?.value

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
    // If user is already logged in and trying to access login/signup pages, redirect to dashboard
    if (authToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }
  
  // If the path is not public and there's no auth token, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify the auth token
  const payload = await verifyToken(authToken)
  
  // If the token is invalid and we have a refresh token, try to refresh it
  if (!payload && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken)
    
    if (newAccessToken) {
      // Create a new response
      const response = NextResponse.next()
      
      // Set the new access token in the response cookies
      response.cookies.set('auth-token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
      
      return response
    } else {
      // If refresh token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // If token is invalid and we couldn't refresh it, redirect to login
  if (!payload && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Allow access to protected routes if auth token is valid
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}