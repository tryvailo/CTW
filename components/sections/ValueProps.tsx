import React from 'react';
import { Card } from '../ui/Card';

interface ValueProp {
  icon: string;
  title: string;
  description: string;
}

const valueProps: ValueProp[] = [
  {
    icon: '✓',
    title: 'FREE',
    description: 'Compare anytime',
  },
  {
    icon: '✓',
    title: 'REAL',
    description: 'NHS & Private data',
  },
  {
    icon: '✓',
    title: 'CLEAR',
    description: 'Pricing shown upfront',
  },
  {
    icon: '✓',
    title: 'NO DATA',
    description: 'No personal info needed',
  },
];

export const ValueProps: React.FC = () => {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {valueProps.map((prop, index) => (
          <Card key={index} className="text-center bg-elderly-primary-light">
            <div className="text-3xl mb-2 text-elderly-primary">{prop.icon}</div>
            <h3 className="text-elderly-lg font-bold mb-2 text-elderly-primary">{prop.title}</h3>
            <p className="text-elderly-sm text-elderly-text">{prop.description}</p>
          </Card>
        ))}
      </div>
      <p className="text-elderly-sm text-elderly-text text-center mt-6 max-w-3xl mx-auto">
        We show you real waiting times from the NHS and real costs from private clinics. 
        Everything is free to compare. We don't collect your personal information on this page.
      </p>
    </section>
  );
};

