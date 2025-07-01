'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthToken } from '@/lib/hooks/useAuthToken'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AdminStatsCards } from '@/components/admin/dashboard/admin-stats-cards'
import { DailyRevenueReport } from '@/components/admin/dashboard/daily-revenue-report'
import { DoctorsList } from '@/components/admin/dashboard/doctors-list'
import { StaffList } from '@/components/admin/dashboard/staff-list'
import { TransactionHistory } from '@/components/admin/dashboard/transaction-history'
import { AdminAppointments } from '@/components/admin/dashboard/admin-appointments'
import { User } from '@/lib/types'

interface PageProps {
  params: { clinicId: string; adminId: string }
}

// — Skeleton loader for dashboard
function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      {/* Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  )
}

export default function AdminDashboardPage({ params }: PageProps) {
  const router = useRouter()
  const { token } = useAuthToken()
  const clinicId = params.clinicId

  const [clinic, setClinic] = useState<any>(null)
  const [admin, setAdmin] = useState<User | null>(null)
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_staff: 0,
    total_appointments: 0,
  })
  const [revenueReport, setRevenueReport] = useState<Record<string, number>>({})
  const [doctors, setDoctors] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    let isMounted = true
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        // 1️⃣ Fetch clinic + admin info
        const clinicRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/get-admin-dashboard/${clinicId}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        if (clinicRes.status === 401) {
          if (isMounted) router.push('/login')
          return
        }
        if (!clinicRes.ok) throw new Error(`Error ${clinicRes.status}`)

        const clinicJson = await clinicRes.json()
        if (!clinicJson.status) throw new Error(clinicJson.message || 'Failed to fetch clinic')

        if (isMounted) {
          setClinic(clinicJson.data.clinic)
          setAdmin(clinicJson.data.created_by)
        }

        // 2️⃣ Fetch dashboard metrics
        const dashRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/get-admin-dashboard/${clinicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        if (dashRes.status === 401) {
          if (isMounted) router.push('/login')
          return
        }
        if (!dashRes.ok) throw new Error(`Error ${dashRes.status}`)

        const dashJson = await dashRes.json()
        if (!dashJson.status) throw new Error(dashJson.message || 'Failed to fetch dashboard')

        if (isMounted) {
          const {
            total_patients,
            total_doctors,
            total_staff,
            total_appointments,
            revenue_report,
            doctors: docs,
            staff: stf,
            transactions: txns,
            appointments: appts,
          } = dashJson.data

          setStats({ total_patients, total_doctors, total_staff, total_appointments })
          setRevenueReport(revenue_report)
          setDoctors(docs)
          setStaff(stf)
          setTransactions(txns)
          setAppointments(appts)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error(err)
          setError(err.message || 'Failed to load dashboard')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [token, clinicId, router])

  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500 font-sf-pro">{error}</p>
      </div>
    )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
        <SkeletonDashboard />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole={"ADMIN"} clinicId={clinicId} userId={params.adminId} />

      <main className="flex-1 overflow-auto">
        <Header clinicName={"clinic.name"} location={"clinic.address.split(',')[0]"} />

        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Stats Cards */}
          <div className="mb-6">
            <AdminStatsCards stats={stats} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <DailyRevenueReport data={revenueReport} onViewMore={() => router.push(`/reports/${clinicId}`)} />
            <DoctorsList doctors={doctors} clinicId={clinicId} />
            <StaffList staff={staff} clinicId={clinicId} />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TransactionHistory transactions={transactions} clinicId={clinicId} />
            <AdminAppointments appointments={appointments} clinicId={clinicId} />
          </div>
        </div>
      </main>
    </div>
  )
}
