"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Building2,
  Users,
  Calendar,
  Stethoscope,
} from "lucide-react"
import { ClinicForm } from "./clinic-form"
import { useAuthToken } from "@/lib/hooks/useAuthToken"
import { ClinicsClientProps } from "./types"
import { Suspense } from "react"

export function ClinicsClient({
  initialClinics,
  userRole,
}: ClinicsClientProps) {
  const router = useRouter()
  const { token } = useAuthToken()

  const [clinics, setClinics] = useState(initialClinics)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)

  // submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const filteredClinics = clinics.filter((c) =>
    [c.name, c.address, c.phone]
      .some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = {
        name: data.name,
        location: data.address,         // backend expects `location`
        address: data.address,
        contact_number: data.phone,     // backend expects `contact_number`
        email: data.email || undefined,
        description: data.description,
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/clinics/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      )

      const body = await res.json()

      if (res.status === 201 && body.success && body.clinic) {
        // append the new clinic to state
        setClinics((prev) => [body.clinic, ...prev])
        setIsFormOpen(false)
      } else if (res.status === 400 && body.error) {
        // validation or duplicate‐key error from DRF
        setSubmitError(body.error)
      } else if (res.status === 401) {
        router.push("/login")
      } else {
        setSubmitError(body.message || "Unexpected server response")
        console.error("Create clinic failed:", body)
      }
    } catch (err: any) {
      console.error("Network error creating clinic:", err)
      setSubmitError(err.message || "Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClinicClick = (id: string) => {
    if (userRole === "SUPER_ADMIN") {
      router.push(`/${id}/admin/dashboard`)
    }
  }

  return (
    <>
      {/* header + add‐clinic button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Clinics Management
        </h1>

        {userRole === "SUPER_ADMIN" && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                variant="digigo"
                size="digigo"
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Add New Clinic</span>
                <span className="sm:hidden">Add Clinic</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Clinic</DialogTitle>
              </DialogHeader>

              {/* <-- show server‐side errors here --> */}
              {submitError && (
                <p className="px-6 text-sm text-red-500 mb-4">
                  {submitError}
                </p>
              )}

              <ClinicForm
                onSubmit={handleSubmit}
                onCancel={() => setIsFormOpen(false)}
                // disable buttons inside the form
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* search bar */}
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

      {/* grid of clinics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic) => (
          <Card
            key={clinic.id}
            className="rounded-[20px] border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClinicClick(clinic.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#7165e1] rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#2e2e2e] truncate">
                    {clinic.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {clinic.address}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p><strong>📞</strong> {clinic.contact_number}</p>
                {clinic.email && <p><strong>✉️</strong> {clinic.email}</p>}
                {clinic.description && (
                  <p className="line-clamp-3 text-gray-700">{clinic.description}</p>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleClinicClick(clinic.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* no‐results fallback */}
      {filteredClinics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[20px] shadow-sm">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500 font-sf-pro mb-2">
            {searchTerm
              ? "No clinics match your search."
              : "No clinics available."}
          </p>
          {userRole === "SUPER_ADMIN" && (
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
