"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Plus, Search, Eye } from "lucide-react"
import { PatientForm } from "@/components/patients/patient-form"

interface Patient {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  createdAt: string
}

interface AdminPatientsClientProps {
  initialPatients: Patient[]
  clinicId: string
}

export default function AdminPatientsClient({ initialPatients, clinicId }: AdminPatientsClientProps) {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>(initialPatients||[])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(initialPatients||[])
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // filter patients
  useEffect(() => {
    const result = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.includes(searchTerm) ||
      p.phone.includes(searchTerm) ||
      p.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(result)
    setCurrentPage(1)
  }, [searchTerm, patients])

  // pagination
  const perPage = parseInt(recordsPerPage, 10)
  const totalPages = Math.ceil((filteredPatients.length) / perPage)
  const startIndex = (currentPage - 1) * perPage
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + perPage)

  // add new patient
  const handleSubmit = async (data: any) => {
    // TODO: API call to add patient
    setIsFormOpen(false)
  }

  // view details
  const handleView = (id: string) => {
    router.push(`/${clinicId}/admin/patients/${id}`)
  }

  const changePage = (page: number) => setCurrentPage(page)
  const changePerPage = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <>
      {/* Header with add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patients Management
        </h1>
        <Button variant="digigo" size="digigo" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-5 w-5" /> Add New Patient
        </Button>
      </div>

      {/* Add Patient Dialog */}
      {/* {isFormOpen && (
        // <PatientForm
        //   onSubmit={handleSubmit}
        //   onCancel={() => setIsFormOpen(false)}
        // />
      )} */}

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <Select value={recordsPerPage} onValueChange={changePerPage}>
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
        <div className="relative flex-1 lg:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="block lg:hidden space-y-4">
        {paginatedPatients.map(p => (
          <Card key={p.id} className="border border-gray-200">
            <CardContent>
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#7165e1]">{p.name}</h3>
                  <p className="text-sm text-gray-600">ID: {p.patientId}</p>
                </div>
                <Badge variant="completed" className="text-xs">
                  Active
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{p.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gender:</span>
                  <span>{p.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span>{p.age}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleView(p.id)}
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader className="bg-[#f4f3ff]">
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.map((p, idx) => (
                <TableRow key={p.id}>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell>{p.patientId}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(p.id)}
                    >
                      <Eye className="w-5 h-5 text-[#7165e1]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}