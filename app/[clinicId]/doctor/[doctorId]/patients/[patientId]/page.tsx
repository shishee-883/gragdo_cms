import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PatientDetailsClient } from "@/components/doctor/patients/patient-details-client"
import { getPatientById } from "@/lib/actions/patients"
import { getClinicById } from "@/lib/actions/clinics"
import { getDoctorById } from "@/lib/actions/doctors"

interface PatientDetailsPageProps {
  params: {
    clinicId: string
    doctorId: string
    patientId: string
  }
}

export default async function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  // Verify clinic, doctor, and patient exist
  const clinic = await getClinicById(params.clinicId)
  const doctor = await getDoctorById(params.doctorId)
  const patient = await getPatientById(params.patientId)
  
  if (!clinic || !doctor || !patient || doctor.clinicId !== params.clinicId || patient.clinicId !== params.clinicId) {
    notFound()
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" clinicId={params.clinicId} userId={params.doctorId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading patient details...</p>
            </div>
          }>
            <PatientDetailsClient patient={patient} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}