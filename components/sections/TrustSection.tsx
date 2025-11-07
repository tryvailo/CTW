import React from 'react';
import Link from 'next/link';

export const TrustSection: React.FC = () => {
  return (
    <section className="mb-12 bg-elderly-accent-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* NHS-Approved Data Sources */}
        <div className="text-center">
          <div className="text-3xl mb-3 text-elderly-accent">✓</div>
          <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
            NHS-Approved Data
          </h3>
          <p className="text-elderly-sm text-elderly-text">
            Using official{' '}
            <Link
              href="https://www.myplannedcare.nhs.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-elderly-primary hover:underline"
            >
              MyPlannedCare
            </Link>{' '}
            and{' '}
            <Link
              href="https://www.phin.org.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-elderly-primary hover:underline"
            >
              PHIN
            </Link>{' '}
            data sources
          </p>
        </div>

        {/* Real Data */}
        <div className="text-center">
          <div className="text-3xl mb-3 text-elderly-accent">✓</div>
          <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
            Real NHS & Private Data
          </h3>
          <p className="text-elderly-sm text-elderly-text">
            Actual waiting times and costs from NHS records and clinic websites
          </p>
        </div>

        {/* Free */}
        <div className="text-center">
          <div className="text-3xl mb-3 text-elderly-accent">✓</div>
          <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
            100% Free
          </h3>
          <p className="text-elderly-sm text-elderly-text">
            No hidden fees. Compare anytime, completely free
          </p>
        </div>

        {/* Updated Weekly */}
        <div className="text-center">
          <div className="text-3xl mb-3 text-elderly-accent">✓</div>
          <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
            Data Updated Weekly
          </h3>
          <p className="text-elderly-sm text-elderly-text">
            Fresh data every week from official sources
          </p>
        </div>

        {/* No Commissions */}
        <div className="text-center">
          <div className="text-3xl mb-3 text-elderly-accent">✓</div>
          <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
            No Commissions
          </h3>
          <p className="text-elderly-sm text-elderly-text">
            We never receive payments from clinics. 100% independent comparison
          </p>
        </div>
      </div>
    </section>
  );
};

