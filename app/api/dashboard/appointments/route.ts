import { NextRequest, NextResponse } from 'next/server';
import { getRecentAppointments } from '@/lib/actions/dashboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const doctorId = searchParams.get('doctorId') || undefined;
    
    const appointments = await getRecentAppointments(clinicId, doctorId);
    
    return NextResponse.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Get recent appointments error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}