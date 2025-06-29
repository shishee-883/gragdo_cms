"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const prescriptionSchema = z.object({
  concern: z.string().min(1, "Concern is required"),
  remarks: z.string().optional(),
  medicines: z.array(z.object({
    medicine: z.string().min(1, "Medicine name is required"),
    content: z.string().min(1, "Content is required"),
    price: z.string().min(1, "Price is required"),
    dosage: z.string().min(1, "Dosage is required"),
    usage: z.string().min(1, "Usage is required"),
    days: z.string().min(1, "Days is required"),
    qty: z.string().min(1, "Quantity is required"),
    advice: z.string().min(1, "Advice is required"),
  })).min(1, "At least one medicine is required"),
})

type PrescriptionFormData = z.infer<typeof prescriptionSchema>

interface Patient {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  address?: string
  medicalHistory?: string
  allergies?: string
  createdAt: Date
}

interface PrescriptionFormProps {
  patient: Patient | null
  onSubmit: (data: PrescriptionFormData) => void
  onCancel: () => void
}

export function PrescriptionForm({
  patient,
  onSubmit,
  onCancel,
}: PrescriptionFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      medicine: "Amoxicillin",
      content: "500mg",
      price: "1000",
      dosage: "1 Tab",
      usage: "0-1-1",
      days: "3",
      qty: "9",
      advice: "After Food"
    }
  ])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      concern: patient?.medicalHistory || "Heart Problem",
      remarks: "",
      medicines: medicines
    }
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const addMedicine = () => {
    setMedicines([...medicines, {
      id: medicines.length + 1,
      medicine: "",
      content: "",
      price: "",
      dosage: "1 Tab",
      usage: "0-1-1",
      days: "3",
      qty: "9",
      advice: "After Food"
    }])
  }

  const removeMedicine = (id: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(m => m.id !== id))
    }
  }

  const updateMedicine = (id: number, field: string, value: string) => {
    setMedicines(medicines.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ))
  }

  const handleFormSubmit = () => {
    const formData = {
      concern: patient?.medicalHistory || "Heart Problem",
      remarks: "",
      medicines: medicines
    }
    onSubmit(formData)
  }

  // Mock data for dropdowns
  const dosageOptions = ["1 Tab", "2 Tab", "1 Tsp", "2 Tsp", "1 Cap", "2 Cap"]
  const usageOptions = ["0-1-1", "1-0-1", "1-1-1", "1-0-0", "0-0-1", "0-1-0"]
  const daysOptions = ["1", "2", "3", "5", "7", "10", "15", "30"]
  const qtyOptions = ["3", "6", "9", "15", "21", "30", "45", "60", "90"]
  const adviceOptions = ["After Food", "Before Food", "Empty Stomach", "With Water", "As Directed"]

  return (
    <Card className="w-full border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span>Patient details</span>
          <span className="mx-2">/</span>
          <span className="text-[#7165e1]">Create Precautions</span>
        </div>

        <h2 className="text-2xl font-bold mb-6">Create prescription</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Medicines Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#f4f3ff]">
                <tr>
                  <th className="p-4 text-left">Medicine</th>
                  <th className="p-4 text-left">Content</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Dosage</th>
                  <th className="p-4 text-left">Usage</th>
                  <th className="p-4 text-left">Days</th>
                  <th className="p-4 text-left">Qty</th>
                  <th className="p-4 text-left">Advice</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={medicine.id} className="border-b">
                    <td className="p-4">
                      <Input
                        value={medicine.medicine}
                        onChange={(e) => updateMedicine(medicine.id, 'medicine', e.target.value)}
                        className="h-10 rounded-lg border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={medicine.content}
                        onChange={(e) => updateMedicine(medicine.id, 'content', e.target.value)}
                        className="h-10 rounded-lg border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={medicine.price}
                        onChange={(e) => updateMedicine(medicine.id, 'price', e.target.value)}
                        className="h-10 rounded-lg border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <Select 
                        defaultValue={medicine.dosage}
                        onValueChange={(value) => updateMedicine(medicine.id, 'dosage', value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dosageOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Select 
                        defaultValue={medicine.usage}
                        onValueChange={(value) => updateMedicine(medicine.id, 'usage', value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {usageOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Select 
                        defaultValue={medicine.days}
                        onValueChange={(value) => updateMedicine(medicine.id, 'days', value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Select 
                        defaultValue={medicine.qty}
                        onValueChange={(value) => updateMedicine(medicine.id, 'qty', value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {qtyOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Select 
                        defaultValue={medicine.advice}
                        onValueChange={(value) => updateMedicine(medicine.id, 'advice', value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {adviceOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedicine(medicine.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={medicines.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Row Button */}
          <Button
            type="button"
            variant="outline"
            onClick={addMedicine}
            className="border-[#7165e1] text-[#7165e1]"
          >
            Add New Row
          </Button>

          <div className="text-center text-gray-500 my-6">OR</div>

          {/* Upload File Section */}
          <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-8 text-center bg-[#f8f7ff]">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="prescription-upload"
            />
            <label htmlFor="prescription-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-[#7165e1] mb-2" />
                <p className="text-[#7165e1] font-medium">
                  Click here to upload file
                </p>
              </div>
            </label>
          </div>

          {/* Display uploaded files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-black">Uploaded Files:</p>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
            >
              Create
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}