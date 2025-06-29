// components/patients/patient-form.tsx
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
import { FileUpload, FilePreview } from "@/components/shared/file-upload"
import { useSession } from "@/components/auth/session-provider"
import { createPatientRecord, updatePatientRecord } from "@/lib/actions/patients"

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  createId: z.string().min(1, "Create ID is required"),
  emailId: z.string().email("Invalid email address").optional().or(z.literal("")),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  occupation: z.string().optional(),
  bloodGroup: z.string().min(1, "Blood group is required"),
  bloodPressure: z.string().optional(),
  sugarLevels: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void
  onCancel: () => void
  initialData?: Partial<PatientFormData>
}

export function PatientForm({
  onSubmit,
  onCancel,
  initialData,
}: PatientFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData,
  })

  const handleFileUpload = (url: string, file: File) => {
    setUploadedFiles(prev => [...prev, { name: file.name, url }])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    
    try {
      const clinicId = user?.clinicId
      
      if (!clinicId) {
        throw new Error("No clinic ID available")
      }
      
      const patientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailId,
        phone: data.mobileNumber,
        gender: data.gender as any,
        dateOfBirth: new Date(new Date().getFullYear() - parseInt(data.age), 0, 1).toISOString().split('T')[0],
        bloodGroup: data.bloodGroup,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        medicalHistory: "",
        allergies: [],
        clinicId,
        createdById: user?.id || "",
        documents: uploadedFiles.map(file => ({
          name: file.name,
          type: "OTHER",
          url: file.url
        }))
      }
      
      let result
      
      if (initialData?.firstName) {
        // Update existing patient
        result = await updatePatientRecord(initialData.id as string, patientData)
      } else {
        // Create new patient
        result = await createPatientRecord(patientData)
      }
      
      if (result.success) {
        onSubmit(data)
      } else {
        console.error("Error saving patient:", result.error)
      }
    } catch (error) {
      console.error("Error saving patient:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {initialData?.firstName ? "Edit Patient" : "Add Patient"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Row 1: First Name, Last Name, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-black">
                First Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter First Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-black">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter Last Name"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-black">
                Age<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("age", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-black">
                Gender<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="MALE"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="FEMALE"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Female</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="OTHER"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Other</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Create ID, Email ID, Mobile Number, Marital Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createId" className="text-sm font-medium text-black">
                Create ID<span className="text-red-500">*</span>
              </Label>
              <Input
                id="createId"
                placeholder="Create Unique ID"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("createId")}
              />
              {errors.createId && (
                <p className="text-xs text-red-500">{errors.createId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailId" className="text-sm font-medium text-black">
                Email ID
              </Label>
              <Input
                id="emailId"
                type="email"
                placeholder="Enter Email ID"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("emailId")}
              />
              {errors.emailId && (
                <p className="text-xs text-red-500">{errors.emailId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-black">
                Mobile Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobileNumber"
                placeholder="Enter Mobile Number"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("mobileNumber")}
              />
              {errors.mobileNumber && (
                <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="text-sm font-medium text-black">
                Marital Status<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("maritalStatus", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              {errors.maritalStatus && (
                <p className="text-xs text-red-500">{errors.maritalStatus.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Occupation, Blood Group, Blood Pressure, Sugar Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-sm font-medium text-black">
                Occupation
              </Label>
              <Select onValueChange={(value) => setValue("occupation", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="homemaker">Homemaker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-sm font-medium text-black">
                Blood Group<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("bloodGroup", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-xs text-red-500">{errors.bloodGroup.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodPressure" className="text-sm font-medium text-black">
                Blood Pressure
              </Label>
              <Input
                id="bloodPressure"
                placeholder="Enter Blood Pressure"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("bloodPressure")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugarLevels" className="text-sm font-medium text-black">
                Sugar Levels
              </Label>
              <Input
                id="sugarLevels"
                placeholder="Enter Sugar Levels"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("sugarLevels")}
              />
            </div>
          </div>

          {/* Row 4: Address, City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-black">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter Address"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("address")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-black">
                City
              </Label>
              <Input
                id="city"
                placeholder="Enter City"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("city")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-black">
                State
              </Label>
              <Select onValueChange={(value) => setValue("state", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="goa">Goa</SelectItem>
                  <SelectItem value="manipur">Manipur</SelectItem>
                  <SelectItem value="meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="tripura">Tripura</SelectItem>
                  <SelectItem value="nagaland">Nagaland</SelectItem>
                  <SelectItem value="mizoram">Mizoram</SelectItem>
                  <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="sikkim">Sikkim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium text-black">
                Postal code
              </Label>
              <Input
                id="postalCode"
                placeholder="Enter Postal Code"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("postalCode")}
              />
            </div>
          </div>

          {/* Upload Reports Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-black">
              Upload Reports
            </Label>
            
            <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-8 text-center bg-[#f8f7ff]">
              <FileUpload
                onFileUpload={handleFileUpload}
                folder="patient-documents"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
                buttonText="Click here to upload file"
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
              {isSubmitting ? "Saving..." : initialData?.firstName ? "Update Patient" : "Create Patient Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
