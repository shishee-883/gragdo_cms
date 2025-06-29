import { NextRequest, NextResponse } from 'next/server';
import { recordPayment } from '@/lib/actions/billing';
import { cookies } from 'next/headers';
import { PaymentMethod } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      invoiceId, amount, paymentMethod, description, patientId, clinicId, document 
    } = body;

    // Get the current user ID from the token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!invoiceId || amount === undefined || !paymentMethod || !description || !patientId || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await recordPayment({
      invoiceId,
      amount,
      paymentMethod: paymentMethod as PaymentMethod,
      description,
      patientId,
      clinicId,
      createdById: token, // Using token as createdById for now
      document
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction
    });
  } catch (error) {
    console.error('Record payment error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}