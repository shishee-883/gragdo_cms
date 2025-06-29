"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
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
import { 
  Star, 
  Users, 
  Stethoscope, 
  MessageSquare, 
  Calendar,
  Search,
  PenSquare,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail
} from "lucide-react"
import { formatTime } from "@/lib/utils"
import { updateDoctor } from "@/lib/actions/doctors"
import { useSession } from "@/components/auth/session-provider"

interface Doctor {
  id: string
  name: string
  email?: string
  phone: string
  specialization: string
  qualification?: string
  experience?: number
  consultationFee?: number
  isAvailable: boolean
  schedules?: any[]
  appointments?: any[]
}

interface DoctorProfileClientProps {
  doctor: Doctor
}

export function DoctorProfileClient({ doctor }: DoctorProfileClientProps) {
  const { user } = useSession()
  // Mock data for demonstration
  const mockStats = {
    patients: 3000,
    surgeries: 1000,
    reviews: 2000
  }

  const mockRating = 4.8
  const mockReviews = [
    {
      id: '1',
      patientName: 'M. Anushka',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      patientName: 'M. Anushka',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      date: new Date('2024-01-10')
    },
    {
      id: '3',
      patientName: 'M. Anushka',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      date: new Date('2024-01-08')
    },
    {
      id: '4',
      patientName: 'M. Anushka',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      date: new Date('2024-01-05')
    }
  ]

  // Mock today's appointments
  const mockTodayAppointments = [
    {
      id: '1',
      patientId: '123456',
      patientName: 'K. Vijay',
      gender: 'M',
      age: 22,
      concern: 'Heart problem',
      time: '09:00 AM - 09:15 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '2',
      patientId: '454575',
      patientName: 'P. Sandeep',
      gender: 'M',
      age: 30,
      concern: 'General checkup',
      time: '09:15 AM - 09:30 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '3',
      patientId: '787764',
      patientName: 'Ch. Asritha',
      gender: 'F',
      age: 25,
      concern: 'PCOD',
      time: '09:30 AM - 09:45 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '4',
      patientId: '454215',
      patientName: 'P. Ravi',
      gender: 'M',
      age: 32,
      concern: 'Kidney disease',
      time: '09:45 AM - 10:00 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '5',
      patientId: '498465',
      patientName: 'A. Srikanth',
      gender: 'M',
      age: 32,
      concern: 'Heart problem',
      time: '10:00 AM - 10:15 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '6',
      patientId: '454215',
      patientName: 'P. Ravi',
      gender: 'M',
      age: 32,
      concern: 'Kidney disease',
      time: '10:15 AM - 10:30 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '7',
      patientId: '498465',
      patientName: 'A. Srikanth',
      gender: 'M',
      age: 32,
      concern: 'Heart problem',
      time: '11:00 AM - 11:15 AM',
      duration: '15 Min',
      status: 'Completed'
    },
    {
      id: '8',
      patientId: '454215',
      patientName: 'P. Ravi',
      gender: 'M',
      age: 32,
      concern: 'Kidney disease',
      time: '11:15 AM - 11:30 AM',
      duration: '15 Min',
      status: 'Pending'
    },
    {
      id: '9',
      patientId: '498465',
      patientName: 'A. Srikanth',
      gender: 'M',
      age: 32,
      concern: 'Heart problem',
      time: '11:30 AM - 11:45 AM',
      duration: '15 Min',
      status: 'Pending'
    },
    {
      id: '10',
      patientId: '454215',
      patientName: 'P. Ravi',
      gender: 'M',
      age: 32,
      concern: 'Kidney disease',
      time: '11:45 AM - 12:00 PM',
      duration: '15 Min',
      status: 'Pending'
    }
  ]

  const [appointments, setAppointments] = useState(mockTodayAppointments)
  const [filteredAppointments, setFilteredAppointments] = useState(mockTodayAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAvailable, setIsAvailable] = useState(doctor.isAvailable)

  useEffect(() => {
    // Filter appointments based on search term
    const filtered = appointments.filter((appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.includes(searchTerm) ||
      appointment.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAppointments(filtered)
    setCurrentPage(1)
  }, [searchTerm, appointments])

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
      case 'Completed':
        return 'completed'
      case 'In Progress':
        return 'inProgress'
      case 'Pending':
        return 'pending'
      default:
        return 'pending'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getAvailabilitySchedule = () => {
    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
    
    return [
      { day: 'Mon', time: '9 AM - 2 PM', isToday: today === 1 },
      { day: 'Tue', time: '9 AM - 2 PM', isToday: today === 2 },
      { day: 'Wed', time: '9 AM - 2 PM', isToday: today === 3 },
      { day: 'Thu', time: '9 AM - 2 PM', isToday: today === 4 },
      { day: 'Fri', time: '9 AM - 2 PM', isToday: today === 5 },
      { day: 'Sat', time: '9 AM - 2 PM', isToday: today === 6 },
      { day: 'Sun', time: 'NA', isToday: today === 0 }
    ]
  }

  const availabilitySchedule = getAvailabilitySchedule()

  const handleToggleAvailability = async () => {
    try {
      const result = await updateDoctor(doctor.id, {
        isAvailable: !isAvailable
      })
      
      if (result.success) {
        setIsAvailable(!isAvailable)
      } else {
        console.error("Failed to update doctor availability:", result.error)
      }
    } catch (error) {
      console.error("Error updating doctor availability:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>Doctors</span>
        <span className="mx-2">/</span>
        <span className="text-[#7165e1]">Doctor's Profile</span>
      </div>

      {/* Doctor Profile Header - Updated with image on left */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Doctor Info Card - Updated with image layout */}
        <Card className="lg:col-span-1 rounded-[20px] border-none shadow-sm">
          <CardContent className="p-4 md:p-6">
            {/* Doctor Image and Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex-shrink-0">
                <AvatarImage 
                  src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2" 
                  alt={doctor.name}
                />
                <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-lg rounded-2xl">
                  {doctor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-sf-pro font-semibold text-[#7165e1] mb-1 truncate">
                  {doctor.name}
                </h3>
                <p className="text-gray-600 font-sf-pro text-sm md:text-base truncate mb-2">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {doctor.experience} Years of Experience
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(mockRating)}
                  <span className="text-xs text-gray-600 ml-1">{mockStats.reviews} Reviews</span>
                </div>
                <Badge 
                  variant={isAvailable ? "completed" : "pending"}
                  className="rounded-full text-xs"
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-xs md:text-sm">
              {doctor.qualification && (
                <p className="text-gray-600">
                  <strong>Qualification:</strong> {doctor.qualification}
                </p>
              )}
              {doctor.consultationFee && (
                <p className="text-gray-600">
                  <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                </p>
              )}
            </div>

            <div className="space-y-2 mb-4 text-xs md:text-sm">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{doctor.phone}</span>
              </div>
              {doctor.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{doctor.email}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{doctor.appointments?.length || 0} upcoming appointments</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm">
                Edit
              </Button>
              <Button 
                variant={isAvailable ? "outline" : "digigo"} 
                size="sm" 
                className="flex-1 text-xs md:text-sm"
                onClick={handleToggleAvailability}
              >
                {isAvailable ? "Set Unavailable" : "Set Available"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Reduced padding */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Patients</p>
              <p className="text-xl font-bold text-[#7165e1]">{mockStats.patients}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Surgeries</p>
              <p className="text-xl font-bold text-[#7165e1]">{mockStats.surgeries}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[20px] border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-600 mb-1">Reviews</p>
              <p className="text-xl font-bold text-[#7165e1]">{mockStats.reviews}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* About and Availability Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About Section */}
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-sf-pro font-semibold text-black mb-4">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We are dedicated to providing exceptional healthcare services with a focus on patient-centered care. Our team of experienced professionals is committed to delivering the highest quality medical treatment in a compassionate and supportive environment. Our state-of-the-art facilities and cutting-edge technology ensure that our patients receive the most advanced care available. Experience and exceptional capabilities combined with our patient-first approach make us the preferred choice for healthcare in the region.
            </p>
            
            <h4 className="text-lg font-sf-pro font-semibold text-black mb-3">Specialized in</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#7165e1] text-white rounded-full px-3 py-1">Thyroid</Badge>
              <Badge className="bg-[#7165e1] text-white rounded-full px-3 py-1">Surgery</Badge>
              <Badge className="bg-[#7165e1] text-white rounded-full px-3 py-1">Gynecol</Badge>
              <Badge className="bg-[#7165e1] text-white rounded-full px-3 py-1">Neurology</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Availability Section - Updated design to match image */}
        <Card className="rounded-[20px] border-none shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-sf-pro font-semibold text-black mb-6">Availability</h3>
            
            {/* Availability Grid - Matching the image layout */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {availabilitySchedule.slice(0, 6).map((schedule, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg text-center text-sm font-medium ${
                    schedule.time === 'NA' 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-[#f4f3ff] text-gray-700'
                  }`}
                >
                  <div className="font-semibold mb-1">{schedule.day}-</div>
                  <div className="text-xs">{schedule.time}</div>
                </div>
              ))}
              
              {/* Sunday - NA with different styling */}
              <div className="p-3 rounded-lg text-center text-sm font-medium bg-gray-100 text-gray-500">
                <div className="font-semibold mb-1">Sun-</div>
                <div className="text-xs text-red-500">NA</div>
              </div>
            </div>
            
            {/* Book Appointment Button */}
            <Button 
              variant="digigo" 
              className="w-full h-12 rounded-xl text-base font-semibold"
            >
              Book Appointment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card className="rounded-[20px] border-none shadow-sm">
        <CardContent className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Today's Appointments
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Records Per Page Dropdown */}
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">Display</span>
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
                <span className="text-sm text-gray-600 whitespace-nowrap">records per page</span>
              </div>

              <Button variant="link" className="text-[#7165e1] text-sm md:text-base font-sf-pro font-medium">
                View All
              </Button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedAppointments.map((appointment, index) => (
              <Card key={appointment.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {appointment.patientId}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusVariant(appointment.status)}
                      className="rounded-[20px] text-xs"
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{appointment.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{appointment.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concern:</span>
                      <span className="text-right">{appointment.concern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{appointment.duration}</span>
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
                        <DropdownMenuItem>
                          <PenSquare className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient's ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
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
                        {appointment.patientId}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.patientName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.gender}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.age}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.concern}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.time}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {appointment.duration}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(appointment.status)}
                          className="rounded-[40px] text-base font-sf-pro"
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-6">
                          <Button variant="ghost" size="icon">
                            <PenSquare className="w-6 h-6" />
                          </Button>
                          <Button variant="ghost" size="icon">
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
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
                
                <Button
                  variant="digigo"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                >
                  {currentPage}
                </Button>
                
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
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card className="rounded-[20px] border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-sf-pro font-semibold text-black">Reviews</h3>
            <Button variant="link" className="text-[#7165e1] text-sm font-sf-pro font-medium">
              Load more
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockReviews.map((review) => (
              <Card key={review.id} className="border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <h4 className="font-semibold text-black mb-2">{review.patientName}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}