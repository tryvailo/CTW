/**
 * API route for checking duplicate submissions
 * TODO: Replace with actual Supabase query
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookingDate = searchParams.get('booking');
    const surgeryDate = searchParams.get('surgery');

    if (!bookingDate || !surgeryDate) {
      return NextResponse.json(
        { error: 'Missing dates' },
        { status: 400 }
      );
    }

    // TODO: Query Supabase for duplicates
    // const { data } = await supabase
    //   .from('patient_submissions')
    //   .select('id')
    //   .eq('booking_date', bookingDate)
    //   .eq('surgery_date', surgeryDate)
    //   .limit(1);

    // For now, return false (no duplicates)
    return NextResponse.json({ isDuplicate: false });
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

