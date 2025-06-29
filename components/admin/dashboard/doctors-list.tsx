import { UserList } from "@/components/shared/user-list"

interface Doctor {
  id: string
  name: string
  specialization: string
  isAvailable: boolean
  avatar?: string
}

interface DoctorsListProps {
  doctors: Doctor[]
}

export function DoctorsList({ doctors }: DoctorsListProps) {
  // Transform doctors data to match UserList interface
  const transformedDoctors = doctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    role: doctor.specialization,
    isAvailable: doctor.isAvailable,
    avatar: doctor.avatar
  }))

  return (
    <UserList 
      title="Doctors List"
      users={transformedDoctors}
      actionLabel="Manage"
      actionUrl="/admin/doctors"
    />
  )
}