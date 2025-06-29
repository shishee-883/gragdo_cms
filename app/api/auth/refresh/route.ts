import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshAccessToken } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = cookies().get('refresh-token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token found' },
        { status: 401 }
      );
    }
    
    const newToken = await refreshAccessToken(refreshToken);
    
    if (!newToken) {
      return NextResponse.json(
        { success: false, error: 'Failed to refresh token' },
        { status: 401 }
      );
    }
    
    // Set the new token in cookies
    cookies().set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}