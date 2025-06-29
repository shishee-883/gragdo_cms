"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Plus, PenSquare, Trash2 } from "lucide-react"
import { MedicineForm } from "./medicine-form"
import { deleteMedicine } from "@/lib/actions/medicines"
import { TableLayout } from "@/components/shared/table-layout"
import { MobileCard } from "@/components/shared/mobile-card"

interface Medicine {
  id: string
  name: string
  manufacturer: string
  batchNumber: string
  type: string
  dosage: string
  manufacturedDate: string
  expiryDate: string
  price: string
}

interface MedicineClientProps {
  initialMedicines: Medicine[]
}

export function MedicineClient({ initialMedicines }: MedicineClientProps) {
  const [medicines, setMedicines] = useState(initialMedicines)
  const [filteredMedicines, setFilteredMedicines] = useState(initialMedicines)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)

  useEffect(() => {
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber.includes(searchTerm) ||
      medicine.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMedicines(filtered)
    setCurrentPage(1)
  }, [searchTerm, medicines])

  const handleSubmit = async (data: any) => {
    console.log("Medicine data:", data)
    setIsFormOpen(false)
    setEditingMedicine(null)
    // Refresh medicines data here
  }

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteMedicine(id)
    if (result.success) {
      setMedicines(prev => prev.filter(m => m.id !== id))
    } else {
      console.error('Failed to delete medicine:', result.error)
    }
  }

  // Pagination logic
  const totalRecords = filteredMedicines.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex)

  // Add Button Component
  const addButtonComponent = (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle>
        </DialogHeader>
        <MedicineForm
          initialData={editingMedicine || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingMedicine(null)
          }}
        />
      </DialogContent>
    </Dialog>
  )

  // Table Header
  const tableHeader = (
    <TableRow>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Medicine Name</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Manufacturer</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Batch number</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Medicine Type</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Dosage</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Manufactured Date</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Expiry Date</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Price</TableHead>
      <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
    </TableRow>
  )

  // Table Body
  const tableBody = paginatedMedicines.map((medicine, index) => (
    <TableRow
      key={medicine.id}
      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
    >
      <TableCell className="text-base text-black font-sf-pro">
        {startIndex + index + 1}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.name}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.manufacturer}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.batchNumber}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.type}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.dosage}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.manufacturedDate}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {medicine.expiryDate}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        Rs. {medicine.price}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(medicine)}>
            <PenSquare className="w-5 h-5 text-[#7165e1]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(medicine.id)}>
            <Trash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))

  // Mobile Cards
  const mobileCards = paginatedMedicines.map((medicine) => (
    <MobileCard
      key={medicine.id}
      title={medicine.name}
      subtitle={medicine.manufacturer}
      actions={
        <>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(medicine)}>
            <PenSquare className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(medicine.id)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </>
      }
    >
      <div className="flex justify-between">
        <span className="text-gray-600">Batch:</span>
        <span>{medicine.batchNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Type:</span>
        <span>{medicine.type}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Dosage:</span>
        <span>{medicine.dosage}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Expiry:</span>
        <span>{medicine.expiryDate}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Price:</span>
        <span>Rs. {medicine.price}</span>
      </div>
    </MobileCard>
  ))

  return (
    <TableLayout
      title="Medicine"
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
      emptyMessage="No medicines found. Add your first medicine to get started."
    />
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