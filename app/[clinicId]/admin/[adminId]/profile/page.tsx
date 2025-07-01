// app/profile/page.tsx

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ProfileClient } from "@/components/profile/profile-client"
// import { getUserProfile } from "@/lib/actions/profile"
import { getCurrentUser } from "@/lib/actions/auth"
// import { UserRole } from "@/lib/types"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const userProfile = await getCurrentUser()
  console.log("ss")
  if (!userProfile) {
    redirect("/login")
  }

  // 2. Fetch their profile
  // const userProfile = await getUserProfile(currentUser.id)
  // if (!userProfile) {
  //   redirect("/login")
  // }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">

      <main className="flex-1 overflow-auto">
        {/* <Header
          clinicName={userProfile.clinic?.name || "DigiGo Care"}
          location={userProfile.clinic?.address?.split(",")[0] || ""}
        /> */}

        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* 
            ProfileClient is a client component
            (it should start with "use client" in its own file).
            We pass the already-fetched data as a prop.
          */}
          <ProfileClient initialProfile={userProfile} />
        </div>
      </main>
    </div>
  )
}
