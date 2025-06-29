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
import { Plus, Search, PenSquare, Trash2, Eye, FileText } from "lucide-react"
import { PrescriptionForm } from "@/components/doctor/prescriptions/prescription-form"
import { PrescriptionViewer } from "@/components/doctor/prescriptions/prescription-viewer"

interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorName: string
  concern: string
  gender: string
  age: number
  reports: {
    id: string
    name: string
    type: string
    url: string
  }[]
  prescriptions: {
    id: string
    name: string
    type: string
    url: string
  }[]
  createdAt: Date
}

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
  createdAt: Date
}

interface DoctorPrescriptionsClientProps {
  initialPrescriptions: Prescription[]
  patients: Patient[]
}

export function DoctorPrescriptionsClient({ 
  initialPrescriptions,
  patients
}: DoctorPrescriptionsClientProps) {
  const router = useRouter()
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions)
  const [filteredPrescriptions, setFilteredPrescriptions] = useState(initialPrescriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null)

  useEffect(() => {
    // Filter prescriptions based on search term
    const filtered = prescriptions.filter((prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patientId.includes(searchTerm) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPrescriptions(filtered)
    setCurrentPage(1)
  }, [searchTerm, prescriptions])

  const handleSubmit = async (data: any) => {
    console.log("Prescription data:", data)
    setIsFormOpen(false)
    setSelectedPatient(null)
    
    // In a real app, you would add the new prescription to the list
    // For now, we'll just simulate it
    const newPrescription = {
      id: Math.random().toString(36).substring(2, 15),
      patientId: selectedPatient?.patientId || "",
      patientName: selectedPatient?.name || "",
      doctorName: "Dr. Ch. Asritha", // Assuming current doctor
      concern: data.concern || "General checkup",
      gender: selectedPatient?.gender || "",
      age: selectedPatient?.age || 0,
      reports: [],
      prescriptions: [
        {
          id: Math.random().toString(36).substring(2, 15),
          name: "Prescription_" + new Date().toISOString().split('T')[0] + ".pdf",
          type: "PDF",
          url: "/mock-prescriptions/new-prescription.pdf"
        }
      ],
      createdAt: new Date()
    }
    
    setPrescriptions(prev => [newPrescription, ...prev])
  }

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsFormOpen(true)
  }

  const handleViewPrescription = (prescription: Prescription) => {
    setViewingPrescription(prescription)
  }

  // Pagination logic
  const totalRecords = filteredPrescriptions.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Patient's list
        </h1>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Patients
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 lg:min-w-[160px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">Display</span>
                <Select defaultValue={recordsPerPage} onValueChange={handleRecordsPerPageChange}>
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
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="border border-gray-200 cursor-pointer" onClick={() => handlePatientClick(patient)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {patient.patientId}
                      </p>
                    </div>
                    <Badge
                      variant="completed"
                      className="rounded-[20px] text-xs"
                    >
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{patient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{patient.age}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient's ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Gender</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Age</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient, index) => (
                    <TableRow
                      key={patient.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff] cursor-pointer"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {index + 1}
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
                      <TableCell>
                        <Badge
                          variant="completed"
                          className="rounded-[40px] text-base font-sf-pro"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatientClick(patient);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Prescription
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
              Showing page {currentPage} of {totalPages || 1}
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
        </div>
      </div>

      {/* Prescription Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionForm
            patient={selectedPatient}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Prescription Viewer Dialog */}
      {viewingPrescription && (
        <PrescriptionViewer
          isOpen={!!viewingPrescription}
          onClose={() => setViewingPrescription(null)}
          prescription={viewingPrescription}
        />
      )}

      {/* Recent Prescriptions Section */}
      {prescriptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1] mb-6">
            Recent Prescriptions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.slice(0, 6).map((prescription) => (
              <Card 
                key={prescription.id} 
                className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewPrescription(prescription)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {prescription.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {prescription.patientId}
                      </p>
                    </div>
                    <FileText className="w-6 h-6 text-[#7165e1]" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concern:</span>
                      <span>{prescription.concern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{prescription.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span>{prescription.doctorName}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPrescription(prescription);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Prescription
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  )
}