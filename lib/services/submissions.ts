/**
 * Service for handling patient submissions
 * Note: This is a placeholder - actual Supabase integration should be added
 */

import type { 
  PatientSubmission, 
  SubmissionFormData, 
  CommunityStats,
  ProcedureSubmission,
  LocationSubmission,
  NHSOrPrivate,
} from '@/lib/types/submissions';

/**
 * Calculate wait weeks from booking and surgery dates
 */
export function calculateWaitWeeks(bookingDate: string, surgeryDate: string): number {
  const booking = new Date(bookingDate);
  const surgery = new Date(surgeryDate);
  
  if (surgery < booking) {
    return 0;
  }
  
  const diffTime = surgery.getTime() - booking.getTime();
  const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return diffWeeks;
}

/**
 * Validate submission form data
 */
export function validateSubmission(data: SubmissionFormData): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.procedure) {
    errors.procedure = 'Please select a procedure';
  }

  if (!data.location) {
    errors.location = 'Please select a location';
  }

  if (!data.booking_date) {
    errors.booking_date = 'Please enter your booking date';
  }

  if (!data.surgery_date) {
    errors.surgery_date = 'Please enter your surgery date';
  }

  if (data.booking_date && data.surgery_date) {
    const booking = new Date(data.booking_date);
    const surgery = new Date(data.surgery_date);
    
    if (surgery < booking) {
      errors.surgery_date = 'Surgery date must be after booking date';
    }
    
    const waitWeeks = calculateWaitWeeks(data.booking_date, data.surgery_date);
    if (waitWeeks > 120) {
      errors.surgery_date = 'Wait time seems unusually long. Please double-check your dates.';
    }
    if (waitWeeks < 1 && data.nhs_or_private === 'nhs') {
      errors.surgery_date = 'NHS wait times are typically longer. Please check your dates.';
    }
  }

  if (!data.nhs_or_private) {
    errors.nhs_or_private = 'Please select NHS or Private';
  }

  if (data.cancellations < 0 || data.cancellations > 10) {
    errors.cancellations = 'Please enter a valid number of cancellations';
  }

  if (data.satisfaction < 1 || data.satisfaction > 5) {
    errors.satisfaction = 'Please rate your satisfaction';
  }

  if (!data.agree_to_publish) {
    errors.agree_to_publish = 'Please agree to publish your anonymised data';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Prepare submission data for API
 */
export function prepareSubmissionData(formData: SubmissionFormData): PatientSubmission {
  const waitWeeks = calculateWaitWeeks(formData.booking_date, formData.surgery_date);

  return {
    procedure: formData.procedure as ProcedureSubmission,
    location: formData.location as LocationSubmission,
    booking_date: formData.booking_date,
    surgery_date: formData.surgery_date,
    wait_weeks: waitWeeks,
    nhs_or_private: formData.nhs_or_private as NHSOrPrivate,
    cancellations: formData.cancellations,
    satisfaction: formData.satisfaction,
    comments: formData.comments || undefined,
    published: true,
  };
}

/**
 * Submit patient experience to API
 */
export async function submitPatientExperience(
  data: PatientSubmission
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // TODO: Replace with actual Supabase API call
    const response = await fetch('/api/submissions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Failed to submit' };
    }

    const result = await response.json();
    return { success: true, id: result.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get community statistics
 * TODO: Replace with actual Supabase query
 */
export async function getCommunityStats(): Promise<CommunityStats> {
  try {
    const response = await fetch('/api/submissions/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    // Return mock data for now
    return {
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
  }
}

/**
 * Check for duplicate submissions
 */
export async function checkDuplicate(
  bookingDate: string,
  surgeryDate: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/submissions/check-duplicate?booking=${bookingDate}&surgery=${surgeryDate}`
    );
    
    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.isDuplicate || false;
  } catch {
    return false;
  }
}

