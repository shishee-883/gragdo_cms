"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DoctorProfileClient } from "@/components/doctors/doctor-profile-client"
import { getDoctorById } from "@/lib/actions/doctors"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface DoctorProfilePageProps {
  params: {
    clinicId: string
    staffId: string
    doctorId: string
  }
}

export default function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [staff, setStaff] = useState<User | null>(null)
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic, staff, and doctor exist
        const [fetchedClinic, fetchedStaff, fetchedDoctor] = await Promise.all([
          getClinicById(params.clinicId),
          findById<User>('users', params.staffId),
          getDoctorById(params.doctorId)
        ])

        if (!fetchedClinic || !fetchedStaff || !fetchedDoctor || 
            fetchedStaff.role !== 'STAFF' || 
            fetchedStaff.clinicId !== params.clinicId || 
            fetchedDoctor.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)
        setStaff(fetchedStaff)
        setDoctor(fetchedDoctor)
      } catch (error) {
        console.error('Error fetching doctor profile:', error)
        setError('Failed to load doctor profile')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.clinicId, params.staffId, params.doctorId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !clinic || !staff || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading doctor profile"}</p>
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
      <Sidebar userRole="STAFF" clinicId={params.clinicId} userId={params.staffId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <DoctorProfileClient doctor={doctor} />
        </div>
      </main>
    </div>
  )
}