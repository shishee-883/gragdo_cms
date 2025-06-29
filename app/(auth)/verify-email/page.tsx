"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmail } from "@/lib/actions/auth"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function verify() {
      if (!token) {
        setIsVerifying(false)
        setError("No verification token provided")
        return
      }

      try {
        const result = await verifyEmail(token)
        
        setIsVerifying(false)
        
        if (result.success) {
          setIsSuccess(true)
        } else {
          setError(result.error || "Failed to verify email")
        }
      } catch (error) {
        setIsVerifying(false)
        setError("An unexpected error occurred")
        console.error(error)
      }
    }

    verify()
  }, [token])

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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
            <p className="text-gray-600">
              {isVerifying 
                ? "Verifying your email address..." 
                : isSuccess 
                  ? "Your email has been verified successfully!" 
                  : "Email verification failed."}
            </p>
          </div>
          
          {isVerifying ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7165e1]"></div>
            </div>
          ) : isSuccess ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Email Verified</h3>
                <p>
                  Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
              
              <Link href="/login">
                <Button className="w-full h-12 rounded-lg bg-[#7165e1] hover:bg-[#5f52d1]">
                  PROCEED TO LOGIN
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
                <p>
                  {error || "We couldn't verify your email. The verification link may have expired or is invalid."}
                </p>
              </div>
              
              <Link href="/login">
                <Button variant="outline" className="mr-2">
                  Back to Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="link" className="text-[#7165e1]">
                  Sign up again
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}