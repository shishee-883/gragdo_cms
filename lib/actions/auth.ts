'use server'

import { UserRole } from "@/lib/types"
import { authApi } from '@/lib/services/api'
import { changePassword as changePasswordService } from '@/lib/services/auth'

interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  clinicId?: string
  password: string
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await authApi.login(credentials.email, credentials.password, credentials.role)
    
    if (response.success) {
      return {
        success: true,
        user: response.user
      }
    } else {
      return { success: false, error: response.error || "Invalid credentials" }
    }
  } catch (error) {
    console.error("Error during login:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function signup(data: SignupData) {
  try {
    const response = await authApi.signup(data)
    
    if (response.success) {
      return {
        success: true,
        user: response.user
      }
    } else {
      return { success: false, error: response.error || "Signup failed" }
    }
  } catch (error) {
    console.error("Error during signup:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await authApi.forgotPassword(email)
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
    }
  } catch (error) {
    console.error("Error during password reset:", error)
    return { success: false, error: "An error occurred during password reset" }
  }
}

export async function resetPassword(uidb64: string, token: string, newPassword: string, confirmPassword: string) {
  try {
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        uidb64, 
        token, 
        new_password: newPassword, 
        confirm_password: confirmPassword 
      }),
    });
    
    const data = await response.json();
    
    return { 
      success: response.ok && data.success, 
      message: data.message || (response.ok ? 'Password reset successfully' : 'Failed to reset password'),
      error: !response.ok ? (data.error || 'Failed to reset password') : undefined
    }
  } catch (error) {
    console.error("Error during password reset:", error)
    return { success: false, error: "An error occurred during password reset" }
  }
}

export async function getRedirectPathForRole(role: UserRole, clinicId?: string, userId?: string) {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/clinics"
    case UserRole.ADMIN:
      return clinicId && userId ? `/${clinicId}/admin/${userId}/dashboard` : "/admin/dashboard"
    case UserRole.STAFF:
      return clinicId && userId ? `/${clinicId}/staff/${userId}/dashboard` : "/staff/dashboard"
    case UserRole.DOCTOR:
      return clinicId && userId ? `/${clinicId}/doctor/${userId}/dashboard` : "/doctor/dashboard"
    default:
      return "/"
  }
}

export async function logout() {
  try {
    await authApi.logout()
    return { success: true }
  } catch (error) {
    console.error("Error during logout:", error)
    return { success: false, error: "An error occurred during logout" }
  }
}

export async function getCurrentUser() {
  try {
    const response = await authApi.getCurrentUser()
    
    if (response.success) {
      return response.user
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function refreshToken(refreshToken: string) {
  try {
    if (!refreshToken) {
      return { success: false, error: 'No refresh token found' }
    }
    
    const response = await authApi.refreshToken(refreshToken)
    
    if (!response.success) {
      return { success: false, error: 'Failed to refresh token' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return { success: false, error: 'An error occurred while refreshing token' }
  }
}

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  try {
    const response = await fetch('/api/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        current_password: currentPassword, 
        new_password: newPassword, 
        confirm_password: confirmPassword 
      }),
    });
    
    const data = await response.json();
    
    return { 
      success: response.ok && data.success, 
      message: data.message || (response.ok ? 'Password updated successfully' : 'Failed to update password'),
      error: !response.ok ? (data.error || 'Failed to update password') : undefined
    }
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, error: 'An error occurred while changing password' }
  }
}

export async function verifyEmail(uidb64: string, token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/verify/${uidb64}/${token}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    return { 
      success: response.ok && data.success, 
      message: data.message || (response.ok ? 'Email verified successfully' : 'Failed to verify email'),
      error: !response.ok ? (data.error || 'Failed to verify email') : undefined
    }
  } catch (error) {
    console.error('Error verifying email:', error)
    return { success: false, error: 'An error occurred while verifying email' }
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const response = await authApi.resendVerificationEmail(email)
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
    }
  } catch (error) {
    console.error('Error resending verification email:', error)
    return { success: false, error: 'An error occurred while resending verification email' }
  }
}