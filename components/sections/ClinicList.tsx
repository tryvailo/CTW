import React from 'react';
import { Button } from '../ui/Button';
import { CancellationWarning } from '../CancellationWarning';
import type { Clinic } from '@/lib/types';
import type { ProcedureId, RegionId, CancellationRiskData } from '@/lib/types/waitingTimes';

// Icons (using SVG to match reference design)
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

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
    <section id="clinic-list" className="mb-12">
      <h2 className="text-elderly-xl font-bold text-elderly-primary mb-4">
        {clinics.length} Private Clinics Offering {procedureName} in {city}
      </h2>
      <p className="text-elderly-sm text-elderly-text mb-6">
        These are {clinics.length} clinics we found offering {procedureName.toLowerCase()} in {city} in 2025. 
        Prices updated every 2 weeks. Clinic order is by lowest to highest cost.
      </p>

      <div className="grid gap-6">
        {clinics.map((clinic) => {
          // Generate features array from available clinic data
          const features: string[] = [];
          if (clinic.hospital_group) {
            features.push(`${clinic.hospital_group} Hospital Group`);
          }
          if (clinic.cqc_rating) {
            features.push(`CQC Rated: ${clinic.cqc_rating}`);
          }
          if (clinic.rating_stars && clinic.rating_stars >= 4.5) {
            features.push('Top rated surgeons');
          }
          if (clinic.price > 0) {
            features.push('Verified provider');
          }
          // Add default features if none available
          if (features.length === 0) {
            features.push('Verified provider');
          }

          return (
            <div key={clinic.clinic_id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                
                {/* Clinic Info */}
                <div className="p-6 md:p-8 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-elderly-xl font-bold text-gray-900">{clinic.name}</h2>
                    {clinic.rating_stars && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                        <StarIcon className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="ml-1 font-bold text-gray-800">{clinic.rating_stars.toFixed(1)}</span>
                        {clinic.rating_count && (
                          <span className="ml-1 text-gray-500 text-sm">({clinic.rating_count})</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{clinic.address || clinic.city || city}</span>
                    <span className="mx-2">•</span>
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-green-700 font-medium">PHIN Verified</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <CheckIcon className="w-5 h-5 mr-3 text-elderly-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {clinic.price > 0 && (
                    <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-600 uppercase font-bold">Starting from</span>
                      <div className="text-elderly-xl font-bold text-elderly-primary">
                        £{clinic.price.toLocaleString()}{procedureName.toLowerCase().includes('cataract') ? ' per eye' : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-6 md:w-72 flex flex-col justify-center space-y-4 border-l border-gray-100">
                  {clinic.phone ? (
                    <a href={`tel:${clinic.phone}`} className="inline-block w-full">
                      <Button variant="primary" className="w-full" size="lg">
                        <PhoneIcon className="mr-2 h-5 w-5 inline" />
                        {clinic.phone}
                      </Button>
                    </a>
                  ) : (
                    <Button variant="primary" className="w-full" size="lg" disabled>
                      Phone not available
                    </Button>
                  )}
                  {clinic.url ? (
                    <a
                      href={clinic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        View Website
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" className="w-full" size="lg" disabled>
                      Website not available
                    </Button>
                  )}
                  <p className="text-center text-sm text-gray-500">
                    Mention "Compare The Wait" when booking
                  </p>
                </div>

              </div>
            </div>
          );
        })}
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

