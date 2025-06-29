import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminPrescriptionsClient } from "@/components/admin/prescriptions/admin-prescriptions-client"
import { getPrescriptions } from "@/lib/actions/prescriptions"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AdminPrescriptionsPageProps {
  params: {
    clinicId: string
    adminId: string
  }
}

export default async function AdminPrescriptionsPage({ params }: AdminPrescriptionsPageProps) {
  // Verify clinic and admin exist
  const clinic = await getClinicById(params.clinicId)
  const admin = await findById<User>('users', params.adminId)
  
  if (!clinic || !admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') || admin.clinicId !== params.clinicId) {
    notFound()
  }

  const prescriptions = await getPrescriptions(params.clinicId)

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole={admin.role} clinicId={params.clinicId} userId={params.adminId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading prescriptions...</p>
            </div>
          }>
            <AdminPrescriptionsClient initialPrescriptions={prescriptions} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}