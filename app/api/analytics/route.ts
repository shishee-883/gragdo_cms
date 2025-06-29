import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/actions/analytics';

export async function GET() {
  try {
    const data = await getAnalyticsData();
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get analytics data error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}