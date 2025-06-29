import { NextRequest, NextResponse } from 'next/server';
import { getMedicines, createMedicineRecord } from '@/lib/actions/medicines';
import { cookies } from 'next/headers';
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
      manufacturedDate, expiryDate, price, stock, reorderLevel, clinicId 
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
      createdById: token // Using token as createdById for now
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