'use server'

import { UserRole } from "@/lib/types"
import { authApi } from '@/lib/services/api'

interface LoginCredentials {
  email: string
  password: string
}

interface SignupData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  address?: string
  profile_image?: string
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await authApi.login(credentials.email, credentials.password)
    
    if (response.success) {
      return {
        success: true,
        user: response.user,
        message: response.message,
        token: response.access
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        uidb64, 
        token, 
        new_password: newPassword, 
        confirm_password: confirmPassword 
      }),
    });
    
    const data = await response.json();
    
    return { 
      success: response.ok, 
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

export async function getCurrentUser(token?: string) {
  try {
    if (token) {
      const response = await authApi.getCurrentUser(token);
      if (response.success) {
        return response.profile;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
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
    
    return { success: true, token: response.access }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return { success: false, error: 'An error occurred while refreshing token' }
  }
}

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string, token?: string) {
  try {
    const response = await authApi.updatePassword(currentPassword, newPassword, confirmPassword, token);
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
    }
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, error: 'An error occurred while changing password' }
  }
}

export async function verifyEmail(uidb64: string, token: string) {
  try {
    const response = await authApi.verifyEmail(uidb64, token);
    
    return { 
      success: response.success, 
      message: response.message,
      error: response.error 
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