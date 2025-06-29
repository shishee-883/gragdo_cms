"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { signup } from "@/lib/actions/auth"
import { UserRole } from "@/lib/types"
import { Eye, EyeOff } from "lucide-react"
import { useSession } from "@/components/auth/session-provider"

export function SignupForm() {
  const router = useRouter()
  const { login: setSession } = useSession()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const [clinicId, setClinicId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName || !lastName || !email || !phone || !role || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }
    
    // For roles that require a clinic ID
    if ((role === "ADMIN" || role === "STAFF" || role === "DOCTOR") && !clinicId) {
      setError("Clinic ID is required for this role")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await signup({
        firstName,
        lastName,
        email,
        phone,
        role: role as UserRole,
        clinicId: clinicId || undefined,
        password
      })
      
      if (result.success) {
        // Set the session
        if (result.user) {
          setSession(result.user)
        }
        
        // Show success message
        setSuccess(true)
      } else {
        setError(result.error || "Signup failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Account Created Successfully</h3>
          <p>
            Your account has been created. Please check your email to verify your account.
          </p>
        </div>
        
        <Link href="/login">
          <Button className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]">
            PROCEED TO LOGIN
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First Name"
            className="h-12 rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            className="h-12 rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          className="h-12 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="Phone Number"
          className="h-12 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <SelectTrigger className="h-12 rounded-lg">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="DOCTOR">Doctor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(role === "ADMIN" || role === "STAFF" || role === "DOCTOR") && (
        <div className="space-y-2">
          <Label htmlFor="clinicId">Clinic ID</Label>
          <Input
            id="clinicId"
            placeholder="Clinic ID"
            className="h-12 rounded-lg"
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            required
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-12 rounded-lg pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="h-12 rounded-lg pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          required
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Link href="/terms" className="text-[#7165e1] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#7165e1] hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
        disabled={isLoading}
      >
        {isLoading ? "SIGNING UP..." : "SIGN UP"}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#7165e1] hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}