import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await verifyEmail(token);

    return NextResponse.json({
      success: result,
      message: result ? 'Email verified successfully' : 'Failed to verify email',
      error: !result ? 'Failed to verify email' : undefined
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}