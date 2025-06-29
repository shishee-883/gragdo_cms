import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import { UserRole } from '@/lib/types';
import { cookies } from 'next/headers';

// Convert string to Uint8Array for jose
const textEncoder = new TextEncoder();

/**
 * Generate a JWT token for a user
 */
export async function generateToken(payload: any): Promise<string> {
  const secret = textEncoder.encode(config.jwt.secret);
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwt.expiresIn)
    .sign(secret);
  
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const secret = textEncoder.encode(config.jwt.secret);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Refresh an access token using a refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    return data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Verify an email using a token
 */
export async function verifyEmail(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/verify-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify email');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
}

/**
 * Change a user's password
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{success: boolean, message?: string, error?: string}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ 
        current_password: currentPassword, 
        new_password: newPassword, 
        confirm_password: newPassword 
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Failed to change password' 
      };
    }
    
    return { 
      success: true, 
      message: data.message || 'Password changed successfully' 
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return { 
      success: false, 
      error: 'An error occurred while changing password' 
    };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    
    if (!payload) {
      // Try to refresh the token
      const refreshToken = cookieStore.get('refresh-token')?.value;
      
      if (!refreshToken) {
        return null;
      }
      
      const newToken = await refreshAccessToken(refreshToken);
      
      if (!newToken) {
        return null;
      }
      
      // Verify the new token
      const newPayload = await verifyToken(newToken);
      
      if (!newPayload) {
        return null;
      }
      
      return {
        user: {
          id: newPayload.sub,
          email: newPayload.email,
          name: newPayload.name,
          role: newPayload.role,
          clinicId: newPayload.clinicId,
          clinicIds: newPayload.clinicIds,
        },
        expires: new Date(newPayload.exp * 1000),
      };
    }
    
    return {
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        clinicId: payload.clinicId,
        clinicIds: payload.clinicIds,
      },
      expires: new Date(payload.exp * 1000),
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Check if the user has a specific role
 */
export async function hasRole(role: UserRole | UserRole[]) {
  const session = await getSession();
  
  if (!session) {
    return false;
  }
  
  if (Array.isArray(role)) {
    return role.includes(session.user.role as UserRole);
  }
  
  return session.user.role === role;
}