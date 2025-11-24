/**
 * Unit tests for data loading functions
 */

import {
  loadNHSWaits,
  loadProcedures,
  loadCities,
  loadPrivateCosts,
  loadClinics,
  getNHSWait,
  getPrivateCost,
  getClinics,
  getProcedure,
  getCityBySlug,
} from '../data';
import type { ProcedureId, City } from '../types';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(),
}));

import fs from 'fs';

describe('Data Loading Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadNHSWaits', () => {
    it('should load and parse NHS waits CSV correctly', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,42,2025-11-05,My Planned Care
hip,Leeds,Leeds Teaching Hospitals NHS Trust,27,50,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadNHSWaits();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        procedure_id: 'cataract',
        city: 'London',
        avg_wait_weeks: 18,
        patient_reported_wait_weeks: 42,
        is_estimated: false,
      });
      expect(result[1]).toMatchObject({
        procedure_id: 'hip',
        city: 'Leeds',
        avg_wait_weeks: 27,
        patient_reported_wait_weeks: 50,
        is_estimated: true, // Leeds + hip should be estimated
      });
    });

    it('should mark estimated values correctly', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
knee,Leeds,Leeds Teaching Hospitals NHS Trust,25,78,2025-11-05,My Planned Care
knee,Birmingham,University Hospitals Birmingham NHS Foundation Trust,23,65,2025-11-05,My Planned Care
knee,Bristol,University Hospitals Bristol and Weston NHS Foundation Trust,22,44,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadNHSWaits();

      expect(result[0].is_estimated).toBe(true); // Leeds + knee
      expect(result[1].is_estimated).toBe(true); // Birmingham + knee
      expect(result[2].is_estimated).toBe(true); // Bristol + knee
    });

    it('should handle missing patient_reported_wait_weeks', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadNHSWaits();

      expect(result[0].patient_reported_wait_weeks).toBeUndefined();
      expect(result[0].avg_wait_weeks).toBe(18);
    });

    it('should return empty array when file is missing', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const result = loadNHSWaits();

      expect(result).toEqual([]);
    });

    it('should handle invalid numeric values', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,invalid,NaN,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadNHSWaits();

      expect(result[0].avg_wait_weeks).toBe(0);
      expect(result[0].patient_reported_wait_weeks).toBeUndefined();
    });

    it('should filter out rows with missing procedure_id or city', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,42,2025-11-05,My Planned Care
,Manchester,Some Trust,20,5,2025-11-05,My Planned Care
hip,,Some Trust,24,45,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadNHSWaits();

      expect(result).toHaveLength(1);
      expect(result[0].procedure_id).toBe('cataract');
    });
  });

  describe('getNHSWait', () => {
    it('should return correct wait data for procedure and city', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,42,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = getNHSWait('cataract', 'London');

      expect(result).not.toBeNull();
      expect(result?.city).toBe('London');
      expect(result?.procedure_id).toBe('cataract');
    });

    it('should return null for non-existent combination', () => {
      const mockCSV = `procedure_id,city,nhs_trust,avg_wait_weeks,patient_reported_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,42,2025-11-05,My Planned Care`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = getNHSWait('hip', 'Manchester');

      expect(result).toBeNull();
    });
  });

  describe('loadProcedures', () => {
    it('should load procedures correctly', () => {
      const mockCSV = `procedure_id,name,specialty,description,nhs_code
cataract,Cataract Surgery,Ophthalmology,Removal and replacement of cloudy lens,C71`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadProcedures();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatchObject({
        procedure_id: 'cataract',
        name: 'Cataract Surgery',
      });
    });

    it('should return empty array when file is missing', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const result = loadProcedures();

      expect(result).toEqual([]);
    });
  });

  describe('loadCities', () => {
    it('should load cities with fallback slug generation', () => {
      const mockCSV = `city,slug,elderly_population,priority
London,london,1500000,PHASE 1
Manchester,,200000,PHASE 1`;

      (fs.readFileSync as jest.Mock).mockReturnValue(mockCSV);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = loadCities();

      expect(result[0].slug).toBe('london');
      expect(result[1].slug).toBe('manchester'); // Generated from city name
    });
  });

  describe('Error handling', () => {
    it('should handle file read errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });

      const result = loadNHSWaits();

      expect(result).toEqual([]);
    });

    it('should handle empty CSV files', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const result = loadNHSWaits();

      expect(result).toEqual([]);
    });
  });
});

