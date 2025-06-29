import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/services/api';

export async function GET(request: NextRequest) {
  try {
    const response = await authApi.getCurrentUser();
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: response.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}