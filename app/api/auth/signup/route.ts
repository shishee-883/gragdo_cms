import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/lib/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, role, clinicId, password } = body;

    if (!firstName || !lastName || !email || !phone || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await signup({
      firstName,
      lastName,
      email,
      phone,
      role,
      clinicId,
      password
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Note: The cookie is already set in the signup function
    // We just need to return the user data

    return NextResponse.json({
      success: true,
      user: result.user
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}