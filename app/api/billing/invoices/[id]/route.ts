import { NextRequest, NextResponse } from 'next/server';
import { 
  getInvoiceById, 
  updateInvoiceRecord, 
  deleteInvoiceRecord 
} from '@/lib/actions/billing';
import { InvoiceItemType, InvoiceStatus } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await getInvoiceById(params.id);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      items, discount, tax, dueDate, status, notes, document 
    } = body;

    // Validate items if provided
    if (items) {
      for (const item of items) {
        if (!item.description || item.quantity === undefined || item.unitPrice === undefined || !item.type) {
          return NextResponse.json(
            { success: false, error: 'Each item must have description, quantity, unitPrice, and type' },
            { status: 400 }
          );
        }
      }
    }

    const result = await updateInvoiceRecord(params.id, {
      items: items?.map(item => ({
        id: item.id,
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
      status: status as InvoiceStatus,
      notes,
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
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteInvoiceRecord(params.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}