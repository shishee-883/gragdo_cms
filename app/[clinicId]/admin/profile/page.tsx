"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProfileClient } from "@/components/profile/profile-client"
import { getUserProfile } from "@/lib/actions/profile"
import { getCurrentUser } from "@/lib/actions/auth"

export default function ProfilePage({ params }: { params: { clinicId: string, adminId: string } }) {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Get current user
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push("/login")
          return
        }

        // Get user profile
        const profile = await getUserProfile(currentUser.id)
        
        if (!profile) {
          router.push("/login")
          return
        }
        
        setUserProfile(profile)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading profile"}</p>
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
      <Sidebar 
        userRole={userProfile.role} 
        clinicId={params.clinicId} 
        userId={params.adminId} 
      />
      
      <main className="flex-1 overflow-auto">
        <Header
          clinicName={userProfile.clinic?.name || "DigiGo Care"}
          location={userProfile.clinic?.address?.split(",")[0] || ""}
        />

        <div className="p-4 md:p-6 lg:p-[34px]">
          <ProfileClient initialProfile={userProfile} />
        </div>
      </main>
    </div>
  )
}