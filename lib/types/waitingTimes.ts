/**
 * TypeScript types for waiting times data from comparethewait-data-source.json
 */

export type ProcedureId = 'cataract' | 'hip' | 'knee';
export type RegionId = 'london' | 'manchester' | 'birmingham' | 'leeds' | 'bristol';
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'very_low' | 'no_data';

export interface WaitingTimes {
  official_nhs_target_weeks: number;
  official_nhs_notes?: string;
  healthcare_provider_average_weeks: number;
  healthcare_provider_notes?: string;
  patient_reported_average_weeks: number;
  patient_reported_median_weeks: number;
  patient_reported_min_weeks: number;
  patient_reported_max_weeks: number;
  patient_reported_sample_size: number;
  patient_reported_notes?: string;
}

export interface CancellationRisk {
  percentage_experience: number;
  average_delay_weeks: number;
  cancellations_per_patient_average: number;
}

export interface PrivateComparison {
  average_wait_weeks: number;
  average_cost_pounds: number;
  cost_range_min_pounds: number;
  cost_range_max_pounds: number;
}

export interface UKWideProcedureData {
  procedure_id: ProcedureId;
  procedure_name: string;
  average_age_at_procedure: string;
  annual_procedures_uk: number;
  waiting_times: WaitingTimes;
  private_comparison: PrivateComparison;
  key_facts: string[];
  cancellation_risk: CancellationRisk;
}

export interface RegionalProcedureData {
  official_target_weeks: number;
  patient_reported_average_weeks: number | null;
  patient_reported_median_weeks: number | null;
  patient_reported_range: string;
  sample_size: number;
  confidence: ConfidenceLevel;
  variation_note?: string;
  private_average_weeks: number;
  private_average_cost_pounds: number;
  recommended_display: string;
}

export interface RegionalData {
  region_id: RegionId;
  region_name: string;
  nhs_trust_count: number;
  population_55_plus: number;
  cataract: RegionalProcedureData;
  hip: RegionalProcedureData;
  knee: RegionalProcedureData;
  key_insight: string;
}

export interface WaitingTimesDataSource {
  metadata: {
    source: string;
    data_version: string;
    last_updated: string;
    research_date: string;
    research_sources: string[];
    disclaimer: string;
    data_quality_notes: string;
  };
  uk_wide: {
    cataract: UKWideProcedureData;
    hip_replacement: UKWideProcedureData;
    knee_replacement: UKWideProcedureData;
  };
  regions: RegionalData[];
  private_clinics_benchmark: {
    average_wait_days: number;
    average_wait_weeks: number;
    guaranteed_slot: boolean;
    cancellation_rate_percent: number;
    cataract_average_cost: number;
    hip_average_cost: number;
    knee_average_cost: number;
    key_feature: string;
  };
  messaging_guidelines: {
    tone: string;
    avoid: string[];
    key_phrases: string[];
    british_spellings: string[];
  };
}

export interface OfficialVsRealityData {
  officialTarget: number;
  officialNotes?: string;
  providerAverage: number;
  providerNotes?: string;
  patientAverage: number;
  patientMedian: number;
  patientMin: number;
  patientMax: number;
  sampleSize: number;
  confidence: ConfidenceLevel;
  keyFacts?: string[];
  variationNote?: string;
  recommendedDisplay?: string;
}

export interface CancellationRiskData {
  percentageExperience: number;
  averageDelayWeeks: number;
  cancellationsPerPatientAverage: number;
}

