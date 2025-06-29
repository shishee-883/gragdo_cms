import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, createAppointmentRecord } from '@/lib/actions/appointments';
import { cookies } from 'next/headers';
import { AppointmentType } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    const doctorId = searchParams.get('doctorId') || undefined;
    const patientId = searchParams.get('patientId') || undefined;
    const status = searchParams.get('status') || undefined;
    
    const appointments = await getAppointments(clinicId, doctorId, patientId, status as any);
    
    return NextResponse.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
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
      patientId, doctorId, clinicId, appointmentDate, startTime, endTime, 
      duration, type, concern, notes, isFollowUp, previousAppointmentId 
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

    if (!patientId || !doctorId || !clinicId || !appointmentDate || !startTime || !endTime || !duration || !concern) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createAppointmentRecord({
      patientId,
      doctorId,
      clinicId,
      appointmentDate,
      startTime,
      endTime,
      duration,
      type: type as AppointmentType || AppointmentType.REGULAR,
      concern,
      notes,
      isFollowUp: isFollowUp || false,
      previousAppointmentId,
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
      appointment: result.appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}