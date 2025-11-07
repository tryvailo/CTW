'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';
import type { ProcedureId, City } from '@/lib/types';

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureId | ''>('');
  const [selectedCity, setSelectedCity] = useState<City | ''>('');
  
  const handleSearch = () => {
    if (selectedProcedure && selectedCity) {
      const citySlug = selectedCity.toLowerCase().replace(/\s+/g, '-');
      router.push(`/comparison/${selectedProcedure}/${citySlug}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border-elderly border-elderly-gray-medium shadow-sm">
      <div className="space-y-4">
        {/* Procedure Dropdown */}
        <div>
          <label htmlFor="procedure" className="block text-elderly-base font-semibold mb-2 text-elderly-text">
            1. Select Procedure to Compare
          </label>
          <select
            id="procedure"
            value={selectedProcedure}
            onChange={(e) => setSelectedProcedure(e.target.value as ProcedureId)}
            className="w-full min-h-touch px-4 text-elderly-base border-elderly border-elderly-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2"
          >
            <option value="">Choose a procedure to compare...</option>
            <option value="cataract">Cataract Surgery</option>
            <option value="hip">Hip Replacement</option>
            <option value="knee">Knee Replacement</option>
          </select>
          <p className="text-elderly-xs text-elderly-gray-dark mt-1">
            Compare NHS wait times vs private costs for your procedure
          </p>
        </div>

        {/* City Dropdown */}
        <div>
          <label htmlFor="city" className="block text-elderly-base font-semibold mb-2 text-elderly-text">
            2. Select Your City
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as City)}
            className="w-full min-h-touch px-4 text-elderly-base border-elderly border-elderly-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2"
          >
            <option value="">Choose your city...</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Leeds">Leeds</option>
            <option value="Bristol">Bristol</option>
          </select>
          <p className="text-elderly-xs text-elderly-gray-dark mt-1">
            See waiting times and costs for your area
          </p>
        </div>

        {/* Search Button */}
        <div>
          <Button
            onClick={handleSearch}
            disabled={!selectedProcedure || !selectedCity}
            className="w-full"
            size="large"
          >
            See Your Savings Estimate
          </Button>
          <p className="text-elderly-sm text-elderly-gray-dark mt-2 text-center">
            (Takes 2 minutes, no contact info needed)
          </p>
        </div>
      </div>
    </div>
  );
};

