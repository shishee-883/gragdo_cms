"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Patient {
  id: string
  patientId: string
  name: string
  phone: string
  gender: string
  age: number
  concern?: string
  doctorName?: string
  duration?: string
  status?: string
}

interface DoctorPatientsClientProps {
  initialPatients: Patient[]
}

export function DoctorPatientsClient({ initialPatients }: DoctorPatientsClientProps) {
  const router = useRouter()
  
  // Use useState with functional updater to prevent recreation on every render
  const [patients] = useState(() => {
    return initialPatients.map(patient => ({
      ...patient,
      concern: patient.concern || (patient.id === "1" ? "Heart problem" : 
                                 patient.id === "2" ? "General checkup" : 
                                 patient.id === "3" ? "PCOD" : 
                                 patient.id === "4" ? "Kidney disease" : "Heart problem"),
      doctorName: patient.id === "1" || patient.id === "5" ? "K. Ranganath" :
                  patient.id === "2" ? "L. Satya" :
                  patient.id === "3" ? "G. Anitha" : "P. Ravi",
      duration: "30 Min",
      status: patient.id <= "5" ? "Completed" : 
              patient.id === "6" ? "In Progress" : "Pending"
    }))
  })

  const [filteredPatients, setFilteredPatients] = useState(patients)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.concern && patient.concern.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.doctorName && patient.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredPatients(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, patients])

  // Pagination logic
  const totalRecords = filteredPatients.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  const handlePatientClick = (id: string) => {
    router.push(`/doctor/patients/${id}`)
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
        return 'completed'
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
        Patient's list
      </h1>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Search and Records Per Page */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Display</span>
              <Select 
                defaultValue={recordsPerPage} 
                onValueChange={handleRecordsPerPageChange}
              >
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

            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Doctor name</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Duration</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((patient, index) => (
                  <TableRow
                    key={patient.id}
                    className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff] cursor-pointer"
                    onClick={() => handlePatientClick(patient.id)}
                  >
                    <TableCell className="text-base text-black font-sf-pro">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.patientId}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.name}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.phone}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.gender}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.age}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.concern}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.doctorName}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {patient.duration}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(patient.status || 'Completed')}
                        className="rounded-[40px] text-base font-sf-pro"
                      >
                        {patient.status || 'Completed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePatientClick(patient.id);
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58C10.0199 15.58 8.41992 13.98 8.41992 12C8.41992 10.02 10.0199 8.42 11.9999 8.42C13.9799 8.42 15.5799 10.02 15.5799 12Z" stroke="#7165E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M11.9998 20.27C15.5298 20.27 18.8198 18.19 21.1098 14.59C22.0098 13.18 22.0098 10.81 21.1098 9.4C18.8198 5.8 15.5298 3.72 11.9998 3.72C8.46984 3.72 5.17984 5.8 2.88984 9.4C1.98984 10.81 1.98984 13.18 2.88984 14.59C5.17984 18.19 8.46984 20.27 11.9998 20.27Z" stroke="#7165E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete action
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.8499 9.14001L18.1999 19.21C18.0899 20.78 17.9999 22 15.2099 22H8.7899C5.9999 22 5.9099 20.78 5.7999 19.21L5.1499 9.14001" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.33 16.5H13.66" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9.5 12.5H14.5" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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
              Showing page {currentPage} of {totalPages}
            </p>
            
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
          </div>
        </div>
      </div>
    </div>
  )
}