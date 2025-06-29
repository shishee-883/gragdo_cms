import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/services/api';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'No refresh token found' },
        { status: 401 }
      );
    }
    
    const response = await authApi.refreshToken(refreshToken);
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to refresh token' },
        { status: 401 }
      );
    }
    
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