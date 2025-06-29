import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, refreshAccessToken } from '@/lib/services/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    const refreshTokenValue = cookieStore.get('refresh-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = await verifyToken(token);

    if (payload) {
      // Token is valid, return user data
      return NextResponse.json({
        success: true,
        user: {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          clinicId: payload.clinicId,
          clinicIds: payload.clinicIds,
        }
      });
    } else if (refreshTokenValue) {
      // Token is invalid but we have a refresh token, try to refresh
      const newToken = await refreshAccessToken(refreshTokenValue);
      
      if (newToken) {
        // Set the new token in cookies
        cookies().set('auth-token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });
        
        // Verify the new token
        const newPayload = await verifyToken(newToken);
        
        if (newPayload) {
          // New token is valid, return user data
          return NextResponse.json({
            success: true,
            user: {
              id: newPayload.sub,
              name: newPayload.name,
              email: newPayload.email,
              role: newPayload.role,
              clinicId: newPayload.clinicId,
              clinicIds: newPayload.clinicIds,
            }
          });
        }
      }
    }

    // If we get here, authentication failed
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}