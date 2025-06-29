import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FormLayoutProps {
  title: string
  children: ReactNode
  onSubmit: () => void
  onCancel: () => void
  isSubmitting?: boolean
  submitLabel?: string
  breadcrumb?: ReactNode
}

export function FormLayout({
  title,
  children,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
  breadcrumb
}: FormLayoutProps) {
  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none">
      <CardHeader className="pb-6">
        {breadcrumb && breadcrumb}
        <CardTitle className="text-2xl md:text-3xl font-sf-pro font-semibold text-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 md:px-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] text-white font-medium"
            >
              {isSubmitting ? "Processing..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}