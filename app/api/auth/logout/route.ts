import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authApi } from '@/lib/services/api';

export async function POST(request: NextRequest) {
  try {
    // Call the backend logout endpoint
    await authApi.logout();
    
    // Clear cookies regardless of the backend response
    cookies().delete('auth-token');
    cookies().delete('refresh-token');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookies even if there's an error
    cookies().delete('auth-token');
    cookies().delete('refresh-token');
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  }
}