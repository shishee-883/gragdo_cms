import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, createDoctor } from '@/lib/actions/doctors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    
    const doctors = await getDoctors(clinicId);
    
    return NextResponse.json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, specialization, qualification, experience, consultationFee, clinicId, createdById } = body;

    if (!name || !phone || !specialization || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, specialization, and clinicId are required' },
        { status: 400 }
      );
    }

    const result = await createDoctor({
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      consultationFee,
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
      doctor: result.doctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}