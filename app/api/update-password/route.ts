import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { current_password, new_password, confirm_password } = body;

    if (!current_password || !new_password || !confirm_password) {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/update-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        current_password, 
        new_password, 
        confirm_password 
      }),
    });

    const data = await response.json();

    // Return the response from the backend
    return NextResponse.json(
      { 
        success: response.ok, 
        message: data.message || (response.ok ? 'Password updated successfully' : 'Failed to update password'),
        error: !response.ok ? data.error : undefined
      },
      { status: response.status }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}