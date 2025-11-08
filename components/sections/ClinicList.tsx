import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CancellationWarning } from '../CancellationWarning';
import type { Clinic } from '@/lib/types';
import type { ProcedureId, RegionId, CancellationRiskData } from '@/lib/types/waitingTimes';

interface ClinicListProps {
  clinics: Clinic[];
  procedureName: string;
  city: string;
  procedureId?: ProcedureId;
  regionId?: RegionId;
  cancellationRiskData?: CancellationRiskData | null;
}

export const ClinicList: React.FC<ClinicListProps> = ({ 
  clinics, 
  procedureName, 
  city,
  procedureId,
  regionId,
  cancellationRiskData,
}) => {
  if (clinics.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-elderly-xl font-bold text-elderly-text mb-4">
          Private Clinics Offering {procedureName} in {city}
        </h2>
        <p className="text-elderly-base text-elderly-text">
          No clinics found. Please check back later.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
        {clinics.length} Private Clinics Offering {procedureName} in {city}
      </h2>
      <p className="text-elderly-sm text-elderly-text mb-6">
        These are {clinics.length} clinics we found offering {procedureName.toLowerCase()} in {city} in 2025. 
        Prices updated every 2 weeks. Clinic order is by lowest to highest cost.
      </p>

      <div className="space-y-4">
        {clinics.map((clinic, index) => (
          <Card key={clinic.clinic_id}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-elderly-lg font-bold text-elderly-primary">
                    #{index + 1}.
                  </span>
                  <h3 className="text-elderly-lg font-bold text-elderly-text">
                    {clinic.name}
                  </h3>
                </div>
                
                <p className="text-elderly-base font-bold text-elderly-text mb-3">
                  Price: £{clinic.price.toLocaleString()} {procedureName.toLowerCase().includes('cataract') ? 'per eye' : ''}
                </p>

                <div className="space-y-2 text-elderly-sm text-elderly-text">
                  {/* Hospital Group */}
                  {clinic.hospital_group && (
                    <p>
                      <span className="font-semibold">🏥</span> {clinic.hospital_group}
                    </p>
                  )}
                  
                  {/* Address */}
                  {clinic.address ? (
                    <p>
                      <span className="font-semibold">📍</span> {clinic.address}
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">📍</span> {clinic.city || city}
                    </p>
                  )}
                  
                  {/* Phone */}
                  {clinic.phone ? (
                    <p>
                      <span className="font-semibold">☎️</span> {clinic.phone}
                    </p>
                  ) : (
                    <p className="text-elderly-gray-dark">
                      <span className="font-semibold">☎️</span> Phone not available
                    </p>
                  )}
                  
                  {/* Website */}
                  {clinic.url ? (
                    <p>
                      <span className="font-semibold">🌐</span>{' '}
                      <a
                        href={clinic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-elderly-primary underline hover:text-elderly-primary-dark break-all"
                      >
                        {clinic.url}
                      </a>
                    </p>
                  ) : (
                    <p className="text-elderly-gray-dark">
                      <span className="font-semibold">🌐</span> Website not available
                    </p>
                  )}
                  
                  {/* Ratings */}
                  {clinic.rating_stars && (
                    <p>
                      <span className="font-semibold">⭐</span> {clinic.rating_stars.toFixed(1)}/5.0
                      {clinic.rating_count && ` (${clinic.rating_count} ${clinic.rating_count === 1 ? 'review' : 'reviews'})`}
                    </p>
                  )}
                  
                  {/* CQC Rating */}
                  {clinic.cqc_rating && (
                    <p>
                      <span className="font-semibold">🏆</span> CQC Rating: <span className="font-semibold">{clinic.cqc_rating}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:min-w-[200px]">
                {clinic.url ? (
                  <a
                    href={clinic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="primary" className="w-full">
                      Visit website
                    </Button>
                  </a>
                ) : (
                  <Button variant="primary" className="w-full" disabled>
                    Website not available
                  </Button>
                )}
                {clinic.phone ? (
                  <a href={`tel:${clinic.phone}`} className="inline-block">
                    <Button variant="secondary" className="w-full">
                      Call clinic
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>
                    Phone not available
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Inline Cancellation Warning */}
      {cancellationRiskData && procedureId && regionId && (
        <CancellationWarning
          data={cancellationRiskData}
          procedure={procedureId}
          region={regionId}
          variant="inline"
          procedureName={procedureName}
        />
      )}
    </section>
  );
};

