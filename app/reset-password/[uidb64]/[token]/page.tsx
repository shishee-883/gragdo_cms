"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { resetPassword } from "@/lib/actions/auth"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    // Validate token by making a simple request to check if it's valid
    async function validateToken() {
      if (!params.uidb64 || !params.token) {
        setIsValidToken(false)
        setIsValidatingToken(false)
        return
      }

      try {
        // You could make a lightweight request to validate the token
        // For now, we'll just assume it's valid and let the reset attempt handle validation
        setIsValidToken(true)
        setIsValidatingToken(false)
      } catch (error) {
        console.error('Error validating token:', error)
        setIsValidToken(false)
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const uidb64 = params.uidb64 as string
      const token = params.token as string
      
      const result = await resetPassword(uidb64, token, newPassword, confirmPassword)
      
      if (result.success) {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(result.error || "Password reset failed")
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left side - Image and branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#7165e1] flex-col items-center justify-center text-white p-10 relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
            alt="Healthcare professionals"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-20"
          />
        </div>
        <div className="z-10 text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">We Trust DigiGo Care</h2>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm mt-8">
            <h3 className="text-2xl font-bold mb-2">Welcome to DigiGo Care</h3>
            <h4 className="text-xl font-semibold mb-6">Patient Management System</h4>
            
            <p className="text-sm mb-1">Tested & Trusted by Real Doctors.</p>
            <p className="text-sm">Tested in real clinics. Trusted by professionals.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Reset password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Reset Password
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your new password below.
            </p>
            
            {isValidatingToken ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
                <p className="mt-4 text-lg text-gray-600">Validating your reset link...</p>
              </div>
            ) : !isValidToken ? (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">Invalid Reset Link</h2>
                <p className="text-gray-600 mb-6">
                  The password reset link is invalid or has expired.
                </p>
                <Link href="/forgot-password">
                  <Button className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]">
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            ) : success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-700 mb-2">Password Reset Successful</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Redirecting to login page in a few seconds...
                </p>
                <Link href="/login">
                  <Button className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]">
                    Go to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-12 rounded-lg pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}