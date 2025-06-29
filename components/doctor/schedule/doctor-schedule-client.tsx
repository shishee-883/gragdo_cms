"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Appointment {
  id: string
  patient: {
    patientId: string
    name: string
    phone: string
    gender: string
    age: number
  }
  doctor: {
    name: string
  }
  appointmentDate: Date
  duration: number
  concern: string
  status: string
}

interface PatientDetails {
  id: string
  patientId: string
  name: string
  email?: string
  phone: string
  gender: string
  age: number
  bloodGroup?: string
  bloodPressure?: string
  sugarLevels?: string
}

interface DoctorScheduleClientProps {
  initialAppointments: Appointment[]
  patients: PatientDetails[]
}

export function DoctorScheduleClient({ 
  initialAppointments, 
  patients 
}: DoctorScheduleClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [scheduledAppointments, setScheduledAppointments] = useState<Record<string, string>>({})
  const [currentAppointment, setCurrentAppointment] = useState<PatientDetails | null>(null)
  const [nextAppointment, setNextAppointment] = useState<PatientDetails | null>(null)

  // Generate time slots from 9:00 to 17:00 using useMemo
  const allTimeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  }, []);

  const [timeSlots, setTimeSlots] = useState<string[]>(allTimeSlots)

  // Mock data for patient details
  const mockPatientDetails = {
    "K. Vijay": {
      name: "K. Vijay",
      age: 22,
      sex: "M",
      bloodGroup: "O +ve",
      bloodPressure: "120/80 mmHg",
      sugarLevels: "70 mg/dL",
      concern: "Heart Problem"
    },
    "P. Rahul": {
      name: "P. Rahul",
      age: 25,
      sex: "M",
      bloodGroup: "B +ve",
      bloodPressure: "120/80 mmHg",
      sugarLevels: "70 mg/dL",
      concern: "Heart Problem"
    },
    "P. Anu": {
      name: "P. Anu",
      age: 28,
      sex: "F",
      bloodGroup: "A +ve",
      bloodPressure: "110/70 mmHg",
      sugarLevels: "80 mg/dL",
      concern: "Fever"
    },
    "Ch. Aruna": {
      name: "Ch. Aruna",
      age: 35,
      sex: "F",
      bloodGroup: "AB +ve",
      bloodPressure: "130/85 mmHg",
      sugarLevels: "90 mg/dL",
      concern: "Headache"
    },
    "D. Dhanush": {
      name: "D. Dhanush",
      age: 40,
      sex: "M",
      bloodGroup: "O -ve",
      bloodPressure: "140/90 mmHg",
      sugarLevels: "100 mg/dL",
      concern: "Back Pain"
    },
    "B. Krishna": {
      name: "B. Krishna",
      age: 30,
      sex: "M",
      bloodGroup: "B -ve",
      bloodPressure: "125/85 mmHg",
      sugarLevels: "85 mg/dL",
      concern: "Stomach Pain"
    },
    "T. Ram": {
      name: "T. Ram",
      age: 45,
      sex: "M",
      bloodGroup: "A -ve",
      bloodPressure: "135/88 mmHg",
      sugarLevels: "95 mg/dL",
      concern: "Joint Pain"
    }
  };

  // Set up mock schedule data
  useEffect(() => {
    // This would normally come from the appointments data
    const mockSchedule = {
      "09:30": "K. Vijay",
      "10:00": "P. Rahul",
      "10:30": "P. Anu",
      "11:00": "Ch. Aruna",
      "11:30": "D. Dhanush",
      "12:00": "B. Krishna",
      "12:30": "T. Ram"
    };
    
    setScheduledAppointments(mockSchedule);
    
    // Set current and next appointment based on current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${Math.floor(currentMinute / 30) * 30 === 0 ? '00' : '30'}`;
    
    // Find the current appointment
    const currentPatientName = mockSchedule[currentTimeString];
    if (currentPatientName) {
      setCurrentAppointment(mockPatientDetails[currentPatientName]);
    }
    
    // Find the next appointment
    const timeSlotIndex = allTimeSlots.findIndex(slot => slot === currentTimeString);
    if (timeSlotIndex !== -1 && timeSlotIndex < allTimeSlots.length - 1) {
      const nextTimeSlot = allTimeSlots[timeSlotIndex + 1];
      const nextPatientName = mockSchedule[nextTimeSlot];
      if (nextPatientName) {
        setNextAppointment(mockPatientDetails[nextPatientName]);
      }
    }
  }, [allTimeSlots]);

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Helper component for ChevronDown icon
  function ChevronDown(props) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Upcoming Schedule
        </h1>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-lg font-medium">
            {formatDate(currentDate)}
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="bg-[#f4f3ff] p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-[#7165e1]" />
          </div>
          
          <Button variant="outline" className="rounded-full">
            Day
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          <div className="p-4 font-medium text-gray-500 border-r">TIME</div>
          {timeSlots.slice(0, 6).map((time, index) => (
            <div key={index} className="p-4 font-medium text-center border-r">
              {time}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-b">
          <div className="p-4 font-medium text-gray-500 border-r">PATIENT</div>
          {timeSlots.slice(0, 6).map((time, index) => {
            const patientName = scheduledAppointments[time] || "";
            return (
              <div key={index} className={`p-4 text-center border-r ${patientName ? 'bg-[#f4f3ff] text-[#7165e1]' : ''}`}>
                {patientName}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current and Next Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Appointment */}
        <Card className="rounded-[20px] border-none shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[#7165e1] mb-4">Current Appointment</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{currentAppointment?.name || "No appointment"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Concern</p>
                <p className="font-medium">{currentAppointment?.concern || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Age</p>
                <p className="font-medium">{currentAppointment?.age || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                <p className="font-medium">{currentAppointment?.bloodGroup || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sex</p>
                <p className="font-medium">{currentAppointment?.sex || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blood Pressure</p>
                <p className="font-medium">{currentAppointment?.bloodPressure || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Sugar Levels</p>
                <p className="font-medium">{currentAppointment?.sugarLevels || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Appointment */}
        <Card className="rounded-[20px] border-none shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Next Appointment</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{nextAppointment?.name || "No appointment"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Concern</p>
                <p className="font-medium">{nextAppointment?.concern || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Age</p>
                <p className="font-medium">{nextAppointment?.age || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                <p className="font-medium">{nextAppointment?.bloodGroup || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Sex</p>
                <p className="font-medium">{nextAppointment?.sex || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Blood Pressure</p>
                <p className="font-medium">{nextAppointment?.bloodPressure || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Sugar Levels</p>
                <p className="font-medium">{nextAppointment?.sugarLevels || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}