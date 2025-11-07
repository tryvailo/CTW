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
          {/* GDPR Compliant */}
          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium text-left">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl text-elderly-success">✓</span>
              <h3 className="text-elderly-sm font-semibold text-elderly-text">
                GDPR Compliant
              </h3>
            </div>
            <p className="text-elderly-sm text-elderly-text">
              We follow UK data protection laws and never collect unnecessary information.
            </p>
          </div>

          {/* NHS-Grade Encryption */}
          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium text-left">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl text-elderly-success">✓</span>
              <h3 className="text-elderly-sm font-semibold text-elderly-text">
                NHS-Grade Encryption
              </h3>
            </div>
            <p className="text-elderly-sm text-elderly-text">
              Your browsing is secure with the same encryption standards used by NHS services.
            </p>
          </div>

          {/* No Ads or Tracking */}
          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium text-left">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl text-elderly-success">✓</span>
              <h3 className="text-elderly-sm font-semibold text-elderly-text">
                No Ads or Tracking
              </h3>
            </div>
            <p className="text-elderly-sm text-elderly-text">
              We don't use advertising cookies or sell your information to third parties.
            </p>
          </div>

          {/* 100% Anonymous Comparison */}
          <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium text-left">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl text-elderly-success">✓</span>
              <h3 className="text-elderly-sm font-semibold text-elderly-text">
                100% Anonymous Comparison
              </h3>
            </div>
            <p className="text-elderly-sm text-elderly-text">
              You can compare surgery options without providing any contact details.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border-elderly border-elderly-gray-medium">
          <p className="text-elderly-base font-semibold text-elderly-text">
            We never sell your data to clinics or collect personal information for comparisons.
          </p>
        </div>
      </div>
    </section>
  );
};

