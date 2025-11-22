import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { getUKWideData, getPrivateComparisonData } from '@/lib/utils/waitingTimesLoader';
import { loadProcedures } from '@/lib/data';
import type { ProcedureId } from '@/lib/types/waitingTimes';

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const QuickFind: React.FC = () => {
  // Load procedures from CSV data
  const allProcedures = loadProcedures();
  
  // Filter to only show cataract, hip, and knee
  const procedureIds: ProcedureId[] = ['cataract', 'hip', 'knee'];
  const procedures = allProcedures.filter(p => procedureIds.includes(p.procedure_id));

  return (
    <section id="procedures" className="py-16 bg-gray-50 mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-elderly-2xl font-bold mb-8 text-center">Most searched by people like you:</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {procedures.map((procedure) => {
            const waitData = getUKWideData(procedure.procedure_id);
            const privateData = getPrivateComparisonData(procedure.procedure_id);
            
            const officialWait = waitData?.officialTarget || 18;
            const realWait = waitData?.patientAverage || 0;
            const privateWait = privateData?.average_wait_weeks || 2;
            const privateWaitDisplay = privateWait < 2 ? '1-2 weeks' : `${Math.round(privateWait)} weeks`;
            
            return (
              <div 
                key={procedure.procedure_id} 
                className="bg-white rounded-xl overflow-hidden shadow-md border border-blue-100 flex flex-col h-full cursor-pointer transition-all hover:shadow-xl hover:border-blue-300 group"
              >
                <div className="bg-elderly-primary-light p-6">
                  <h3 className="text-elderly-xl font-bold text-elderly-primary mb-2">{procedure.name}</h3>
                  <p className="text-elderly-base text-gray-800 mb-3">{procedure.description}</p>
                  <Link 
                    href={`/procedures/${procedure.procedure_id}`}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Read more about {procedure.name} →
                  </Link>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-gray-600">NHS wait (officially):</span>
                      <span className="font-bold text-gray-900">{officialWait} weeks</span>
                    </div>
                    {realWait > 0 && (
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 bg-red-50 p-2 rounded">
                        <span className="text-gray-800 font-semibold">Real UK wait:</span>
                        <span className="font-bold text-red-700 text-xl">{realWait} weeks</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 bg-green-50 p-2 rounded">
                      <span className="text-gray-800 font-semibold">Private:</span>
                      <span className="font-bold text-elderly-success text-xl">{privateWaitDisplay}</span>
                    </div>
                  </div>

                  <Link href={`/procedures/${procedure.procedure_id}`} className="mt-auto">
                    <Button variant="primary" className="w-full">
                      Compare in your city
                      <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                        <ArrowRightIcon />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

