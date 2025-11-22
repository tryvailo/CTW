'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import type { ProcedureId, City } from '@/lib/types';

// Search Icon
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureId | ''>('');
  const [selectedCity, setSelectedCity] = useState<City | ''>('');
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedProcedure && selectedCity) {
      const citySlug = selectedCity.toLowerCase().replace(/\s+/g, '-');
      router.push(`/comparison/${selectedProcedure}/${citySlug}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-blue-100 w-full max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="relative text-left flex-1 min-w-0">
          <label htmlFor="procedure" className="block text-elderly-base font-bold text-gray-700 mb-3 ml-1">Procedure</label>
          <select 
            id="procedure"
            className="w-full h-[70px] px-6 border-2 border-gray-200 rounded-xl text-elderly-lg focus:border-elderly-primary focus:ring-4 focus:ring-blue-100 transition-all appearance-none bg-white cursor-pointer font-medium"
            value={selectedProcedure}
            onChange={(e) => setSelectedProcedure(e.target.value as ProcedureId)}
            required
            style={{ minWidth: '200px' }}
          >
            <option value="">Choose Procedure</option>
            <option value="cataract">Cataract Surgery</option>
            <option value="hip">Hip Replacement</option>
            <option value="knee">Knee Replacement</option>
          </select>
        </div>
        
        <div className="relative text-left flex-1 min-w-0">
          <label htmlFor="city" className="block text-elderly-base font-bold text-gray-700 mb-3 ml-1">Location</label>
          <select 
            id="city"
            className="w-full h-[70px] px-6 border-2 border-gray-200 rounded-xl text-elderly-lg focus:border-elderly-primary focus:ring-4 focus:ring-blue-100 transition-all appearance-none bg-white cursor-pointer font-medium"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as City)}
            style={{ minWidth: '200px' }}
          >
            <option value="">Select Location</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Leeds">Leeds</option>
            <option value="Bristol">Bristol</option>
          </select>
        </div>

        <div className="relative pt-8 flex-1 min-w-0">
          <Button 
            type="submit" 
            onClick={handleSearch}
            disabled={!selectedProcedure || !selectedCity}
            variant="accent"
            size="xl"
            className="h-[70px] w-full shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all"
          >
            <SearchIcon />
            <span className="ml-2">Compare Now</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

