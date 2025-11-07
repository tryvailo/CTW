import React from 'react';

export const DataInsights: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-elderly-xl font-bold text-center mb-8 text-elderly-text">
        Why Compare?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 - Time Savings */}
        <div className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
          <div className="text-6xl font-bold text-elderly-primary mb-4">
            16 weeks
          </div>
          <h3 className="text-elderly-lg text-elderly-text mb-3 font-semibold">
            Average Time Saved
          </h3>
          <p className="text-elderly-sm text-elderly-gray-dark">
            Patients who choose private surgery save an average of 16 weeks compared to NHS waiting lists for the same procedure.
          </p>
        </div>

        {/* Card 2 - Cost Information */}
        <div className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
          <div className="text-6xl font-bold text-elderly-primary mb-4">
            £1,200–£3,500
          </div>
          <h3 className="text-elderly-lg text-elderly-text mb-3 font-semibold">
            Typical Private Costs
          </h3>
          <p className="text-elderly-sm text-elderly-gray-dark">
            Our comparison shows exact costs for cataract, hip, and knee surgery from verified private clinics in your area.
          </p>
        </div>

        {/* Card 3 - Knowledge Gap */}
        <div className="bg-elderly-primary-light p-6 rounded-lg border-elderly border-elderly-gray-medium text-center">
          <div className="text-6xl font-bold text-elderly-primary mb-4">
            5 in 10
          </div>
          <h3 className="text-elderly-lg text-elderly-text mb-3 font-semibold">
            Didn't Know Private Was Affordable
          </h3>
          <p className="text-elderly-sm text-elderly-gray-dark">
            Half of patients over 65 told us they had no idea private surgery costs were within reach until they used our comparison.
          </p>
        </div>
      </div>
    </section>
  );
};

