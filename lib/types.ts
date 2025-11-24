/**
 * TypeScript types for CompareTheWait data structures
 */

export type ProcedureId = 'cataract' | 'hip' | 'knee';

export type City = 'London' | 'Manchester' | 'Birmingham' | 'Leeds' | 'Bristol';

export interface Procedure {
  procedure_id: ProcedureId;
  name: string;
  specialty: string;
  description: string;
  nhs_code: string;
}

export interface CityData {
  city: City;
  slug: string;
  elderly_population?: string;
  priority?: string;
}

export interface NHSWait {
  procedure_id: ProcedureId;
  city: City;
  nhs_trust: string;
  avg_wait_weeks: number;
  patient_reported_wait_weeks?: number; // Real patient data (may be undefined for estimated values)
  is_estimated?: boolean; // Flag to mark estimated values
  date: string; // YYYY-MM-DD format
  source: string;
}

export interface PrivateCost {
  procedure_id: ProcedureId;
  city: City;
  cost_min: number;
  cost_max: number;
  clinic_count: number;
  date: string; // YYYY-MM-DD format
  source: string;
}

export interface Clinic {
  clinic_id: string;
  name: string;
  city: City;
  procedure_id: ProcedureId;
  price: number;
  url?: string; // Optional - may be empty in CSV
  phone?: string; // Optional - may be empty in CSV
  address?: string; // Optional - full address
  rating_stars?: number; // Optional - rating out of 5
  rating_count?: number; // Optional - number of reviews
  cqc_rating?: string; // Optional - CQC rating (Outstanding, Good, Requires improvement, Inadequate)
  hospital_group?: string; // Optional - hospital group/chain name (Spire, Circle, Nuffield, etc.)
  last_updated: string; // YYYY-MM-DD format
  details_last_updated?: string; // YYYY-MM-DD format - when details (address, phone, url, ratings) were last updated
}

export interface ComparisonData {
  procedure: Procedure;
  city: City;
  nhsWait: NHSWait | null;
  privateCost: PrivateCost | null;
  clinics: Clinic[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  faq_id: string;
  question: string;
  answer: string;
  procedure_id: ProcedureId | 'general';
  category: 'general' | 'procedure' | 'extended';
}

export interface ContentData {
  content_id: string;
  section: string;
  key: string;
  value: string;
  language: string;
}

export interface ExtendedFAQ {
  question: string;
  answer: string;
  category: 'safety' | 'process' | 'cost' | 'aftercare';
}

