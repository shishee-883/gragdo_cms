import { NextRequest, NextResponse } from 'next/server';
import { 
  getAppointmentById, 
  updateAppointmentRecord, 
  deleteAppointment, 
  checkInAppointment,
  startAppointment,
  completeAppointment,
  rescheduleAppointment,
  cancelAppointment
} from '@/lib/actions/appointments';
import { AppointmentStatus } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await getAppointmentById(params.id);
    
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
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
      appointmentDate, startTime, endTime, duration, type, concern, 
      notes, status, vitals, followUpDate, action 
    } = body;

    let result;

    // Handle different types of updates based on the action
    switch (action) {
      case 'checkIn':
        result = await checkInAppointment(params.id);
        break;
      case 'start':
        result = await startAppointment(params.id);
        break;
      case 'complete':
        result = await completeAppointment(params.id, { vitals, notes, followUpDate });
        break;
      case 'reschedule':
        if (!appointmentDate || !startTime || !endTime || !duration) {
          return NextResponse.json(
            { success: false, error: 'Required fields for rescheduling are missing' },
            { status: 400 }
          );
        }
        result = await rescheduleAppointment(params.id, { appointmentDate, startTime, endTime, duration });
        break;
      case 'cancel':
        if (!body.cancelReason || !body.cancelledById) {
          return NextResponse.json(
            { success: false, error: 'Reason and canceller ID are required for cancellation' },
            { status: 400 }
          );
        }
        result = await cancelAppointment(params.id, { 
          cancelledById: body.cancelledById, 
          cancelReason: body.cancelReason 
        });
        break;
      default:
        // Regular update
        result = await updateAppointmentRecord(params.id, {
          appointmentDate,
          startTime,
          endTime,
          duration,
          type,
          concern,
          notes,
          status: status as AppointmentStatus,
          vitals,
          followUpDate
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
      appointment: result.appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
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
    const result = await deleteAppointment(params.id);

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
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}