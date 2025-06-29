// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { uploadFile, generateFileKey } from '@/lib/services/s3';

export async function POST(request: NextRequest) {
  try {
    // Get the auth token to ensure the user is authenticated
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Generate a unique key for the file
    const key = generateFileKey(folder, file.name);
    
    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload the file to S3
    const url = await uploadFile(buffer, key, file.type);
    
    return NextResponse.json({
      success: true,
      url,
      key,
      name: file.name,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during file upload' },
      { status: 500 }
    );
  }
}
