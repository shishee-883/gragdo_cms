import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { BedsClient } from "@/components/rooms/beds/beds-client"
import { getBedsByRoom } from "@/lib/actions/beds"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface BedsPageProps {
  params: {
    clinicId: string
    staffId: string
    roomId: string
  }
}

export default async function BedsPage({ params }: BedsPageProps) {
  // Verify clinic and staff exist
  const clinic = await getClinicById(params.clinicId)
  const staff = await findById<User>('users', params.staffId)
  
  if (!clinic || !staff || staff.role !== 'STAFF' || staff.clinicId !== params.clinicId) {
    notFound()
  }

  const beds = await getBedsByRoom(params.roomId)

  if (!beds) {
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
              <p className="text-lg text-gray-500 font-sf-pro">Loading beds...</p>
            </div>
          }>
            <BedsClient roomId={params.roomId} initialBeds={beds} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}