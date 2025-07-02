"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { PrescriptionsClient } from "@/components/prescriptions/prescriptions-client"
import { getPrescriptions } from "@/lib/actions/prescriptions"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface PrescriptionsPageProps {
  params: {
    clinicId: string
    staffId: string
  }
}

export default function PrescriptionsPage({ params }: PrescriptionsPageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [staff, setStaff] = useState<User | null>(null)
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic and staff exist
        const fetchedClinic = await getClinicById(params.clinicId)
        const fetchedStaff = await findById<User>('users', params.staffId)
        
        if (!fetchedClinic || !fetchedStaff || 
            fetchedStaff.role !== 'STAFF' || 
            fetchedStaff.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)
        setStaff(fetchedStaff)

        // Get prescriptions for this clinic
        const fetchedPrescriptions = await getPrescriptions(params.clinicId)
        setPrescriptions(fetchedPrescriptions)
      } catch (error) {
        console.error('Error fetching prescriptions data:', error)
        setError('Failed to load prescriptions data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.clinicId, params.staffId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !clinic || !staff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading prescriptions"}</p>
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
          <PrescriptionsClient initialPrescriptions={prescriptions} />
        </div>
      </main>
    </div>
  )
}