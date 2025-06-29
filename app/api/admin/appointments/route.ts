import { NextRequest, NextResponse } from 'next/server';
import { getAdminAppointments } from '@/lib/actions/admin-dashboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Clinic ID is required' },
        { status: 400 }
      );
    }
    
    const appointments = await getAdminAppointments(clinicId);
    
    return NextResponse.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Get admin appointments error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}