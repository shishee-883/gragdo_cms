import { ResetPasswordForm } from "./reset-password-form"
import Image from "next/image"

export default function ResetPasswordPage() {
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>
          
          {/* Reset password form */}
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}