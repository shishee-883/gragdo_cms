import { NextRequest, NextResponse } from 'next/server';
import { getAdminDoctors } from '@/lib/actions/admin-dashboard';

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
    
    const doctors = await getAdminDoctors(clinicId);
    
    return NextResponse.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Get admin doctors error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}