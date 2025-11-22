'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface ChartData {
  name: string;
  Official: number;
  Real: number;
  Private: number;
}

interface OfficialVsRealityComparisonWrapperProps {
  data: ChartData[];
}

// Dynamically import the client component to avoid SSR issues with recharts
const OfficialVsRealityComparison = dynamic(
  () => import('./OfficialVsRealityComparison').then(mod => ({ default: mod.OfficialVsRealityComparison })),
  { ssr: false }
);

export const OfficialVsRealityComparisonWrapper: React.FC<OfficialVsRealityComparisonWrapperProps> = ({ data }) => {
  return <OfficialVsRealityComparison data={data} />;
};

