"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/actions/auth"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError("Invalid or missing reset token")
      return
    }
    
    if (!password) {
      setError("Please enter a new password")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await resetPassword(token, password)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Password reset failed")
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
          <h3 className="text-lg font-semibold mb-2">Password Reset Successful</h3>
          <p>
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>
        
        <Link href="/login">
          <Button className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]">
            BACK TO LOGIN
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter new password"
          className="h-12 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          className="h-12 rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
        disabled={isLoading}
      >
        {isLoading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-[#7165e1] hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  )
}