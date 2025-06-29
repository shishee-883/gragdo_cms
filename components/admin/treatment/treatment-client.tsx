"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, PenSquare, Trash2, Filter } from "lucide-react"
import { TreatmentForm } from "./treatment-form"
import { deleteTreatment, createTreatment, updateTreatment } from "@/lib/actions/treatments"
import { useSession } from "@/components/auth/session-provider"

interface Treatment {
  id: string
  name: string
  description?: string
  cost: number
  duration?: number
  clinicId: string
  createdById?: string
  createdAt?: string
  updatedAt?: string
  // UI-specific properties
  treatmentName?: string
  treatmentInChargeName?: string
  treatmentCost?: string
}

interface TreatmentClientProps {
  initialTreatments: Treatment[]
}

export function TreatmentClient({ initialTreatments }: TreatmentClientProps)  {
  // Transform treatments to include UI-specific properties
  const transformedTreatments = initialTreatments.map(treatment => ({
    ...treatment,
    treatmentName: treatment.name,
    treatmentInChargeName: "Dr. " + treatment.name.split(' ')[0], // Mock data
    treatmentCost: treatment.cost.toString()
  }))

  const [treatments, setTreatments] = useState(transformedTreatments)
  const [filteredTreatments, setFilteredTreatments] = useState(transformedTreatments)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const { user } = useSession()

  useEffect(() => {
    // Filter treatments based on search term
    const filtered = treatments.filter((treatment) =>
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (treatment.treatmentInChargeName && treatment.treatmentInChargeName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredTreatments(filtered)
    setCurrentPage(1)
  }, [searchTerm, treatments])

  const handleSubmit = async (data: any) => {
    try {
      const clinicId = user?.clinicId || ""
      
      if (!clinicId) {
        console.error("No clinic ID available")
        return
      }
      
      const treatmentData = {
        name: data.treatmentName,
        description: data.description,
        cost: parseFloat(data.treatmentCost),
        duration: data.duration ? parseInt(data.duration) : undefined,
        clinicId
      }
      
      let result
      
      if (editingTreatment) {
        // Update existing treatment
        result = await updateTreatment(editingTreatment.id, treatmentData)
      } else {
        // Create new treatment
        result = await createTreatment(treatmentData)
      }
      
      if (result.success) {
        // Refresh the treatments list
        if (editingTreatment) {
          setTreatments(prev => 
            prev.map(t => t.id === editingTreatment.id ? {
              ...t,
              ...treatmentData,
              treatmentName: treatmentData.name,
              treatmentCost: treatmentData.cost.toString()
            } : t)
          )
        } else {
          setTreatments(prev => [
            {
              ...result.treatment,
              treatmentName: treatmentData.name,
              treatmentInChargeName: "Dr. " + treatmentData.name.split(' ')[0],
              treatmentCost: treatmentData.cost.toString()
            },
            ...prev
          ])
        }
      } else {
        console.error("Failed to save treatment:", result.error)
      }
    } catch (error) {
      console.error("Error saving treatment:", error)
    }
    
    setIsFormOpen(false)
    setEditingTreatment(null)
  }

  const handleEdit = (treatment: Treatment) => {
    setEditingTreatment(treatment)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteTreatment(id)
    if (result.success) {
      setTreatments(prev => prev.filter(t => t.id !== id))
    } else {
      console.error('Failed to delete treatment:', result.error)
    }
  }

  // Pagination logic
  const totalRecords = filteredTreatments.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedTreatments = filteredTreatments.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <div>
      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl text-black font-sf-pro font-bold">
              Treatments
            </h1>
            
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

              {/* Filter Button */}
              <Button variant="outline" className="h-10 px-4 rounded-xl border-gray-300 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2 text-[#7165e1]" />
                Filter by
              </Button>

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

              {/* Add Treatment Button */}
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Treatment
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingTreatment ? "Edit Treatment" : "Add Treatment"}</DialogTitle>
                  </DialogHeader>
                  <TreatmentForm
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setIsFormOpen(false)
                      setEditingTreatment(null)
                    }}
                    initialData={editingTreatment || undefined}
                    clinicId={user?.clinicId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedTreatments.map((treatment, index) => (
              <Card key={treatment.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {treatment.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        In-charge: {treatment.treatmentInChargeName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-semibold">Rs. {treatment.cost.toLocaleString()}</span>
                    </div>
                    {treatment.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{treatment.duration} minutes</span>
                      </div>
                    )}
                    {treatment.description && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Description:</span>
                        <span className="text-right max-w-[200px] truncate">{treatment.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(treatment)}>
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(treatment.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View - Matching the image layout exactly */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      S.No
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Treatment Name
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Treatment In-charge
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Treatment Cost
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTreatments.map((treatment, index) => (
                    <TableRow
                      key={treatment.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {treatment.name}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {treatment.treatmentInChargeName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        Rs. {treatment.cost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(treatment)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(treatment.id)}>
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages || 1}
              {searchTerm && ` (filtered)`}
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

          {totalRecords === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? `No treatments found matching your search.` : "No treatments found. Add your first treatment to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}