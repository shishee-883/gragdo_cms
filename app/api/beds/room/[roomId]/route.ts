import { NextRequest, NextResponse } from 'next/server';
import { getBedsByRoom } from '@/lib/actions/beds';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const beds = await getBedsByRoom(params.roomId);
    
    return NextResponse.json({
      success: true,
      beds
    });
  } catch (error) {
    console.error('Get beds by room error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}