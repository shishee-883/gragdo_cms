import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    const result = await resetPassword(token, newPassword);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}