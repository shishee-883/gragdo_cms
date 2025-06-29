"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, PenSquare, Trash2, Eye } from "lucide-react"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { deleteAppointment } from "@/lib/actions/appointments"
import { formatTime } from "@/lib/utils"

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

interface AdminAppointmentsClientProps {
  initialAppointments: Appointment[]
  patients: any[]
  doctors: any[]
}

export function AdminAppointmentsClient({ 
  initialAppointments, 
  patients, 
  doctors 
}: AdminAppointmentsClientProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [filteredAppointments, setFilteredAppointments] = useState(initialAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null)

  useEffect(() => {
    const filtered = appointments.filter((appointment) =>
      appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.patientId.includes(searchTerm) ||
      appointment.patient.phone.includes(searchTerm) ||
      appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAppointments(filtered)
    setCurrentPage(1)
  }, [searchTerm, appointments])

  const handleSubmit = async (data: any) => {
    console.log("Appointment data:", data)
    setIsFormOpen(false)
    setEditingAppointment(null)
  }

  const handleEdit = (id: string) => {
    setEditingAppointment(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteAppointment(id)
    if (result.success) {
      setAppointments(prev => prev.filter(a => a.id !== id))
    } else {
      console.error('Failed to delete appointment:', result.error)
    }
  }

  const handleView = (id: string) => {
    console.log('View appointment:', id)
  }

  // Pagination logic
  const totalRecords = filteredAppointments.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

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

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Appointments Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Schedule Appointment</span>
              <span className="sm:hidden">Schedule</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <AppointmentForm
              patients={patients}
              doctors={doctors}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Appointments
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
                <Select value={recordsPerPage} onValueChange={handleRecordsPerPageChange}>
                  <SelectTrigger className="h-10 w-[80px] rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative flex-1 lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Results Summary and Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} appointments
              {searchTerm && ` (filtered from ${appointments.length} total)`}
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-3 text-xs"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "digigo" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="h-8 w-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedAppointments.map((appointment, index) => (
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
                      <span>{formatTime(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concern:</span>
                      <span className="text-right">{appointment.concern}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(appointment.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(appointment.id)}>
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(appointment.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
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
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient's ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Gender</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Age</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Concern</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Doctor name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Time</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAppointments.map((appointment, index) => (
                    <TableRow
                      key={appointment.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px]"
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {startIndex + index + 1}
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
                        {formatTime(appointment.appointmentDate)}
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(appointment.id)}>
                            <Eye className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment.id)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment.id)}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No appointments found matching your search." : "No appointments found. Schedule your first appointment to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}