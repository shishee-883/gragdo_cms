import { NextRequest, NextResponse } from 'next/server';
import { getClinics, createClinic, updateClinic, deleteClinic } from '@/lib/actions/clinics';
import { cookies } from 'next/headers';

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
    const { name, address, phone, email, description } = body;

    // Get the current user ID from the token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

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