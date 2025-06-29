"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface Column {
  key: string
  label: string
  className?: string
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  actionLabel?: string
  actionUrl?: string
  renderCell?: (item: any, column: Column) => React.ReactNode
  maxHeight?: string
}

export function DataTable({ 
  title, 
  columns, 
  data, 
  actionLabel = "View All", 
  actionUrl,
  renderCell,
  maxHeight = "400px"
}: DataTableProps) {
  const router = useRouter()
  
  const handleAction = () => {
    if (actionUrl) {
      router.push(actionUrl)
    }
  }

  const defaultRenderCell = (item: any, column: Column) => {
    return item[column.key]
  }

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            {title}
          </h3>
          <Button 
            variant="link" 
            className="text-[#7165e1] text-sm font-sf-pro font-medium p-0"
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </div>

        <ScrollArea style={{ height: maxHeight }}>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                {columns.map((column) => (
                  <TableHead 
                    key={column.key} 
                    className={`text-xs font-sf-pro font-medium text-gray-600 ${column.className || ''}`}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id || index} className="border-b border-gray-100">
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key} 
                      className={`text-sm font-sf-pro text-black ${column.className || ''}`}
                    >
                      {renderCell ? renderCell(item, column) : defaultRenderCell(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}