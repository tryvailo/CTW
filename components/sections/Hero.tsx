import React from 'react';
import { SearchBar } from '../ui/SearchBar';

interface HeroProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Waiting for Surgery? Compare Your NHS vs Private Options",
  subtitle = "Honest comparison of waiting times and costs for cataract, hip & knee surgery in major UK cities. Free information, no pressure.",
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

