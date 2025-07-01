"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import dayjs from "dayjs"

interface DailyRevenueReportProps {
  data: Record<string, number>
  onViewMore?: () => void
}

export function DailyRevenueReport({ data, onViewMore }: DailyRevenueReportProps) {
  // Convert your map into a sorted array of { date, amount }
  const bars = useMemo(() => {
    return Object.entries(data)
      .map(([date, amount]) => ({
        date: dayjs(date).format("MMM D"),
        amount,
      }))
      .sort((a, b) => dayjs(a.date, "MMM D").diff(dayjs(b.date, "MMM D")))
      .slice(-7) // last 7 entries
  }, [data])

  const total = useMemo(() => bars.reduce((sum, bar) => sum + bar.amount, 0), [bars])
  const maxValue = useMemo(
    () => (bars.length > 0 ? Math.max(...bars.map((b) => b.amount)) : 0),
    [bars]
  )

  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            Daily Revenue (Last 7 days)
          </h3>
          {onViewMore && (
            <Button
              variant="link"
              className="text-[#7165e1] text-sm font-sf-pro font-medium p-0"
              onClick={onViewMore}
            >
              View more
            </Button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold text-[#7165e1] mb-2">
            ₹ {total.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="h-40 flex items-end justify-between gap-2 mb-4">
          {bars.map((bar, idx) => {
            const heightPercent = maxValue > 0 ? (bar.amount / maxValue) * 100 : 0
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-[#7165e1] rounded-t"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{bar.date}</span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-[#7165e1] rounded" />
          <span className="text-gray-600">Revenue</span>
        </div>
      </CardContent>
    </Card>
  )
}
