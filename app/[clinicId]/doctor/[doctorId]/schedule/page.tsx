"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorScheduleClient } from "@/components/doctor/schedule/doctor-schedule-client"
import { getAppointments } from "@/lib/actions/appointments"
import { getPatients } from "@/lib/actions/patients"
import { getClinicById } from "@/lib/actions/clinics"
import { getDoctorById } from "@/lib/actions/doctors"

interface DoctorSchedulePageProps {
  params: {
    clinicId: string
    doctorId: string
  }
}

export default function DoctorSchedulePage({ params }: DoctorSchedulePageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic and doctor exist
        const fetchedClinic = await getClinicById(params.clinicId)
        const fetchedDoctor = await getDoctorById(params.doctorId)
        
        if (!fetchedClinic || !fetchedDoctor || fetchedDoctor.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)
        setDoctor(fetchedDoctor)

        // Fetch appointments and patients in parallel
        const [fetchedAppointments, fetchedPatients] = await Promise.all([
          getAppointments(params.clinicId, params.doctorId),
          getPatients(params.clinicId)
        ])

        setAppointments(fetchedAppointments)
        setPatients(fetchedPatients)
      } catch (error) {
        console.error('Error fetching schedule data:', error)
        setError('Failed to load schedule data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.clinicId, params.doctorId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !clinic || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading schedule"}</p>
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
          <DoctorScheduleClient 
            initialAppointments={appointments}
            patients={patients}
          />
        </div>
      </main>
    </div>
  )
}