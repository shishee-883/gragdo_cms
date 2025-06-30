// app/api/update-user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/actions/users';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone_number, address, role } = body;

    // Validate role if provided
    if (role && !['admin', 'doctor', 'staff'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be admin, doctor, or staff' },
        { status: 400 }
      );
    }

    const result = await updateUser(params.userId, {
      firstName: first_name,
      lastName: last_name,
      email,
      phoneNumber: phone_number,
      address,
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
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
