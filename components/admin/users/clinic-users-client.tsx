"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { ClinicUserForm } from "./clinic-user-form"
import { createClinicUser } from "@/lib/actions/users"
import { getCurrentUser } from "@/lib/actions/auth"

interface ClinicUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

interface ClinicUsersClientProps {
  clinicId: string
  initialUsers: ClinicUser[]
}

export function ClinicUsersClient({ clinicId, initialUsers }: ClinicUsersClientProps) {
  const [users, setUsers] = useState(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, users])

  const handleSubmit = async (data: any) => {
    try {
      const result = await createClinicUser(clinicId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        password: data.password,
        role: data.role
      })

      if (result.success) {
        // Add the new user to the list
        const newUser = {
          id: result.user.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          createdAt: new Date().toISOString()
        }
        
        setUsers(prev => [newUser, ...prev])
        setIsFormOpen(false)
      } else {
        console.error("Failed to create clinic user:", result.error)
        // You could show an error message here
      }
    } catch (error) {
      console.error("Error creating clinic user:", error)
    }
  }

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the user
    setUsers(prev => prev.filter(user => user.id !== id))
  }

  // Pagination logic
  const totalRecords = filteredUsers.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

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
          Clinic Users Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Add New User</span>
              <span className="sm:hidden">Add User</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Clinic User</DialogTitle>
            </DialogHeader>
            <ClinicUserForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              clinicId={clinicId}
              currentUser={currentUser}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Clinic Users
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
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.email}
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-[#f4f3ff] text-[#7165e1] rounded-full text-xs font-medium">
                      {user.role}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{user.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                <TableRow>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Name</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Email</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Role</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Created At</TableHead>
                  <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                    <TableCell className="text-base text-black font-sf-pro">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      <div className="px-2 py-1 bg-[#f4f3ff] text-[#7165e1] rounded-full text-xs font-medium inline-block">
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell className="text-base text-black font-sf-pro">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages || 1}
              {searchTerm && ` (filtered from ${users.length} total)`}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No users found matching your search." : "No users found. Add your first clinic user to get started."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}