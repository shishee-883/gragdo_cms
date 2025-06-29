"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { login, getCurrentUser } from "@/lib/actions/auth"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Check for saved credentials in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('digigo_email')
    
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await login({
        email,
        password
      })
      
      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('digigo_email', email)
        } else {
          // Clear saved credentials if remember me is unchecked
          localStorage.removeItem('digigo_email')
        }
        
        // Get current user to determine redirect path
        const currentUser = await getCurrentUser()
        
        if (currentUser) {
          // Redirect based on role
          if (currentUser.role === "SUPER_ADMIN") {
            router.push("/profile")
          } else if (currentUser.role === "ADMIN") {
            if (currentUser.clinicId) {
              router.push(`/${currentUser.clinicId}/admin/${currentUser.id}/dashboard`)
            } else {
              router.push("/admin/dashboard")
            }
          } else if (currentUser.role === "STAFF") {
            if (currentUser.clinicId && currentUser.id) {
              router.push(`/${currentUser.clinicId}/staff/${currentUser.id}/dashboard`)
            } else {
              router.push("/staff/dashboard")
            }
          } else if (currentUser.role === "DOCTOR") {
            if (currentUser.clinicId && currentUser.id) {
              router.push(`/${currentUser.clinicId}/doctor/${currentUser.id}/dashboard`)
            } else {
              router.push("/doctor/dashboard")
            }
          } else {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#7165e1] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
        disabled={isLoading}
      >
        {isLoading ? "LOGGING IN..." : "LOGIN"}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-[#7165e1] hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}