'use client';

import React from 'react';
import { Button } from '../ui/Button';
import type { ComparisonData } from '@/lib/types';

// Icons
const CalendarIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PoundIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface ComparisonTableProps {
  data: ComparisonData;
  privateWaitWeeks?: number; // Private wait time in weeks from data
  officialTarget?: number; // Official NHS target in weeks
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, privateWaitWeeks, officialTarget }) => {
  const { procedure, nhsWait, privateCost, clinics, city } = data;
  const clinicCount = clinics.length;
  
  // Format private wait time display
  const privateWaitDisplay = privateWaitWeeks 
    ? (privateWaitWeeks < 2 ? '1-2 Weeks' : `${Math.round(privateWaitWeeks)} Weeks`)
    : '1-2 Weeks'; // Fallback only if no data

  // Handle scroll to clinic list
  const handleFindClinics = () => {
    const clinicList = document.getElementById('clinic-list');
    if (clinicList) {
      clinicList.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-10">
        <span className="bg-blue-100 text-elderly-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
          Comparison Report
        </span>
        <h2 className="text-elderly-2xl md:text-elderly-hero font-bold text-gray-900 mt-4 mb-2">
          {procedure.name} in <span className="text-elderly-primary border-b-4 border-blue-200">{city}</span>
        </h2>
        <p className="text-elderly-lg text-gray-600 max-w-2xl mx-auto">
          Based on data from local NHS trusts and private clinics in {city}.
        </p>
      </div>

      {/* The Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* NHS Card */}
        <div className="bg-white rounded-xl shadow-md border-t-8 border-gray-400 p-6 md:p-8 relative">
          <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-bold">
            Public Option
          </div>
          <h3 className="text-elderly-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-2">🏥</span> NHS Route
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <CalendarIcon className="text-red-500 mr-4 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Estimated Wait</p>
                <p className="text-4xl font-bold text-red-600">{nhsWait?.avg_wait_weeks || 'N/A'} {nhsWait?.avg_wait_weeks ? 'Weeks' : ''}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {officialTarget 
                    ? `Often longer than the ${officialTarget}-week target`
                    : 'Often longer than the official target'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <PoundIcon className="text-green-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Cost to you</p>
                <p className="text-3xl font-bold text-gray-900">£0</p>
                <p className="text-sm text-gray-500 mt-1">Funded by taxpayers</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center">
                <AlertCircleIcon className="mr-2" /> Things to consider:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Wait times can increase unexpectedly</li>
                <li>• You may not choose your specific surgeon</li>
                <li>• Cancellations are possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Private Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-8 border-elderly-primary p-6 md:p-8 relative transform md:-translate-y-4 md:mb-[-1rem] z-10 ring-1 ring-blue-100">
          <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold">
            Fastest Option
          </div>
          <h3 className="text-elderly-xl font-bold text-elderly-primary mb-6 flex items-center">
            <span className="text-3xl mr-2">⚡</span> Private Route
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <CalendarIcon className="text-green-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Estimated Wait</p>
                <p className="text-4xl font-bold text-green-600">{privateWaitDisplay}</p>
                <p className="text-sm text-gray-500 mt-1">Consultation usually within days</p>
              </div>
            </div>

            <div className="flex items-start">
              <PoundIcon className="text-gray-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Typical Cost Range</p>
                <p className="text-3xl font-bold text-gray-900">£{privateCost?.cost_min.toLocaleString() || 'N/A'} - £{privateCost?.cost_max.toLocaleString() || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-1">Includes surgery & aftercare</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                <CheckCircleIcon className="mr-2" /> Benefits:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Choose your own consultant</li>
                <li>• Private room & better amenities</li>
                <li>• Plan surgery around your life</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <Button 
                size="xl" 
                variant="accent" 
                className="w-full shadow-lg"
                onClick={handleFindClinics}
              >
                Find Clinics in {city}
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">No obligation to book.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Additional Context */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-elderly-xl font-bold mb-4">About {procedure.name}</h3>
        <p className="text-elderly-base text-gray-700 leading-relaxed mb-4">
          {procedure.description}
        </p>
        <p className="text-elderly-base text-gray-700 leading-relaxed">
          In {city}, the demand for this procedure has led to significant variations in waiting times. 
          While the NHS provides excellent care, the backlog means that patients often wait months in pain or discomfort. 
          Private options in the {city} area can bypass this queue completely.
        </p>
      </div>

      <p className="text-elderly-xs text-elderly-gray-dark italic mt-4">
        Data sources: NHS My Planned Care, PHIN consultant registry, clinic websites. Updated every 2 weeks. 
        This is informational only—consult your doctor before deciding.
      </p>
    </section>
  );
};
