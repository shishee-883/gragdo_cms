// components/prescriptions/prescription-form.tsx
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
import { FileUpload, FilePreview } from "@/components/shared/file-upload"
import { useSession } from "@/components/auth/session-provider"
import { createPrescriptionRecord } from "@/lib/actions/prescriptions"

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  concern: z.string().min(1, "Concern is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  medications: z.string().min(1, "Medications are required"),
  instructions: z.string().optional(),
  followUpDate: z.string().optional(),
})

type PrescriptionFormData = z.infer<typeof prescriptionSchema>

interface PrescriptionFormProps {
  onSubmit: (data: PrescriptionFormData) => void
  onCancel: () => void
  initialData?: Partial<PrescriptionFormData>
}

export function PrescriptionForm({
  onSubmit,
  onCancel,
  initialData,
}: PrescriptionFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: initialData,
  })

  const handleFileUpload = (url: string, file: File) => {
    setUploadedFiles(prev => [...prev, { name: file.name, url }])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true)
    
    try {
      const clinicId = user?.clinicId
      
      if (!clinicId) {
        throw new Error("No clinic ID available")
      }
      
      // Get the first uploaded file URL if available
      const documentUrl = uploadedFiles.length > 0 ? uploadedFiles[0].url : undefined
      
      const prescriptionData = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        clinicId,
        appointmentId: "apt-001", // This should be dynamic in a real app
        diagnosis: data.diagnosis,
        medications: [
          {
            name: "Medication from form",
            dosage: "As prescribed",
            frequency: "As needed",
            duration: "As directed",
            quantity: 1
          }
        ],
        instructions: data.instructions,
        followUpDate: data.followUpDate,
        document: documentUrl,
        createdById: user?.id || ""
      }
      
      const result = await createPrescriptionRecord(prescriptionData)
      
      if (result.success) {
        onSubmit(data)
      } else {
        console.error("Error saving prescription:", result.error)
      }
    } catch (error) {
      console.error("Error saving prescription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mock data for dropdowns
  const mockPatients = [
    { id: '1', name: 'K. Vijay', patientId: '123456' },
    { id: '2', name: 'P. Sandeep', patientId: '454575' },
    { id: '3', name: 'Ch. Asritha', patientId: '787764' },
  ]

  const mockDoctors = [
    { id: '1', name: 'Dr. K. Ranganath', specialization: 'Cardiology' },
    { id: '2', name: 'Dr. L. Satya', specialization: 'General Medicine' },
    { id: '3', name: 'Dr. G. Anitha', specialization: 'Gynecology' },
  ]

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {initialData?.patientId ? "Edit Prescription" : "Add Prescription"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Row 1: Patient, Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="text-sm font-medium text-black">
                Patient<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("patientId", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.patientId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-xs text-red-500">{errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId" className="text-sm font-medium text-black">
                Doctor<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("doctorId", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.doctorId && (
                <p className="text-xs text-red-500">{errors.doctorId.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Concern, Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="concern" className="text-sm font-medium text-black">
                Concern<span className="text-red-500">*</span>
              </Label>
              <Input
                id="concern"
                placeholder="Enter patient's concern"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("concern")}
              />
              {errors.concern && (
                <p className="text-xs text-red-500">{errors.concern.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis" className="text-sm font-medium text-black">
                Diagnosis<span className="text-red-500">*</span>
              </Label>
              <Input
                id="diagnosis"
                placeholder="Enter diagnosis"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("diagnosis")}
              />
              {errors.diagnosis && (
                <p className="text-xs text-red-500">{errors.diagnosis.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Medications */}
          <div className="space-y-2">
            <Label htmlFor="medications" className="text-sm font-medium text-black">
              Medications<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="medications"
              placeholder="Enter prescribed medications with dosage and frequency"
              className="min-h-[120px] rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
              {...register("medications")}
            />
            {errors.medications && (
              <p className="text-xs text-red-500">{errors.medications.message}</p>
            )}
          </div>

          {/* Row 4: Instructions, Follow-up Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium text-black">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder="Enter special instructions for the patient"
                className="min-h-[100px] rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("instructions")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate" className="text-sm font-medium text-black">
                Follow-up Date
              </Label>
              <Input
                id="followUpDate"
                type="date"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("followUpDate")}
              />
            </div>
          </div>

          {/* Upload Documents Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-black">
              Upload Prescription Documents
            </Label>
            
            <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-8 text-center bg-[#f8f7ff]">
              <FileUpload
                onFileUpload={handleFileUpload}
                folder="prescription-documents"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
                buttonText="Click here to upload prescription files"
                buttonVariant="ghost"
                className="flex flex-col items-center"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-black">Uploaded Files:</p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      onRemove={() => removeFile(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200">
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
              {isSubmitting ? "Saving..." : initialData?.patientId ? "Update Prescription" : "Create Prescription"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
