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
import { Plus, Search, PenSquare, Trash2, Eye, Receipt } from "lucide-react"
import { InvoiceForm } from "@/components/billing/invoice-form"
import { InvoiceViewer } from "@/components/billing/invoice-viewer"

interface Transaction {
  id: string
  doctorName?: string
  testName?: string
  date?: string
  amount: number
  status?: 'Paid' | 'Pending' | 'Overdue'
  invoiceNo?: string
  patientName?: string
  phone?: string
  type?: string
  description?: string
  paymentStatus?: string
  appointmentId?: string
  clinicId?: string
  createdAt?: string
  updatedAt?: string
}

interface AdminTransactionsClientProps {
  initialTransactions: Transaction[]
}

export function AdminTransactionsClient({ initialTransactions }: AdminTransactionsClientProps) {
  // Transform transactions to include invoice data
  const transactionsWithInvoiceData = initialTransactions.map((transaction, index) => ({
    ...transaction,
    status: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)] as 'Paid' | 'Pending' | 'Overdue',
    invoiceNo: `#${123456 + index}`,
    patientName: ['K. Vijay', 'P. Sandeep', 'Ch. Asritha', 'P. Ravi', 'A. Srikanth'][Math.floor(Math.random() * 5)],
    phone: '9876543210',
    createdDate: transaction.date || transaction.createdAt || new Date().toISOString().split('T')[0],
    dueDate: transaction.date || transaction.createdAt || new Date().toISOString().split('T')[0],
    items: [
      {
        description: transaction.testName || transaction.description || 'Service',
        quantity: 1,
        rate: transaction.amount,
        amount: transaction.amount
      }
    ]
  }))

  const [transactions, setTransactions] = useState(transactionsWithInvoiceData)
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsWithInvoiceData)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordsPerPage, setRecordsPerPage] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<any>(null)

  useEffect(() => {
    const filtered = transactions.filter((transaction) =>
      (transaction.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.testName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.patientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.invoiceNo || '').includes(searchTerm) ||
      (transaction.status?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [searchTerm, transactions])

  const handleSubmit = async (data: any) => {
    console.log("Invoice data:", data)
    setIsFormOpen(false)
  }

  const handleView = (transaction: any) => {
    setViewingInvoice(transaction)
  }

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id)
  }

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // Pagination logic
  const totalRecords = filteredTransactions.length
  const recordsPerPageNum = parseInt(recordsPerPage)
  const totalPages = Math.ceil(totalRecords / recordsPerPageNum)
  const startIndex = (currentPage - 1) * recordsPerPageNum
  const endIndex = startIndex + recordsPerPageNum
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
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
          Transactions Management
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

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Transaction History
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
            {paginatedTransactions.map((transaction, index) => (
              <Card key={transaction.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {transaction.invoiceNo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {transaction.patientName}
                      </p>
                    </div>
                    <Badge
                      className={`rounded-full text-xs ${getStatusColor(transaction.status || 'Pending')}`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span>{transaction.doctorName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span>{transaction.testName || transaction.description || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{transaction.date || transaction.createdAt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">₹ {transaction.amount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(transaction)}>
                      <Receipt className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(transaction.id)}>
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(transaction.id)}>
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
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">S.No</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Invoice No.</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Patient Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Doctor Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Service</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Date</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Amount</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Status</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction, index) => (
                    <TableRow key={transaction.id} className="bg-[#f4f3ff] rounded-[10px] my-[10px]">
                      <TableCell className="text-base text-black font-sf-pro">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {transaction.invoiceNo}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {transaction.patientName}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {transaction.doctorName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {transaction.testName || transaction.description || 'N/A'}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        {transaction.date || transaction.createdAt || 'N/A'}
                      </TableCell>
                      <TableCell className="text-base text-black font-sf-pro">
                        ₹ {transaction.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full text-sm font-sf-pro ${getStatusColor(transaction.status || 'Pending')}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(transaction)}>
                            <Receipt className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(transaction.id)}>
                            <PenSquare className="w-5 h-5 text-[#7165e1]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
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
              {searchTerm && ` (filtered from ${transactions.length} total)`}
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

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                {searchTerm ? "No transactions found matching your search." : "No transactions found. Create your first invoice to get started."}
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