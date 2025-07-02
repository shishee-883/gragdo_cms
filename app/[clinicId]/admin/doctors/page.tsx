"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminDoctorsClient } from "@/components/admin/doctors/admin-doctors-client"
import { useAuthToken } from '@/lib/hooks/useAuthToken'
import { User } from "@/lib/types"

interface AdminDoctorsPageProps {
  params: { clinicId: string }
}

export default function AdminDoctorsPage({ params }: AdminDoctorsPageProps) {
  const router = useRouter()
  const clinicId = params.clinicId
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuthToken()

  useEffect(() => {
    async function fetchData() {
      if (!token) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/get-clinic-users/${clinicId}/doctor`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        )

        const data = await res.json()
        setDoctors(data.users)

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch doctors')
        }

      } catch (error: any) {
        console.error('Error fetching doctors data:', error)
        setError(error.message || 'Failed to load doctors data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [clinicId, token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading doctors"}</p>
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
      <Sidebar userRole="ADMIN" clinicId={clinicId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header 
          clinicName={"clinic.name"} 
          location={("clinic.address || ''").split(',')[0] || 'Unknown'} 
        />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <AdminDoctorsClient doctors={doctors} clinicId={clinicId as string}/>
        </div>
      </main>
    </div>
  )
}
