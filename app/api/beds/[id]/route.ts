import { NextRequest, NextResponse } from 'next/server';
import { 
  getBedById, 
  updateBedRecord, 
  deleteBed, 
  assignBed, 
  dischargeBed, 
  reserveBed 
} from '@/lib/actions/beds';
import { BedStatus } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bed = await getBedById(params.id);
    
    if (!bed) {
      return NextResponse.json(
        { success: false, error: 'Bed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      bed
    });
  } catch (error) {
    console.error('Get bed error:', error);
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
    const { bedNumber, status, notes, action, patientId, admissionDate, dischargeDate } = body;

    let result;

    // Handle different types of updates based on the action
    switch (action) {
      case 'assign':
        if (!patientId || !admissionDate) {
          return NextResponse.json(
            { success: false, error: 'Patient ID and admission date are required for assignment' },
            { status: 400 }
          );
        }
        result = await assignBed(params.id, { patientId, admissionDate, dischargeDate });
        break;
      case 'discharge':
        result = await dischargeBed(params.id);
        break;
      case 'reserve':
        result = await reserveBed(params.id);
        break;
      default:
        // Regular update
        result = await updateBedRecord(params.id, {
          bedNumber,
          status: status as BedStatus,
          notes
        });
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      bed: result.bed
    });
  } catch (error) {
    console.error('Update bed error:', error);
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
    const result = await deleteBed(params.id);

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
    console.error('Delete bed error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}