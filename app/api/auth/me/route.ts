import { NextResponse } from 'next/server';

// This route is deprecated and will redirect to the new endpoint
export async function GET() {
  return NextResponse.redirect(new URL('/api/current-user-details', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));
}