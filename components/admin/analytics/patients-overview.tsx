"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PatientsOverview() {
  // Data matching the image exactly
  const data = {
    male: 660,
    female: 949,
    children: 818
  }

  const total = data.male + data.female + data.children
  const malePercentage = (data.male / total) * 100
  const femalePercentage = (data.female / total) * 100
  const childrenPercentage = (data.children / total) * 100

  return (
    <Card className="rounded-[20px] border-none shadow-sm h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-sf-pro font-semibold text-black">
          Patients Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Male segment (top-left) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#7165e1"
              strokeWidth="15"
              strokeDasharray={`${malePercentage * 2.199} 219.9`}
              strokeDashoffset="0"
            />
            {/* Female segment (right side - largest) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#a855f7"
              strokeWidth="15"
              strokeDasharray={`${femalePercentage * 2.199} 219.9`}
              strokeDashoffset={`-${malePercentage * 2.199}`}
            />
            {/* Children segment (bottom-left) */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth="15"
              strokeDasharray={`${childrenPercentage * 2.199} 219.9`}
              strokeDashoffset={`-${(malePercentage + femalePercentage) * 2.199}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-black">{data.male+data.female+data.children}</span>
            <span className="text-sm text-gray-600">Total</span>
          </div>
          
          {/* Data labels positioned around the chart */}
          <div className="absolute top-2 left-4 text-center">
            <span className="text-lg font-bold text-black">{data.male}</span>
          </div>
          
          <div className="absolute top-4 right-0 text-center">
            <span className="text-lg font-bold text-black">{data.female}</span>
          </div>
          
          <div className="absolute bottom-4 left-0 text-center">
            <span className="text-lg font-bold text-black">{data.children}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#7165e1] rounded"></div>
            <span className="text-gray-600">Male</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#a855f7] rounded"></div>
            <span className="text-gray-600">Female</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#c4b5fd] rounded"></div>
            <span className="text-gray-600">Children</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}