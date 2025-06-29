"use client";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PenSquare, Trash2, MoreHorizontal } from "lucide-react"
import { formatTime } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppointmentStatus } from "@/lib/types"

interface Appointment {
  id: string
  patient: {
    patientId: string
    name: string
    phone: string
    gender: string
    age: number
  }
  doctor: {
    name: string
  }
  appointmentDate: Date
  duration: number
  concern: string
  status: string
}

interface AppointmentTableProps {
  appointments: Appointment[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function AppointmentTable({ appointments, onEdit, onDelete }: AppointmentTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'completed'
      case 'IN_PROGRESS':
        return 'inProgress'
      case 'PENDING':
        return 'pending'
      default:
        return 'pending'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'In Progress'
      case 'COMPLETED':
        return 'Completed'
      case 'PENDING':
        return 'Pending'
      default:
        return status
    }
  }

  const safeFormatTime = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    try {
      return formatTime(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-4 md:p-6 lg:p-[34px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
            Appointments
          </h2>
          <Button
            variant="link"
            className="text-[#7165e1] text-sm md:text-base font-sf-pro font-medium"
          >
            View All
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {appointments.map((appointment, index) => (
            <Card key={appointment.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#7165e1]">
                      {appointment.patient.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {appointment.patient.patientId}
                    </p>
                  </div>
                  <Badge
                    variant={getStatusVariant(appointment.status)}
                    className="rounded-[20px] text-xs"
                  >
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{appointment.patient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span>{appointment.patient.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span>{appointment.doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>{safeFormatTime(appointment.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concern:</span>
                    <span className="text-right">{appointment.concern}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(appointment.id)}>
                        <PenSquare className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete?.(appointment.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                <TableRow>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    S.No
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Patient's ID
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Name
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Phone
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Gender
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Age
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Concern
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Doctor name
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Time
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment, index) => (
                  <TableRow
                    key={appointment.id}
                    className="bg-[#f4f3ff] rounded-[10px] my-[10px]"
                  >
                    <TableCell className="text-base text-black font-sf-pro">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.patient.patientId}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.patient.name}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.patient.phone}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.patient.gender}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.patient.age}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.concern}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {appointment.doctor.name}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {safeFormatTime(appointment.appointmentDate)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(appointment.status)}
                        className="rounded-[40px] text-base font-sf-pro"
                      >
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(appointment.id)}
                        >
                          <PenSquare className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete?.(appointment.id)}
                        >
                          <Trash2 className="w-[23px] h-[23px]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}