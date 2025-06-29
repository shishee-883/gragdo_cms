"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, Building2 } from "lucide-react"

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

interface InvoiceViewerProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice
}

export function InvoiceViewer({ isOpen, onClose, invoice }: InvoiceViewerProps) {
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

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    console.log('Downloading invoice:', invoice.invoiceNo)
  }

  const handlePayNow = () => {
    console.log('Processing payment for invoice:', invoice.invoiceNo)
  }

  // Calculate totals
  const subTotal = invoice.items.reduce((sum, item) => sum + item.amount, 0)
  const discount = 200 // Mock discount
  const tax = 100 // Mock tax
  const totalAmount = subTotal - discount + tax

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Invoice {invoice.invoiceNo}</DialogTitle>
        </DialogHeader>
        
        {/* Purple Header */}
        <div className="bg-[#7165e1] h-16 w-full rounded-t-lg"></div>
        
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            {/* Left Side - DigiGo Care Logo and Invoice */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#7165e1] rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-black">Invoice</h1>
                </div>
              </div>
            </div>

            {/* Right Side - DigiGo Care Info */}
            <div className="text-right">
              <h2 className="text-2xl font-bold text-black mb-2">DigiGo Care</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Dr. Ch. Asritha,</p>
                <p>1/2-3, ABC Street</p>
                <p>Vijayawada, Krishna Dist.,</p>
                <p>Andhra Pradesh, India</p>
                <p>543210</p>
              </div>
            </div>
          </div>

          {/* Bill To and Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Bill To */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Bill to:</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">K. Vijay,</p>
                <p>1/2-3, ABC Street</p>
                <p>Vijayawada, Krishna Dist.,</p>
                <p>Andhra Pradesh, India</p>
                <p>543210</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="text-right">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Invoice Number</span>
                  <p className="font-semibold">{invoice.invoiceNo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date</span>
                  <p className="font-semibold">05-06-2025</p>
                </div>
                <div>
                  <span className="text-gray-600">Due Date</span>
                  <p className="font-semibold">06-06-2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Service/Items/Products</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Cost/Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Consultation Fee</td>
                    <td className="py-3 px-4 text-center">1</td>
                    <td className="py-3 px-4 text-center">Rs. 1000</td>
                    <td className="py-3 px-4 text-right">Rs. 1000</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">Medicine name 1</td>
                    <td className="py-3 px-4 text-center">10</td>
                    <td className="py-3 px-4 text-center">Rs. 100</td>
                    <td className="py-3 px-4 text-right">Rs. 1000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">₹ 2000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">₹ 200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹ 100</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span className="text-[#7165e1]">Total Amount</span>
                <span className="text-[#7165e1]">₹ 1900</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="px-8 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Download
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="px-8 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Print
            </Button>
            <Button 
              onClick={handlePayNow}
              className="px-8 py-2 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white"
            >
              Pay now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}