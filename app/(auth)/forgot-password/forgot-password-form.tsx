"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword } from "@/lib/actions/auth"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError("Please enter your email")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const result = await forgotPassword(email)
      
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
          <h3 className="text-lg font-semibold mb-2">Password Reset Email Sent</h3>
          <p>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your email and follow the instructions to reset your password.
          </p>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Didn't receive the email? Check your spam folder or try again.
        </p>
        
        <Button 
          onClick={() => {
            setSuccess(false)
            setEmail("")
          }}
          variant="outline"
          className="mr-2"
        >
          Try Again
        </Button>
        
        <Link href="/login">
          <Button variant="link" className="text-[#7165e1]">
            Back to Login
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="h-12 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
        disabled={isLoading}
      >
        {isLoading ? "PROCESSING..." : "RESET PASSWORD"}
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