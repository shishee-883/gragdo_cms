"use client";

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface Appointment {
  id: string
  sNo: number
  name: string
  phoneNumber: string
  email: string
  age: number
  gender: string
  action: 'Accept' | 'Decline'
}

interface AdminAppointmentsProps {
  appointments: Appointment[]
}

export function AdminAppointments({ appointments }: AdminAppointmentsProps) {
  const [appointmentList, setAppointmentList] = useState(appointments);

  const handleAction = (appointmentId: string, action: 'Accept' | 'Decline') => {
    console.log(`${action} appointment:`, appointmentId);
    // In a real app, you would call an API to update the appointment status
  }

  const columns = [
    { key: 'sNo', label: 'S.No' },
    { key: 'name', label: 'Name' },
    { key: 'phoneNumber', label: 'Phone number' },
    { key: 'email', label: 'Email' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'action', label: 'Action' }
  ]

  const renderCell = (item: Appointment, column: any) => {
    if (column.key === 'action') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-7 rounded"
            onClick={() => handleAction(item.id, 'Accept')}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="text-xs px-3 py-1 h-7 rounded"
            onClick={() => handleAction(item.id, 'Decline')}
          >
            Decline
          </Button>
        </div>
      )
    }
    return item[column.key as keyof Appointment]
  }

  return (
    <DataTable
      title="Appointments"
      columns={columns}
      data={appointmentList}
      actionLabel="View All"
      onAction={() => console.log('View all appointments')}
      renderCell={renderCell}
    />
  )
}