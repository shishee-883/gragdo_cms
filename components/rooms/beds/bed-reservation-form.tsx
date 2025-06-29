"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar } from "lucide-react"
import { FormLayout } from "@/components/shared/form-layout"
import { InputField, SelectField, RadioGroupField } from "@/components/shared/form-field"

const bedReservationSchema = z.object({
  patientFirstName: z.string().min(1, "First name is required"),
  patientLastName: z.string().min(1, "Last name is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  roomType: z.string().min(1, "Room type is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
})

type BedReservationFormData = z.infer<typeof bedReservationSchema>

interface BedReservationFormProps {
  roomId: string
  onSubmit: (data: BedReservationFormData) => void
  onCancel: () => void
}

export function BedReservationForm({
  roomId,
  onSubmit,
  onCancel,
}: BedReservationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BedReservationFormData>({
    resolver: zodResolver(bedReservationSchema),
    defaultValues: {
      patientFirstName: "Ajay Kumar",
      patientLastName: "Kumar",
      age: "35",
      gender: "Male",
      roomType: "",
      roomNumber: "",
      bedNumber: "",
      admissionDate: "",
    },
  })

  const breadcrumb = (
    <div className="flex items-center text-sm text-gray-600 mb-4">
      <span>Patients</span>
      <span className="mx-2">/</span>
      <span>Rooms</span>
      <span className="mx-2">/</span>
      <span>Beds</span>
      <span className="mx-2">/</span>
      <span className="text-[#7165e1]">Reserve Bed</span>
    </div>
  )

  const handleFormSubmit = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <FormLayout 
      title="Reserve Bed"
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitLabel="Reserve Bed"
      breadcrumb={breadcrumb}
    >
      {/* Row 1: Patient First Name, Patient Last Name, Age, Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField
          id="patientFirstName"
          label="Patient First Name"
          placeholder="Enter First Name"
          required
          register={register("patientFirstName")}
          error={errors.patientFirstName?.message}
        />

        <InputField
          id="patientLastName"
          label="Patient Last Name"
          placeholder="Enter Last Name"
          required
          register={register("patientLastName")}
          error={errors.patientLastName?.message}
        />

        <InputField
          id="age"
          label="Age"
          placeholder="Enter Age"
          required
          register={register("age")}
          error={errors.age?.message}
        />

        <RadioGroupField
          id="gender"
          label="Gender"
          required
          register={register("gender")}
          error={errors.gender?.message}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" }
          ]}
        />
      </div>

      {/* Row 2: Room Type, Room Number, Bed Number, Admission Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField
          id="roomType"
          label="Room Type"
          required
          error={errors.roomType?.message}
          options={[
            { value: "delux", label: "Delux" },
            { value: "standard", label: "Standard" },
            { value: "private", label: "Private" },
            { value: "suite", label: "Suite" },
            { value: "ward", label: "Ward" }
          ]}
          onValueChange={(value) => setValue("roomType", value)}
        />

        <SelectField
          id="roomNumber"
          label="Room Number"
          required
          error={errors.roomNumber?.message}
          options={[
            { value: "1", label: "Room 1" },
            { value: "2", label: "Room 2" },
            { value: "3", label: "Room 3" },
            { value: "4", label: "Room 4" },
            { value: "5", label: "Room 5" }
          ]}
          onValueChange={(value) => setValue("roomNumber", value)}
        />

        <SelectField
          id="bedNumber"
          label="Bed Number"
          required
          error={errors.bedNumber?.message}
          options={[
            { value: "1", label: "Bed 1" },
            { value: "2", label: "Bed 2" },
            { value: "3", label: "Bed 3" },
            { value: "4", label: "Bed 4" }
          ]}
          onValueChange={(value) => setValue("bedNumber", value)}
        />

        <InputField
          id="admissionDate"
          label="Admission Date"
          type="date"
          required
          register={register("admissionDate")}
          error={errors.admissionDate?.message}
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
        />
      </div>
    </FormLayout>
  )
}