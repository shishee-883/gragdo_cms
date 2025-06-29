"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, UserCheck, FileText, CreditCard, Settings, ChevronDown, Building2, Menu, X, Users2, Receipt, Activity, Bed, Pill, FlaskRound as Flask, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/actions/auth"

interface SidebarProps {
  userRole: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'DOCTOR'
  clinicId?: string
  userId?: string
}

export function Sidebar({ userRole, clinicId, userId }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }
    fetchCurrentUser()
  }, [])

  // Use session user role if available
  const effectiveRole = currentUser?.role || userRole
  const effectiveClinicId = currentUser?.clinicId || clinicId
  const effectiveUserId = currentUser?.id || userId

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(false)
        setIsOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    // Check if the current path is a submenu item and expand its parent
    const treatmentsSubmenuPaths = [
      `/${effectiveClinicId}/admin/treatment`, 
      `/${effectiveClinicId}/admin/medicine`, 
      `/admin/treatment`, 
      `/admin/medicine`
    ]
    
    if (treatmentsSubmenuPaths.some(path => pathname.startsWith(path))) {
      setExpandedItems(prev => prev.includes('Treatments') ? prev : [...prev, 'Treatments'])
    }
  }, [pathname, effectiveClinicId])

  const toggleExpanded = (item: string) => {
    setExpandedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
      if (!isCollapsed) {
        setExpandedItems([])
      }
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  // Generate base paths for each role
  const getBasePath = (role: string) => {
    if (effectiveClinicId && effectiveUserId && (role === 'STAFF' || role === 'DOCTOR')) {
      return `/${effectiveClinicId}/${role.toLowerCase()}/${effectiveUserId}`
    } else if (effectiveClinicId) {
      return `/${effectiveClinicId}/${role.toLowerCase()}`
    } else {
      return `/${role.toLowerCase()}`
    }
  }

  // Admin menu items
  const adminMenuItems = [
    {
      name: "Dashboard",
      href: `${getBasePath('ADMIN')}/dashboard`,
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Patients",
      href: `${getBasePath('ADMIN')}/patients`,
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Doctors",
      href: `${getBasePath('ADMIN')}/doctors`,
      icon: UserCheck,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Staffs",
      href: `${getBasePath('ADMIN')}/staffs`,
      icon: Users2,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Appointments",
      href: `${getBasePath('ADMIN')}/appointments`,
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Rooms",
      href: `${getBasePath('ADMIN')}/rooms`,
      icon: Bed,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Treatments",
      icon: Flask,
      roles: ['SUPER_ADMIN', 'ADMIN'],
      hasSubmenu: true,
      submenu: [
        { 
          name: "Treatments list", 
          href: `${getBasePath('ADMIN')}/treatment` 
        },
        { 
          name: "Medicine", 
          href: `${getBasePath('ADMIN')}/medicine` 
        }
      ]
    },
    {
      name: "Transactions",
      href: `${getBasePath('ADMIN')}/transactions`,
      icon: Receipt,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: "Prescription",
      href: `${getBasePath('ADMIN')}/prescriptions`,
      icon: FileText,
      roles: ['SUPER_ADMIN', 'ADMIN', 'USER']
    },
    {
      name: "Analytics",
      href: `${getBasePath('ADMIN')}/analytics`,
      icon: Activity,
      roles: ['SUPER_ADMIN', 'ADMIN']
    }
  ]

  // Doctor menu items
  const doctorMenuItems = [
    {
      name: "Dashboard",
      href: `${getBasePath('DOCTOR')}/dashboard`,
      icon: LayoutDashboard,
      roles: ['DOCTOR']
    },
    {
      name: "Patients",
      href: `${getBasePath('DOCTOR')}/patients`,
      icon: Users,
      roles: ['DOCTOR']
    },
    {
      name: "Appointments",
      href: `${getBasePath('DOCTOR')}/appointments`,
      icon: Calendar,
      roles: ['DOCTOR']
    },
    {
      name: "Schedule",
      href: `${getBasePath('DOCTOR')}/schedule`,
      icon: Clock,
      roles: ['DOCTOR']
    },
    {
      name: "Prescriptions",
      href: `${getBasePath('DOCTOR')}/prescriptions`,
      icon: FileText,
      roles: ['DOCTOR']
    },
    {
      name: "Settings",
      href: `${getBasePath('DOCTOR')}/settings`,
      icon: Settings,
      roles: ['DOCTOR']
    }
  ]

  // Staff menu items
  const staffMenuItems = [
    {
      name: "Dashboard",
      href: `${getBasePath('STAFF')}/dashboard`,
      icon: LayoutDashboard,
      roles: ['STAFF']
    },
    {
      name: "Appointments",
      href: `${getBasePath('STAFF')}/appointments`,
      icon: Calendar,
      roles: ['STAFF']
    },
    {
      name: "Patients",
      href: `${getBasePath('STAFF')}/patients`,
      icon: Users,
      roles: ['STAFF']
    },
    {
      name: "Doctors",
      href: `${getBasePath('STAFF')}/doctors`,
      icon: UserCheck,
      roles: ['STAFF']
    },
    {
      name: "Rooms",
      href: `${getBasePath('STAFF')}/rooms`,
      icon: Bed,
      roles: ['STAFF']
    },
    {
      name: "Prescriptions",
      href: `${getBasePath('STAFF')}/prescriptions`,
      icon: FileText,
      roles: ['STAFF']
    },
    {
      name: "Billing & Invoice",
      href: `${getBasePath('STAFF')}/billing`,
      icon: CreditCard,
      roles: ['STAFF']
    },
    {
      name: "Settings",
      href: `${getBasePath('STAFF')}/settings`,
      icon: Settings,
      roles: ['STAFF']
    }
  ]

  // Determine which menu items to show based on user role
  let menuItems = effectiveRole === 'DOCTOR' 
    ? doctorMenuItems 
    : (effectiveRole === 'STAFF' ? staffMenuItems : adminMenuItems);
  
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(effectiveRole)
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 bg-white shadow-md border hover:bg-gray-50"
        >
          <Menu className="h-5 w-5 text-[#7165e1]" />
        </Button>

        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-full w-[280px] bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            className="absolute right-4 top-4 h-8 w-8"
          >
            <X className="h-4 w-4 text-[#7165e1]" />
          </Button>

          {/* Logo */}
          <div className="flex items-center px-6 py-6 mt-8">
            <div className="w-[40px] h-[40px] bg-[#7165e1] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 font-extrabold text-[#7165e1] text-[20px] tracking-[-0.22px] font-tt-tricks">
              DigiGo Care
            </h1>
          </div>

          {/* Navigation */}
          <nav className="px-6 space-y-2 flex-1 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <div key={item.name}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      className={cn(
                        "flex items-center w-full p-3 rounded-[12px] transition-all duration-200 hover:bg-[#7165e1]/10",
                        expandedItems.includes(item.name) ? "bg-[#7165e1]/10" : ""
                      )}
                      onClick={() => toggleExpanded(item.name)}
                    >
                      <item.icon className="w-[24px] h-[24px] text-[#888888]" />
                      <span className="ml-4 text-base font-sf-pro font-semibold text-[#888888]">
                        {item.name}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "ml-auto w-[20px] h-[20px] text-[#888888] transition-transform",
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    
                    {expandedItems.includes(item.name) && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block p-2 rounded-lg text-sm font-sf-pro transition-colors",
                              pathname === subItem.href 
                                ? "bg-[#7165e1] text-white" 
                                : "text-[#888888] hover:bg-[#7165e1]/10"
                            )}
                            onClick={closeMobileSidebar}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href as string}
                    className={cn(
                      "flex items-center p-3 rounded-[12px] transition-all duration-200 hover:bg-[#7165e1]/10",
                      pathname === item.href ? "bg-[#7165e1]" : ""
                    )}
                    onClick={closeMobileSidebar}
                  >
                    <item.icon className="w-[24px] h-[24px]" />
                    <span
                      className={cn(
                        "ml-4 text-base font-sf-pro font-semibold",
                        pathname === item.href ? "text-white" : "text-[#888888]"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>
      </>
    )
  }

  return (
    <aside className={cn(
      "bg-white h-full flex flex-col shadow-lg transition-all duration-300 ease-in-out relative hidden md:flex",
      isCollapsed ? "w-[80px]" : "w-[300px]"
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white shadow-md border hover:bg-gray-50",
          "flex items-center justify-center"
        )}
      >
        {isCollapsed ? (
          <Menu className="h-3 w-3 text-[#7165e1]" />
        ) : (
          <X className="h-3 w-3 text-[#7165e1]" />
        )}
      </Button>

      {/* Logo */}
      <div className={cn(
        "flex items-center px-[24px] py-6 transition-all duration-300",
        isCollapsed && "px-[20px] justify-center"
      )}>
        <div className="w-[40px] h-[40px] bg-[#7165e1] rounded-lg flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <h1 className="ml-3 font-extrabold text-[#7165e1] text-[22px] tracking-[-0.22px] font-tt-tricks transition-opacity duration-300">
            DigiGo Care
          </h1>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "mt-[50px] px-[24px] space-y-3 flex-1 transition-all duration-300",
        isCollapsed && "px-[20px]"
      )}>
        {filteredMenuItems.map((item) => (
          <div key={item.name}>
            {item.hasSubmenu ? (
              <div>
                <button
                  className={cn(
                    "flex items-center w-full p-3 rounded-[16px] transition-all duration-200 hover:bg-[#7165e1]/10 group",
                    expandedItems.includes(item.name) ? "bg-[#7165e1]/10" : "",
                    isCollapsed && "justify-center"
                  )}
                  onClick={() => !isCollapsed && toggleExpanded(item.name)}
                >
                  <item.icon className="w-[28px] h-[28px] flex-shrink-0 text-[#888888]" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-[24px] text-lg font-sf-pro font-semibold text-[#888888] transition-opacity duration-300">
                        {item.name}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "ml-auto w-[24px] h-[24px] text-[#888888] transition-transform duration-200",
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        )}
                      />
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-[90px] bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </button>
                
                {/* Submenu */}
                {item.hasSubmenu && !isCollapsed && expandedItems.includes(item.name) && (
                  <div className="ml-[52px] mt-2 space-y-2 transition-all duration-300">
                    {item.submenu?.map((subItem:any) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "block p-2 rounded-lg text-base font-sf-pro transition-colors duration-200",
                          pathname === subItem.href 
                            ? "bg-[#7165e1] text-white" 
                            : "text-[#888888] hover:bg-[#7165e1]/10"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href as string}
                className={cn(
                  "flex items-center p-3 rounded-[16px] transition-all duration-200 hover:bg-[#7165e1]/10 group",
                  pathname === item.href ? "bg-[#7165e1]" : "",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="w-[28px] h-[28px] flex-shrink-0" />
                {!isCollapsed && (
                  <span
                    className={cn(
                      "ml-[24px] text-lg font-sf-pro font-semibold transition-opacity duration-300",
                      pathname === item.href ? "text-white" : "text-[#888888]"
                    )}
                  >
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-[90px] bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}