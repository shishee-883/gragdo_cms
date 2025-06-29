import { Suspense } from "react"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getClinics } from "@/lib/actions/clinics"
import { getUserProfile } from "@/lib/actions/profile"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'
import { verifyToken } from "@/lib/services/auth"

export default async function ClinicsPage() {
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
    
    // Verify and decode the token to get the user ID
    const payload = await verifyToken(token)
    if (!payload) {
      redirect('/login')
    }
    
    // Get the current user profile
    const userProfile = await getUserProfile(payload.id as string)
    
    // If no user is logged in or user is not a super admin, redirect to login
    if (!userProfile || userProfile.role !== 'SUPER_ADMIN') {
      redirect('/login')
    }
    
    // Get all clinics
    const clinics = await getClinics()
    
    // Filter clinics based on user's clinicIds if they exist
    const filteredClinics = userProfile.clinicIds 
      ? clinics.filter(clinic => userProfile.clinicIds?.includes(clinic.id))
      : clinics

    return (
      <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
          </div>
        }>
          <ClinicsClient 
            initialClinics={filteredClinics} 
            userRole={userProfile.role}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error in clinics page:', error)
    redirect('/login')
  }
}