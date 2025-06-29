"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorName: string
  concern: string
  gender: string
  age: number
  reports: {
    id: string
    name: string
    type: string
    url: string
  }[]
  prescriptions: {
    id: string
    name: string
    type: string
    url: string
  }[]
  createdAt: Date
}

interface PrescriptionViewerProps {
  isOpen: boolean
  onClose: () => void
  prescription: Prescription
}

export function PrescriptionViewer({
  isOpen,
  onClose,
  prescription
}: PrescriptionViewerProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    console.log('Downloading prescription:', prescription.id)
    // For demo purposes, we'll just show an alert
    alert(`Downloading prescription for ${prescription.patientName}...`)
  }

  // Mock data for the prescription
  const mockPrescriptionData = {
    doctor: {
      name: "Dr. Ch. Asritha",
      qualification: "MBBS, MS - Gynecology",
      clinic: "Clinic Name",
      email: "sample@gmail.com",
      phone: "9876543210"
    },
    patient: {
      name: prescription.patientName,
      age: prescription.age,
      sex: prescription.gender === "MALE" ? "M" : prescription.gender === "FEMALE" ? "F" : "O",
      bloodGroup: "O +ve",
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    },
    medications: [
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      },
      {
        medicine: "Amoxicillin",
        content: "500mg",
        price: "1000",
        dosage: "1 Tab",
        usage: "1-0-1",
        days: "3",
        qty: "9",
        advice: "After Food"
      }
    ]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-[#f4f3ff] h-16 w-full rounded-t-lg"></div>
        
        <div className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            {/* Doctor Info */}
            <div>
              <h1 className="text-2xl font-bold text-[#7165e1] mb-2">
                {mockPrescriptionData.doctor.name}
              </h1>
              <p className="text-gray-600 mb-1">{mockPrescriptionData.doctor.qualification}</p>
              <p className="text-gray-600 mb-1">{mockPrescriptionData.doctor.clinic}</p>
              <p className="text-gray-600 mb-1">Email: {mockPrescriptionData.doctor.email}</p>
              <p className="text-gray-600">Phone No.: {mockPrescriptionData.doctor.phone}</p>
            </div>
            
            {/* Logo */}
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-[#7165e1]">
                <div className="w-8 h-8 bg-[#7165e1] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">D</span>
                </div>
                DigiGo Care
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Patient Name</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{mockPrescriptionData.patient.name}</h3>
            
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Age</span>
                <p className="font-semibold">{mockPrescriptionData.patient.age}</p>
              </div>
              <div>
                <span className="text-gray-600">Sex</span>
                <p className="font-semibold">{mockPrescriptionData.patient.sex}</p>
              </div>
              <div>
                <span className="text-gray-600">Blood Group</span>
                <p className="font-semibold">{mockPrescriptionData.patient.bloodGroup}</p>
              </div>
              <div>
                <span className="text-gray-600">Date</span>
                <p className="font-semibold">{mockPrescriptionData.patient.date}</p>
              </div>
              <div>
                <span className="text-gray-600">Time</span>
                <p className="font-semibold">{mockPrescriptionData.patient.time}</p>
              </div>
            </div>
          </div>

          {/* Prescription Table */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#7165e1] mb-4">Rx</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Medicine</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Content</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Price</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Dosage</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Usage</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Days</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Qty</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPrescriptionData.medications.map((medication, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.medicine}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.content}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.price}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.dosage}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.usage}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.days}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.qty}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{medication.advice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button 
              onClick={handleDownload}
              className="bg-[#7165e1] hover:bg-[#5f52d1] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}