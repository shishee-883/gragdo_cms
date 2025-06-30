// components/admin/users/clinic-user-form.tsx
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
import { Eye, EyeOff } from "lucide-react"

const createUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "doctor", "staff"]),
})

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  role: z.enum(["admin", "doctor", "staff"]),
})

type ClinicUserFormData = z.infer<typeof createUserSchema>

interface ClinicUserFormProps {
  onSubmit: (data: ClinicUserFormData) => void
  onCancel: () => void
  clinicId: string
  currentUser: any
  initialData?: Partial<ClinicUserFormData>
  isEditing?: boolean
}

export function ClinicUserForm({
  onSubmit,
  onCancel,
  clinicId,
  currentUser,
  initialData,
  isEditing = false
}: ClinicUserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClinicUserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      role: "staff",
    },
  })

  const handleFormSubmit = async (data: ClinicUserFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Error with clinic user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {isEditing ? "Edit Clinic User" : "Add Clinic User"}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Row 1: First Name, Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-black">
                First Name
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
                Last Name
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
          </div>

          {/* Row 2: Email, Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-black">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-black">
                Phone Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Enter Phone Number"
                className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
                {...register("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Address */}
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
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Row 4: Password, Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-black">
                  Password<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1] pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>
            )}

            <div className={`space-y-2 ${isEditing ? 'md:col-span-2' : ''}`}>
              <Label htmlFor="role" className="text-sm font-medium text-black">
                Role<span className="text-red-500">*</span>
              </Label>
              <Select 
                defaultValue={initialData?.role || "staff"} 
                onValueChange={(value) => setValue("role", value as "admin" | "doctor" | "staff")}
              >
                <SelectTrigger className="h-12 rounded-lg border-gray-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
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
              {isSubmitting ? "Processing..." : isEditing ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
