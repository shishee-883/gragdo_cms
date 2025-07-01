import { Suspense } from "react"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getClinics } from "@/lib/actions/clinics"
import { getUserProfile } from "@/lib/actions/profile"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { useAuthToken } from "@/lib/hooks/useAuthToken"

export default async function ClinicsPage(context) {
  try {
    const {token} = context.params
    
    // Get all clinics
    const clinics = await getClinics(token)
    
    // Filter clinics based on user's clinicIds if they exist
    const filteredClinics = clinics

    return (
      <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
          </div>
        }>
          <ClinicsClient 
            initialClinics={filteredClinics} 
            userRole={"SUPER_ADMIN"}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error in clinics page:', error)
    redirect('/login')
  }
}