import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RoomsClient } from "@/components/rooms/rooms-client"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface RoomsPageProps {
  params: {
    clinicId: string
    staffId: string
  }
}

export default async function RoomsPage({ params }: RoomsPageProps) {
  // Verify clinic and staff exist
  const clinic = await getClinicById(params.clinicId)
  const staff = await findById<User>('users', params.staffId)
  
  if (!clinic || !staff || staff.role !== 'STAFF' || staff.clinicId !== params.clinicId) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" clinicId={params.clinicId} userId={params.staffId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
            Rooms Management
          </h1>
          <RoomsClient />
        </div>
      </main>
    </div>
  )
}