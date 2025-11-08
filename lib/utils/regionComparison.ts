/**
 * Utility functions for regional comparison data
 * 
 * Note: This file should NOT import waitingTimesLoader directly if used in client components.
 * Data should be loaded server-side and passed as props.
 */

import type { ProcedureId, RegionId, ConfidenceLevel, WaitingTimesDataSource } from '@/lib/types/waitingTimes';

export interface RegionalWaitTime {
  regionId: RegionId;
  regionName: string;
  recommendedDisplay: string;
  confidence: ConfidenceLevel;
  sampleSize: number;
  patientAverage: number | null;
  patientMedian: number | null;
  hasFastTrack: boolean;
  keyInsight?: string;
}

export interface RegionalComparisonData {
  procedure: ProcedureId;
  procedureName: string;
  regions: RegionalWaitTime[];
}

/**
 * Get all regional data for a procedure from loaded data
 */
export function getRegionalComparisonDataFromSource(
  data: WaitingTimesDataSource,
  procedureId: ProcedureId
): RegionalComparisonData | null {
  
  let procedureName: string;
  switch (procedureId) {
    case 'cataract':
      procedureName = 'Cataract Surgery';
      break;
    case 'hip':
      procedureName = 'Hip Replacement';
      break;
    case 'knee':
      procedureName = 'Knee Replacement';
      break;
    default:
      return null;
  }

  const regions: RegionalWaitTime[] = data.regions.map((region) => {
    const procedureData = region[procedureId];
    const hasFastTrack = procedureData.variation_note?.toLowerCase().includes('aces') || 
                         procedureData.variation_note?.toLowerCase().includes('fast-track') ||
                         false;

    return {
      regionId: region.region_id,
      regionName: region.region_name,
      recommendedDisplay: procedureData.recommended_display,
      confidence: procedureData.confidence,
      sampleSize: procedureData.sample_size,
      patientAverage: procedureData.patient_reported_average_weeks,
      patientMedian: procedureData.patient_reported_median_weeks,
      hasFastTrack,
      keyInsight: region.key_insight,
    };
  });

  return {
    procedure: procedureId,
    procedureName,
    regions,
  };
}

/**
 * Get all procedures comparison data from loaded source
 */
export function getAllProceduresComparisonDataFromSource(
  data: WaitingTimesDataSource
): Record<ProcedureId, RegionalComparisonData | null> {
  return {
    cataract: getRegionalComparisonDataFromSource(data, 'cataract'),
    hip: getRegionalComparisonDataFromSource(data, 'hip'),
    knee: getRegionalComparisonDataFromSource(data, 'knee'),
  };
}

/**
 * Calculate savings between two regions
 */
export function calculateRegionalSavings(
  fromRegion: RegionalWaitTime,
  toRegion: RegionalWaitTime
): {
  weeksSaved: number;
  percentageSaved: number;
  message: string;
} | null {
  const fromWeeks = fromRegion.patientAverage;
  const toWeeks = toRegion.patientAverage;

  if (!fromWeeks || !toWeeks || fromWeeks <= toWeeks) {
    return null;
  }

  const weeksSaved = Math.round(fromWeeks - toWeeks);
  const percentageSaved = Math.round((weeksSaved / fromWeeks) * 100);

  return {
    weeksSaved,
    percentageSaved,
    message: `You could save ${weeksSaved} week${weeksSaved !== 1 ? 's' : ''} by choosing ${toRegion.regionName} instead of ${fromRegion.regionName}`,
  };
}

/**
 * Get region performance color
 */
export function getRegionPerformanceColor(
  region: RegionalWaitTime,
  allRegions: RegionalWaitTime[]
): {
  color: string;
  bgColor: string;
  label: string;
} {
  // Filter out regions with no data
  const regionsWithData = allRegions.filter(r => r.patientAverage !== null);
  
  if (regionsWithData.length === 0 || region.patientAverage === null) {
    return {
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      label: 'No data',
    };
  }

  // Sort by wait time (lowest first)
  const sorted = [...regionsWithData].sort((a, b) => 
    (a.patientAverage || 0) - (b.patientAverage || 0)
  );

  const rank = sorted.findIndex(r => r.regionId === region.regionId);
  const total = sorted.length;

  // Best performance (top 20%)
  if (rank < total * 0.2) {
    return {
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      label: 'Best',
    };
  }
  // Good performance (20-40%)
  if (rank < total * 0.4) {
    return {
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      label: 'Good',
    };
  }
  // Average performance (40-60%)
  if (rank < total * 0.6) {
    return {
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      label: 'Average',
    };
  }
  // Below average (bottom 40%)
  return {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Below average',
  };
}

/**
 * Get confidence display info
 */
export function getConfidenceInfo(confidence: ConfidenceLevel, sampleSize: number): {
  icon: string;
  label: string;
  color: string;
  opacity: string;
  tooltip: string;
} {
  if (sampleSize === 0) {
    return {
      icon: '❌',
      label: 'No data',
      color: 'text-gray-500',
      opacity: 'opacity-40',
      tooltip: 'Help us improve: Submit your data',
    };
  }

  if (sampleSize >= 50) {
    return {
      icon: '✅',
      label: 'High confidence',
      color: 'text-green-600',
      opacity: 'opacity-100',
      tooltip: `Based on ${sampleSize} patient submissions`,
    };
  }

  if (sampleSize >= 10) {
    return {
      icon: '🟡',
      label: 'Medium confidence',
      color: 'text-yellow-600',
      opacity: 'opacity-80',
      tooltip: `Based on ${sampleSize} patient submissions`,
    };
  }

  return {
    icon: '⚠️',
    label: 'Low confidence',
    color: 'text-orange-600',
    opacity: 'opacity-60',
    tooltip: `Limited data: Only ${sampleSize} submission${sampleSize !== 1 ? 's' : ''}. Help us improve by submitting your experience.`,
  };
}

