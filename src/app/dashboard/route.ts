import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function GET() {
  return NextResponse.redirect('/dashboard/patient');
}