import { NextRequest, NextResponse } from 'next/server';
import { 
  getMedicineById, 
  updateMedicineRecord, 
  deleteMedicineRecord,
  updateMedicineStock
} from '@/lib/actions/medicines';
import { MedicineType } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicine = await getMedicineById(params.id);
    
    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      medicine
    });
  } catch (error) {
    console.error('Get medicine error:', error);
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
      name, manufacturer, batchNumber, type, dosage, 
      manufacturedDate, expiryDate, price, stock, reorderLevel, isActive, action 
    } = body;

    let result;

    // Handle stock updates separately
    if (action === 'updateStock') {
      if (body.quantity === undefined || body.isAddition === undefined) {
        return NextResponse.json(
          { success: false, error: 'Quantity and isAddition are required for stock updates' },
          { status: 400 }
        );
      }
      
      result = await updateMedicineStock(params.id, body.quantity, body.isAddition);
    } else {
      // Regular update
      result = await updateMedicineRecord(params.id, {
        name,
        manufacturer,
        batchNumber,
        type: type as MedicineType,
        dosage,
        manufacturedDate,
        expiryDate,
        price,
        stock,
        reorderLevel,
        isActive
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
      medicine: result.medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
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
    const result = await deleteMedicineRecord(params.id);

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
    console.error('Delete medicine error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}