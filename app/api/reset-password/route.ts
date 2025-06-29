import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uidb64, token, new_password, confirm_password } = body;

    if (!uidb64 || !token || !new_password || !confirm_password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (new_password !== confirm_password) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/reset-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        uidb64, 
        token, 
        new_password, 
        confirm_password 
      }),
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(
      { 
        success: response.ok, 
        message: data.message || (response.ok ? 'Password reset successfully. You can now log in with your new password.' : 'Failed to reset password'),
        error: !response.ok ? data.error : undefined
      },
      { status: response.status }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}