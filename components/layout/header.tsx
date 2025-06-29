"use client"

import { useState } from "react"
import { Search, Calendar, Bell, ChevronDown, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { PlanDetailsModal } from "@/components/layout/plan-details-modal"
import Link from "next/link"
import { useSession } from "@/components/auth/session-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"

interface HeaderProps {
  clinicName?: string
  location?: string
}

export function Header({ clinicName = "ABC Clinic", location = "Ongole" }: HeaderProps) {
  const currentDate = new Date()
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const { user, logout } = useSession()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="h-[60px] md:h-[80px] bg-white shadow-[0px_1px_30px_#7165e114] flex items-center px-3 md:px-[20px] justify-between">
      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="hidden sm:flex w-full max-w-[350px] lg:w-[600px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] items-center px-3 md:px-[20px]">
        <Search className="w-4 h-4 md:w-5 md:h-5 text-[#000000b2] flex-shrink-0" />
        <Input
          placeholder="Search patients, appointments..."
          className="ml-2 bg-transparent border-none text-sm md:text-base font-sf-pro font-medium placeholder:text-[#000000b2] focus-visible:ring-0"
        />
      </div>

      {/* Mobile Search Icon */}
      <div className="sm:hidden w-[40px] h-[40px] bg-[#f4f3ff] rounded-[16px] flex items-center justify-center">
        <Search className="w-4 h-4 text-[#7165e1]" />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Plan Selector */}
        <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-[40px] md:h-[50px] px-3 md:px-4 bg-[#7165e1] text-white border-none rounded-[16px] hover:bg-[#5f52d1] flex items-center gap-2"
            >
              <Crown className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base font-sf-pro font-medium">
                Starter Plan
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader>
              <DialogTitle>Plan Details</DialogTitle>
            </DialogHeader>
            <PlanDetailsModal onClose={() => setIsPlanModalOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Date - Hidden on small mobile */}
        <div className="hidden xs:flex w-[120px] sm:w-[160px] md:w-[180px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] items-center justify-center px-2">
          <Calendar className="w-5 h-5 md:w-[28px] md:h-[28px] mr-1 md:mr-[8px] text-[#7165e1] flex-shrink-0" />
          <span className="text-xs md:text-base text-black font-sf-pro font-medium truncate">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* Notifications */}
        <div className="w-[40px] md:w-[50px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] flex items-center justify-center">
          <Bell className="w-5 h-5 md:w-[26px] md:h-[26px] text-[#7165e1]" />
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-[180px] sm:w-[220px] md:w-[280px] h-[40px] md:h-[50px] bg-[#f4f3ff] rounded-[16px] flex items-center px-2 md:px-3 hover:bg-[#eeebff] transition-colors cursor-pointer">
              <Avatar className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-xl flex-shrink-0">
                <AvatarImage src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" />
                <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-sm md:text-base rounded-xl">
                  {user?.name?.charAt(0) || clinicName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 md:ml-3 flex-1 min-w-0">
                <p className="text-sm md:text-lg text-black font-sf-pro font-semibold truncate">
                  {user?.name || clinicName}
                </p>
                <p className="text-xs md:text-sm text-black font-sf-pro truncate">
                  {location}
                </p>
              </div>
              <ChevronDown className="ml-auto w-[12px] h-[6px] md:w-[15px] md:h-[8px] flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px]" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/change-password" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}