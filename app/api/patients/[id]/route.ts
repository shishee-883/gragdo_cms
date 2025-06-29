import { NextRequest, NextResponse } from 'next/server';
import { getPatientById, updatePatientRecord, deletePatientRecord } from '@/lib/actions/patients';
import { Gender } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await getPatientById(params.id);
    
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patient
    });
  } catch (error) {
    console.error('Get patient error:', error);
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
      firstName, lastName, email, phone, gender, dateOfBirth, 
      bloodGroup, address, city, state, postalCode, 
      medicalHistory, allergies, emergencyContact, isActive 
    } = body;

    const result = await updatePatientRecord(params.id, {
      firstName,
      lastName,
      email,
      phone,
      gender: gender as Gender,
      dateOfBirth,
      bloodGroup,
      address,
      city,
      state,
      postalCode,
      medicalHistory,
      allergies,
      emergencyContact,
      isActive
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      patient: result.patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
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
    const result = await deletePatientRecord(params.id);

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
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}