import { NextRequest, NextResponse } from 'next/server';
import { createBedRecord } from '@/lib/actions/beds';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bedNumber, roomId, clinicId, notes } = body;

    // Get the current user ID from the token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (bedNumber === undefined || !roomId || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createBedRecord({
      bedNumber,
      roomId,
      clinicId,
      createdById: token, // Using token as createdById for now
      notes
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bed: result.bed
    });
  } catch (error) {
    console.error('Create bed error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}