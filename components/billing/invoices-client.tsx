"use client"

import { useState, useEffect } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal, ExternalLink } from "lucide-react"
import { InvoiceForm } from "./invoice-form"
import { InvoiceViewer } from "./invoice-viewer"

interface Invoice {
  id: string
  invoiceNo: string
  patientName: string
  phone: string
  createdDate: string
  dueDate: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
}

interface InvoicesClientProps {
  initialInvoices: Invoice[]
}

export function InvoicesClient({ initialInvoices }: InvoicesClientProps) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [filteredInvoices, setFilteredInvoices] = useState(initialInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    // Filter invoices based on search term
    const filtered = invoices.filter((invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNo.includes(searchTerm) ||
      invoice.phone.includes(searchTerm) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredInvoices(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, invoices])

  const handleSubmit = async (data: any) => {
    console.log("Invoice data:", data)
    setIsFormOpen(false)
    setEditingInvoice(null)
    // Here you would typically refresh the data or add the new invoice to the list
  }

  const handleEdit = (id: string) => {
    setEditingInvoice(id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    // Implement delete functionality
    setInvoices(prev => prev.filter(i => i.id !== id))
  }

  const handleView = (invoice: Invoice) => {
    setViewingInvoice(invoice)
  }

  // Pagination logic
  const totalRecords = filteredInvoices.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing records per page
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'completed'
      case 'Pending':
        return 'pending'
      case 'Overdue':
        return 'destructive'
      default:
        return 'pending'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Billing & Invoice Management
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Create Invoice</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoices Container with integrated search and pagination */}
      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          {/* Header with Search and Records Per Page */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Invoices
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

              {/* Create Invoice Button */}
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="digigo" size="sm" className="h-10 px-4 rounded-xl">
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                  </DialogHeader>
                  <InvoiceForm
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {paginatedInvoices.map((invoice, index) => (
              <Card key={invoice.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {invoice.invoiceNo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {invoice.patientName}
                      </p>
                    </div>
                    <Badge
                      className={`rounded-full text-xs ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{invoice.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{invoice.createdDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due:</span>
                      <span>{invoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">Rs. {invoice.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleView(invoice)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleEdit(invoice.id)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
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
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium w-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Invoice No.
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Patient Name
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Phone
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Created date
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Due date
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Amount
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice, index) => (
                    <TableRow
                      key={invoice.id}
                      className="bg-[#f4f3ff] rounded-[10px] my-[10px] hover:bg-[#eeebff]"
                    >
                      <TableCell className="text-base text-black font-sf-pro">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {invoice.invoiceNo}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {invoice.patientName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {invoice.phone}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {invoice.createdDate}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {invoice.dueDate}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        Rs. {invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full text-sm font-sf-pro ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleView(invoice)}
                          >
                            <ExternalLink className="w-4 h-4 text-[#7165e1]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(invoice.id)}
                          >
                            <Edit className="w-4 h-4 text-[#7165e1]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(invoice.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
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
              Showing page {currentPage} of {totalPages}
              {searchTerm && ` (filtered from ${invoices.length} total)`}
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
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No invoices found matching your search." : "No invoices found. Create your first invoice to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Viewer Dialog */}
      {viewingInvoice && (
        <InvoiceViewer
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          invoice={viewingInvoice}
        />
      )}
    </>
  )
}