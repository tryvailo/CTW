import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getUKWideData } from '@/lib/utils/waitingTimesLoader';
import type { ProcedureId } from '@/lib/types/waitingTimes';

interface ProcedureCard {
  id: ProcedureId;
  name: string;
  description: string;
  slug: string;
}

const procedures: ProcedureCard[] = [
  {
    id: 'cataract',
    name: 'Cataract Surgery',
    description: '30% of people over 65 have cataracts. Cloudy vision that gets worse waiting.',
    slug: 'cataract',
  },
  {
    id: 'hip',
    name: 'Hip Replacement',
    description: 'Severe hip pain limiting your walks and activities? 25+ week NHS waits.',
    slug: 'hip',
  },
  {
    id: 'knee',
    name: 'Knee Replacement',
    description: 'Bad knees stopping you from walking or playing with grandchildren? 22+ week waits.',
    slug: 'knee',
  },
];

export const QuickFind: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-elderly-xl font-bold text-elderly-text mb-6 text-center">
        Most searched by people like you:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {procedures.map((procedure) => {
          const waitData = getUKWideData(procedure.id);
          const officialWait = waitData?.officialTarget || 18;
          const realWait = waitData?.patientAverage || 0;
          
          return (
            <Card key={procedure.id} className="flex flex-col bg-elderly-primary-light">
              <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                {procedure.name}
              </h3>
              <p className="text-elderly-sm text-elderly-text mb-4 flex-grow">
                {procedure.description}
              </p>
              <div className="mb-4 space-y-2">
                <p className="text-elderly-sm">
                  <strong>NHS wait (officially):</strong>{' '}
                  <span className="text-elderly-warning font-bold">{officialWait} weeks</span>
                </p>
                {realWait > 0 && (
                  <p className="text-elderly-sm">
                    <strong>Real UK wait:</strong>{' '}
                    <span className="text-red-600 font-bold">{realWait} weeks</span>
                  </p>
                )}
                <p className="text-elderly-sm">
                  <strong>Private:</strong>{' '}
                  <span className="text-elderly-success font-bold">1-2 weeks</span>
                </p>
              </div>
              <Link href={`/procedures/${procedure.slug}`} className="mt-auto">
                <Button variant="primary" className="w-full">
                  Compare in your city →
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

