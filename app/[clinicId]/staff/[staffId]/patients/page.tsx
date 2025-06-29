import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PatientsClient } from "@/components/patients/patients-client"
import { getPatients } from "@/lib/actions/patients"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface PatientsPageProps {
  params: {
    clinicId: string
    staffId: string
  }
}

export default async function PatientsPage({ params }: PatientsPageProps) {
  // Verify clinic and staff exist
  const clinic = await getClinicById(params.clinicId)
  const staff = await findById<User>('users', params.staffId)
  
  if (!clinic || !staff || staff.role !== 'STAFF' || staff.clinicId !== params.clinicId) {
    notFound()
  }

  const patients = await getPatients(params.clinicId)

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" clinicId={params.clinicId} userId={params.staffId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <PatientsClient initialPatients={patients} />
        </div>
      </main>
    </div>
  )
}