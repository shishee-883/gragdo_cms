"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Search, Filter } from "lucide-react"

interface TableLayoutProps {
  title: string
  addButtonComponent?: ReactNode
  searchTerm: string
  setSearchTerm: (value: string) => void
  recordsPerPage: string
  setRecordsPerPage: (value: string) => void
  totalRecords: number
  currentPage: number
  setCurrentPage: (page: number) => void
  tableHeader: ReactNode
  tableBody: ReactNode
  mobileCards?: ReactNode
  showFilter?: boolean
  emptyMessage?: string
}

export function TableLayout({
  title,
  addButtonComponent,
  searchTerm,
  setSearchTerm,
  recordsPerPage,
  setRecordsPerPage,
  totalRecords,
  currentPage,
  setCurrentPage,
  tableHeader,
  tableBody,
  mobileCards,
  showFilter = false,
  emptyMessage = "No records found."
}: TableLayoutProps) {
  const totalPages = Math.ceil(totalRecords / parseInt(recordsPerPage))
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(value)
    setCurrentPage(1)
  }

  return (
    <div className="bg-white rounded-[20px] shadow-sm">
      <div className="p-4 md:p-6 lg:p-[34px]">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
            {title}
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

            {/* Filter Button */}
            {showFilter && (
              <Button variant="outline" className="h-10 px-4 rounded-xl border-gray-300 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2 text-[#7165e1]" />
                Filter by
              </Button>
            )}

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

            {/* Add Button Component */}
            {addButtonComponent}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {mobileCards}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                {tableHeader}
              </TableHeader>
              <TableBody>
                {tableBody}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages}
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
              {searchTerm ? `No records found matching your search.` : emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}