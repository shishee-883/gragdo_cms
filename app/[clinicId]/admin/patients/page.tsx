'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthToken } from '@/lib/hooks/useAuthToken'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Search, Eye, PenSquare } from "lucide-react"
import PatientForm from "@/components/admin/patients/admin-patients-client"

interface Patient {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  address?: string
}

interface PageProps {
  params: { clinicId: string }
}

// — Skeleton loader for patients page
function SkeletonPatients() {
  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" clinicId="" />
      <main className="flex-1 overflow-auto">
        <Header clinicName="" location="" />
        <div className="p-4 md:p-6 lg:p-[34px] animate-pulse space-y-6">
          {/* you can keep your existing skeleton UI */}
        </div>
      </main>
    </div>
  )
}

export default function AdminPatientsClient({ params }: PageProps) {
  const router = useRouter()
  const { token } = useAuthToken()
  const clinicId = params.clinicId

  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  // fetch patients list
  const fetchPatients = async () => {
    if (!token) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patients/list-by-clinic/${clinicId}`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            start_date: "12-02-2024",
            end_date:   "12-09-2025",
          }),
        }
      )

      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to fetch patients')

      setPatients(data.patients)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [token, clinicId])

  // filter patients
  useEffect(() => {
    const result = patients.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.includes(searchTerm) ||
      p.phone.includes(searchTerm) ||
      p.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(result)
    setCurrentPage(1)
  }, [searchTerm, patients])

  // pagination logic
  const perPage = parseInt(recordsPerPage, 10)
  const totalPages = Math.ceil(filteredPatients.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + perPage)

  // open form for new patient
  const openNewForm = () => {
    setEditingPatient(null)
    setIsFormOpen(true)
  }

  // open form for editing
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setIsFormOpen(true)
  }

  // handle form submit (create or update)
  const handleSubmit = async (formData: any) => {
    const url = editingPatient
      ? `${process.env.NEXT_PUBLIC_API_URL}/patients/update/${editingPatient.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/patients/create`
    const method = editingPatient ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, clinicId }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      // refresh the list
      await fetchPatients()
      setIsFormOpen(false)
      setEditingPatient(null)
    } catch (err) {
      console.error('Failed to save patient:', err)
    }
  }

  // view details
  const handleView = (patientId: string) => {
    router.push(`/${clinicId}/admin/patients/${patientId}`)
  }

  const changePage = (page: number) => setCurrentPage(page)
  const changePerPage = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500 font-sf-pro">{error}</p>
      </div>
    )
  }

  if (loading) {
    return <SkeletonPatients />
  }

  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole="ADMIN" clinicId={clinicId} />

      <main className="flex-1 overflow-auto">
        <Header clinicName={"clinic.name"} location={"clinic.address.split(',')[0]"} />

        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
              Patients Management
            </h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="digigo" size="digigo" onClick={openNewForm}>
                  <Plus className="mr-2 h-5 w-5" /> Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                </DialogHeader>
                <PatientForm
                  initialData={editingPatient || undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsFormOpen(false)}
                  clinicId= {clinicId as string}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 lg:min-w-[160px]">
              <span className="text-sm text-gray-600">Display</span>
              <Select value={recordsPerPage} onValueChange={changePerPage}>
                <SelectTrigger className="h-10 w-[80px] rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "10", "25", "50", "100"].map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">records per page</span>
            </div>
            <div className="relative flex-1 lg:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 h-10 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {paginatedPatients.map((p) => (
              <Card key={p.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">{p.name}</h3>
                      <p className="text-sm text-gray-600">ID: {p.patientId}</p>
                    </div>
                    <Badge variant="completed" className="rounded-[20px] text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{p.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{p.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{p.age}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(p.patientId)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(p)}>
                      <PenSquare className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] font-medium">Patient ID</TableHead>
                    <TableHead className="text-[#888888] font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] font-medium">Phone</TableHead>
                    <TableHead className="text-[#888888] font-medium">Gender</TableHead>
                    <TableHead className="text-[#888888] font-medium">Age</TableHead>
                    <TableHead className="text-[#888888] font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPatients.map((p, idx) => (
                    <TableRow key={p.id} className="my-[10px] bg-[#f4f3ff] rounded-[10px]">
                      <TableCell>{startIndex + idx + 1}</TableCell>
                      <TableCell>{p.patientId}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(p.patientId)}>
                            <Eye className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages}
              {searchTerm && ` (filtered from ${patients.length} total)`}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
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
                        onClick={() => changePage(pageNum)}
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
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No patients found matching your search." : "No patients found. Add your first patient to get started."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
