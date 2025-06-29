"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
import { Plus, Search, PenSquare, Trash2, MoreHorizontal, Eye, FileText, Download } from "lucide-react"
import { PrescriptionForm } from "./prescription-form"
import { PrescriptionViewer } from "./prescription-viewer"
import { EnhancedPrescription } from "@/lib/types"

interface PrescriptionsClientProps {
  initialPrescriptions: EnhancedPrescription[]
}

export function PrescriptionsClient({ initialPrescriptions }: PrescriptionsClientProps) {
  const [prescriptions, setPrescriptions] = useState<EnhancedPrescription[]>(initialPrescriptions || [])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<EnhancedPrescription[]>(initialPrescriptions || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState<string | null>(null)
  const [viewingDocument, setViewingDocument] = useState<{
    type: 'reports' | 'prescriptions'
    documents: any[]
    patientName: string
  } | null>(null)

  useEffect(() => {
    // Filter prescriptions based on search term
    if (prescriptions && prescriptions.length > 0) {
      const filtered = prescriptions.filter((prescription) =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patientId.includes(searchTerm) ||
        prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.gender.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPrescriptions(filtered)
      setCurrentPage(1) // Reset to first page when searching
    } else {
      setFilteredPrescriptions([])
    }
  }, [searchTerm, prescriptions])

  const handleSubmit = async (data: any) => {
    console.log("Prescription data:", data)
    setIsFormOpen(false)
    setEditingPrescription(null)
    // Here you would typically refresh the data or add the new prescription to the list
  }

  const handleEdit = (id: string) => {
    setEditingPrescription(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    // Implement delete functionality
    setPrescriptions(prev => prev.filter(p => p.id !== id))
  }

  const handleViewReports = (prescription: EnhancedPrescription) => {
    setViewingDocument({
      type: 'reports',
      documents: prescription.reports,
      patientName: prescription.patientName
    })
  }

  const handleViewPrescriptions = (prescription: EnhancedPrescription) => {
    setViewingDocument({
      type: 'prescriptions',
      documents: prescription.prescriptions,
      patientName: prescription.patientName
    })
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
    setCurrentPage(1) // Reset to first page when changing records per page
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Prescriptions Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Add New Prescription</span>
              <span className="sm:hidden">Add Prescription</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <PrescriptionForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Prescriptions Container with integrated search and pagination */}
      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Prescriptions
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

              {/* Search Bar */}
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
            {paginatedPrescriptions.map((prescription, index) => (
              <Card key={prescription.id} className="border border-gray-200">
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
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span>{prescription.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concern:</span>
                      <span className="text-right">{prescription.concern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{prescription.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span>{prescription.age}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleViewReports(prescription)}
                    >
                      View Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleViewPrescriptions(prescription)}
                    >
                      View Prescriptions
                    </Button>
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
                      Doctor name
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Concern
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Gender
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Age
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Reports
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Prescriptions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrescriptions.map((prescription, index) => (
                    <TableRow
                      key={prescription.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px]"
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.patientId}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.patientName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.doctorName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.concern}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.gender}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {prescription.age}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-[#7165e1] p-0 h-auto font-sf-pro"
                          onClick={() => handleViewReports(prescription)}
                        >
                          View Reports
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-[#7165e1] p-0 h-auto font-sf-pro"
                          onClick={() => handleViewPrescriptions(prescription)}
                        >
                          View Prescriptions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Results Summary and Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages || 1}
              {searchTerm && ` (filtered from ${prescriptions.length} total)`}
            </p>
            
            {/* Pagination Controls */}
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

          {/* Bottom Pagination (for mobile) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 lg:hidden">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600 px-3">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No prescriptions found matching your search." : "No prescriptions found. Add your first prescription to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Dialog */}
      {viewingDocument && (
        <PrescriptionViewer
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documents={viewingDocument.documents}
          patientName={viewingDocument.patientName}
          type={viewingDocument.type}
        />
      )}
    </>
  )
}