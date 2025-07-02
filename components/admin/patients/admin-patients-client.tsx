'use client'

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
import { useAuth } from "@/components/providers/AuthContext"

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact_number: z.string().min(10, "Contact number must be at least 10 digits"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  address: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

interface PatientFormProps {
  initialData?: Partial<PatientFormData & { id: string }> // include id for updates
  clinicId: string
  onSubmit: () => Promise<void>
  onCancel: () => void
}

export default function PatientForm({
  initialData,
  clinicId,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const { token } = useAuth()

  const handleFormSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    setApiMessage(null)
    try {
      const payload = {
        name: data.name,
        age: data.age,
        email: data.email,
        contact_number: data.contact_number,
        gender: data.gender,
        address: data.address,
        clinic_id: clinicId,
      }
      let response
      if (initialData && initialData.id) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patients/update/${initialData.id}/`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/patients/create`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }
      const result = await response.json()
      if (response.ok && result.success) {
        setIsError(false)
        setApiMessage(result.message || 'Operation successful')
        await onSubmit()
      } else {
        setIsError(true)
        setApiMessage(result.error || result.message || 'Something went wrong')
      }
    } catch (err: any) {
      setIsError(true)
      setApiMessage(err.message || 'Unexpected error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">
          {initialData && initialData.id ? 'Edit Patient' : 'Add New Patient'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {apiMessage && (
          <div className={`p-2 mb-4 text-sm rounded ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {apiMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name<span className="text-red-500">*</span></Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="age">Age<span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => setValue("age", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 100 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="contact_number">Contact Number<span className="text-red-500">*</span></Label>
            <Input id="contact_number" {...register("contact_number")} />
            {errors.contact_number && <p className="text-xs text-red-500">{errors.contact_number.message}</p>}
          </div>

          <div>
            <Label>Gender<span className="text-red-500">*</span></Label>
            <div className="flex gap-4">
              {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                <label key={g} className="flex items-center gap-1">
                  <input type="radio" value={g} {...register('gender')} />
                  {g}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData && initialData.id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
