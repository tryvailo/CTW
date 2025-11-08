/**
 * Data loader utility for waiting times data from comparethewait-data-source.json
 */

import fs from 'fs';
import path from 'path';
import type {
  WaitingTimesDataSource,
  OfficialVsRealityData,
  CancellationRiskData,
  PrivateComparison,
  ProcedureId,
  RegionId,
} from '@/lib/types/waitingTimes';

// Path to data file
const DATA_FILE = path.join(process.cwd(), 'data', 'raw', 'comparethewait-data-source.json');

let cachedData: WaitingTimesDataSource | null = null;

/**
 * Load waiting times data from JSON file
 */
export function loadWaitingTimesData(): WaitingTimesDataSource {
  if (cachedData) {
    return cachedData;
  }

  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    cachedData = JSON.parse(fileContent) as WaitingTimesDataSource;
    return cachedData;
  } catch (error) {
    console.error('Error loading waiting times data:', error);
    throw new Error('Failed to load waiting times data');
  }
}

/**
 * Get UK-wide data for a procedure
 */
export function getUKWideData(
  procedureId: ProcedureId
): OfficialVsRealityData | null {
  const data = loadWaitingTimesData();
  
  let procedureKey: 'cataract' | 'hip_replacement' | 'knee_replacement';
  switch (procedureId) {
    case 'cataract':
      procedureKey = 'cataract';
      break;
    case 'hip':
      procedureKey = 'hip_replacement';
      break;
    case 'knee':
      procedureKey = 'knee_replacement';
      break;
    default:
      return null;
  }

  const procedureData = data.uk_wide[procedureKey];
  if (!procedureData) {
    return null;
  }

  const { waiting_times, key_facts } = procedureData;

  return {
    officialTarget: waiting_times.official_nhs_target_weeks,
    officialNotes: waiting_times.official_nhs_notes,
    providerAverage: waiting_times.healthcare_provider_average_weeks,
    providerNotes: waiting_times.healthcare_provider_notes,
    patientAverage: waiting_times.patient_reported_average_weeks,
    patientMedian: waiting_times.patient_reported_median_weeks,
    patientMin: waiting_times.patient_reported_min_weeks,
    patientMax: waiting_times.patient_reported_max_weeks,
    sampleSize: waiting_times.patient_reported_sample_size,
    confidence: 'medium', // UK-wide data is generally medium confidence
    keyFacts: key_facts,
  };
}

/**
 * Get regional data for a procedure and region
 */
export function getRegionalData(
  procedureId: ProcedureId,
  regionId: RegionId
): OfficialVsRealityData | null {
  const data = loadWaitingTimesData();
  
  const region = data.regions.find((r) => r.region_id === regionId);
  if (!region) {
    return null;
  }

  const procedureData = region[procedureId];
  if (!procedureData) {
    return null;
  }

  // Get UK-wide key facts for context
  let procedureKey: 'cataract' | 'hip_replacement' | 'knee_replacement';
  switch (procedureId) {
    case 'cataract':
      procedureKey = 'cataract';
      break;
    case 'hip':
      procedureKey = 'hip_replacement';
      break;
    case 'knee':
      procedureKey = 'knee_replacement';
      break;
    default:
      return null;
  }

  const ukWideData = data.uk_wide[procedureKey];
  const keyFacts = ukWideData?.key_facts || [];
  const ukWideProviderAverage = ukWideData?.waiting_times.healthcare_provider_average_weeks || procedureData.official_target_weeks;

  return {
    officialTarget: procedureData.official_target_weeks,
    providerAverage: ukWideProviderAverage, // Use UK-wide provider average as regional data doesn't have separate provider data
    providerNotes: ukWideData?.waiting_times.healthcare_provider_notes,
    patientAverage: procedureData.patient_reported_average_weeks || 0,
    patientMedian: procedureData.patient_reported_median_weeks || 0,
    patientMin: 0,
    patientMax: 0,
    sampleSize: procedureData.sample_size,
    confidence: procedureData.confidence,
    keyFacts: keyFacts,
    variationNote: procedureData.variation_note,
    recommendedDisplay: procedureData.recommended_display,
  };
}

/**
 * Get combined data (prefers regional, falls back to UK-wide)
 */
export function getWaitingTimesData(
  procedureId: ProcedureId,
  regionId?: RegionId
): OfficialVsRealityData | null {
  if (regionId) {
    const regionalData = getRegionalData(procedureId, regionId);
    if (regionalData && regionalData.sampleSize > 0) {
      return regionalData;
    }
  }

  // Fall back to UK-wide data
  return getUKWideData(procedureId);
}

/**
 * Map City name to RegionId
 */
export function cityToRegionId(city: string): RegionId | null {
  const cityLower = city.toLowerCase();
  const mapping: Record<string, RegionId> = {
    london: 'london',
    manchester: 'manchester',
    birmingham: 'birmingham',
    leeds: 'leeds',
    bristol: 'bristol',
  };
  return mapping[cityLower] || null;
}

/**
 * Get cancellation risk data for a procedure
 */
export function getCancellationRiskData(
  procedureId: ProcedureId
): CancellationRiskData | null {
  const data = loadWaitingTimesData();
  
  let procedureKey: 'cataract' | 'hip_replacement' | 'knee_replacement';
  switch (procedureId) {
    case 'cataract':
      procedureKey = 'cataract';
      break;
    case 'hip':
      procedureKey = 'hip_replacement';
      break;
    case 'knee':
      procedureKey = 'knee_replacement';
      break;
    default:
      return null;
  }

  const procedureData = data.uk_wide[procedureKey];
  if (!procedureData || !procedureData.cancellation_risk) {
    return null;
  }

  const { cancellation_risk } = procedureData;
  return {
    percentageExperience: cancellation_risk.percentage_experience,
    averageDelayWeeks: cancellation_risk.average_delay_weeks,
    cancellationsPerPatientAverage: cancellation_risk.cancellations_per_patient_average,
  };
}

/**
 * Get private comparison data for a procedure (prefers regional, falls back to UK-wide)
 */
export function getPrivateComparisonData(
  procedureId: ProcedureId,
  regionId?: RegionId
): PrivateComparison | null {
  const data = loadWaitingTimesData();
  
  // Try to get regional data first
  if (regionId) {
    const region = data.regions.find((r) => r.region_id === regionId);
    if (region) {
      const procedureData = region[procedureId];
      if (procedureData && procedureData.private_average_weeks && procedureData.private_average_cost_pounds) {
        // Use regional data if available
        return {
          average_wait_weeks: procedureData.private_average_weeks,
          average_cost_pounds: procedureData.private_average_cost_pounds,
          cost_range_min_pounds: procedureData.private_average_cost_pounds * 0.85, // Estimate 15% below
          cost_range_max_pounds: procedureData.private_average_cost_pounds * 1.15, // Estimate 15% above
        };
      }
    }
  }

  // Fall back to UK-wide data
  let procedureKey: 'cataract' | 'hip_replacement' | 'knee_replacement';
  switch (procedureId) {
    case 'cataract':
      procedureKey = 'cataract';
      break;
    case 'hip':
      procedureKey = 'hip_replacement';
      break;
    case 'knee':
      procedureKey = 'knee_replacement';
      break;
    default:
      return null;
  }

  const procedureData = data.uk_wide[procedureKey];
  if (!procedureData || !procedureData.private_comparison) {
    return null;
  }

  return procedureData.private_comparison;
}

