import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AppointmentsClient } from "@/components/appointments/appointments-client"
import { getAppointments } from "@/lib/actions/appointments"
import { getPatients } from "@/lib/actions/patients"
import { getDoctors } from "@/lib/actions/doctors"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AppointmentsPageProps {
  params: {
    clinicId: string
    staffId: string
  }
}

export default async function AppointmentsPage({ params }: AppointmentsPageProps) {
  // Verify clinic and staff exist
  const clinic = await getClinicById(params.clinicId)
  const staff = await findById<User>('users', params.staffId)
  
  if (!clinic || !staff || staff.role !== 'STAFF' || staff.clinicId !== params.clinicId) {
    notFound()
  }

  const [appointments, patients, doctors] = await Promise.all([
    getAppointments(params.clinicId),
    getPatients(params.clinicId),
    getDoctors(params.clinicId)
  ])

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="STAFF" clinicId={params.clinicId} userId={params.staffId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading appointments...</p>
            </div>
          }>
            <AppointmentsClient 
              initialAppointments={appointments}
              patients={patients}
              doctors={doctors}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}