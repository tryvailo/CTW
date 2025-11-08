import React from 'react';
import { SearchBar } from '../ui/SearchBar';

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
    <section className="text-center mb-12 bg-elderly-primary-light p-8 rounded-lg border-elderly border-elderly-gray-medium">
      <h1 className="text-elderly-hero font-bold text-elderly-primary mb-6">
        {title}
      </h1>
      <p className="text-elderly-base text-elderly-text mb-8 max-w-3xl mx-auto">
        {subtitle}
      </p>
      {showSearch && (
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
      )}
    </section>
  );
};

