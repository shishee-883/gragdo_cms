"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { getClinics } from "@/lib/actions/clinics"
import { getUserProfile } from "@/lib/actions/profile"
import { redirect, useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/actions/auth"
import { useAuthToken } from "@/lib/hooks/useAuthToken"

export default function ClinicsPage() {
  const router = useRouter()
  const { token } = useAuthToken()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the current user
        const user = await getCurrentUser(token)
        setCurrentUser(user)
        
        // If no user is logged in, redirect to login
        if (!user) {
          router.push('/login')
          return
        }
        
        // Get the current user profile
        const profile = await getUserProfile(user.id)
        setUserProfile(profile)
        
        // If no user is logged in or user is not a super admin, redirect to login
        if (!profile || profile.role !== 'SUPER_ADMIN') {
          router.push('/login')
          return
        }
        
        // Get all clinics
        const fetchedClinics = await getClinics(token)
        
        // Filter clinics based on user's clinicIds if they exist
        const filteredClinics = fetchedClinics
        setClinics(filteredClinics)
      } catch (error) {
        console.error('Error in clinics page:', error)
        setError('Failed to load clinics')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, router])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1] mx-auto"></div>
        <p className="mt-4 text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500 font-sf-pro">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 font-sf-pro">Loading clinics...</p>
        </div>
      }>
        <ClinicsClient 
          initialClinics={clinics} 
          userRole={userProfile?.role || "SUPER_ADMIN"}
        />
      </Suspense>
    </div>
  )
}