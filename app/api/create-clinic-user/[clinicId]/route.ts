import { NextRequest, NextResponse } from 'next/server';
import { createClinicUser } from '@/lib/actions/users';

export async function POST(
  request: NextRequest,
  { params }: { params: { clinicId: string } }
) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone_number, address, password, role } = body;

    if (!email || !phone_number || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'doctor', 'staff'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be admin, doctor, or staff' },
        { status: 400 }
      );
    }

    const result = await createClinicUser(params.clinicId, {
      firstName: first_name,
      lastName: last_name,
      email,
      phoneNumber: phone_number,
      address,
      password,
      role: role as 'admin' | 'doctor' | 'staff'
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
    }, { status: 201 });
  } catch (error) {
    console.error('Create clinic user error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}