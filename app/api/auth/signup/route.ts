import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/lib/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password, address, profile_image } = body;

    if (!firstName || !lastName || !email || !phone || !password) {
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
      password,
      address,
      profile_image
      
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

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