'use client';

import React from 'react';
import Link from 'next/link';
import type { ProcedureId, RegionId } from '@/lib/types/waitingTimes';
import type { CancellationRiskData } from '@/lib/types/waitingTimes';

interface CancellationWarningProps {
  data: CancellationRiskData | null;
  procedure: ProcedureId;
  region?: RegionId;
  variant?: 'banner' | 'card' | 'inline';
  procedureName?: string;
}

export const CancellationWarning: React.FC<CancellationWarningProps> = ({
  data,
  procedure,
  region,
  variant = 'banner',
  procedureName,
}) => {
  if (!data) {
    return null;
  }

  const procedureDisplayName = procedureName || 
    (procedure === 'cataract' ? 'Cataract Surgery' :
     procedure === 'hip' ? 'Hip Replacement' : 'Knee Replacement');

  // Inline variant - minimal display
  if (variant === 'inline') {
    return (
      <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">⚠️</span>
          <div className="flex-1">
            <p className="text-elderly-sm text-elderly-text font-semibold mb-1">
              About surgery cancellations
            </p>
            <p className="text-elderly-xs text-elderly-text">
              Patients tell us {data.percentageExperience}% experience at least one cancellation, 
              adding approximately {data.averageDelayWeeks} weeks each time. 
              <Link 
                href={`/comparison/${procedure}/${region || 'london'}#cancellations`}
                className="text-elderly-primary underline ml-1"
              >
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Card variant - standalone box
  if (variant === 'card') {
    return (
      <div 
        className="bg-orange-50 border-elderly border-orange-300 p-6 rounded-lg shadow-sm"
        role="region"
        aria-labelledby="cancellation-warning-heading"
      >
        <h3 
          id="cancellation-warning-heading"
          className="text-elderly-lg font-bold text-elderly-primary mb-4 flex items-center gap-2"
        >
          <span aria-hidden="true">⚠️</span>
          About Surgery Cancellations
        </h3>

        <div className="space-y-4 text-elderly-sm text-elderly-text">
          <div>
            <p className="font-semibold mb-2">Patients tell us:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{data.percentageExperience}% experience at least one cancellation</li>
              <li>Each cancellation adds approximately {data.averageDelayWeeks} weeks</li>
              <li>Some patients experience multiple cancellations</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">Common reasons:</p>
            <ul className="list-none space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Staff shortages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Operating theatre unavailability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Medical complications during pre-op assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Hospital system issues</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">What you can do:</p>
            <ul className="list-none space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Confirm your pre-op assessment is complete</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Know your priority status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Keep hospital contact details handy</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-orange-300">
            <p className="font-semibold mb-2">Private alternative:</p>
            <ul className="list-none space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Zero cancellation rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                <span>Date guaranteed weeks in advance</span>
              </li>
            </ul>
            {region && (
              <Link
                href={`/comparison/${procedure}/${region}`}
                className="inline-block mt-3 text-elderly-primary underline hover:text-elderly-primary-dark text-elderly-sm"
              >
                Learn more about private options
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Banner variant - full-width at top
  return (
    <div 
      id="cancellations"
      className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6"
      role="alert"
      aria-labelledby="cancellation-banner-heading"
    >
      <h2 
        id="cancellation-banner-heading"
        className="text-elderly-xl font-bold text-elderly-primary mb-4 flex items-center gap-2"
      >
        <span aria-hidden="true">⚠️</span>
        About Surgery Cancellations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-elderly-sm text-elderly-text">
        {/* Left column: Patient experiences */}
        <div>
          <p className="font-semibold mb-3 text-elderly-base">Patients tell us:</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>{data.percentageExperience}%</strong> experience at least one cancellation
            </li>
            <li>
              Each cancellation adds approximately <strong>{data.averageDelayWeeks} week{data.averageDelayWeeks !== 1 ? 's' : ''}</strong>
            </li>
            <li>
              Some patients experience <strong>multiple cancellations</strong> (average: {data.cancellationsPerPatientAverage.toFixed(1)} per patient)
            </li>
          </ul>
        </div>

        {/* Right column: Common reasons */}
        <div>
          <p className="font-semibold mb-3 text-elderly-base">Common reasons:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Staff shortages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Operating theatre unavailability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Medical complications during pre-op assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Hospital system issues</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom section: What you can do + Private alternative */}
      <div className="mt-6 pt-6 border-t border-orange-300 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-semibold mb-3 text-elderly-base">What you can do:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Confirm your pre-op assessment is complete</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Know your priority status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Keep hospital contact details handy</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3 text-elderly-base">Private alternative:</p>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Zero cancellation rate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 text-base flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
              <span>Date guaranteed weeks in advance</span>
            </li>
          </ul>
          {region && (
            <Link
              href={`/comparison/${procedure}/${region}#private-clinics`}
              className="inline-block mt-4 text-elderly-primary underline hover:text-elderly-primary-dark font-semibold text-elderly-sm"
            >
              Learn more about private options →
            </Link>
          )}
        </div>
      </div>

      {/* Normalising message */}
      <div className="mt-6 pt-4 border-t border-orange-300">
        <p className="text-elderly-xs text-elderly-gray-dark italic">
          This is normal and happens across the NHS. Cancellations are usually due to system-wide 
          pressures, not individual hospital performance. Being prepared can help reduce the impact.
        </p>
      </div>
    </div>
  );
};

