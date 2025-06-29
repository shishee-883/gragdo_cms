import { ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

interface PageLayoutProps {
  children: ReactNode
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'DOCTOR'
  title?: string
}

export function PageLayout({ children, userRole, title }: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-[#f4f3ff]">
      <Sidebar userRole={userRole} />
      
      <main className="flex-1 overflow-auto ml-0 md:ml-0">
        <Header />
        
        <div className="p-4 md:p-6 lg:p-[34px]">
          {title && (
            <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1] mb-6">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}