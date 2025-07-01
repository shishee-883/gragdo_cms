"use client"

import { UserList } from "@/components/shared/user-list"

interface StaffMember {
  id: number
  name: string
  availability: string    // e.g. "9am-5pm" or "N/A"
  avatar?: string
}

interface StaffListProps {
  staff: StaffMember[]
  clinicId: string
}

export function StaffList({ staff, clinicId }: StaffListProps) {
  // Transform incoming data into the shape UserList expects
  const transformedStaff = staff.map((member) => ({
    id: member.id.toString(),
    name: member.name,
    // You can supply a generic role label or pull from data if available
    role: "Staff",
    // Consider "N/A" or empty as unavailable
    isAvailable:
      member.availability.trim().toLowerCase() !== "n/a" &&
      member.availability.trim() !== "",
    // Forward the raw availability string for display
    status: member.availability,
    // Fallback avatar if none provided
    avatar: member.avatar ?? "/images/default-avatar.png",
  }))

  return (
    <UserList
      title="Staff"
      users={transformedStaff}
      actionLabel="Manage"
      actionUrl={`/admin/${clinicId}/staff`}
    />
  )
}
