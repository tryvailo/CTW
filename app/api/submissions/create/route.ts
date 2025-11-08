/**
 * API route for creating patient submissions
 * TODO: Replace with actual Supabase integration
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PatientSubmission } from '@/lib/types/submissions';

export async function POST(request: NextRequest) {
  try {
    const data: PatientSubmission = await request.json();

    // Validate required fields
    if (!data.procedure || !data.location || !data.booking_date || !data.surgery_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const booking = new Date(data.booking_date);
    const surgery = new Date(data.surgery_date);
    
    if (surgery < booking) {
      return NextResponse.json(
        { error: 'Surgery date must be after booking date' },
        { status: 400 }
      );
    }

    // TODO: Insert into Supabase
    // const { data: submission, error } = await supabase
    //   .from('patient_submissions')
    //   .insert([data])
    //   .select()
    //   .single();

    // For now, return mock success
    const mockId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return NextResponse.json(
      { 
        id: mockId,
        message: 'Submission received successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

