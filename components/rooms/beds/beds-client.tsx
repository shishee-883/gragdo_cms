"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Search } from "lucide-react"
import { BedReservationForm } from "./bed-reservation-form"
import { dischargeBed } from "@/lib/actions/beds"
import { TableLayout } from "@/components/shared/table-layout"
import { MobileCard } from "@/components/shared/mobile-card"

interface Bed {
  id: string
  bedNumber: number
  patientName: string
  age: number
  gender: string
  admissionDate: string
  dischargeDate: string
  status: 'occupied' | 'available' | 'reserved'
}

interface BedsClientProps {
  roomId: string
  initialBeds: Bed[]
}

export function BedsClient({ roomId, initialBeds }: BedsClientProps) {
  const [beds, setBeds] = useState(initialBeds)
  const [filteredBeds, setFilteredBeds] = useState(initialBeds)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isReservationOpen, setIsReservationOpen] = useState(false)

  useEffect(() => {
    const filtered = beds.filter((bed) =>
      bed.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.bedNumber.toString().includes(searchTerm) ||
      bed.gender.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBeds(filtered)
    setCurrentPage(1)
  }, [searchTerm, beds])

  const handleReservation = async (data: any) => {
    console.log("Bed reservation data:", data)
    setIsReservationOpen(false)
    // Refresh beds data here
  }

  const handleDischarge = async (bedId: string) => {
    const result = await dischargeBed(bedId)
    if (result.success) {
      setBeds(prev => prev.map(bed => 
        bed.id === bedId 
          ? { ...bed, status: 'available' as const, patientName: '', age: 0, gender: '', admissionDate: '', dischargeDate: '' }
          : bed
      ))
    }
  }

  // Pagination logic
  const totalRecords = filteredBeds.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedBeds = filteredBeds.slice(startIndex, endIndex)

  // Breadcrumb
  const breadcrumb = (
    <div className="flex items-center text-sm text-gray-600 mb-4">
      <span>Patients</span>
      <span className="mx-2">/</span>
      <span>Rooms</span>
      <span className="mx-2">/</span>
      <span>Beds</span>
    </div>
  )

  // Add Button Component
  const addButtonComponent = (
    <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
      <DialogTrigger asChild>
        <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
          Reserve Bed
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reserve Bed</DialogTitle>
        </DialogHeader>
        <BedReservationForm
          roomId={roomId}
          onSubmit={handleReservation}
          onCancel={() => setIsReservationOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )

  // Table Header
  const tableHeader = (
    <TableRow>
      <TableHead>Bed No.</TableHead>
      <TableHead>Patient Name</TableHead>
      <TableHead>Age</TableHead>
      <TableHead>Gender</TableHead>
      <TableHead>Admin Date</TableHead>
      <TableHead>Discharge Date</TableHead>
      <TableHead>Action</TableHead>
    </TableRow>
  )

  // Table Body
  const tableBody = paginatedBeds.map((bed) => (
    <TableRow
      key={bed.id}
      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
    >
      <TableCell className="text-base text-black font-sf-pro">
        {bed.bedNumber}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {bed.patientName}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {bed.age}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {bed.gender}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {bed.admissionDate}
      </TableCell>
      <TableCell className="text-base text-black font-sf-pro">
        {bed.dischargeDate}
      </TableCell>
      <TableCell>
        <Button
          variant="digigo"
          size="sm"
          onClick={() => handleDischarge(bed.id)}
          className="rounded-xl"
        >
          Discharge
        </Button>
      </TableCell>
    </TableRow>
  ))

  // Mobile Cards
  const mobileCards = paginatedBeds.map((bed) => (
    <MobileCard
      key={bed.id}
      title={`Bed ${bed.bedNumber}`}
      subtitle={bed.patientName}
      actions={
        <Button 
          variant="digigo" 
          size="sm" 
          className="flex-1"
          onClick={() => handleDischarge(bed.id)}
        >
          Discharge
        </Button>
      }
    >
      <div className="flex justify-between">
        <span className="text-gray-600">Age:</span>
        <span>{bed.age}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Gender:</span>
        <span>{bed.gender}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Admission:</span>
        <span>{bed.admissionDate}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Discharge:</span>
        <span>{bed.dischargeDate}</span>
      </div>
    </MobileCard>
  ))

  return (
    <>
      {breadcrumb}
      <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
        Beds
      </h1>
      <TableLayout
        title="Beds"
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
        emptyMessage="No beds found."
      />
    </>
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