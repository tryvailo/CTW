/**
 * API route for getting community statistics
 * TODO: Replace with actual Supabase queries
 */

import { NextResponse } from 'next/server';
import type { CommunityStats } from '@/lib/types/submissions';

export async function GET() {
  try {
    // TODO: Query Supabase for real stats
    // const { data: submissions } = await supabase
    //   .from('patient_submissions')
    //   .select('*')
    //   .eq('published', true);

    // Mock data for now
    const stats: CommunityStats = {
      stories_this_month: 127,
      total_contributors: 3214,
      most_common_wait: {
        procedure: 'Cataract Surgery',
        weeks: 21,
      },
      fastest_procedure: {
        procedure: 'Cataract',
        location: 'Leeds ACES',
        weeks: 4,
      },
      slowest_wait: {
        procedure: 'Knee',
        location: 'Wales',
        weeks: 234,
      },
      data_gaps: [
        {
          procedure: 'Hip replacement',
          location: 'Birmingham',
          needed: 5,
        },
        {
          procedure: 'Knee replacement',
          location: 'Leeds',
          needed: 3,
        },
      ],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

