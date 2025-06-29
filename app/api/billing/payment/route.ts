import { NextRequest, NextResponse } from 'next/server';
import { recordPayment } from '@/lib/actions/billing';
import { PaymentMethod } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      invoiceId, amount, paymentMethod, description, patientId, clinicId, document, createdById
    } = body;

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
      createdById: createdById || 'unknown',
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