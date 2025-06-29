import { NextRequest, NextResponse } from 'next/server';
import { getRooms, createRoomRecord } from '@/lib/actions/rooms';
import { RoomType } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const isActive = searchParams.has('isActive') 
      ? searchParams.get('isActive') === 'true' 
      : undefined;
    
    const rooms = await getRooms(clinicId, isActive);
    
    return NextResponse.json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomNumber, roomType, floor, totalBeds, clinicId, createdById } = body;

    if (!roomNumber || !roomType || floor === undefined || totalBeds === undefined || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createRoomRecord({
      roomNumber,
      roomType: roomType as RoomType,
      floor,
      totalBeds,
      clinicId,
      createdById: createdById || 'unknown'
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      room: result.room
    });
  } catch (error) {
    console.error('Create room error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}