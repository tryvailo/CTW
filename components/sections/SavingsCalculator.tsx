import React from 'react';
import { Card } from '../ui/Card';
import { EstimatedWaitTime } from '../common/EstimatedWaitTime';
import type { ComparisonData } from '@/lib/types';
import type { PrivateComparison } from '@/lib/types/waitingTimes';

interface SavingsCalculatorProps {
  data: ComparisonData;
  privateComparison?: PrivateComparison | null;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ data, privateComparison }) => {
  const { nhsWait, privateCost } = data;
  
  if (!nhsWait || !privateCost) {
    return null;
  }

  // Use private comparison data from JSON if available, otherwise fall back to defaults
  const privateWaitWeeks = privateComparison?.average_wait_weeks || 1.5;
  const avgCost = privateComparison?.average_cost_pounds || (privateCost.cost_min + privateCost.cost_max) / 2;
  
  // Use patient-reported average if available, otherwise use avg_wait_weeks
  const nhsWaitWeeks = nhsWait.patient_reported_wait_weeks || nhsWait.avg_wait_weeks;
  
  const timeSaved = nhsWaitWeeks - privateWaitWeeks;
  const monthsSaved = Math.round((timeSaved / 4) * 10) / 10;
  const costPerWeek = Math.round(avgCost / 52);
  const costPerMonth = Math.round(avgCost / 12);

  return (
    <section className="mb-12">
      <Card className="bg-elderly-primary-light">
        <div className="text-center mb-6">
          <h2 className="text-elderly-xl font-bold text-elderly-primary mb-2">
            💰 SAVINGS CALCULATOR
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-elderly-lg font-bold text-elderly-text mb-2">
              If you go private instead of NHS:
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium">
            <p className="text-elderly-base font-bold text-elderly-text mb-2">
              TIME SAVED: {Math.round(timeSaved)} weeks
            </p>
            <p className="text-elderly-sm text-elderly-text">
              ({nhsWaitWeeks} weeks wait → {privateWaitWeeks} week{privateWaitWeeks !== 1 ? 's' : ''} wait)
            </p>
            <p className="text-elderly-base font-bold text-elderly-text mt-4">
              That's {monthsSaved} months shorter!
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium">
            <p className="text-elderly-base font-bold text-elderly-text mb-2">
              COST: £{avgCost.toLocaleString()} (average private)
            </p>
            <div className="mt-2 space-y-1 text-elderly-sm text-elderly-text">
              <p>Annual cost: £{avgCost.toLocaleString()}</p>
              <p>That's £{costPerMonth.toLocaleString()}/month</p>
              <p>Or £{costPerWeek.toLocaleString()}/week</p>
            </div>
          </div>

          <div>
            <h4 className="text-elderly-base font-bold text-elderly-text mb-2">
              Is it worth it?
            </h4>
            <ul className="list-disc list-inside text-elderly-sm text-elderly-text space-y-1">
              <li>Getting treatment {Math.round(timeSaved)} weeks sooner (from {nhsWaitWeeks} weeks to {privateWaitWeeks} week{privateWaitWeeks !== 1 ? 's' : ''})</li>
              <li>Returning to normal activities {Math.round(timeSaved)} weeks sooner</li>
              <li>Peace of mind & known timeline</li>
            </ul>
          </div>

          <p className="text-elderly-sm text-elderly-text italic">
            Everyone's different—only you can decide if private is right for you.
          </p>
        </div>
      </Card>
    </section>
  );
};

