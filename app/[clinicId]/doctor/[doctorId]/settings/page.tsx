import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorSettingsClient } from "@/components/doctor/settings/doctor-settings-client"
import { getUserProfile } from "@/lib/actions/profile"
import { getClinicById } from "@/lib/actions/clinics"
import { getDoctorById } from "@/lib/actions/doctors"

interface DoctorSettingsPageProps {
  params: {
    clinicId: string
    doctorId: string
  }
}

export default async function DoctorSettingsPage({ params }: DoctorSettingsPageProps) {
  // Verify clinic and doctor exist
  const clinic = await getClinicById(params.clinicId)
  const doctor = await getDoctorById(params.doctorId)
  
  if (!clinic || !doctor || doctor.clinicId !== params.clinicId) {
    notFound()
  }

  const userProfile = await getUserProfile(doctor.userId)

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" clinicId={params.clinicId} userId={params.doctorId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading settings...</p>
            </div>
          }>
            <DoctorSettingsClient initialProfile={userProfile} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}