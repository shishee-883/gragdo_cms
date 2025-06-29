import { NextRequest, NextResponse } from 'next/server';
import { createBedRecord } from '@/lib/actions/beds';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bedNumber, roomId, clinicId, notes, createdById } = body;

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
      createdById: createdById || 'unknown',
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