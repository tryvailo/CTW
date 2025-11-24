'use client';

import React, { useState } from 'react';

interface EstimatedWaitTimeProps {
  weeks: number;
  isEstimated?: boolean;
  className?: string;
  showLabel?: boolean;
}

const InfoIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const EstimatedWaitTime: React.FC<EstimatedWaitTimeProps> = ({ 
  weeks, 
  isEstimated = false,
  className = '',
  showLabel = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Validate and sanitize weeks value
  const validWeeks = Number.isFinite(weeks) && weeks >= 0 ? Math.round(weeks) : 0;
  
  // Fallback for invalid data
  if (!validWeeks) {
    return (
      <span className={className}>
        <span className="text-gray-400 italic">Data unavailable</span>
      </span>
    );
  }

  if (!isEstimated) {
    return (
      <span className={className}>
        {validWeeks} week{validWeeks !== 1 ? 's' : ''}
      </span>
    );
  }

  return (
    <span className={`${className} ${isEstimated ? 'text-gray-600' : ''}`}>
      {validWeeks} week{validWeeks !== 1 ? 's' : ''}
      <span className="text-yellow-600 font-bold ml-1">*</span>
      {showLabel && (
        <span 
          className="inline-flex items-center ml-2 cursor-help relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          <InfoIcon className="h-4 w-4 text-blue-500" />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50">
              <p className="font-semibold mb-1">Estimated Value</p>
              <p>
                Estimated from regional NHS data. Based on national averages and regional patterns. 
                Limited patient data available for this combination.
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </span>
      )}
    </span>
  );
};

