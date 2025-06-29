import { NextRequest, NextResponse } from 'next/server';
import { getTreatments } from '@/lib/actions/treatments';

export async function GET() {
  try {
    const treatments = await getTreatments();
    
    return NextResponse.json({
      success: true,
      treatments
    });
  } catch (error) {
    console.error('Get treatments error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}