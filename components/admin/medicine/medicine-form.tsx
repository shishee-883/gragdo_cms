// components/admin/medicine/medicine-form.tsx
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
import { Trash2 } from "lucide-react"
import { FileUpload, FilePreview } from "@/components/shared/file-upload"
import { useSession } from "@/components/auth/session-provider"
import { createMedicineRecord, updateMedicineRecord } from "@/lib/actions/medicines"

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  type: z.string().min(1, "Medicine type is required"),
  dosage: z.string().min(1, "Dosage is required"),
  manufacturedDate: z.string().min(1, "Manufactured date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
  reorderLevel: z.string().optional(),
})

type MedicineFormData = z.infer<typeof medicineSchema>

interface Medicine {
  id: string
  name: string
  manufacturer: string
  batchNumber: string
  type: string
  dosage: string
  manufacturedDate: string
  expiryDate: string
  price: string
}

interface MedicineFormProps {
  initialData?: Medicine
  onSubmit: (data: MedicineFormData) => void
  onCancel: () => void
}

export function MedicineForm({
  initialData,
  onSubmit,
  onCancel,
}: MedicineFormProps) {
  const [medicineRows, setMedicineRows] = useState([
    {
      id: 1,
      name: initialData?.name || "ALERGIN",
      manufacturer: initialData?.manufacturer || "Cipla",
      batchNumber: initialData?.batchNumber || "123456",
      type: initialData?.type || "Capsule",
      dosage: initialData?.dosage || "500mg",
      manufacturedDate: initialData?.manufacturedDate || "30-05-2025",
      expiryDate: initialData?.expiryDate || "06-06-2027",
      price: initialData?.price || "100"
    }
  ])
  const [medicineImages, setMedicineImages] = useState<{id: number, name: string, url: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()

  const addNewRow = () => {
    setMedicineRows([...medicineRows, {
      id: medicineRows.length + 1,
      name: "",
      manufacturer: "Cipla",
      batchNumber: "",
      type: "Capsule",
      dosage: "",
      manufacturedDate: "",
      expiryDate: "",
      price: ""
    }])
  }

  const removeRow = (id: number) => {
    if (medicineRows.length > 1) {
      setMedicineRows(medicineRows.filter(row => row.id !== id))
      // Also remove any associated images
      setMedicineImages(prev => prev.filter(img => img.id !== id))
    }
  }

  const updateRow = (id: number, field: string, value: string) => {
    setMedicineRows(medicineRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ))
  }

  const handleImageUpload = (url: string, file: File) => {
    // Associate the image with the first medicine row by default
    setMedicineImages(prev => [...prev, { id: medicineRows[0].id, name: file.name, url }])
  }

  const removeImage = (index: number) => {
    setMedicineImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const clinicId = user?.clinicId
      
      if (!clinicId) {
        throw new Error("No clinic ID available")
      }
      
      // Process all rows and submit
      for (const row of medicineRows) {
        // Find any images associated with this medicine
        const images = medicineImages.filter(img => img.id === row.id).map(img => img.url)
        
        const medicineData = {
          name: row.name,
          manufacturer: row.manufacturer,
          batchNumber: row.batchNumber,
          type: row.type,
          dosage: row.dosage,
          manufacturedDate: row.manufacturedDate,
          expiryDate: row.expiryDate,
          price: parseFloat(row.price),
          stock: 100, // Default value
          reorderLevel: 10, // Default value
          clinicId,
          createdById: user?.id || "",
          imageUrls: images
        }
        
        let result
        
        if (initialData && initialData.id) {
          // Update existing medicine
          result = await updateMedicineRecord(initialData.id, medicineData)
        } else {
          // Create new medicine
          result = await createMedicineRecord(medicineData)
        }
        
        if (!result.success) {
          console.error(`Failed to save medicine ${row.name}:`, result.error)
        }
      }
      
      // Call the onSubmit callback with the first row's data
      onSubmit(medicineRows[0])
    } catch (error) {
      console.error("Error saving medicines:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {initialData ? "Edit Medicine" : "Add Medicine"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        {/* Medicine Images */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-black mb-2 block">
            Medicine Images
          </Label>
          <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-6 text-center bg-[#f8f7ff]">
            <FileUpload
              onFileUpload={handleImageUpload}
              folder="medicine-images"
              accept="image/*"
              multiple={true}
              buttonText="Upload Medicine Images"
              buttonVariant="ghost"
              className="flex flex-col items-center"
            />
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>
          
          {/* Display uploaded images */}
          {medicineImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {medicineImages.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-9 gap-2 bg-[#f4f3ff] p-4 rounded-t-lg mb-2">
          <div className="text-sm font-medium text-gray-700">Medicine name</div>
          <div className="text-sm font-medium text-gray-700">Manufacturer</div>
          <div className="text-sm font-medium text-gray-700">Batch Number</div>
          <div className="text-sm font-medium text-gray-700">Medicine type</div>
          <div className="text-sm font-medium text-gray-700">Dosage</div>
          <div className="text-sm font-medium text-gray-700">Manufacture date</div>
          <div className="text-sm font-medium text-gray-700">Expiry Date</div>
          <div className="text-sm font-medium text-gray-700">Price</div>
          <div className="text-sm font-medium text-gray-700">Action</div>
        </div>

        {/* Medicine Rows */}
        {medicineRows.map((row) => (
          <div key={row.id} className="grid grid-cols-9 gap-2 p-2 border-b">
            <div>
              <Input
                value={row.name}
                onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Select 
                value={row.manufacturer}
                onValueChange={(value) => updateRow(row.id, 'manufacturer', value)}
              >
                <SelectTrigger className="h-10 rounded-lg border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cipla">Cipla</SelectItem>
                  <SelectItem value="Sun Pharma">Sun Pharma</SelectItem>
                  <SelectItem value="Dr. Reddy's">Dr. Reddy's</SelectItem>
                  <SelectItem value="Lupin">Lupin</SelectItem>
                  <SelectItem value="Zydus">Zydus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                value={row.batchNumber}
                onChange={(e) => updateRow(row.id, 'batchNumber', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Select 
                value={row.type}
                onValueChange={(value) => updateRow(row.id, 'type', value)}
              >
                <SelectTrigger className="h-10 rounded-lg border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tablets">Tablets</SelectItem>
                  <SelectItem value="Capsules">Capsules</SelectItem>
                  <SelectItem value="Syrups">Syrups</SelectItem>
                  <SelectItem value="Liquids">Liquids</SelectItem>
                  <SelectItem value="Creams">Creams</SelectItem>
                  <SelectItem value="Inhalers">Inhalers</SelectItem>
                  <SelectItem value="Patches">Patches</SelectItem>
                  <SelectItem value="Injections">Injections</SelectItem>
                  <SelectItem value="Suppositories">Suppositories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                value={row.dosage}
                onChange={(e) => updateRow(row.id, 'dosage', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Input
                type="text"
                value={row.manufacturedDate}
                onChange={(e) => updateRow(row.id, 'manufacturedDate', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <Input
                type="text"
                value={row.expiryDate}
                onChange={(e) => updateRow(row.id, 'expiryDate', e.target.value)}
                className="h-10 rounded-lg border-gray-300"
              />
            </div>
            <div>
              <div className="flex items-center">
                <span className="mr-1">Rs.</span>
                <Input
                  value={row.price}
                  onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                  className="h-10 rounded-lg border-gray-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                disabled={medicineRows.length === 1}
                className="h-8 w-8 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Row Button */}
        <Button
          variant="outline"
          onClick={addNewRow}
          className="mt-4 border-[#7165e1] text-[#7165e1]"
        >
          Add New Row
        </Button>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 mt-6">
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
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
