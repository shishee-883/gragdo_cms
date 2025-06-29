'use server'

import { cookies } from 'next/headers'
import { UserRole } from "@/lib/types"
import { authApi } from '@/lib/services/api'
import { changePassword as changePasswordService, verifyEmail as verifyEmailService, getSession } from '@/lib/services/auth'

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
      // Set the auth token in a cookie
      cookies().set('auth-token', response.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
      
      // Set the refresh token in a cookie
      cookies().set('refresh-token', response.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })
      
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
      // Set the auth token in a cookie
      cookies().set('auth-token', response.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      })
      
      // Set the refresh token in a cookie
      cookies().set('refresh-token', response.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })
      
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

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await authApi.resetPassword(token, newPassword)
    
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
    
    // Clear the auth cookie
    cookies().delete('auth-token')
    // Clear the refresh token cookie
    cookies().delete('refresh-token')
    
    return { success: true }
  } catch (error) {
    console.error("Error during logout:", error)
    return { success: false, error: "An error occurred during logout" }
  }
}

export async function getCurrentUser(token?: string) {
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

export async function refreshToken() {
  try {
    const refreshToken = cookies().get('refresh-token')?.value
    
    if (!refreshToken) {
      return { success: false, error: 'No refresh token found' }
    }
    
    const response = await authApi.refreshToken(refreshToken)
    
    if (!response.access) {
      return { success: false, error: 'Failed to refresh token' }
    }
    
    // Set the new access token in a cookie
    cookies().set('auth-token', response.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error refreshing token:', error)
    return { success: false, error: 'An error occurred while refreshing token' }
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    return await changePasswordService(currentPassword, newPassword)
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, error: 'An error occurred while changing password' }
  }
}

export async function verifyEmail(token: string) {
  try {
    const success = await verifyEmailService(token)
    
    return { 
      success, 
      message: success ? 'Email verified successfully' : 'Failed to verify email' 
    }
  } catch (error) {
    console.error('Error verifying email:', error)
    return { success: false, error: 'An error occurred while verifying email' }
  }
}

export async function getCurrentSession() {
  try {
    return await getSession()
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}