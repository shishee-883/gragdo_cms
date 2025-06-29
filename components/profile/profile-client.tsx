// components/profile/profile-client.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload, FilePreview } from "@/components/shared/file-upload"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save, 
  Camera,
  Building2,
  Lock
} from "lucide-react"
import { updateUserProfile } from "@/lib/actions/profile"
import { formatDate } from "@/lib/utils"
import { ChangePasswordForm } from "@/components/settings/change-password-form"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  address?: string
  bio?: string
  profileImage?: string
  clinic?: {
    name: string
    address: string
  }
  createdAt: Date
}

interface ProfileClientProps {
  initialProfile: UserProfile
}

export function ProfileClient({ initialProfile }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | undefined>(initialProfile.profileImage)
  const [activeTab, setActiveTab] = useState("profile")
  const [uploadedProfileImage, setUploadedProfileImage] = useState<{name: string, url: string} | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialProfile.name,
      email: initialProfile.email,
      phone: initialProfile.phone || "",
      address: initialProfile.address || "",
      bio: initialProfile.bio || "",
    },
  })

  const handleImageUpload = (url: string, file: File) => {
    setUploadedProfileImage({ name: file.name, url })
    setProfileImage(url)
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const result = await updateUserProfile(initialProfile.id, {
        ...data,
        profileImage: uploadedProfileImage?.url || profileImage
      })
      
      if (result.success) {
        // You could add a toast notification here
        console.log('Profile updated successfully')
      } else {
        console.error('Failed to update profile:', result.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-700'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700'
      case 'USER':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Admin'
      case 'USER':
        return 'User'
      default:
        return role
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-sf-pro font-bold text-[#7165e1]">
          Profile Settings
        </h1>
        
        {activeTab === "profile" && (
          <Button
            variant="digigo"
            size="digigo"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !isDirty}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white rounded-lg p-1">
          <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-[#7165e1] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md data-[state=active]:bg-[#7165e1] data-[state=active]:text-white">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <Card className="lg:col-span-1 rounded-[20px] border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 rounded-2xl">
                    <AvatarImage 
                      src={profileImage || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2"} 
                      alt={initialProfile.name}
                    />
                    <AvatarFallback className="bg-[#7165e1] text-white font-sf-pro font-semibold text-xl rounded-2xl">
                      {initialProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4">
                    <FileUpload
                      onFileUpload={handleImageUpload}
                      folder="profile-images"
                      accept="image/*"
                      multiple={false}
                      buttonText="Change Photo"
                      buttonVariant="outline"
                    />
                  </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-sf-pro font-bold text-[#7165e1] mb-2">
                  {initialProfile.name}
                </h2>
                
                <Badge className={`rounded-full text-sm mb-4 ${getRoleColor(initialProfile.role)}`}>
                  {getRoleLabel(initialProfile.role)}
                </Badge>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{initialProfile.email}</span>
                  </div>
                  
                  {initialProfile.phone && (
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{initialProfile.phone}</span>
                    </div>
                  )}
                  
                  {initialProfile.clinic && (
                    <div className="flex items-center justify-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{initialProfile.clinic.name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {formatDate(initialProfile.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form Card */}
            <Card className="lg:col-span-2 rounded-[20px] border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-sf-pro font-semibold text-[#7165e1]">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Address
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className="h-12 rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      {...register("bio")}
                      className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#7165e1] focus:ring-[#7165e1]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Additional Information Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-sf-pro font-semibold text-[#7165e1] mb-4">
                      Account Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="h-12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center">
                          <Badge className={`rounded-full text-sm ${getRoleColor(initialProfile.role)}`}>
                            {getRoleLabel(initialProfile.role)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                        <div className="h-12 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center text-gray-600">
                          {formatDate(initialProfile.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {initialProfile.clinic && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Associated Clinic</Label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <p className="font-sf-pro font-semibold text-[#7165e1]">
                            {initialProfile.clinic.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {initialProfile.clinic.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="max-w-4xl mx-auto">
            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
