import { NextRequest, NextResponse } from 'next/server';
import { getPatients, createPatientRecord } from '@/lib/actions/patients';
import { Gender } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get('clinicId') || undefined;
    
    const patients = await getPatients(clinicId);
    
    return NextResponse.json({
      success: true,
      patients
    });
  } catch (error) {
    console.error('Get patients error:', error);
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
      firstName, lastName, email, phone, gender, dateOfBirth, 
      bloodGroup, address, city, state, postalCode, 
      medicalHistory, allergies, emergencyContact, clinicId, createdById, documents
    } = body;

    if (!firstName || !lastName || !phone || !gender || !dateOfBirth || !clinicId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const result = await createPatientRecord({
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
      clinicId,
      createdById: createdById || 'unknown',
      documents: documents || []
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
    console.error('Create patient error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}