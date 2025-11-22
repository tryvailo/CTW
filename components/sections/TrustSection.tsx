import React from 'react';
import Link from 'next/link';

// SVG Icons
const ShieldCheckIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const PoundSterlingIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 7c0-5.333-3.333-8-8-8S2 1.667 2 7c0 4.667 3.333 7 8 7s8 2.333 8 7c0 5.333-3.333 8-8 8S2 19.667 2 15" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const BanIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m4.9 4.9 14.2 14.2" />
  </svg>
);

const TrustItem: React.FC<{ icon: React.ReactNode; title: string; desc: React.ReactNode }> = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="text-elderly-primary mb-4 bg-white p-4 rounded-full shadow-md border border-blue-50">
      {icon}
    </div>
    <h3 className="font-bold text-elderly-lg mb-2 text-elderly-text">{title}</h3>
    <p className="text-elderly-sm text-gray-600 leading-relaxed max-w-[200px]">{desc}</p>
  </div>
);

export const TrustSection: React.FC = () => {
  return (
    <section className="bg-elderly-accent-light py-12 border-b border-orange-100 mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <TrustItem 
            icon={<ShieldCheckIcon />}
            title="NHS-Approved Data" 
            desc={
              <>
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
                data sources.
              </>
            }
          />
          <TrustItem 
            icon={<CheckCircleIcon />}
            title="Real NHS & Private Data" 
            desc="Actual waiting times and costs from NHS records and clinic websites." 
          />
          <TrustItem 
            icon={<PoundSterlingIcon />}
            title="100% Free" 
            desc="No hidden fees. Compare anytime, completely free." 
          />
          <TrustItem 
            icon={<RefreshIcon />}
            title="Data Updated Every 2 Weeks" 
            desc="Fresh data every 2 weeks from official sources." 
          />
          <TrustItem 
            icon={<BanIcon />}
            title="No Commissions" 
            desc="We never receive payments from clinics. 100% independent comparison." 
          />
        </div>
      </div>
    </section>
  );
};

