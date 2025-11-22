import React from 'react';

// SVG Icons
const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FileCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const SecurityCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 flex items-start space-x-4">
    <div className="text-orange-600 mt-1 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-elderly-lg text-gray-900 mb-1">{title}</h3>
      <p className="text-elderly-base text-gray-700">{desc}</p>
    </div>
  </div>
);

export const SecuritySection: React.FC = () => {
  return (
    <section className="py-16 bg-elderly-accent-light mb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center mb-10 space-x-3">
          <LockIcon />
          <h2 className="text-elderly-2xl font-bold text-gray-900">Your Data Is Safe</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecurityCard 
            icon={<FileCheckIcon />}
            title="GDPR Compliant"
            desc="We follow UK data protection laws and never collect unnecessary information."
          />
          <SecurityCard 
            icon={<ShieldIcon />}
            title="NHS-Grade Encryption"
            desc="Your browsing is secure with the same encryption standards used by NHS services."
          />
          <SecurityCard 
            icon={<EyeOffIcon />}
            title="No Ads or Tracking"
            desc="We don't use advertising cookies or sell your information to third parties."
          />
          <SecurityCard 
            icon={<LockIcon />}
            title="100% Anonymous Comparison"
            desc="You can compare surgery options without providing any contact details."
          />
        </div>
        
        <div className="text-center mt-10">
           <p className="text-elderly-base font-semibold text-gray-800">
             We never sell your data to clinics or collect personal information for comparisons.
           </p>
        </div>
      </div>
    </section>
  );
};

