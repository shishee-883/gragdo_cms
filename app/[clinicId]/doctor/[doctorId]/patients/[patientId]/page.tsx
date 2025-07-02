"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic, doctor, and patient exist
        const [fetchedClinic, fetchedDoctor, fetchedPatient] = await Promise.all([
          getClinicById(params.clinicId),
          getDoctorById(params.doctorId),
          getPatientById(params.patientId)
        ])
        
        if (!fetchedClinic || !fetchedDoctor || !fetchedPatient || 
            fetchedDoctor.clinicId !== params.clinicId || 
            fetchedPatient.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)
        setDoctor(fetchedDoctor)
        setPatient(fetchedPatient)
      } catch (error) {
        console.error('Error fetching patient details:', error)
        setError('Failed to load patient details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.clinicId, params.doctorId, params.patientId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !clinic || !doctor || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading patient details"}</p>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-[#7165e1] text-white rounded-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="DOCTOR" clinicId={params.clinicId} userId={params.doctorId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <PatientDetailsClient patient={patient} />
        </div>
      </main>
    </div>
  )
}