import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RoomsClient } from "@/components/rooms/rooms-client"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AdminRoomsPageProps {
  params: {
    clinicId: string
    adminId: string
  }
}

export default async function AdminRoomsPage({ params }: AdminRoomsPageProps) {
  // Verify clinic and admin exist
  const clinic = await getClinicById(params.clinicId)
  const admin = await findById<User>('users', params.adminId)
  
  if (!clinic || !admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') || admin.clinicId !== params.clinicId) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole={admin.role} clinicId={params.clinicId} userId={params.adminId} />
      
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