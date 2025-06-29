import { NextRequest, NextResponse } from 'next/server';
import { getClinics, createClinic, updateClinic, deleteClinic } from '@/lib/actions/clinics';

export async function GET() {
  try {
    const clinics = await getClinics();
    
    return NextResponse.json({
      success: true,
      clinics
    });
  } catch (error) {
    console.error('Get clinics error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, phone, email, description, createdById } = body;

    if (!name || !address || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, address, and phone are required' },
        { status: 400 }
      );
    }

    const result = await createClinic({
      name,
      address,
      phone,
      email,
      description,
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
      clinic: result.clinic
    });
  } catch (error) {
    console.error('Create clinic error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}