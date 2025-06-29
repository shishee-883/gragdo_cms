import { NextRequest, NextResponse } from 'next/server';

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

    // Forward the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/forgot-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(
      { 
        success: response.ok, 
        message: data.message || (response.ok ? 'Password reset email sent successfully' : 'Failed to send password reset email'),
        error: !response.ok ? data.error : undefined
      },
      { status: response.status }
    );
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}