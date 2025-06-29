import { NextRequest, NextResponse } from 'next/server';
import { forgotPassword } from '@/lib/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await forgotPassword(email);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      error: result.error
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}