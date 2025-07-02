"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentTable } from "@/components/appointments/appointment-table"
import { DoctorsActivity } from "@/components/dashboard/doctors-activity"
import { RecentReports } from "@/components/dashboard/recent-reports"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter } from "lucide-react"
import { getDashboardStats, getRecentAppointments, getDoctorsActivity, getRecentReports } from "@/lib/actions/dashboard"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { getUserProfile } from "@/lib/actions/profile"
import { User } from "@/lib/types"

interface StaffDashboardPageProps {
  params: {
    clinicId: string
    staffId: string
  }
}

export default function StaffDashboardPage({ params }: StaffDashboardPageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [staff, setStaff] = useState<User | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctorsActivity, setDoctorsActivity] = useState<any[]>([])
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Verify clinic exists
        const fetchedClinic = await getClinicById(params.clinicId)
        if (!fetchedClinic) {
          router.push('/not-found')
          return
        }

        setClinic(fetchedClinic)

        // Handle staff verification - use mock profile for 'default-user'
        let fetchedStaff: User | null = null
        
        if (params.staffId === 'default-user') {
          // Use mock user profile for demo mode - call without token to get default profile
          const mockProfile = await getUserProfile('default-user')
          // Ensure the mock user has the correct role and clinic association
          if (mockProfile) {
            fetchedStaff = {
              id: mockProfile.id,
              name: mockProfile.name,
              email: mockProfile.email,
              password: 'password123', // Mock password
              phone: mockProfile.phone,
              role: 'STAFF',
              clinicId: params.clinicId,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        } else {
          // Find real user in database
          fetchedStaff = await findById<User>('users', params.staffId)
        }
        
        if (!fetchedStaff || fetchedStaff.role !== 'STAFF' || fetchedStaff.clinicId !== params.clinicId) {
          router.push('/not-found')
          return
        }

        setStaff(fetchedStaff)

        // Fetch dashboard data in parallel
        const [statsRaw, fetchedAppointments, fetchedDoctorsActivity, fetchedRecentReports] = await Promise.all([
          getDashboardStats(params.clinicId),
          getRecentAppointments(params.clinicId),
          getDoctorsActivity(params.clinicId),
          getRecentReports(params.clinicId)
        ])

        // Map the stats properties to match what StatsCards expects
        const mappedStats = {
          appointments: statsRaw.todayAppointments,
          totalPatients: statsRaw.totalPatients,
          checkIns: statsRaw.checkIns,
          availableDoctors: statsRaw.availableDoctors
        }

        setStats(mappedStats)
        setAppointments(fetchedAppointments)
        setDoctorsActivity(fetchedDoctorsActivity)
        setRecentReports(fetchedRecentReports)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
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

  if (error || !clinic || !staff || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error || "Error loading dashboard"}</p>
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
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Time Filter and Add Patient */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mt-6 lg:mt-[30px]">
            <Tabs defaultValue="today" className="w-full lg:w-[561px]">
              <TabsList className="w-full h-[50px] md:h-[54px] p-0 bg-white rounded-2xl grid grid-cols-3">
                <TabsTrigger
                  value="today"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="yesterday"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  Yesterday
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
                >
                  This Month
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-[50px] md:w-[54px] h-[50px] md:h-[54px] bg-white rounded-[10.8px] flex items-center justify-center">
                <Filter className="w-[20px] h-[23px] md:w-[23px] md:h-[26px] text-[#7165e1]" />
              </div>
              <Button variant="digigo" size="digigo" className="w-full sm:w-[180px] md:w-[200px] h-[50px] md:h-[54px] text-sm md:text-base">
                <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                Add Patient
              </Button>
            </div>
          </div>

          {/* Appointments Table - Full Width */}
          <div className="mt-8 lg:mt-[50px]">
            <AppointmentTable appointments={appointments} />
          </div>

          {/* Bottom Section: Doctor's Activity and Recent Reports */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {/* Doctor's Activity */}
            <div className="xl:col-span-1">
              <DoctorsActivity doctors={doctorsActivity} />
            </div>

            {/* Recent Reports */}
            <div className="xl:col-span-1">
              <RecentReports reports={recentReports} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}