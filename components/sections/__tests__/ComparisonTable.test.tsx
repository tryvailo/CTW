/**
 * Unit tests for ComparisonTable component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComparisonTable } from '../ComparisonTable';
import type { ComparisonData } from '@/lib/types';

// Mock EstimatedWaitTime component
jest.mock('../../common/EstimatedWaitTime', () => ({
  EstimatedWaitTime: ({ weeks, isEstimated }: { weeks: number; isEstimated?: boolean }) => (
    <span>{weeks} weeks{isEstimated ? ' *' : ''}</span>
  ),
}));

describe('ComparisonTable', () => {
  const mockProcedure = {
    procedure_id: 'cataract' as const,
    name: 'Cataract Surgery',
    specialty: 'Ophthalmology',
    description: 'Removal and replacement of cloudy lens',
    nhs_code: 'C71',
  };

  const mockNHSWait = {
    procedure_id: 'cataract' as const,
    city: 'London' as const,
    nhs_trust: 'Imperial College Healthcare NHS Trust',
    avg_wait_weeks: 18,
    patient_reported_wait_weeks: 42,
    is_estimated: false,
    date: '2025-11-05',
    source: 'My Planned Care',
  };

  const mockPrivateCost = {
    procedure_id: 'cataract' as const,
    city: 'London' as const,
    cost_min: 2500,
    cost_max: 3200,
    clinic_count: 5,
    date: '2025-11-05',
    source: 'PHIN + clinic websites',
  };

  const mockClinics = [
    {
      clinic_id: 'test_clinic',
      name: 'Test Clinic',
      city: 'London' as const,
      procedure_id: 'cataract' as const,
      price: 2800,
      last_updated: '2025-11-05',
    },
  ];

  const createMockData = (overrides?: Partial<ComparisonData>): ComparisonData => ({
    procedure: mockProcedure,
    city: 'London',
    nhsWait: mockNHSWait,
    privateCost: mockPrivateCost,
    clinics: mockClinics,
    ...overrides,
  });

  describe('Rendering', () => {
    it('should render comparison table with all data', () => {
      const data = createMockData();
      const { container } = render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      // Check that procedure name and city are rendered (may be in different elements)
      expect(container.textContent).toMatch(/Cataract Surgery/i);
      expect(container.textContent).toMatch(/London/i);
      expect(screen.getByText('42 weeks')).toBeInTheDocument();
      expect(screen.getByText('£2,500 - £3,200')).toBeInTheDocument();
    });

    it('should display estimated wait time with asterisk when is_estimated is true', () => {
      const data = createMockData({
        nhsWait: {
          ...mockNHSWait,
          patient_reported_wait_weeks: 50,
          is_estimated: true,
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('50 weeks *')).toBeInTheDocument();
    });

    it('should show disclaimer when value is estimated', () => {
      const data = createMockData({
        nhsWait: {
          ...mockNHSWait,
          is_estimated: true,
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText(/Note on Estimated Wait Times/i)).toBeInTheDocument();
    });

    it('should not show disclaimer when value is not estimated', () => {
      const data = createMockData();
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.queryByText(/Note on Estimated Wait Times/i)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle missing procedure data', () => {
      const data = createMockData({ procedure: null as any });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText(/Unable to load comparison data/i)).toBeInTheDocument();
    });

    it('should handle missing city', () => {
      const data = createMockData({ city: '' as any });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText(/Unable to load comparison data/i)).toBeInTheDocument();
    });

    it('should handle missing NHS wait data', () => {
      const data = createMockData({ nhsWait: null });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle missing patient_reported_wait_weeks', () => {
      const data = createMockData({
        nhsWait: {
          ...mockNHSWait,
          patient_reported_wait_weeks: undefined,
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('18 Weeks')).toBeInTheDocument();
    });

    it('should handle missing private cost data', () => {
      const data = createMockData({ privateCost: null });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('should handle empty clinics array', () => {
      const data = createMockData({ clinics: [] });
      const { container } = render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(container.textContent).toMatch(/Cataract Surgery/i);
      expect(container.textContent).toMatch(/London/i);
    });

    it('should handle missing procedure description', () => {
      const data = createMockData({
        procedure: {
          ...mockProcedure,
          description: '',
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText(/Information about this procedure is being updated/i)).toBeInTheDocument();
    });
  });

  describe('Fallback values', () => {
    it('should use fallback for private wait weeks when not provided', () => {
      const data = createMockData();
      render(<ComparisonTable data={data} />);

      expect(screen.getByText('1-2 Weeks')).toBeInTheDocument();
    });

    it('should use fallback for official target when not provided', () => {
      const data = createMockData();
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} />);

      expect(screen.getByText(/Often longer than the official target/i)).toBeInTheDocument();
    });
  });

  describe('Cost formatting', () => {
    it('should format costs with thousand separators', () => {
      const data = createMockData({
        privateCost: {
          ...mockPrivateCost,
          cost_min: 14500,
          cost_max: 15200,
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('£14,500 - £15,200')).toBeInTheDocument();
    });

    it('should handle missing cost values', () => {
      const data = createMockData({
        privateCost: {
          ...mockPrivateCost,
          cost_min: undefined as any,
          cost_max: undefined as any,
        },
      });
      render(<ComparisonTable data={data} privateWaitWeeks={1.5} officialTarget={18} />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });
});

