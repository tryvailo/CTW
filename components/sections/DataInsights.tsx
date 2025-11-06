import React from 'react';
import { getDataInsights, formatDateForDisplay } from '@/lib/stats';

export const DataInsights: React.FC = () => {
  const insights = getDataInsights();

  return (
    <section className="mb-12 bg-elderly-primary-light p-8 rounded-lg border-elderly border-elderly-gray-medium">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-elderly-xl font-bold text-elderly-text mb-4">
            Key Insights from Real Data
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Average NHS Wait */}
          <div className="bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
            <div className="text-3xl font-bold text-elderly-warning mb-2">
              {insights.avgNHSWaitWeeks} weeks
            </div>
            <p className="text-elderly-base font-semibold text-elderly-text mb-2">
              Average NHS Wait
            </p>
            <p className="text-elderly-sm text-elderly-gray-dark">
              Typical waiting time for surgery on NHS
            </p>
          </div>

          {/* Average Private Wait */}
          <div className="bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
            <div className="text-3xl font-bold text-elderly-success mb-2">
              {insights.avgPrivateWaitWeeks} weeks
            </div>
            <p className="text-elderly-base font-semibold text-elderly-text mb-2">
              Average Private Wait
            </p>
            <p className="text-elderly-sm text-elderly-gray-dark">
              Typical waiting time for private surgery
            </p>
          </div>

          {/* Time Saved */}
          <div className="bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
            <div className="text-3xl font-bold text-elderly-accent mb-2">
              {insights.avgSavingsWeeks} weeks
            </div>
            <p className="text-elderly-base font-semibold text-elderly-text mb-2">
              Time Saved
            </p>
            <p className="text-elderly-sm text-elderly-gray-dark">
              Average time saved with private surgery
            </p>
          </div>
        </div>

        {/* Cost Range */}
        <div className="bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium text-center mb-6">
          <p className="text-elderly-base text-elderly-text mb-2">
            <strong>Average Private Cost Range:</strong>
          </p>
          <p className="text-elderly-xl font-bold text-elderly-text">
            £{insights.avgPrivateCostMin.toLocaleString()} - £{insights.avgPrivateCostMax.toLocaleString()}
          </p>
          <p className="text-elderly-sm text-elderly-gray-dark mt-2">
            Based on real clinic prices across all procedures and cities
          </p>
        </div>

        {/* Key Message */}
        <div className="bg-elderly-accent-light p-6 rounded-lg border-elderly border-elderly-accent text-center">
          <p className="text-elderly-lg font-semibold text-elderly-text mb-2">
            Patients save {insights.avgSavingsWeeks} weeks on average by choosing private surgery
          </p>
          <p className="text-elderly-sm text-elderly-text">
            Data updated: {formatDateForDisplay(insights.lastUpdatedDate)} • Based on NHS and private clinic records
          </p>
        </div>
      </div>
    </section>
  );
};

