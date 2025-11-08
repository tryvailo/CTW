/**
 * TypeScript types for patient submission system
 */

export type ProcedureSubmission = 'cataract' | 'hip' | 'knee';
export type LocationSubmission = 'london' | 'manchester' | 'birmingham' | 'leeds' | 'bristol';
export type NHSOrPrivate = 'nhs' | 'private';

export interface PatientSubmission {
  id?: string;
  procedure: ProcedureSubmission;
  location: LocationSubmission;
  booking_date: string; // YYYY-MM-DD format
  surgery_date: string; // YYYY-MM-DD format
  wait_weeks: number;
  nhs_or_private: NHSOrPrivate;
  cancellations: number;
  satisfaction: number; // 1-5
  comments?: string;
  created_at?: string;
  published?: boolean;
}

export interface SubmissionFormData {
  procedure: ProcedureSubmission | '';
  location: LocationSubmission | '';
  booking_date: string;
  surgery_date: string;
  nhs_or_private: NHSOrPrivate | '';
  cancellations: number;
  satisfaction: number;
  comments: string;
  agree_to_publish: boolean;
}

export interface CommunityStats {
  stories_this_month: number;
  total_contributors: number;
  most_common_wait: {
    procedure: string;
    weeks: number;
  };
  fastest_procedure: {
    procedure: string;
    location: string;
    weeks: number;
  };
  slowest_wait: {
    procedure: string;
    location: string;
    weeks: number;
  };
  data_gaps: Array<{
    procedure: string;
    location: string;
    needed: number;
  }>;
}

export interface SubmissionValidationError {
  field: string;
  message: string;
}
