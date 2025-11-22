import React from 'react';
import { SearchBar } from '../ui/SearchBar';

// Professional Medical SVG Icons
const CataractIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 5V3" />
    <path d="M12 21v-2" />
    <path d="M5 12H3" />
    <path d="M21 12h-2" />
  </svg>
);

const HipIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 2C12.5 2 12 8 12 8C12 8 7 8.5 7 12C7 15.5 11 17 11 17" />
    <path d="M12 8C12 8 17 8.5 17 12C17 15.5 13 17 13 17" />
    <circle cx="12" cy="19" r="3" />
    <path d="M12 22V22" />
  </svg>
);

const KneeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3v5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V3" />
    <path d="M10 21v-5c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v5" />
    <rect x="10" y="11" width="4" height="4" rx="1" />
    <path d="M5 13h2" />
    <path d="M17 13h2" />
  </svg>
);

interface HeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  title = "NHS Says You'll Wait 18 Weeks. Most People Actually Wait a Year. Here's the Truth.",
  subtitle = "Real data from 3,000+ patients shows NHS wait times are often 3-4x longer than official targets. See what to actually expect for cataract, hip & knee surgery in your area. Plus faster alternatives.",
  showSearch = true,
}) => {
  return (
    <section className="bg-elderly-primary-light py-12 md:py-20 px-4 mb-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-elderly-2xl md:text-elderly-hero font-bold text-elderly-text mb-6 leading-tight">
          NHS Says You'll Wait 18 Weeks.<br />
          <span className="text-elderly-primary">Most People Actually Wait a Year.</span><br />
          Here's the Truth.
        </h1>
        
        <p className="text-elderly-lg md:text-elderly-xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
          Real data from 3,000+ patients. Compare wait times & costs for:
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {/* Cataract Badge */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="bg-elderly-primary text-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300 border-4 border-white">
              <CataractIcon />
            </div>
            <span className="mt-3 font-bold text-elderly-lg text-elderly-primary text-center">Cataract</span>
          </div>

          {/* Hip Badge */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="bg-elderly-primary text-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300 border-4 border-white">
              <HipIcon />
            </div>
            <span className="mt-3 font-bold text-elderly-lg text-elderly-primary text-center">Hip Replacement</span>
          </div>

          {/* Knee Badge */}
          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="bg-elderly-primary text-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 transform group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300 border-4 border-white">
              <KneeIcon />
            </div>
            <span className="mt-3 font-bold text-elderly-lg text-elderly-primary text-center">Knee Replacement</span>
          </div>
        </div>

        {showSearch && (
          <div className="w-full max-w-6xl mx-auto px-4">
            <SearchBar />
          </div>
        )}
      </div>
    </section>
  );
};

