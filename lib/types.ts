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
  url: string;
  phone: string;
  last_updated: string; // YYYY-MM-DD format
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
  category: 'general' | 'procedure';
}

export interface ContentData {
  content_id: string;
  section: string;
  key: string;
  value: string;
  language: string;
}

