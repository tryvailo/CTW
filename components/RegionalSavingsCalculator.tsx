'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { RegionalWaitTime } from '@/lib/utils/regionComparison';
import { calculateRegionalSavings } from '@/lib/utils/regionComparison';

interface RegionalSavingsCalculatorProps {
  fromRegion: RegionalWaitTime | null;
  toRegion: RegionalWaitTime | null;
  procedureName: string;
  procedureId: string;
}

export const RegionalSavingsCalculator: React.FC<RegionalSavingsCalculatorProps> = ({
  fromRegion,
  toRegion,
  procedureName,
  procedureId,
}) => {
  if (!fromRegion || !toRegion) {
    return null;
  }

  const savings = calculateRegionalSavings(fromRegion, toRegion);

  if (!savings) {
    return (
      <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-4 rounded-lg">
        <p className="text-elderly-sm text-elderly-text">
          {toRegion.regionName} doesn't offer faster wait times than {fromRegion.regionName} for {procedureName.toLowerCase()}.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="bg-green-50 border-2 border-green-300 p-6 rounded-lg shadow-sm"
      role="region"
      aria-labelledby="savings-calculator-heading"
    >
      <h3 
        id="savings-calculator-heading"
        className="text-elderly-lg font-bold text-green-800 mb-4"
      >
        Potential Time Savings
      </h3>

      <div className="space-y-4 text-elderly-base text-elderly-text">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-lg border border-gray-300">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">From</p>
            <p className="font-bold text-elderly-lg mb-2">{fromRegion.regionName}</p>
            <p className="text-elderly-sm">{fromRegion.recommendedDisplay}</p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-gray-300">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">To</p>
            <p className="font-bold text-elderly-lg mb-2">{toRegion.regionName}</p>
            <p className="text-elderly-sm">{toRegion.recommendedDisplay}</p>
          </div>
        </div>

        <div className="p-5 bg-green-100 rounded-lg border-2 border-green-400">
          <p className="text-elderly-lg font-bold text-green-800 mb-2">
            You could save {savings.weeksSaved} week{savings.weeksSaved !== 1 ? 's' : ''} ({savings.percentageSaved}%)
          </p>
          <p className="text-elderly-sm text-green-700">
            by choosing {toRegion.regionName} instead of {fromRegion.regionName}
          </p>
        </div>

        {toRegion.hasFastTrack && (
          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-elderly-sm text-yellow-800">
              <span className="font-semibold">✨ Fast-track available:</span> {toRegion.regionName} has an ACES fast-track centre, which may offer even faster access.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-green-300">
          <p className="text-elderly-sm text-elderly-text mb-3">
            <strong>Can I request a different hospital?</strong>
          </p>
          <p className="text-elderly-sm text-elderly-text mb-3">
            Yes! Under NHS Patient Choice, you have the right to choose where you receive treatment, 
            including hospitals in different regions. Your GP can help you explore options.
          </p>
          <Link
            href={`/comparison/${procedureId}/${toRegion.regionId}`}
            className="inline-block text-elderly-primary underline hover:text-elderly-primary-dark font-semibold text-elderly-sm"
          >
            Learn more about {procedureName.toLowerCase()} in {toRegion.regionName} →
          </Link>
        </div>
      </div>
    </div>
  );
};

