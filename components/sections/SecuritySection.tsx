import React from 'react';

export const SecuritySection: React.FC = () => {
  return (
    <section className="mb-12 bg-elderly-accent-light p-8 rounded-lg border-elderly border-elderly-gray-medium">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-elderly-xl font-bold text-elderly-text mb-4">
            Your Data Is Safe
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl text-elderly-success">✓</span>
            <div className="text-left">
              <h3 className="text-elderly-lg font-semibold text-elderly-text mb-1">
                GDPR Compliant
              </h3>
              <p className="text-elderly-sm text-elderly-text">
                We follow UK data protection regulations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl text-elderly-success">✓</span>
            <div className="text-left">
              <h3 className="text-elderly-lg font-semibold text-elderly-text mb-1">
                NHS-Grade Encryption
              </h3>
              <p className="text-elderly-sm text-elderly-text">
                Your information is protected with secure encryption
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl text-elderly-success">✓</span>
            <div className="text-left">
              <h3 className="text-elderly-lg font-semibold text-elderly-text mb-1">
                No Ads or Tracking
              </h3>
              <p className="text-elderly-sm text-elderly-text">
                We don't use advertising or track your browsing
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl text-elderly-success">✓</span>
            <div className="text-left">
              <h3 className="text-elderly-lg font-semibold text-elderly-text mb-1">
                100% Anonymous Comparison
              </h3>
              <p className="text-elderly-sm text-elderly-text">
                Compare options without sharing personal information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium">
          <p className="text-elderly-base font-semibold text-elderly-text">
            We never sell your data to clinics
          </p>
        </div>
      </div>
    </section>
  );
};

