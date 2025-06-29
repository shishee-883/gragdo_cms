import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransactionRecord } from '@/lib/actions/transactions';
import { TransactionType, PaymentMethod, PaymentStatus } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const patientId = searchParams.get('patientId') || undefined;
    const type = searchParams.get('type') as TransactionType | undefined;
    
    const transactions = await getTransactions(clinicId, patientId, type);
    
    return NextResponse.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, type, description, paymentMethod, paymentStatus,
      invoiceId, appointmentId, patientId, doctorId, clinicId, document, createdById
    } = body;

    if (amount === undefined || !type || !description || !paymentMethod || !paymentStatus || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createTransactionRecord({
      amount,
      type: type as TransactionType,
      description,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: paymentStatus as PaymentStatus,
      invoiceId,
      appointmentId,
      patientId,
      doctorId,
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
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}