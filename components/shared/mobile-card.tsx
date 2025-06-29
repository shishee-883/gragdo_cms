import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MobileCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
}

export function MobileCard({ title, subtitle, children, actions }: MobileCardProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-[#7165e1]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          {children}
        </div>

        {actions && (
          <div className="flex gap-2 mt-4">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  )
}