import { NextRequest, NextResponse } from 'next/server';
import { getTransactionSummary } from '@/lib/actions/transactions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId');
    const period = searchParams.get('period') as 'day' | 'week' | 'month' | 'year' || 'month';
    
    if (!clinicId) {
      return NextResponse.json(
        { success: false, error: 'Clinic ID is required' },
        { status: 400 }
      );
    }
    
    const summary = await getTransactionSummary(clinicId, period);
    
    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Get transaction summary error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}