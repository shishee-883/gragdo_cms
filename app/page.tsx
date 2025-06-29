import { redirect } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole, getCurrentUser } from "@/lib/actions/auth"
import { cookies } from 'next/headers'

// Force dynamic rendering to ensure request context is available
export const dynamic = 'force-dynamic'

export default async function Home() {
  try {
    // Get the auth token from cookies in the server component
    let token: string | undefined
    
    try {
      const cookieStore = cookies()
      token = cookieStore.get('auth-token')?.value
    } catch (cookieError) {
      // If cookies() fails due to request scope issues, treat as no token
      console.warn('Failed to access cookies:', cookieError)
      token = undefined
    }
    
    // If no token, redirect to login
    if (!token) {
      redirect('/login')
    }
    
    // Get current user using the token
    const currentUser = await getCurrentUser(token)
    
    // If no user, redirect to login
    if (!currentUser) {
      redirect('/login')
    }
    
    // Get user profile with the current user's ID
    const userProfile = await getUserProfile(currentUser.id)
    
    if (!userProfile) {
      redirect('/login')
    }
    
    // Redirect based on user role
    const redirectPath = await getRedirectPathForRole(
      userProfile.role, 
      userProfile.clinic?.id,
      userProfile.id
    )
    redirect(redirectPath)
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors to allow Next.js to handle redirects properly
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('Error in home page:', error)
    redirect('/login')
  }
}