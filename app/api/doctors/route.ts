import { NextRequest, NextResponse } from 'next/server';
import { getDoctors, createDoctor } from '@/lib/actions/doctors';
import { cookies } from 'next/headers';

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
    const { name, email, phone, specialization, qualification, experience, consultationFee, clinicId } = body;

    // Get the current user ID from the token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

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