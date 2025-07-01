"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { PatientForm } from "@/components/patients/patient-form"
// import { deletePatient } from "@/lib/actions/patients"

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

export function AdminPatientsClient({ initialPatients, clinicId }: AdminPatientsClientProps) {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(initialPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<string | null>(null)

  // Filter on searchTerm or patients update
  useEffect(() => {
    const filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.includes(searchTerm) ||
      p.phone.includes(searchTerm) ||
      p.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
    setCurrentPage(1)
  }, [searchTerm, patients])

  // Pagination
  const totalRecords = filteredPatients.length
  const perPage = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / perPage)
  const startIndex = (currentPage - 1) * perPage
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + perPage)

  const handleSubmit = async (data: any) => {
    // TODO: call API to add/edit patient
    setIsFormOpen(false)
    setEditingPatient(null)
  }

  const handleEdit = (id: string) => {
    setEditingPatient(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deletePatient(id)
    if (result.success) {
      setPatients(prev => prev.filter(p => p.id !== id))
    } else {
      console.error('Failed to delete patient:', result.error)
    }
  }

  const handleView = (id: string) => {
    // Route to patient details page
    router.push(`/${clinicId}/admin/patients/${id}`)
  }

  const changePage = (page: number) => setCurrentPage(page)
  const changePerPage = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patients Management
        </h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </span>
              <span className="sm:hidden">
                {editingPatient ? 'Edit' : 'Add'}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </DialogTitle>
            </DialogHeader>
            <PatientForm
              patient={patients.find(p => p.id === editingPatient) || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingPatient(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table container */}
      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-sf-pro font-semibold text-black">
              Patient's List
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="whitespace-nowrap text-sm text-gray-600">Display</span>
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
                <span className="whitespace-nowrap text-sm text-gray-600">records per page</span>
              </div>
              <div className="relative flex-1 lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="block lg:hidden space-y-4">
            {paginatedPatients.map((p, i) => (
              <Card key={p.patientId} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">{p.name}</h3>
                      <p className="text-sm text-gray-600">ID: {p.patientId}</p>
                    </div>
                    <Badge variant="completed" className="rounded-[20px] text-xs">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span>{p.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Gender:</span><span>{p.gender}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Age:</span><span>{p.age}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Age:</span><span>{p.address}</span></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(p.id)}><Eye className="w-4 h-4 mr-2"/>View</Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(p.id)}><PenSquare className="w-4 h-4 mr-2"/>Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Gender</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Age</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatients.map((p, i) => (
                    <TableRow key={p.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                      <TableCell>{startIndex + i + 1}</TableCell>
                      <TableCell>{p.patientId}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(p.id)}><Eye className="w-5 h-5 text-[#7165e1]"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(p.id)}><PenSquare className="w-5 h-5 text-[#7165e1]"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-5 h-5 text-red-500"/></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
