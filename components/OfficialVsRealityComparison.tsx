'use client';

import React, { useState } from 'react';
import type { OfficialVsRealityData } from '@/lib/types/waitingTimes';

interface OfficialVsRealityComparisonProps {
  data: OfficialVsRealityData | null;
  variant?: 'full' | 'compact' | 'homepage';
}

export const OfficialVsRealityComparison: React.FC<OfficialVsRealityComparisonProps> = ({
  data,
  variant = 'full',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data) {
    return (
      <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-6 rounded-lg">
        <p className="text-elderly-base text-elderly-text">
          Waiting times data not available for this procedure and location.
        </p>
      </div>
    );
  }

  const gapWeeks = data.patientAverage - data.officialTarget;

  // Variant-specific rendering
  if (variant === 'homepage') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
          <p className="text-elderly-sm text-elderly-gray-dark mb-2">NHS Target</p>
          <p className="text-elderly-xl font-bold text-blue-700">{data.officialTarget} weeks</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
          <p className="text-elderly-sm text-elderly-gray-dark mb-2">Providers Average</p>
          <p className="text-elderly-xl font-bold text-orange-700">{data.providerAverage} weeks</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-300">
          <p className="text-elderly-sm text-elderly-gray-dark mb-2">Patients Report</p>
          <p className="text-elderly-xl font-bold text-red-700">{data.patientAverage} weeks</p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white border-elderly border-elderly-gray-medium p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-elderly-lg font-bold text-elderly-primary mb-2">
              Official vs Reality
            </h3>
            <div className="flex flex-wrap gap-4 text-elderly-sm">
              <span className="text-blue-700 font-semibold">
                NHS: {data.officialTarget}w
              </span>
              <span className="text-orange-700 font-semibold">
                Providers: {data.providerAverage}w
              </span>
              <span className="text-red-700 font-semibold">
                Patients: {data.patientAverage}w
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <section
      className="bg-white border-elderly border-elderly-gray-medium p-6 rounded-lg shadow-sm mb-6"
      aria-labelledby="official-vs-reality-heading"
    >
      <h2
        id="official-vs-reality-heading"
        className="text-elderly-xl font-bold text-elderly-primary mb-6"
      >
        Official vs Reality
      </h2>

      {/* Three-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Official NHS Target */}
        <div
          className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300"
          role="region"
          aria-label="Official NHS target"
        >
          <h3 className="text-elderly-base font-semibold text-blue-900 mb-3">
            What NHS officially targets
          </h3>
          <p className="text-elderly-2xl font-bold text-blue-700 mb-3">
            {data.officialTarget} weeks
          </p>
          {data.officialNotes && (
            <p className="text-elderly-xs text-blue-800">{data.officialNotes}</p>
          )}
        </div>

        {/* Healthcare Provider Average */}
        <div
          className="p-6 bg-orange-50 rounded-lg border-2 border-orange-300"
          role="region"
          aria-label="Healthcare provider average"
        >
          <h3 className="text-elderly-base font-semibold text-orange-900 mb-3">
            What healthcare providers typically deliver
          </h3>
          <p className="text-elderly-2xl font-bold text-orange-700 mb-3">
            {data.providerAverage} weeks
          </p>
          {data.providerNotes && (
            <p className="text-elderly-xs text-orange-800">{data.providerNotes}</p>
          )}
        </div>

        {/* Patient Reported */}
        <div
          className="p-6 bg-red-50 rounded-lg border-2 border-red-300"
          role="region"
          aria-label="Patient reported average"
        >
          <h3 className="text-elderly-base font-semibold text-red-900 mb-3">
            What patients have actually experienced
          </h3>
          <p className="text-elderly-2xl font-bold text-red-700 mb-3">
            {data.patientAverage} weeks
          </p>
          {data.patientMedian > 0 && data.patientMedian !== data.patientAverage && (
            <p className="text-elderly-xs text-red-800 mt-2">
              (Median: {data.patientMedian} weeks)
            </p>
          )}
        </div>
      </div>

      {/* Gap indicator */}
      {gapWeeks > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
          <p className="text-elderly-base text-elderly-text">
            <strong>Gap:</strong> Patients report waiting{' '}
            <span className="font-bold text-orange-700">{gapWeeks} weeks longer</span> than the
            official NHS target.
          </p>
        </div>
      )}


      {/* Key facts (expandable) */}
      {data.keyFacts && data.keyFacts.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left flex items-center justify-between p-4 bg-elderly-gray-light rounded-lg hover:bg-elderly-gray-medium transition-colors focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2"
            aria-expanded={isExpanded}
            aria-controls="key-facts-content"
          >
            <span className="text-elderly-base font-semibold text-elderly-primary">
              Why the gap? {isExpanded ? 'Hide' : 'Show'} key facts
            </span>
            <span className="text-elderly-xl" aria-hidden="true">
              {isExpanded ? '−' : '+'}
            </span>
          </button>
          {isExpanded && (
            <div
              id="key-facts-content"
              className="mt-4 p-4 bg-elderly-primary-light rounded-lg"
              role="region"
              aria-label="Key facts about waiting times"
            >
              <ul className="space-y-2 list-disc list-inside text-elderly-sm text-elderly-text">
                {data.keyFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer disclaimer */}
      <footer className="pt-4 border-t border-elderly-gray-medium">
        <p className="text-elderly-xs text-elderly-gray-dark">
          We show all data transparently. Actual wait depends on location, complexity, and
          circumstances.
        </p>
      </footer>
    </section>
  );
};

