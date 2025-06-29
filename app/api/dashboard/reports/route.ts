import { NextRequest, NextResponse } from 'next/server';
import { getRecentReports } from '@/lib/actions/dashboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    
    const reports = await getRecentReports(clinicId);
    
    return NextResponse.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('Get recent reports error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}