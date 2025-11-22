import React from 'react';
import { getUKWideData, getPrivateComparisonData } from '@/lib/utils/waitingTimesLoader';
import { loadProcedures } from '@/lib/data';
import type { ProcedureId } from '@/lib/types/waitingTimes';

const StatCard: React.FC<{ title: string; highlight: string; desc: string }> = ({ title, highlight, desc }) => (
  <div className="bg-elderly-primary-light p-8 rounded-2xl text-center border border-blue-100">
    <h3 className="text-elderly-lg font-bold text-gray-700 mb-2">{title}</h3>
    <div className="text-5xl md:text-6xl font-bold text-elderly-primary my-4">{highlight}</div>
    <p className="text-elderly-base text-gray-800">{desc}</p>
  </div>
);

export const DataInsights: React.FC = () => {
  // Calculate average time saved across all procedures
  const allProcedures = loadProcedures();
  const procedureIds: ProcedureId[] = ['cataract', 'hip', 'knee'];
  const procedures = allProcedures.filter(p => procedureIds.includes(p.procedure_id));

  let totalTimeSaved = 0;
  let procedureCount = 0;
  let minCost = Infinity;
  let maxCost = 0;

  procedures.forEach(procedure => {
    const waitData = getUKWideData(procedure.procedure_id);
    const privateData = getPrivateComparisonData(procedure.procedure_id);
    
    if (waitData && privateData) {
      const timeSaved = waitData.patientAverage - privateData.average_wait_weeks;
      if (timeSaved > 0) {
        totalTimeSaved += timeSaved;
        procedureCount++;
      }
      
      if (privateData.cost_range_min_pounds < minCost) {
        minCost = privateData.cost_range_min_pounds;
      }
      if (privateData.cost_range_max_pounds > maxCost) {
        maxCost = privateData.cost_range_max_pounds;
      }
    }
  });

  const avgTimeSaved = procedureCount > 0 ? Math.round(totalTimeSaved / procedureCount) : 0;
  const costRange = minCost < Infinity && maxCost > 0 
    ? `£${Math.round(minCost).toLocaleString()}–£${Math.round(maxCost).toLocaleString()}`
    : 'Varies by procedure';

  return (
    <section className="py-16 bg-white mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-elderly-2xl md:text-elderly-hero font-bold text-center mb-12">Why Compare?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            title="Average Time Saved"
            highlight={avgTimeSaved > 0 ? `${avgTimeSaved} weeks` : 'Varies'}
            desc={`Patients who choose private surgery save an average of ${avgTimeSaved} weeks compared to NHS waiting lists for the same procedure.`}
          />
          <StatCard 
            title="Typical Private Costs"
            highlight={costRange}
            desc="Our comparison shows exact costs for cataract, hip, and knee surgery from verified private clinics in your area."
          />
          <StatCard 
            title="Didn't Know Private Was Affordable"
            highlight="5 in 10"
            desc="Half of patients over 65 told us they had no idea private surgery costs were within reach until they used our comparison."
          />
        </div>
      </div>
    </section>
  );
};

