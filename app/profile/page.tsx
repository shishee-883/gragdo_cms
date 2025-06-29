"use client"

import { Suspense, useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProfileClient } from "@/components/profile/profile-client"
import { getUserProfile } from "@/lib/actions/profile"
import { getCurrentUser } from "@/lib/actions/auth"
import { UserRole } from "@/lib/types"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          redirect('/login')
          return
        }
        
        const profile = await getUserProfile(currentUser.id)
        
        if (!profile) {
          redirect('/login')
          return
        }
        
        setUserProfile(profile)
      } catch (error) {
        console.error('Error loading profile:', error)
        redirect('/login')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
      </div>
    )
  }

  if (!userProfile) {
    return null // This should not happen as we redirect in the useEffect
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar 
        userRole={userProfile.role as UserRole} 
        clinicId={userProfile.clinic?.id} 
        userId={userProfile.id} 
      />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header 
          clinicName={userProfile.clinic?.name || "DigiGo Care"} 
          location={userProfile.clinic?.address?.split(',')[0] || ""}
        />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <Suspense fallback={
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">Loading profile...</p>
            </div>
          }>
            <ProfileClient initialProfile={userProfile} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}