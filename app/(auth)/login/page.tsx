import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginForm } from "./login-form"

export default function LoginPage() {
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
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started Now</h1>
            <p className="text-gray-600">Welcome back, Simplified Patient Management System.</p>
          </div>
          
          {/* Social login buttons */}
          <div className="flex gap-4 mb-6">
            <Button variant="outline" className="w-1/2 h-12 rounded-full">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true">
                <path
                  d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                  fill="currentColor"
                />
              </svg>
              Login with Google
            </Button>
            <Button variant="outline" className="w-1/2 h-12 rounded-full">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" aria-hidden="true">
                <path
                  d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.18 14.77 3.06 6.07 9.09 5.87c1.18.05 2.03.79 2.74.83 1.03-.12 2-.9 3.04-.86 1.51.08 2.63.64 3.4 1.64-2.99 1.79-2.23 5.41.26 6.79-.67 1.93-1.5 3.82-2.48 6.01zM12.03 5.67c-.12-2.76 2.25-5.06 4.94-5.2.28 2.78-2.01 5.13-4.94 5.2z"
                  fill="currentColor"
                />
              </svg>
              Login with Apple
            </Button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          {/* Login form */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}