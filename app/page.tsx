"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserProfile } from "@/lib/actions/profile"
import { getRedirectPathForRole, getCurrentUser } from "@/lib/actions/auth"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function redirectUser() {
      try {
        // Get current user - this function should handle authentication internally
        const currentUser = await getCurrentUser()
        
        // If no user, redirect to login
        if (!currentUser) {
          router.push('/login')
          return
        }
        
        // Get user profile with the current user's ID
        const userProfile = await getUserProfile(currentUser.id)
        
        if (!userProfile) {
          router.push('/login')
          return
        }
        
        // Redirect based on user role
        const redirectPath = await getRedirectPathForRole(
          userProfile.role, 
          userProfile.clinic?.id,
          userProfile.id
        )
        router.push(redirectPath)
      } catch (error) {
        // Re-throw NEXT_REDIRECT errors to allow Next.js to handle redirects properly
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
          throw error
        }
        
        console.error('Error in home page:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    redirectUser()
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
    </div>
  }

  return null
}