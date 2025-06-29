import { Suspense } from "react"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getClinics } from "@/lib/actions/clinics"
import { getUserProfile } from "@/lib/actions/profile"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"

export default async function ClinicsPage() {
  try {
    // Get the current user
    const currentUser = await getCurrentUser()
    
    // If no user is logged in, redirect to login
    if (!currentUser) {
      redirect('/login')
    }
    
    // Get the current user profile
    const userProfile = await getUserProfile(currentUser.id)
    
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