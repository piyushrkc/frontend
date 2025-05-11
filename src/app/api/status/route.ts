import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    version: '1.0.0',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
}