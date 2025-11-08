'use client';

import React from 'react';
import Link from 'next/link';
import type { SubmissionFormData } from '@/lib/types/submissions';

interface SuccessStatesProps {
  submission: SubmissionFormData;
  waitWeeks: number;
  submissionId: string;
}

const PROCEDURE_NAMES: Record<string, string> = {
  cataract: 'Cataract Surgery',
  hip: 'Hip Replacement',
  knee: 'Knee Replacement',
};

const LOCATION_NAMES: Record<string, string> = {
  london: 'London',
  manchester: 'Manchester',
  birmingham: 'Birmingham',
  leeds: 'Leeds',
  bristol: 'Bristol',
};

export const SuccessStates: React.FC<SuccessStatesProps> = ({
  submission,
  waitWeeks,
  submissionId,
}) => {
  const procedureName = PROCEDURE_NAMES[submission.procedure] || submission.procedure;
  const locationName = LOCATION_NAMES[submission.location] || submission.location;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  return (
    <div
      className="bg-green-50 border-2 border-green-300 p-6 rounded-lg shadow-sm"
      role="region"
      aria-labelledby="success-heading"
    >
      <div className="text-center mb-6">
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <h2
          id="success-heading"
          className="text-elderly-xl font-bold text-green-800 mb-2"
        >
          Thank you! Your experience will help thousands of people
        </h2>
        <p className="text-elderly-base text-green-700">
          We've anonymised your data. Here's what you shared:
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg border border-green-200 mb-6">
        <ul className="space-y-3 text-elderly-sm text-elderly-text">
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">Procedure:</span>
            <span>{procedureName}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">Location:</span>
            <span>{locationName}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">Booked:</span>
            <span>{formatDate(submission.booking_date)}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">Surgery:</span>
            <span>{formatDate(submission.surgery_date)}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold min-w-[120px]">Wait:</span>
            <span className="font-bold text-green-700">
              {waitWeeks} week{waitWeeks !== 1 ? 's' : ''}
            </span>
          </li>
          {submission.cancellations > 0 && (
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Cancellations:</span>
              <span>{submission.cancellations}</span>
            </li>
          )}
          {submission.satisfaction > 0 && (
            <li className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Satisfaction:</span>
              <span>
                {submission.satisfaction}/5{' '}
                <span className="text-yellow-500" aria-hidden="true">
                  {'★'.repeat(submission.satisfaction)}
                </span>
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/comparison/${submission.procedure}/${submission.location}`}
          className="btn-primary text-center min-h-touch"
        >
          View how this compares to others →
        </Link>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'I shared my NHS wait time experience',
                text: `I waited ${waitWeeks} weeks for ${procedureName.toLowerCase()} in ${locationName}. Help others by sharing your experience too!`,
                url: window.location.href,
              });
            }
          }}
          className="btn-secondary text-center min-h-touch"
        >
          Share with friends
        </button>
      </div>

      <p className="mt-6 text-elderly-xs text-green-700 text-center">
        Your submission ID: {submissionId.substring(0, 8)}... (for reference)
      </p>
    </div>
  );
};

