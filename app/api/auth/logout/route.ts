import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/services/api';

export async function POST(request: NextRequest) {
  try {
    // Call the backend logout endpoint
    await authApi.logout();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
  }
}