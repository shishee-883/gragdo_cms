import { NextRequest, NextResponse } from 'next/server';
import { getInvoices, createInvoiceRecord } from '@/lib/actions/billing';
import { cookies } from 'next/headers';
import { InvoiceItemType, InvoiceStatus } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const patientId = searchParams.get('patientId') || undefined;
    const status = searchParams.get('status') as InvoiceStatus | undefined;
    
    const invoices = await getInvoices(clinicId, patientId, status);
    
    return NextResponse.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error('Get invoices error:', error);
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
      patientId, clinicId, appointmentId, items, discount, tax, dueDate, notes, document 
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

    if (!patientId || !clinicId || !items || items.length === 0 || 
        discount === undefined || tax === undefined || !dueDate) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.description || item.quantity === undefined || item.unitPrice === undefined || !item.type) {
        return NextResponse.json(
          { success: false, error: 'Each item must have description, quantity, unitPrice, and type' },
          { status: 400 }
        );
      }
    }

    const result = await createInvoiceRecord({
      patientId,
      clinicId,
      appointmentId,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        type: item.type as InvoiceItemType,
        medicineId: item.medicineId,
        treatmentId: item.treatmentId
      })),
      discount,
      tax,
      dueDate,
      notes,
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
      invoice: result.invoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}