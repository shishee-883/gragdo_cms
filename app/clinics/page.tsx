"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthToken } from "@/lib/hooks/useAuthToken"
import { ClinicsClient } from "@/components/clinics/clinics-client"
import { Suspense } from "react"

// A simple skeleton: 6 placeholder cards
function SkeletonClinics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-4 space-y-4 bg-white rounded-2xl shadow animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-40 bg-gray-200 rounded" />
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 rounded flex-1" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ClinicsPage() {
  const router = useRouter()
  const { token } = useAuthToken()

  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    let isMounted = true
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/clinics/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        )

        if (res.status === 401) {
          if (isMounted) router.push("/login")
          return
        }
        if (!res.ok) throw new Error(`Error ${res.status}`)

        const data = await res.json()
        if (isMounted) setClinics(Array.isArray(data.clinic_list) ? data.clinic_list : [])
      } catch (err: any) {
        if (err.name !== "AbortError" && isMounted) {
          console.error(err)
          setError(err.message || "Failed to load clinics")
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [token, router])

  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500 font-sf-pro">{error}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#f4f3ff] p-4 md:p-6 lg:p-[34px]">
      {loading ? (
        <SkeletonClinics />
      ) : (
        <Suspense
          fallback={<SkeletonClinics />}
        >
          <ClinicsClient initialClinics={clinics} userRole="SUPER_ADMIN" />
        </Suspense>
      )}
    </div>
  )
}
