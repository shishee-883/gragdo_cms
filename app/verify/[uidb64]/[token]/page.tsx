"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyEmailPage() {
  const router = useRouter()
  const params = useParams()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")

  useEffect(() => {
    async function verifyEmail() {
      if (!params.uidb64 || !params.token) {
        setIsVerifying(false)
        setError("Invalid verification link")
        return
      }

      try {
        const uidb64 = params.uidb64 as string
        const token = params.token as string
        
        // Make API request to verify email
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/verify/${uidb64}/${token}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        
        setIsVerifying(false)
        
        if (response.ok && data.success) {
          setIsSuccess(true)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setError(data.message || "Failed to verify email")
        }
      } catch (error) {
        console.error('Error verifying email:', error)
        setIsVerifying(false)
        setError("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [params, router])

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setResendError("Please enter your email address")
      return
    }
    
    setIsResending(true)
    setResendError("")
    setResendSuccess(false)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/resend-verification-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResendSuccess(true)
        setResendError("")
      } else {
        setResendError(data.error || "Failed to resend verification email")
      }
    } catch (error) {
      console.error('Error resending verification email:', error)
      setResendError("An unexpected error occurred")
    } finally {
      setIsResending(false)
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
      
      {/* Right side - Verification status */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Email Verification
            </h1>
            
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
                <p className="mt-4 text-lg text-gray-600">Verifying your email address...</p>
              </div>
            ) : isSuccess ? (
              <div className="py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-green-700 mb-2">Email Verified Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Redirecting to login page in a few seconds...
                </p>
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 mb-2">Verification Failed</h2>
                <p className="text-gray-600 mb-6">
                  {error || "We couldn't verify your email. The verification link may have expired or is invalid."}
                </p>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Resend Verification Email</h3>
                  
                  {resendSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                      Verification email has been sent successfully. Please check your inbox.
                    </div>
                  ) : (
                    <form onSubmit={handleResendVerification} className="space-y-4">
                      <div className="text-left">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      
                      {resendError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                          {resendError}
                        </div>
                      )}
                      
                      <Button 
                        type="submit"
                        className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1] flex items-center justify-center"
                        disabled={isResending}
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    </form>
                  )}
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/login')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}