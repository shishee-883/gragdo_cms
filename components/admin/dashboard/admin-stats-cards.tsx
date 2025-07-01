"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, UserCheck, Users2 } from "lucide-react"

interface AdminStatsCardsProps {
  stats: {
    total_patients: number
    total_appointments: number
    total_doctors: number
    total_staff: number
  }
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const statsData = [
    {
      title: "Total patients",
      value: stats.total_patients.toString(),
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      cardColor: "bg-blue-50",
    },
    {
      title: "Appointments",
      value: stats.total_appointments.toString(),
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      cardColor: "bg-purple-50",
    },
    {
      title: "Doctors",
      value: stats.total_doctors.toString(),
      icon: UserCheck,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      cardColor: "bg-green-50",
    },
    {
      title: "Staff",
      value: stats.total_staff.toString(),
      icon: Users2,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      cardColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, idx) => (
        <Card
          key={idx}
          className={`rounded-[20px] border-none shadow-sm ${stat.cardColor}`}
        >
          <CardContent className="p-4 flex items-center">
            <div
              className={`w-[50px] h-[50px] ${stat.bgColor} rounded-[12px] flex items-center justify-center flex-shrink-0`}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <p className="text-sm text-gray-600 font-medium truncate">
                {stat.title}
              </p>
              <p className="text-2xl text-[#7165e1] font-bold">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
