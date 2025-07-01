// app/admin/[clinicId]/patients/[patientId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
// import { PatientDetailsClient } from '@/components/admin/patients/patient-details-client'
import { useAuthToken } from '@/lib/hooks/useAuthToken'

export default function PatientDetailsPage() {
  const { clinicId, patientId } = useParams()
  const router = useRouter()
  const { token } = useAuthToken()

  const [patient, setPatient] = useState<any>(null)
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/patients/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        if (res.status === 401) {
          if (isMounted) router.push('/login')
          return
        }
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        if (isMounted) setPatient(json)
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error(err)
          setError(err.message || 'Failed to load patient')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [patientId, token, router])

  if (error) return <div className="text-red-500 p-6">{error}</div>
  if (loading) return <div className="p-6">Loading patient...</div>

  // return <PatientDetailsClient patient={patient!} />
}
