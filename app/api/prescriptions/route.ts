import { NextRequest, NextResponse } from 'next/server';
import { getPrescriptions, createPrescriptionRecord } from '@/lib/actions/prescriptions';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const doctorId = searchParams.get('doctorId') || undefined;
    const patientId = searchParams.get('patientId') || undefined;
    
    const prescriptions = await getPrescriptions(clinicId, doctorId, patientId);
    
    return NextResponse.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
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
      patientId, doctorId, clinicId, appointmentId, diagnosis, 
      medications, instructions, followUpDate, document 
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

    if (!patientId || !doctorId || !clinicId || !appointmentId || !diagnosis || !medications) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createPrescriptionRecord({
      patientId,
      doctorId,
      clinicId,
      appointmentId,
      diagnosis,
      medications,
      instructions,
      followUpDate,
      document,
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
      prescription: result.prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}