'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patients/details/${patientId}`,
          {
            method: 'POST', // Changed from GET to POST
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
            body: JSON.stringify({ clinic_id: clinicId }), // Added clinic_id to request body
          }
        )

        if (res.status === 401) {
          if (isMounted) router.push('/login')
          return
        }

        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()

        if (!json.success) throw new Error(json.message || 'Failed to fetch patient details')

        if (isMounted) setPatient(json.patient)
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
  }, [patientId, clinicId, token, router])

  if (error) return <div className="text-red-500 p-6">{error}</div>
  if (loading) return <div className="p-6">Loading patient...</div>

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-[#7165e1]">{patient.name}</h2>
      <div>
        <strong>Email:</strong> {patient.email || 'N/A'}
      </div>
      <div>
        <strong>Phone:</strong> {patient.phone_number}
      </div>
      <div>
        <strong>Gender:</strong> {patient.gender}
      </div>
      <div>
        <strong>Age:</strong> {patient.age}
      </div>
      <div>
        <strong>Address:</strong> {patient.address || 'N/A'}
      </div>
      <div>
        <strong>Medical History:</strong> {patient.medical_history || 'N/A'}
      </div>

      <div>
        <h3 className="text-xl font-semibold">Reports</h3>
        {patient.reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          patient.reports.map((report: any) => (
            <div key={report.id} className="mt-2">
              <div className="font-medium">{report.report_name}</div>
              <div className="text-sm">{report.description || 'No description'}</div>
              <a
                href={report.report_file}
                target="_blank"
                className="text-[#7165e1] underline"
              >
                View Report
              </a>
            </div>
          ))
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold">Prescriptions</h3>
        {patient.prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          patient.prescriptions.map((prescription: any) => (
            <div key={prescription.id} className="mt-2">
              <div className="font-medium">Prescription ID: {prescription.id}</div>
              <div className="text-sm">{prescription.prescription_details}</div>
              <a
                href={prescription.prescription_file}
                target="_blank"
                className="text-[#7165e1] underline"
              >
                View Prescription
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
