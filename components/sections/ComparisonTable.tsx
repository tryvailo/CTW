import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import type { ComparisonData } from '@/lib/types';

interface ComparisonTableProps {
  data: ComparisonData;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ data }) => {
  const { procedure, nhsWait, privateCost, clinics } = data;
  const clinicCount = clinics.length;

  return (
    <section className="mb-12">
      <h2 className="text-elderly-xl font-bold text-elderly-primary mb-6">
        NHS vs Private: {procedure.name} Comparison
      </h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader className="w-1/2">
              NHS ROUTE
            </TableCell>
            <TableCell isHeader className="w-1/2">
              PRIVATE ROUTE
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Waiting Time */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">WAITING TIME</strong>
                <p className="text-elderly-base mb-2">
                  <span className="text-elderly-urgency font-bold">
                    <span className="mr-1">⏰</span>
                    About {nhsWait?.avg_wait_weeks || 'N/A'} weeks
                  </span>
                  {nhsWait?.avg_wait_weeks && ` (${Math.round((nhsWait.avg_wait_weeks / 4) * 10) / 10}+ months)`}
                </p>
                <ul className="list-disc list-inside text-elderly-sm space-y-1">
                  <li>Blurry vision / Pain continues</li>
                  <li>Safety concerns</li>
                  <li>Slower daily life</li>
                </ul>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">WAITING TIME</strong>
                <p className="text-elderly-base mb-2">
                  <span className="text-elderly-success font-bold">
                    1-2 weeks (typical)
                  </span>
                </p>
                <p className="text-elderly-sm">
                  Often within a few days to 2 weeks from initial booking. Book online or by phone.
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Cost */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">COST TO YOU</strong>
                <p className="text-elderly-base mb-2">FREE</p>
                <p className="text-elderly-sm">(paid by NHS/taxes)</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">COST TO YOU</strong>
                <p className="text-elderly-base mb-2">
                  £{privateCost?.cost_min.toLocaleString() || 'N/A'} - £{privateCost?.cost_max.toLocaleString() || 'N/A'}
                </p>
                <p className="text-elderly-sm">
                  {clinicCount} {clinicCount === 1 ? 'clinic' : 'clinics'} offering this procedure
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Where */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">WHERE</strong>
                <p className="text-elderly-sm">
                  {nhsWait?.nhs_trust || 'Your local NHS Trust'}
                </p>
                <p className="text-elderly-sm mt-2">
                  Referred by GP or optician
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">WHERE</strong>
                <p className="text-elderly-sm">
                  {clinicCount > 0 ? `${clinicCount} ${clinicCount === 1 ? 'private clinic' : 'private clinics'}` : 'Multiple private clinics'} in {data.city}
                </p>
                <p className="text-elderly-sm mt-2">
                  Most are in central areas. Easy parking or public transport access.
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Surgeon */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">THE SURGEON</strong>
                <p className="text-elderly-sm">
                  NHS consultant (excellent quality)
                </p>
                <p className="text-elderly-sm mt-2">
                  Usually high standard (all have medical training)
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">THE SURGEON</strong>
                <p className="text-elderly-sm">
                  Often the same surgeon who works for NHS in private practice part-time
                </p>
                <p className="text-elderly-sm mt-2">
                  Same qualifications and experience as NHS
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Facility */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">THE FACILITY</strong>
                <p className="text-elderly-sm">
                  NHS hospital. Good equipment (shared with other procedures)
                </p>
                <p className="text-elderly-sm mt-2">
                  Standard hospital environment (may be busy)
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">THE FACILITY</strong>
                <p className="text-elderly-sm">
                  Private clinic. Newer, often more modern equipment
                </p>
                <p className="text-elderly-sm mt-2">
                  Often more comfortable: Single rooms, quieter wards, better parking
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Recovery */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">RECOVERY TIME</strong>
                <p className="text-elderly-sm">
                  {procedure.procedure_id === 'cataract' ? '4-6 weeks typical' : 'Variable (NHS may schedule follow-ups slower)'}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">RECOVERY TIME</strong>
                <p className="text-elderly-sm">
                  {procedure.procedure_id === 'cataract' ? '2-4 weeks typical' : 'Similar recovery time, may be quicker scheduling'}
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Choose if */}
          <TableRow>
            <TableCell>
              <div>
                <strong className="block mb-2">Choose NHS if:</strong>
                <ul className="list-disc list-inside text-elderly-sm space-y-1 mt-2">
                  <li>You can wait {nhsWait?.avg_wait_weeks || 'several'} weeks</li>
                  <li>Cost is a concern</li>
                  <li>Want NHS safety net</li>
                </ul>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <strong className="block mb-2">Choose Private if:</strong>
                <ul className="list-disc list-inside text-elderly-sm space-y-1 mt-2">
                  <li>You want faster surgery</li>
                  <li>Willing to pay £{privateCost?.cost_min.toLocaleString() || 'N/A'}-{privateCost?.cost_max.toLocaleString() || 'N/A'}</li>
                  <li>Want slightly better comfort</li>
                  <li>Have health insurance (may cover cost)</li>
                </ul>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <p className="text-elderly-xs text-elderly-gray-dark italic mt-4">
        Data sources: NHS My Planned Care, PHIN consultant registry, clinic websites. Updated every 2 weeks. 
        This is informational only—consult your doctor before deciding.
      </p>
    </section>
  );
};

