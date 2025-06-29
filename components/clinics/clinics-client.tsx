"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Building2, Users, Calendar, Stethoscope } from "lucide-react"
import { ClinicForm } from "./clinic-form"

interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  description?: string
  stats?: {
    patients: number
    appointments: number
    doctors: number
  }
}

interface ClinicsClientProps {
  initialClinics: Clinic[]
  userRole: string
}

export function ClinicsClient({ initialClinics, userRole }: ClinicsClientProps) {
  const router = useRouter()
  const [clinics, setClinics] = useState(initialClinics)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filter clinics based on search term
  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.phone.includes(searchTerm)
  )

  const handleSubmit = async (data: any) => {
    console.log("Clinic data:", data)
    setIsFormOpen(false)
    // In a real app, you would refresh the clinics data here
  }

  const handleClinicClick = (clinicId: string) => {
    if (userRole === 'SUPER_ADMIN') {
      router.push(`/${clinicId}/admin/dashboard`)
    } else {
      router.push(`/${clinicId}/admin/dashboard`)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Clinics Management
        </h1>
        
        {userRole === 'SUPER_ADMIN' && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="digigo" size="digigo" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Add New Clinic</span>
                <span className="sm:hidden">Add Clinic</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Clinic</DialogTitle>
              </DialogHeader>
              <ClinicForm
                onSubmit={handleSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search clinics..."
            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <Card 
            key={clinic.id} 
            className="rounded-[20px] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClinicClick(clinic.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-[#7165e1] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-sf-pro font-bold text-[#7165e1] mb-1 truncate">
                    {clinic.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {clinic.address}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <p>{clinic.phone}</p>
                {clinic.email && <p>{clinic.email}</p>}
                {clinic.description && (
                  <p className="line-clamp-2">{clinic.description}</p>
                )}
              </div>
              
              {clinic.stats && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Patients</p>
                    <p className="text-lg font-bold text-[#7165e1]">{clinic.stats.patients}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Appointments</p>
                    <p className="text-lg font-bold text-[#7165e1]">{clinic.stats.appointments}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Stethoscope className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600">Doctors</p>
                    <p className="text-lg font-bold text-[#7165e1]">{clinic.stats.doctors}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClinics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[20px] shadow-sm">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500 font-sf-pro mb-2">
            {searchTerm ? "No clinics found matching your search." : "No clinics found."}
          </p>
          {userRole === 'SUPER_ADMIN' && (
            <Button 
              variant="digigo" 
              size="sm" 
              className="mt-4"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Clinic
            </Button>
          )}
        </div>
      )}
    </>
  )
}