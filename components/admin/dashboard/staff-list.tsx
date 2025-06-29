import { UserList } from "@/components/shared/user-list"

interface Staff {
  id: string
  name: string
  role: string
  isAvailable: boolean
  avatar?: string
}

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  return (
    <UserList 
      title="Staff List"
      users={staff}
      actionLabel="Manage"
      actionUrl="/admin/staffs"
    />
  )
}