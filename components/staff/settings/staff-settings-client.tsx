"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/lib/actions/profile"

const staffSettingsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
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

type StaffSettingsFormData = z.infer<typeof staffSettingsSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  address?: string
  bio?: string
  profileImage?: string
  clinic?: {
    name: string
    address: string
  }
  createdAt: Date
}

interface StaffSettingsClientProps {
  initialProfile: UserProfile
}

export function StaffSettingsClient({ initialProfile }: StaffSettingsClientProps) {
  const [isAvailable, setIsAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Split the name into first and last name
  const nameParts = initialProfile.name.split(' ')
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(' ') || ""

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StaffSettingsFormData>({
    resolver: zodResolver(staffSettingsSchema),
    defaultValues: {
      firstName: firstName || "Ajay Kumar",
      lastName: lastName || "Kumar",
      age: "35",
      gender: "Male",
      createId: "123456",
      emailId: initialProfile.email || "",
      mobileNumber: initialProfile.phone || "9876543210",
      maritalStatus: "Married",
      qualification: "B.Pharm",
      specialization: "Clinical Pharmacy",
      designation: "Staff",
      experience: "3 Years",
      address: initialProfile.address || "1/2-3, ABC Street",
      city: "Ongole",
      state: "Andhra Pradesh",
      postalCode: "523001",
    },
  })

  const onSubmit = async (data: StaffSettingsFormData) => {
    setIsLoading(true)
    try {
      // Combine first and last name
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      
      const result = await updateUserProfile(initialProfile.id, {
        name: fullName,
        email: data.emailId || undefined,
        phone: data.mobileNumber,
        address: data.address
      })
      
      if (result.success) {
        // You could add a toast notification here
        console.log('Profile updated successfully')
      } else {
        console.error('Failed to update profile:', result.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form or navigate away
    console.log('Cancel clicked')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="rounded-[20px] border-2 border-[#7165e1] shadow-sm bg-white">
        <CardContent className="p-8">
          {/* Header with Available Toggle */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
              Account Settings
            </h1>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Available</span>
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: First Name, Last Name, Age, Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-black">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
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
                <Input
                  id="age"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("age")}
                />
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
                      defaultChecked
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
                      defaultChecked
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
                <Input
                  id="qualification"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("qualification")}
                />
                {errors.qualification && (
                  <p className="text-xs text-red-500">{errors.qualification.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium text-black">
                  Specialization<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialization"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("specialization")}
                />
                {errors.specialization && (
                  <p className="text-xs text-red-500">{errors.specialization.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" className="text-sm font-medium text-black">
                  Designation<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("designation")}
                />
                {errors.designation && (
                  <p className="text-xs text-red-500">{errors.designation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium text-black">
                  Experience<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("experience")}
                />
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
                <Input
                  id="state"
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("state")}
                />
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
                  className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-xs text-red-500">{errors.postalCode.message}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isDirty}
                className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
              >
                Edit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}