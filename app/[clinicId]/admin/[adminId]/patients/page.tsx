"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminPatientsClient } from "@/components/admin/patients/admin-patients-client"
import { getPatients } from "@/lib/actions/patients"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AdminPatientsPageProps {
  params: {
    clinicId: string
    adminId: string
  }
}

export default function AdminPatientsPage({ params }: AdminPatientsPageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [admin, setAdmin] = useState<User | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic and admin exist
        const fetchedClinic = await getClinicById(params.clinicId)
        const fetchedAdmin = await findById<User>('users', params.adminId)
        
        if (!fetchedClinic || !fetchedAdmin || 
            (fetchedAdmin.role !== 'ADMIN' && fetchedAdmin.role !== 'SUPER_ADMIN') || 
            fetchedAdmin.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)
        setAdmin(fetchedAdmin)

        // Fetch patients
        const fetchedPatients = await getPatients(params.clinicId)
        setPatients(fetchedPatients)
      } catch (error) {
        console.error('Error fetching patients data:', error)
        setError('Failed to load patients data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.clinicId, params.adminId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !clinic || !admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading patients"}</p>
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
      <Sidebar userRole={admin.role} clinicId={params.clinicId} userId={params.adminId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <AdminPatientsClient initialPatients={patients} />
        </div>
      </main>
    </div>
  )
}