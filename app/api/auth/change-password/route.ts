import { NextRequest, NextResponse } from 'next/server';
import { changePassword } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    const result = await changePassword(currentPassword, newPassword);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}