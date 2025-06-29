// components/billing/invoice-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Calendar } from "lucide-react"
import { FileUpload, FilePreview } from "@/components/shared/file-upload"
import { useSession } from "@/components/auth/session-provider"
import { createInvoiceRecord } from "@/lib/actions/billing"

const invoiceSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  patientName: z.string().min(1, "Patient name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  dueDate: z.string().min(1, "Due date is required"),
  remarks: z.string().optional(),
  items: z.array(z.object({
    service: z.string().min(1, "Service is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    cost: z.number().min(0, "Cost must be positive"),
    amount: z.number().min(0, "Amount must be positive"),
  })).min(1, "At least one item is required"),
  discountPercent: z.number().min(0).max(100).optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void
  onCancel: () => void
  initialData?: Partial<InvoiceFormData>
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  initialData,
}: InvoiceFormProps) {
  const [items, setItems] = useState([
    { service: "", quantity: 1, cost: 0, amount: 0 }
  ])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [invoiceFile, setInvoiceFile] = useState<{name: string, url: string} | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      ...initialData,
      items: items
    },
  })

  // Mock data for dropdowns
  const mockDoctors = [
    { id: '1', name: 'Ch. Asritha' },
    { id: '2', name: 'K. Ranganath' },
    { id: '3', name: 'L. Satya' },
  ]

  const mockPatients = [
    { id: '1', name: 'K. Vijay' },
    { id: '2', name: 'P. Sandeep' },
    { id: '3', name: 'Ch. Asritha' },
  ]

  const addItem = () => {
    const newItems = [...items, { service: "", quantity: 1, cost: 0, amount: 0 }]
    setItems(newItems)
    setValue("items", newItems)
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
      setValue("items", newItems)
    }
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Auto-calculate amount when quantity or cost changes
    if (field === 'quantity' || field === 'cost') {
      newItems[index].amount = newItems[index].quantity * newItems[index].cost
    }
    
    setItems(newItems)
    setValue("items", newItems)
  }

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0)
  }

  const calculateDiscount = () => {
    return (calculateSubTotal() * discountPercent) / 100
  }

  const calculateTax = () => {
    const afterDiscount = calculateSubTotal() - calculateDiscount()
    return afterDiscount * 0.18 // 18% GST
  }

  const calculateTotal = () => {
    return calculateSubTotal() - calculateDiscount() + calculateTax()
  }

  const handleFileUpload = (url: string, file: File) => {
    setInvoiceFile({ name: file.name, url })
  }

  const handleFormSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true)
    
    try {
      const clinicId = user?.clinicId
      
      if (!clinicId) {
        throw new Error("No clinic ID available")
      }
      
      const invoiceData = {
        patientId: mockPatients.find(p => p.name === data.patientName)?.id || "",
        clinicId,
        items: items.map(item => ({
          description: item.service,
          quantity: item.quantity,
          unitPrice: item.cost,
          type: "CONSULTATION", // Default type
        })),
        discount: calculateDiscount(),
        tax: calculateTax(),
        dueDate: data.dueDate,
        notes: data.remarks,
        createdById: user?.id || "",
        document: invoiceFile?.url
      }
      
      const result = await createInvoiceRecord(invoiceData)
      
      if (result.success) {
        onSubmit({ ...data, items, discountPercent })
      } else {
        console.error("Error saving invoice:", result.error)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          Create Invoice
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Row 1: Doctor Name, Patient Name, Invoice Number, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName" className="text-sm font-medium text-black">
                Doctor Name<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("doctorName", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Ch. Asritha" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorName && (
                <p className="text-xs text-red-500">{errors.doctorName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientName" className="text-sm font-medium text-black">
                Patient Name<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("patientName", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="K. Vijay" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.name}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientName && (
                <p className="text-xs text-red-500">{errors.patientName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber" className="text-sm font-medium text-black">
                Invoice Number
              </Label>
              <Input
                id="invoiceNumber"
                placeholder="#123456"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("invoiceNumber")}
              />
              {errors.invoiceNumber && (
                <p className="text-xs text-red-500">{errors.invoiceNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-black">
                Due Date<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="dueDate"
                  type="date"
                  placeholder="Select Due Date"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1] pl-4"
                  {...register("dueDate")}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Invoice File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Upload Invoice Document
            </Label>
            <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-6 text-center bg-[#f8f7ff]">
              <FileUpload
                onFileUpload={handleFileUpload}
                folder="invoice-documents"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={false}
                buttonText="Upload Invoice Document"
                buttonVariant="ghost"
                className="flex flex-col items-center"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>
            
            {/* Display uploaded file */}
            {invoiceFile && (
              <div className="mt-2">
                <FilePreview
                  file={invoiceFile}
                  onRemove={() => setInvoiceFile(null)}
                />
              </div>
            )}
          </div>

          {/* Remarks/Notes */}
          <div className="space-y-2">
            <Label htmlFor="remarks" className="text-sm font-medium text-black">
              Remarks/Notes
            </Label>
            <Textarea
              id="remarks"
              placeholder="Enter your notes here"
              className="min-h-[100px] rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
              {...register("remarks")}
            />
          </div>

          {/* Service Items Table */}
          <div className="space-y-4">
            <div className="bg-[#f4f3ff] rounded-lg p-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-gray-700">
                <div className="col-span-4">Service/Items/Products</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Cost</div>
                <div className="col-span-3">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-3">
                  <div className="col-span-4">
                    <Input
                      placeholder="Enter Item"
                      value={item.service}
                      onChange={(e) => updateItem(index, 'service', e.target.value)}
                      className="h-10 rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Enter Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-10 rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Enter Cost"
                      value={item.cost}
                      onChange={(e) => updateItem(index, 'cost', parseFloat(e.target.value) || 0)}
                      className="h-10 rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Enter Amount"
                      value={item.amount.toFixed(2)}
                      disabled
                      className="h-10 rounded-lg border-gray-300 bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1 flex items-center">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Row Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="mt-2 text-[#7165e1] border-[#7165e1] hover:bg-[#7165e1] hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Row
              </Button>

              {/* Discount */}
              <div className="flex justify-end mt-6">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-black">
                    Discount % of total amount
                  </Label>
                  <Input
                    type="number"
                    placeholder="%"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 rounded-lg border-gray-300"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">₹ {calculateSubTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">₹ {calculateDiscount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹ {calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span className="text-[#7165e1]">Total Amount</span>
                <span className="text-[#7165e1]">₹ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || formSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || formSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
            >
              {isSubmitting || formSubmitting ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
