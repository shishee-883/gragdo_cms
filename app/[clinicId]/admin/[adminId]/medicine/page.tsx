import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MedicineClient } from "@/components/admin/medicine/medicine-client"
import { getMedicines } from "@/lib/actions/medicines"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AdminMedicinePageProps {
  params: {
    clinicId: string
    adminId: string
  }
}

export default async function AdminMedicinePage({ params }: AdminMedicinePageProps) {
  // Verify clinic and admin exist
  const clinic = await getClinicById(params.clinicId)
  const admin = await findById<User>('users', params.adminId)
  
  if (!clinic || !admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN') || admin.clinicId !== params.clinicId) {
    notFound()
  }

  const medicines = await getMedicines()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole={admin.role} clinicId={params.clinicId} userId={params.adminId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading medicines...</p>
            </div>
          }>
            <MedicineClient initialMedicines={medicines} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}