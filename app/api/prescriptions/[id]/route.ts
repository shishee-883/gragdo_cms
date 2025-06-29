import { NextRequest, NextResponse } from 'next/server';
import { 
  getPrescriptionById, 
  updatePrescriptionRecord, 
  deletePrescriptionRecord 
} from '@/lib/actions/prescriptions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await getPrescriptionById(params.id);
    
    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('Get prescription error:', error);
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
      diagnosis, medications, instructions, followUpDate, isActive, document 
    } = body;

    const result = await updatePrescriptionRecord(params.id, {
      diagnosis,
      medications,
      instructions,
      followUpDate,
      isActive,
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
      prescription: result.prescription
    });
  } catch (error) {
    console.error('Update prescription error:', error);
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
    const result = await deletePrescriptionRecord(params.id);

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
    console.error('Delete prescription error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}