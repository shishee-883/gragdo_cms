"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { AdminStatsCards } from "@/components/admin/dashboard/admin-stats-cards"
import { DailyRevenueReport } from "@/components/admin/dashboard/daily-revenue-report"
import { DoctorsList } from "@/components/admin/dashboard/doctors-list"
import { StaffList } from "@/components/admin/dashboard/staff-list"
import { TransactionHistory } from "@/components/admin/dashboard/transaction-history"
import { AdminAppointments } from "@/components/admin/dashboard/admin-appointments"
import { getAdminDashboardStats, getAdminDoctors, getAdminStaff, getAdminTransactions, getAdminAppointments } from "@/lib/actions/admin-dashboard"
import { getClinicById } from "@/lib/actions/clinics"
import { findById } from "@/lib/db"
import { User } from "@/lib/types"

interface AdminDashboardPageProps {
  params: {
    clinicId: string
    adminId: string
  }
}

export default function AdminDashboardPage({ params }: AdminDashboardPageProps) {
  const router = useRouter()
  const [clinic, setClinic] = useState<any>(null)
  const [admin, setAdmin] = useState<User | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
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

        // Fetch all dashboard data in parallel
        const [
          fetchedStats, 
          fetchedDoctors, 
          fetchedStaff, 
          fetchedTransactions, 
          fetchedAppointments
        ] = await Promise.all([
          getAdminDashboardStats(params.clinicId),
          getAdminDoctors(params.clinicId),
          getAdminStaff(params.clinicId),
          getAdminTransactions(params.clinicId),
          getAdminAppointments(params.clinicId)
        ])

        setStats(fetchedStats)
        setDoctors(fetchedDoctors)
        setStaff(fetchedStaff)
        setTransactions(fetchedTransactions)
        setAppointments(fetchedAppointments)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
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
      <Sidebar userRole={admin.role} clinicId={params.clinicId} userId={params.adminId} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header clinicName={clinic.name} location={clinic.address.split(',')[0]} />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Stats Cards */}
          <div className="mb-6">
            <AdminStatsCards stats={stats} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Daily Revenue Report */}
            <div className="lg:col-span-1">
              <DailyRevenueReport clinicId={params.clinicId} />
            </div>

            {/* Doctors List */}
            <div className="lg:col-span-1">
              <DoctorsList doctors={doctors} clinicId={params.clinicId} />
            </div>

            {/* Staff List */}
            <div className="lg:col-span-1">
              <StaffList staff={staff} clinicId={params.clinicId} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Transaction History */}
            <div className="xl:col-span-1">
              <TransactionHistory transactions={transactions} clinicId={params.clinicId} />
            </div>

            {/* Appointments */}
            <div className="xl:col-span-1">
              <AdminAppointments appointments={appointments} clinicId={params.clinicId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}