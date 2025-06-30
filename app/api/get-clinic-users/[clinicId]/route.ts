// app/api/get-clinic-users/[clinicId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getClinicUsers } from '@/lib/actions/users';

export async function GET(
  request: NextRequest,
  { params }: { params: { clinicId: string } }
) {
  try {
    const result = await getClinicUsers(params.clinicId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      users: result.users
    });
  } catch (error) {
    console.error('Get clinic users error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
