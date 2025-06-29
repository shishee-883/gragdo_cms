"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Plus, PenSquare, Trash2, Filter } from "lucide-react"
import { TreatmentForm } from "./treatment-form"
import { deleteTreatment, createTreatment, updateTreatment } from "@/lib/actions/treatments"
import { TableLayout } from "@/components/shared/table-layout"
import { MobileCard } from "@/components/shared/mobile-card"
import { getCurrentUser } from "@/lib/actions/auth"

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
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Fetch current user
    async function fetchUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

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
      const clinicId = currentUser?.clinicId || ""
      
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

  // Add Button Component
  const addButtonComponent = (
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
          clinicId={currentUser?.clinicId}
          currentUser={currentUser}
        />
      </DialogContent>
    </Dialog>
  )

  // Table Header
  const tableHeader = (
    <TableRow>
      <TableHead>
        S.No
      </TableHead>
      <TableHead>
        Treatment Name
      </TableHead>
      <TableHead>
        Treatment In-charge
      </TableHead>
      <TableHead>
        Treatment Cost
      </TableHead>
      <TableHead>
        Action
      </TableHead>
    </TableRow>
  )

  // Table Body
  const tableBody = paginatedTreatments.map((treatment, index) => (
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
  ))

  // Mobile Cards
  const mobileCards = paginatedTreatments.map((treatment, index) => (
    <MobileCard
      key={treatment.id}
      title={treatment.name}
      subtitle={treatment.treatmentInChargeName || ""}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(treatment)}>
            <PenSquare className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(treatment.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      }
    >
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
    </MobileCard>
  ))

  return (
    <div>
      <TableLayout
        title="Treatments"
        addButtonComponent={addButtonComponent}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        recordsPerPage={recordsPerPage}
        setRecordsPerPage={setRecordsPerPage}
        totalRecords={totalRecords}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        tableHeader={tableHeader}
        tableBody={tableBody}
        mobileCards={mobileCards}
        showFilter={true}
        emptyMessage="No treatments found. Add your first treatment to get started."
      />
    </div>
  )
}

// Helper component for table header
function TableHead({ children, className = "" }) {
  return (
    <th className={`text-[#888888] text-lg font-sf-pro font-medium ${className}`}>
      {children}
    </th>
  )
}