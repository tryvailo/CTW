import React from 'react';
import { loadWaitingTimesData } from '@/lib/utils/waitingTimesLoader';
import type { ProcedureId } from '@/lib/types/waitingTimes';

interface RegionalVariationComparisonProps {
  procedure?: ProcedureId;
}

export const RegionalVariationComparison: React.FC<RegionalVariationComparisonProps> = ({ procedure }) => {
  // Load data from the same source as other components (comparethewait-data-source.json)
  const waitingTimesData = loadWaitingTimesData();

  // If a specific procedure is provided, show only that procedure's data
  if (procedure) {
    const procedureKey = procedure === 'hip' ? 'hip' : procedure === 'knee' ? 'knee' : 'cataract';
    const procedureName = procedure === 'hip' ? 'Hip Replacement' : procedure === 'knee' ? 'Knee Replacement' : 'Cataract Surgery';
    
    const regions = waitingTimesData.regions.map(region => ({
      regionName: region.region_name,
      waitDisplay: region[procedureKey].recommended_display,
      waitWeeks: region[procedureKey].patient_reported_average_weeks || region[procedureKey].official_target_weeks,
    }));

    return (
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-elderly-2xl font-bold mb-4">Regional Variation: Wait Times Across UK</h2>
            <p className="text-elderly-lg text-gray-700">
              Wait times for {procedureName} vary significantly by region. Compare regions and see if traveling could save you time.
            </p>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-elderly-primary text-white">
                  <th className="p-4 md:p-6 text-elderly-lg font-bold border-r border-blue-600">Region/City</th>
                  <th className="p-4 md:p-6 text-elderly-lg font-bold">Wait Time</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {regions.map((row, idx) => (
                  <tr key={row.regionName} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 md:p-6 text-elderly-base font-bold text-gray-900 border-r border-gray-100">{row.regionName}</td>
                    <td className="p-4 md:p-6 text-elderly-base text-gray-800">{row.waitDisplay || `${row.waitWeeks} weeks`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // Default: show all three procedures (for homepage)
  const regions = waitingTimesData.regions.map(region => ({
    regionName: region.region_name,
    cataractDisplay: region.cataract.recommended_display,
    hipDisplay: region.hip.recommended_display,
    kneeDisplay: region.knee.recommended_display,
    // Fallback values if recommended_display is not available
    cataractWait: region.cataract.patient_reported_average_weeks || region.cataract.official_target_weeks,
    hipWait: region.hip.patient_reported_average_weeks || region.hip.official_target_weeks,
    kneeWait: region.knee.patient_reported_average_weeks || region.knee.official_target_weeks,
  }));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-elderly-2xl font-bold mb-4">Regional Variation: Wait Times Across UK</h2>
          <p className="text-elderly-lg text-gray-700">
            Wait times vary significantly by region. Compare regions and see if traveling could save you time.
          </p>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-elderly-primary text-white">
                <th className="p-4 md:p-6 text-elderly-lg font-bold border-r border-blue-600">Region/City</th>
                <th className="p-4 md:p-6 text-elderly-lg font-bold border-r border-blue-600">Cataract Wait</th>
                <th className="p-4 md:p-6 text-elderly-lg font-bold border-r border-blue-600">Hip Wait</th>
                <th className="p-4 md:p-6 text-elderly-lg font-bold">Knee Wait</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {regions.map((row, idx) => (
                <tr key={row.regionName} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4 md:p-6 text-elderly-base font-bold text-gray-900 border-r border-gray-100">{row.regionName}</td>
                  <td className="p-4 md:p-6 text-elderly-base text-gray-800 border-r border-gray-100">{row.cataractDisplay || `${row.cataractWait} weeks`}</td>
                  <td className="p-4 md:p-6 text-elderly-base text-gray-800 border-r border-gray-100">{row.hipDisplay || `${row.hipWait} weeks`}</td>
                  <td className="p-4 md:p-6 text-elderly-base text-gray-800">{row.kneeDisplay || `${row.kneeWait} weeks`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
