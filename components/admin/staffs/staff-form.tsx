// components/admin/staffs/staff-form.tsx
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

const staffSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  createId: z.string().min(1, "Create ID is required"),
  emailId: z.string().email("Invalid email address").optional().or(z.literal("")),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  qualification: z.string().min(1, "Qualification is required"),
  specialization: z.string().min(1, "Specialization is required"),
  designation: z.string().min(1, "Designation is required"),
  experience: z.string().min(1, "Experience is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
})

type StaffFormData = z.infer<typeof staffSchema>

interface StaffFormProps {
  onSubmit: (data: StaffFormData) => void
  onCancel: () => void
  initialData?: Partial<StaffFormData>
}

export function StaffForm({
  onSubmit,
  onCancel,
  initialData,
}: StaffFormProps) {
  const [profileImage, setProfileImage] = useState<{name: string, url: string} | null>(null)
  const [documentFiles, setDocumentFiles] = useState<{name: string, url: string}[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData,
  })

  const handleProfileImageUpload = (url: string, file: File) => {
    setProfileImage({ name: file.name, url })
  }

  const handleDocumentUpload = (url: string, file: File) => {
    setDocumentFiles(prev => [...prev, { name: file.name, url }])
  }

  const removeDocument = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = async (data: StaffFormData) => {
    setIsSubmitting(true)
    
    try {
      // In a real app, you would send the profile image and documents to the server
      const staffData = {
        ...data,
        profileImage: profileImage?.url,
        documents: documentFiles.map(doc => doc.url)
      }
      
      // Call the onSubmit callback with the enhanced data
      onSubmit(data)
    } catch (error) {
      console.error("Error saving staff:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {initialData?.firstName ? "Edit Staff" : "Add Staff"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="space-y-4 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage.url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">
                      {initialData?.firstName?.charAt(0) || "S"}
                    </span>
                  )}
                </div>
              </div>
              
              <FileUpload
                onFileUpload={handleProfileImageUpload}
                folder="staff-profiles"
                accept="image/*"
                multiple={false}
                buttonText="Upload Profile Image"
                buttonVariant="outline"
              />
            </div>
          </div>

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
                  {Array.from({ length: 60 }, (_, i) => i + 18).map((age) => (
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
                    value="Male"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Female"
                    {...register("gender")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Female</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Other"
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
              <Label className="text-sm font-medium text-black">
                Marital Status<span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Married"
                    {...register("maritalStatus")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Married</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Unmarried"
                    {...register("maritalStatus")}
                    className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
                  />
                  <span className="text-sm">Unmarried</span>
                </label>
              </div>
              {errors.maritalStatus && (
                <p className="text-xs text-red-500">{errors.maritalStatus.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Qualification, Specialization, Designation, Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qualification" className="text-sm font-medium text-black">
                Qualification<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("qualification", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Pharm">B.Pharm</SelectItem>
                  <SelectItem value="D.Pharm">D.Pharm</SelectItem>
                  <SelectItem value="M.Pharm">M.Pharm</SelectItem>
                  <SelectItem value="BSc Nursing">BSc Nursing</SelectItem>
                  <SelectItem value="GNM">GNM</SelectItem>
                  <SelectItem value="ANM">ANM</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                  <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                </SelectContent>
              </Select>
              {errors.qualification && (
                <p className="text-xs text-red-500">{errors.qualification.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-black">
                Specialization<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("specialization", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clinical Pharmacy">Clinical Pharmacy</SelectItem>
                  <SelectItem value="Hospital Pharmacy">Hospital Pharmacy</SelectItem>
                  <SelectItem value="Community Pharmacy">Community Pharmacy</SelectItem>
                  <SelectItem value="Critical Care Nursing">Critical Care Nursing</SelectItem>
                  <SelectItem value="Emergency Nursing">Emergency Nursing</SelectItem>
                  <SelectItem value="General Nursing">General Nursing</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Reception">Reception</SelectItem>
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="text-xs text-red-500">{errors.specialization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation" className="text-sm font-medium text-black">
                Designation<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("designation", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apprentice">Apprentice</SelectItem>
                  <SelectItem value="Compounder">Compounder</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Head Nurse">Head Nurse</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Assistant">Assistant</SelectItem>
                </SelectContent>
              </Select>
              {errors.designation && (
                <p className="text-xs text-red-500">{errors.designation.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-black">
                Experience<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("experience", value)}>
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                  <SelectItem value="4 Years">4 Years</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                  <SelectItem value="5+ Years">5+ Years</SelectItem>
                  <SelectItem value="10+ Years">10+ Years</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience && (
                <p className="text-xs text-red-500">{errors.experience.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: Address, City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-black">
                Address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Enter Address"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-black">
                City<span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Enter City"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-black">
                State<span className="text-red-500">*</span>
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
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-medium text-black">
                Postal code<span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                placeholder="Enter Postal Code"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("postalCode")}
              />
              {errors.postalCode && (
                <p className="text-xs text-red-500">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Upload Documents
            </Label>
            <div className="border-2 border-dashed border-[#7165e1] rounded-lg p-6 text-center bg-[#f8f7ff]">
              <FileUpload
                onFileUpload={handleDocumentUpload}
                folder="staff-documents"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
                buttonText="Upload Documents"
                buttonVariant="ghost"
                className="flex flex-col items-center"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
            
            {/* Display uploaded documents */}
            {documentFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                {documentFiles.map((file, index) => (
                  <FilePreview
                    key={index}
                    file={file}
                    onRemove={() => removeDocument(index)}
                  />
                ))}
              </div>
            )}
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
              {isSubmitting || formSubmitting ? "Adding..." : initialData?.firstName ? "Update Staff" : "Add Staff"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
