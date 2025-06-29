"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  role: string
  isAvailable: boolean
  avatar?: string
}

interface UserListProps {
  title: string
  users: User[]
  actionLabel?: string
  actionUrl?: string
  onAction?: () => void
}

export function UserList({ title, users, actionLabel = "Manage", actionUrl, onAction }: UserListProps) {
  const router = useRouter();
  
  const handleAction = () => {
    if (actionUrl) {
      router.push(actionUrl);
    } else if (onAction) {
      onAction();
    }
  };
  
  return (
    <Card className="rounded-[20px] border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-sf-pro font-semibold text-black">
            {title}
          </h3>
          <Button 
            variant="link" 
            className="text-[#7165e1] text-sm font-sf-pro font-medium p-0"
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-sm rounded-xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-sf-pro font-semibold text-black text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user.role}
                  </p>
                </div>
              </div>
              <Badge
                variant={user.isAvailable ? "completed" : "destructive"}
                className="rounded-full text-xs px-3 py-1"
              >
                {user.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}