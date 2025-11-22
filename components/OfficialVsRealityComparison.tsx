'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  Official: number;
  Real: number;
  Private: number;
}

interface OfficialVsRealityComparisonProps {
  data: ChartData[];
}

export const OfficialVsRealityComparison: React.FC<OfficialVsRealityComparisonProps> = ({ data }) => {

  return (
    <section id="comparison" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-elderly-2xl md:text-elderly-3xl font-bold mb-4">Official vs Reality: The Waiting Times Gap</h2>
          <p className="text-elderly-lg text-gray-700 max-w-3xl mx-auto">
            NHS targets don't always match what patients actually experience. 
            See the real difference between official targets and patient-reported wait times.
          </p>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 16, fill: '#1a1a1a' }} 
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis 
                  label={{ value: 'Weeks Waiting', angle: -90, position: 'insideLeft', style: { fontSize: '16px' } }}
                  tick={{ fontSize: 16, fill: '#1a1a1a' }}
                />
                <Tooltip 
                  contentStyle={{ fontSize: '16px', borderRadius: '8px', border: '2px solid #ddd' }}
                  cursor={{fill: 'transparent'}}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '16px' }} />
                <Bar dataKey="Official" name="NHS Target (Official)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Real" name="Real Patient Wait" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Private" name="Private Surgery" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 text-center text-gray-600 text-elderly-sm italic">
            * Data sourced from verified patient reports and NHS statistics (Dec 2024).
          </div>
        </div>
      </div>
    </section>
  );
};
