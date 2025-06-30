import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AccountSettingsClient } from "@/components/settings/account-settings-client"
import { getUserProfile } from "@/lib/actions/profile"

export default async function SettingsPage() {
  const userProfile = await getUserProfile()

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          <AccountSettingsClient initialProfile={userProfile} />
        </div>
      </main>
    </div>
  )
}