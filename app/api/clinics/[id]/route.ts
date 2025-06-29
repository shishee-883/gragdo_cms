import { NextRequest, NextResponse } from 'next/server';
import { getClinicById, updateClinic, deleteClinic } from '@/lib/actions/clinics';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clinic = await getClinicById(params.id);
    
    if (!clinic) {
      return NextResponse.json(
        { success: false, error: 'Clinic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      clinic
    });
  } catch (error) {
    console.error('Get clinic error:', error);
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
    const { name, address, phone, email, description } = body;

    const result = await updateClinic(params.id, {
      name,
      address,
      phone,
      email,
      description
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      clinic: result.clinic
    });
  } catch (error) {
    console.error('Update clinic error:', error);
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
    const result = await deleteClinic(params.id);

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
    console.error('Delete clinic error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}