import { NextRequest, NextResponse } from 'next/server';
import { getDoctorsActivity } from '@/lib/actions/dashboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    
    const doctorsActivity = await getDoctorsActivity(clinicId);
    
    return NextResponse.json({
      success: true,
      doctorsActivity
    });
  } catch (error) {
    console.error('Get doctors activity error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}