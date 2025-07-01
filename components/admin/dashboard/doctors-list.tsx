"use client"

import { UserList } from "@/components/shared/user-list"
import { useParams } from "next/navigation"

interface Doctor {
  id: number
  name: string
  specialization: string
  availability: string   // from backend: e.g. "9am-5pm" or "N/A"
  avatar?: string
}

interface DoctorsListProps {
  doctors: Doctor[],
  clinicId: string
}

export function DoctorsList({ doctors }: DoctorsListProps) {
  const { clinicId } = useParams()

  const transformedDoctors = doctors.map((doc) => ({
    id: doc.id.toString(),
    name: doc.name,
    role: doc.specialization,
    // mark available if availability isn’t “N/A” or empty
    isAvailable:
      doc.availability.trim().toLowerCase() !== "n/a" &&
      doc.availability.trim() !== "",
    // pass the raw availability into “status” so UserList can show it
    status: doc.availability,
    avatar: doc.avatar ?? "/images/default-avatar.png",
  }))

  return (
    <UserList
      title="Doctors"
      users={transformedDoctors}
      actionLabel="Manage"
      actionUrl={`/admin/${clinicId}/doctors`}
    />
  )
}
