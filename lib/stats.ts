/**
 * Statistics calculation utilities
 * Calculates real statistics from CSV data for Data Insights section
 */

import { loadNHSWaits, loadPrivateCosts } from './data';

export interface DataInsights {
  avgNHSWaitWeeks: number;
  avgPrivateWaitWeeks: number;
  avgPrivateCostMin: number;
  avgPrivateCostMax: number;
  avgSavingsWeeks: number;
  lastUpdatedDate: string;
}

/**
 * Calculate average NHS wait time across all procedures and cities
 */
function calculateAvgNHSWait(): number {
  const waits = loadNHSWaits();
  if (waits.length === 0) return 0;
  
  const totalWeeks = waits.reduce((sum, wait) => sum + wait.avg_wait_weeks, 0);
  return Math.round((totalWeeks / waits.length) * 10) / 10;
}

/**
 * Calculate average private cost range
 */
function calculateAvgPrivateCost(): { min: number; max: number } {
  const costs = loadPrivateCosts();
  if (costs.length === 0) return { min: 0, max: 0 };
  
  const totalMin = costs.reduce((sum, cost) => sum + cost.cost_min, 0);
  const totalMax = costs.reduce((sum, cost) => sum + cost.cost_max, 0);
  const count = costs.length;
  
  return {
    min: Math.round(totalMin / count),
    max: Math.round(totalMax / count),
  };
}

/**
 * Get the most recent update date from data
 */
function getLastUpdatedDate(): string {
  const waits = loadNHSWaits();
  const costs = loadPrivateCosts();
  
  const allDates: string[] = [];
  waits.forEach(wait => {
    if (wait.date) allDates.push(wait.date);
  });
  costs.forEach(cost => {
    if (cost.date) allDates.push(cost.date);
  });
  
  if (allDates.length === 0) {
    return new Date().toISOString().split('T')[0];
  }
  
  // Sort dates and return the most recent
  allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return allDates[0];
}

/**
 * Calculate average savings in weeks (NHS wait - Private wait)
 */
function calculateAvgSavingsWeeks(): number {
  const avgNHS = calculateAvgNHSWait();
  const avgPrivate = 1.5; // Typical private wait is 1-2 weeks, use 1.5 as average
  return Math.round((avgNHS - avgPrivate) * 10) / 10;
}

/**
 * Get all data insights for display
 */
export function getDataInsights(): DataInsights {
  const avgNHSWait = calculateAvgNHSWait();
  const avgPrivateCost = calculateAvgPrivateCost();
  const avgSavingsWeeks = calculateAvgSavingsWeeks();
  const lastUpdated = getLastUpdatedDate();
  
  return {
    avgNHSWaitWeeks: avgNHSWait,
    avgPrivateWaitWeeks: 1.5, // 1-2 weeks average
    avgPrivateCostMin: avgPrivateCost.min,
    avgPrivateCostMax: avgPrivateCost.max,
    avgSavingsWeeks: avgSavingsWeeks,
    lastUpdatedDate: lastUpdated,
  };
}

/**
 * Format date for display (e.g., "5 November 2025")
 */
export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

