"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Upload, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PrescriptionForm } from "@/components/prescriptions/prescription-form"

interface PatientDetailsClientProps {
  patient: any
}

export function PatientDetailsClient({ patient }: PatientDetailsClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleSubmit = async (data: any) => {
    console.log("Prescription data:", data)
    setIsFormOpen(false)
  }

  // Mock data for patient details
  const patientDetails = {
    name: patient?.name || "K. Vijay Kumar",
    age: patient?.age || 22,
    sex: patient?.gender === "MALE" ? "M" : patient?.gender === "FEMALE" ? "F" : "M",
    bloodGroup: "O +ve",
    bloodPressure: "120/80 mmHg",
    sugarLevels: "70 mg/dL",
    chiefComplaint: [
      { complaint: "Chest pain & back pain", duration: "from 5 days" },
      { complaint: "Tiredness", duration: "from 2 weeks" }
    ],
    history: [
      { condition: "High Cholesterol", duration: "from 1 year" },
      { condition: "Lower back injury", duration: "3 months back" }
    ],
    diagnosis: [
      { test: "Blood test", reportUrl: "#" },
      { test: "Electrocardiogram (ECG)", reportUrl: "#" },
      { test: "X-ray", reportUrl: "#" },
      { test: "CT scan", reportUrl: "#" }
    ],
    visits: [
      { date: "30-05-2025", type: "Revisit", comments: "View comments" },
      { date: "20-05-2025", type: "Revisit", comments: "View comments" },
      { date: "10-05-2025", type: "Revisit", comments: "View comments" },
      { date: "30-04-2025", type: "Revisit", comments: "View comments" },
      { date: "20-04-2025", type: "First visit", comments: "View comments" }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/doctor/patients" className="text-gray-600 hover:text-[#7165e1]">
          Patients
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-[#7165e1]">Patient details</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-black">
          Patient Details
        </h1>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="digigo" size="sm" className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Patient Basic Info */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Patient Name */}
            <div>
              <h2 className="text-sm text-gray-500 mb-1">Patient Name</h2>
              <p className="text-lg font-semibold">{patientDetails.name}</p>
            </div>

            {/* Vital Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Age</h2>
                <p className="font-medium">{patientDetails.age}</p>
              </div>
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Sex</h2>
                <p className="font-medium">{patientDetails.sex}</p>
              </div>
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Blood Group</h2>
                <p className="font-medium">{patientDetails.bloodGroup}</p>
              </div>
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Blood Pressure</h2>
                <p className="font-medium">{patientDetails.bloodPressure}</p>
              </div>
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Sugar Levels</h2>
                <p className="font-medium">{patientDetails.sugarLevels}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chief Complaint and Visit History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chief Complaint */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#7165e1] mb-4">Chief Complaint</h2>
            <ul className="space-y-3">
              {patientDetails.chiefComplaint.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-[#7165e1] rounded-full mt-2 mr-2"></span>
                  <div>
                    <span className="font-medium">{item.complaint}</span>
                    <span className="text-gray-500 text-sm ml-1">({item.duration})</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Visit History */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#7165e1] mb-4">Visit History</h2>
            <div className="space-y-4">
              {patientDetails.visits.map((visit, index) => (
                <div key={index} className="flex items-start">
                  {index === 0 ? (
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">T</span>
                      </div>
                      <div className="h-full w-0.5 bg-[#7165e1] mt-1"></div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-6 h-6 bg-[#7165e1] rounded-full"></div>
                      <div className="h-full w-0.5 bg-[#7165e1] mt-1"></div>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{visit.type} on {visit.date}</p>
                    <Button variant="link" className="p-0 h-auto text-[#7165e1] text-sm">
                      {visit.comments}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History and Diagnosis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#7165e1] mb-4">History</h2>
            <ul className="space-y-3">
              {patientDetails.history.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-[#7165e1] rounded-full mt-2 mr-2"></span>
                  <div>
                    <span className="font-medium">{item.condition}</span>
                    <span className="text-gray-500 text-sm ml-1">({item.duration})</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#7165e1] mb-4">Diagnosis</h2>
            <ul className="space-y-3">
              {patientDetails.diagnosis.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-[#7165e1] rounded-full mt-2 mr-2"></span>
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{item.test}</span>
                    <Button variant="link" className="p-0 h-auto text-[#7165e1] text-sm">
                      View report
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <Button 
              variant="outline" 
              className="mt-6 border-[#7165e1] text-[#7165e1] hover:bg-[#7165e1] hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}