import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorProfileClient } from "@/components/doctors/doctor-profile-client"
import { getDoctorById } from "@/lib/actions/doctors"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface DoctorProfilePageProps {
  params: {
    clinicId: string
    staffId: string
    doctorId: string
  }
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  // Verify clinic, staff, and doctor exist
  const clinic = await getClinicById(params.clinicId)
  const staff = await findById<User>('users', params.staffId)
  const doctor = await getDoctorById(params.doctorId)

  if (!clinic || !staff || !doctor || staff.role !== 'STAFF' || 
      staff.clinicId !== params.clinicId || doctor.clinicId !== params.clinicId) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" clinicId={params.clinicId} userId={params.staffId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading doctor profile...</p>
            </div>
          }>
            <DoctorProfileClient doctor={doctor} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}