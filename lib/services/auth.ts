import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import { UserRole } from '@/lib/types';

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
      body: JSON.stringify({ 
        currentPassword, 
        newPassword 
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return null;
    }
    
    return {
      user: data.user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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