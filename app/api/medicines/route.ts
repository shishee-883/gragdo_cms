import { NextRequest, NextResponse } from 'next/server';
import { getMedicines, createMedicineRecord } from '@/lib/actions/medicines';
import { MedicineType } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const isActive = searchParams.has('isActive') 
      ? searchParams.get('isActive') === 'true' 
      : undefined;
    
    const medicines = await getMedicines(clinicId, isActive);
    
    return NextResponse.json({
      success: true,
      medicines
    });
  } catch (error) {
    console.error('Get medicines error:', error);
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
      name, manufacturer, batchNumber, type, dosage, 
      manufacturedDate, expiryDate, price, stock, reorderLevel, clinicId, createdById
    } = body;

    if (!name || !manufacturer || !batchNumber || !type || !dosage || 
        !manufacturedDate || !expiryDate || price === undefined || 
        stock === undefined || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createMedicineRecord({
      name,
      manufacturer,
      batchNumber,
      type: type as MedicineType,
      dosage,
      manufacturedDate,
      expiryDate,
      price,
      stock,
      reorderLevel: reorderLevel || 10,
      clinicId,
      createdById: createdById || 'unknown'
    });

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
    console.error('Create medicine error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}