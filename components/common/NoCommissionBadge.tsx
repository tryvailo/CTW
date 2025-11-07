import React from 'react';

const NoCommissionBadge: React.FC = () => {
  return (
    <div className="bg-elderly-accent-light border-2 border-elderly-gray-medium p-4 rounded-lg">
      <div className="flex flex-col gap-2 text-elderly-base text-elderly-text">
        <div className="flex items-start gap-2">
          <span className="text-green-600 font-bold text-lg">✓</span>
          <span>No commissions from clinics</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-600 font-bold text-lg">✓</span>
          <span>No hidden fees for patients</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-600 font-bold text-lg">✓</span>
          <span>100% free information, forever</span>
        </div>
      </div>
    </div>
  );
};

export default NoCommissionBadge;

