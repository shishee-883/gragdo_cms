"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Eye } from "lucide-react"
import { DoctorForm } from "./doctor-form"
import { useAuthToken } from '@/lib/hooks/useAuthToken'

interface Doctor {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address: number | string
  role: number
  availability: string
  qualification: boolean
  specialization: string
  designation: string
  experience: string
}

interface AdminDoctorsClientProps {
  doctors: Doctor[],
  clinicId: string
}

export function AdminDoctorsClient({ doctors = [], clinicId }: AdminDoctorsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    const { token } = useAuthToken()
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/add-clinc-users/${clinicId}`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, role: "doctor", clinicId })
      })

    if (!res.ok) throw new Error(`Error ${res.status}`)

    setIsFormOpen(false)
    setEditingDoctor(null)
  } catch (err) {
    console.error('Failed to save doctor:', err)
  }
}


  const handleView = (id: string) => {
    window.location.href = `/admin/doctors/${id}`
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Doctors Management
        </h1>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden sm:inline">Add New Doctor</span>
              <span className="sm:hidden">Add Doctor</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <DoctorForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingDoctor(null)
              }}
              currentUser={null}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm">
        <div className="p-4 md:p-6 lg:p-[34px]">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl text-black font-sf-pro font-semibold">
              Doctors List
            </h2>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {Array.isArray(doctors) && doctors.map((doctor) => (
              <Card key={doctor.id} className="border border-gray-200">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#7165e1]">
                        {doctor.first_name} {doctor.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {doctor.id}</p>
                    </div>
                    <Badge variant="default" className="rounded-[20px] text-xs">
                      {doctor.qualification}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <div><strong>Email:</strong> {doctor.email}</div>
                    <div><strong>Phone:</strong> {doctor.phone_number}</div>
                    <div><strong>Address:</strong> {doctor.address}</div>
                    <div><strong>Specialization:</strong> {doctor.specialization}</div>
                    <div><strong>Designation:</strong> {doctor.designation}</div>
                    <div><strong>Experience:</strong> {doctor.experience}</div>
                    <div><strong>Availability:</strong> {doctor.availability}</div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(doctor.id)}>
                      <Eye className="w-5 h-5 text-[#7165e1]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader className="bg-[#f4f3ff] rounded-[10px]">
                  <TableRow>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">ID</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Doctor Name</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Email</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Phone Number</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Address</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Specialization</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Qualification</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Designation</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Experience</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium">Availability</TableHead>
                    <TableHead className="text-[#888888] text-lg font-sf-pro font-medium text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(doctors) && doctors.map((doctor) => (
                    <TableRow
                      key={doctor.id}
                      className="bg-[#f4f3ff] hover:bg-[#eeebff] cursor-pointer"
                      onClick={() => handleView(doctor.id)}
                    >
                      <TableCell>{doctor.id}</TableCell>
                      <TableCell>{doctor.first_name} {doctor.last_name}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.phone_number}</TableCell>
                      <TableCell>{doctor.address}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.qualification}</TableCell>
                      <TableCell>{doctor.designation}</TableCell>
                      <TableCell>{doctor.experience}</TableCell>
                      <TableCell>{doctor.availability}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => handleView(doctor.id)}>
                          <Eye className="w-5 h-5 text-[#7165e1]" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* No Doctors Message */}
          {Array.isArray(doctors) && doctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 font-sf-pro">
                No doctors found. Add your first doctor to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
