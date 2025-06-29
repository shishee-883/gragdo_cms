"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, PenSquare, Trash2, MoreHorizontal } from "lucide-react"
import { updateAppointment } from "@/lib/actions/appointments"

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
  time?: string
}

interface DoctorAppointmentsClientProps {
  initialAppointments: Appointment[]
  patients: any[]
  doctors: any[]
}

export function DoctorAppointmentsClient({ 
  initialAppointments, 
  patients, 
  doctors 
}: DoctorAppointmentsClientProps) {
  // Transform appointments to include time in the format shown in the screenshot
  const transformedAppointments = initialAppointments.map((appointment) => {
    const date = new Date(appointment.appointmentDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Format hours for 12-hour clock
    const formattedHours = hours % 12 || 12;
    
    // Create time strings like "09:30 AM", "10:00 AM", etc.
    const timeString = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    return {
      ...appointment,
      time: timeString
    };
  });

  const [appointments, setAppointments] = useState(transformedAppointments)
  const [filteredAppointments, setFilteredAppointments] = useState(transformedAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("today")

  useEffect(() => {
    // Filter appointments based on search term
    let filtered = appointments;
    
    // Apply tab filter
    if (activeTab === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= today && appointmentDate < tomorrow;
      });
    } else if (activeTab === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= yesterday && appointmentDate < today;
      });
    } else if (activeTab === "month") {
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      const nextMonth = new Date(firstDayOfMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= firstDayOfMonth && appointmentDate < nextMonth;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((appointment) =>
        appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient.patientId.includes(searchTerm) ||
        appointment.patient.phone.includes(searchTerm) ||
        appointment.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchTerm, appointments, activeTab]);

  const handleEdit = (id: string) => {
    console.log('Edit appointment:', id);
  }

  const handleDelete = (id: string) => {
    console.log('Delete appointment:', id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Update the appointment status in the UI immediately for better UX
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: newStatus } 
            : appointment
        )
      );
      
      // Call the server action to update the status in the database
      const result = await updateAppointment(id, { status: newStatus as any });
      
      if (!result.success) {
        // If the update fails, revert the UI change
        console.error('Failed to update appointment status:', result.error);
        setAppointments(prev => 
          prev.map(appointment => 
            appointment.id === id 
              ? { ...appointment, status: appointment.status } 
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  }

  // Pagination logic
  const totalRecords = filteredAppointments.length;
  const recordsPerPageNum = parseInt(recordsPerPage);
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum);
  const startIndex = (currentPage - 1) * recordsPerPageNum;
  const endIndex = startIndex + recordsPerPageNum;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'completed';
      case 'IN_PROGRESS':
        return 'inProgress';
      case 'PENDING':
        return 'pending';
      default:
        return 'pending';
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  }

  return (
    <div>
      {/* Tabs for time filtering */}
      <div className="mb-6">
        <Tabs defaultValue="today" className="w-full lg:w-[561px]" onValueChange={setActiveTab}>
          <TabsList className="w-full h-[50px] md:h-[54px] p-0 bg-white rounded-2xl grid grid-cols-3">
            <TabsTrigger
              value="today"
              className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="yesterday"
              className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
            >
              Yesterday
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="h-[50px] md:h-[54px] data-[state=active]:bg-[#7165e1] data-[state=active]:text-white text-[#888888] text-base md:text-xl rounded-2xl font-sf-pro font-semibold"
            >
              This Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-[20px] shadow-sm p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Appointments</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Records Per Page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Display</span>
              <Select defaultValue={recordsPerPage} onValueChange={handleRecordsPerPageChange}>
                <SelectTrigger className="h-10 w-[80px] rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">records per page</span>
            </div>

            {/* Filter Button */}
            <div className="w-[50px] h-[50px] bg-white border border-gray-200 rounded-[10.8px] flex items-center justify-center">
              <Filter className="w-[20px] h-[23px] text-[#7165e1]" />
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Patient Button */}
            <Button variant="digigo" size="digigo" className="w-full sm:w-[180px] md:w-[200px] h-[50px] text-sm md:text-base">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Time</TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Duration</TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.map((appointment, index) => (
                <TableRow key={appointment.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
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
                    {appointment.time}
                  </TableCell>
                  <TableCell className="text-base text-black font-sf-pro">
                    {appointment.duration} Min
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 p-0">
                          <Badge
                            variant={getStatusVariant(appointment.status)}
                            className="rounded-[40px] text-base font-sf-pro cursor-pointer"
                          >
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}>
                          <Badge variant="completed" className="rounded-[40px] mr-2">
                            Completed
                          </Badge>
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'IN_PROGRESS')}>
                          <Badge variant="inProgress" className="rounded-[40px] mr-2">
                            In Progress
                          </Badge>
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'PENDING')}>
                          <Badge variant="pending" className="rounded-[40px] mr-2">
                            Pending
                          </Badge>
                          Mark as Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages || 1}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <Button
              variant="digigo"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {currentPage}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}