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
import { Plus, Search, PenSquare, Trash2 } from "lucide-react"
import { StaffForm } from "./staff-form"

interface Staff {
  id: string
  staffId: string
  name: string
  designation: string
  weeklySchedule: {
    sun: string
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
  }
}

interface AdminStaffsClientProps {
  initialStaff: any[]
}

export function AdminStaffsClient({ initialStaff }: AdminStaffsClientProps) {
  // Use useState with functional updater to prevent recreation on every render
  const [staff] = useState(() => {
    return initialStaff.map((staff, index) => ({
      id: staff.id,
      staffId: `${123456 + index}`,
      name: staff.name,
      designation: staff.role,
      weeklySchedule: {
        sun: "NA",
        mon: "9AM-2PM",
        tue: "9AM-2PM",
        wed: "9AM-2PM",
        thu: "9AM-2PM",
        fri: "9AM-2PM",
        sat: "9AM-2PM"
      }
    }))
  })

  const [filteredStaff, setFilteredStaff] = useState(staff)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<string | null>(null)

  useEffect(() => {
    const filtered = staff.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.includes(searchTerm) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStaff(filtered)
    setCurrentPage(1)
  }, [searchTerm, staff])

  const handleSubmit = async (data: any) => {
    console.log("Staff data:", data)
    setIsFormOpen(false)
    setEditingStaff(null)
  }

  const handleEdit = (id: string) => {
    setEditingStaff(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    // Note: In a real app, you would need to update the staff state here
    // For now, we'll just log the action
    console.log('Staff member deleted:', id)
  }

  // Pagination logic
  const totalRecords = filteredStaff.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex)

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
          Staff Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Add Staff</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Staff</DialogTitle>
            </DialogHeader>
            <StaffForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Staff List
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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
            {paginatedStaff.map((member, index) => (
              <Card key={member.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {member.staffId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Designation:</span>
                      <span>{member.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="text-right">Mon-Sat: 9AM-2PM</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(member.id)}>
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(member.id)}>
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
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Designation</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Sun</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Mon</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Tue</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Wed</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Thu</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Fri</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Sat</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStaff.map((member, index) => (
                    <TableRow key={member.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                      <TableCell className="text-base text-black font-sf-pro">
                        {member.staffId}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {member.name}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {member.designation}
                      </TableCell>
                      <TableCell className="text-base font-sf-pro">
                        <span className="text-red-500 font-medium">NA</span>
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell className="text-base text-black font-sf-pro">9AM-2PM</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(member.id)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
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
              Showing page {currentPage} of {totalPages}
              {searchTerm && ` (filtered from ${staff.length} total)`}
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

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No staff found matching your search." : "No staff found. Add your first staff member to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}