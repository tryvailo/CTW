/**
 * Data loading and parsing utilities for CSV files
 * 
 * Note: These functions work in Next.js Server Components and during build time.
 * For client-side usage, consider using API routes or fetch.
 */

import fs from 'fs';
import path from 'path';
import {
  Procedure,
  CityData,
  NHSWait,
  PrivateCost,
  Clinic,
  ComparisonData,
  ProcedureId,
  City,
  FAQData,
  FAQItem,
  ContentData,
  ExtendedFAQ,
} from './types';

// Path to data directory
const DATA_DIR = path.join(process.cwd(), 'public', 'data');

/**
 * Parse CSV content string and return array of objects
 */
function parseCSVContent<T>(content: string, headers: (keyof T)[]): T[] {
  try {
    const lines = content.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
      return [];
    }

    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      // Handle CSV values that may contain commas (simple approach)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj as T;
    });
  } catch (error) {
    console.error(`Error parsing CSV content:`, error);
    return [];
  }
}

/**
 * Load CSV file (server-side only)
 * Returns empty string if file cannot be read (fallback for missing files)
 */
function loadCSVFile(filePath: string): string {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`CSV file not found: ${filePath}`);
      return '';
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    if (!content || content.trim().length === 0) {
      console.warn(`CSV file is empty: ${filePath}`);
      return '';
    }
    return content;
  } catch (error) {
    console.error(`Error reading CSV file ${filePath}:`, error);
    return '';
  }
}

/**
 * Load all procedures from CSV
 */
export function loadProcedures(): Procedure[] {
  const headers: (keyof Procedure)[] = [
    'procedure_id',
    'name',
    'specialty',
    'description',
    'nhs_code',
  ];
  
  const content = loadCSVFile('procedures.csv');
  const data = parseCSVContent<Procedure>(content, headers);
  
  return data.map(item => ({
    ...item,
    procedure_id: item.procedure_id as ProcedureId,
  }));
}

/**
 * Load cities data
 */
export function loadCities(): CityData[] {
  const headers: (keyof CityData)[] = ['city', 'slug', 'elderly_population', 'priority'];
  
  const content = loadCSVFile('cities.csv');
  const data = parseCSVContent<CityData>(content, headers);
  
  return data.map(item => ({
    ...item,
    city: item.city as City,
    slug: item.slug || item.city.toLowerCase().replace(/\s+/g, '-'),
  }));
}

/**
 * Load NHS wait times from CSV
 */
/**
 * Load NHS wait times from CSV with fallback
 */
export function loadNHSWaits(): NHSWait[] {
  const headers: (keyof NHSWait)[] = [
    'procedure_id',
    'city',
    'nhs_trust',
    'avg_wait_weeks',
    'patient_reported_wait_weeks',
    'date',
    'source',
  ];
  
  const content = loadCSVFile('nhs_waits.csv');
  if (!content) {
    console.warn('NHS waits CSV file is empty or missing, returning empty array');
    return [];
  }
  
  const data = parseCSVContent<Omit<NHSWait, 'avg_wait_weeks' | 'patient_reported_wait_weeks'> & { 
    avg_wait_weeks: string;
    patient_reported_wait_weeks: string;
  }>(content, headers);
  
  // Define estimated value combinations
  const estimatedCombinations = [
    { city: 'Leeds' as City, procedure: 'hip' as ProcedureId },
    { city: 'Leeds' as City, procedure: 'knee' as ProcedureId },
    { city: 'Birmingham' as City, procedure: 'knee' as ProcedureId },
    { city: 'Bristol' as City, procedure: 'knee' as ProcedureId },
  ];
  
  return data
    .filter(item => item.procedure_id && item.city) // Filter out invalid rows
    .map(item => {
      const city = item.city as City;
      const procedureId = item.procedure_id as ProcedureId;
      const isEstimated = estimatedCombinations.some(
        combo => combo.city === city && combo.procedure === procedureId
      );
      
      const avgWeeks = parseInt(item.avg_wait_weeks, 10);
      const patientWeeks = item.patient_reported_wait_weeks && item.patient_reported_wait_weeks.trim() !== ''
        ? parseInt(item.patient_reported_wait_weeks, 10)
        : undefined;
      
      return {
        ...item,
        procedure_id: procedureId,
        city: city,
        avg_wait_weeks: Number.isFinite(avgWeeks) && avgWeeks >= 0 ? avgWeeks : 0,
        patient_reported_wait_weeks: Number.isFinite(patientWeeks) && patientWeeks && patientWeeks >= 0
          ? patientWeeks
          : undefined,
        is_estimated: isEstimated,
      };
    });
}

/**
 * Load private costs from CSV
 */
export function loadPrivateCosts(): PrivateCost[] {
  const headers: (keyof PrivateCost)[] = [
    'procedure_id',
    'city',
    'cost_min',
    'cost_max',
    'clinic_count',
    'date',
    'source',
  ];
  
  const content = loadCSVFile('private_costs.csv');
  const data = parseCSVContent<Omit<PrivateCost, 'cost_min' | 'cost_max' | 'clinic_count'> & {
    cost_min: string;
    cost_max: string;
    clinic_count: string;
  }>(content, headers);
  
  return data.map(item => ({
    ...item,
    procedure_id: item.procedure_id as ProcedureId,
    city: item.city as City,
    cost_min: parseInt(item.cost_min, 10) || 0,
    cost_max: parseInt(item.cost_max, 10) || 0,
    clinic_count: parseInt(item.clinic_count, 10) || 0,
  }));
}

/**
 * Load clinics from CSV
 */
export function loadClinics(): Clinic[] {
  const headers: (keyof Clinic)[] = [
    'clinic_id',
    'name',
    'city',
    'procedure_id',
    'price',
    'url',
    'phone',
    'address',
    'rating_stars',
    'rating_count',
    'cqc_rating',
    'hospital_group',
    'last_updated',
    'details_last_updated',
  ];
  
  const content = loadCSVFile('clinics.csv');
  const data = parseCSVContent<Omit<Clinic, 'price' | 'rating_stars' | 'rating_count'> & { 
    price: string;
    rating_stars: string;
    rating_count: string;
  }>(content, headers);
  
  return data.map(item => ({
    ...item,
    city: item.city as City,
    procedure_id: item.procedure_id as ProcedureId,
    price: parseInt(item.price, 10) || 0,
    // Convert empty strings to undefined for optional fields
    url: item.url && item.url.trim() !== '' ? item.url : undefined,
    phone: item.phone && item.phone.trim() !== '' ? item.phone : undefined,
    address: item.address && item.address.trim() !== '' ? item.address : undefined,
    rating_stars: item.rating_stars && item.rating_stars.trim() !== '' ? parseFloat(item.rating_stars) : undefined,
    rating_count: item.rating_count && item.rating_count.trim() !== '' ? parseInt(item.rating_count, 10) : undefined,
    cqc_rating: item.cqc_rating && item.cqc_rating.trim() !== '' ? item.cqc_rating : undefined,
    hospital_group: item.hospital_group && item.hospital_group.trim() !== '' ? item.hospital_group : undefined,
    details_last_updated: item.details_last_updated && item.details_last_updated.trim() !== '' ? item.details_last_updated : undefined,
  }));
}

/**
 * Get NHS wait data for specific procedure and city
 */
export function getNHSWait(procedureId: ProcedureId, city: City): NHSWait | null {
  const waits = loadNHSWaits();
  return waits.find(w => w.procedure_id === procedureId && w.city === city) || null;
}

/**
 * Get private cost data for specific procedure and city
 */
export function getPrivateCost(procedureId: ProcedureId, city: City): PrivateCost | null {
  const costs = loadPrivateCosts();
  return costs.find(c => c.procedure_id === procedureId && c.city === city) || null;
}

/**
 * Get clinics for specific procedure and city (sorted by price)
 */
export function getClinics(procedureId: ProcedureId, city: City): Clinic[] {
  const clinics = loadClinics();
  return clinics
    .filter(c => c.procedure_id === procedureId && c.city === city)
    .sort((a, b) => a.price - b.price);
}

/**
 * Get procedure by ID
 */
export function getProcedure(procedureId: ProcedureId): Procedure | null {
  const procedures = loadProcedures();
  return procedures.find(p => p.procedure_id === procedureId) || null;
}

/**
 * Get city by slug (case-insensitive)
 */
export function getCityBySlug(slug: string | undefined): CityData | null {
  if (!slug) return null;
  const cities = loadCities();
  const normalizedSlug = slug.toLowerCase().trim();
  return cities.find(c => c.slug && c.slug.toLowerCase() === normalizedSlug) || null;
}

/**
 * Get all comparison data for a procedure and city
 */
export function getComparisonData(procedureId: ProcedureId, city: City): ComparisonData {
  const procedure = getProcedure(procedureId);
  const nhsWait = getNHSWait(procedureId, city);
  const privateCost = getPrivateCost(procedureId, city);
  const clinics = getClinics(procedureId, city);

  return {
    procedure: procedure || {
      procedure_id: procedureId,
      name: '',
      specialty: '',
      description: '',
      nhs_code: '',
    },
    city,
    nhsWait,
    privateCost,
    clinics,
  };
}

/**
 * Get all procedure-city combinations that have data
 */
export function getAllComparisonCombinations(): Array<{ procedureId: ProcedureId; city: City }> {
  const procedures = loadProcedures();
  const cities = loadCities();
  const nhsWaits = loadNHSWaits();
  
  const combinations: Array<{ procedureId: ProcedureId; city: City }> = [];
  
  procedures.forEach(procedure => {
    cities.forEach(cityData => {
      const hasData = nhsWaits.some(
        wait => wait.procedure_id === procedure.procedure_id && wait.city === cityData.city
      );
      if (hasData) {
        combinations.push({
          procedureId: procedure.procedure_id,
          city: cityData.city,
        });
      }
    });
  });
  
  return combinations;
}

/**
 * Load FAQ data from CSV
 */
export function loadFAQData(): FAQData[] {
  const headers: (keyof FAQData)[] = ['faq_id', 'question', 'answer', 'procedure_id', 'category'];
  
  const content = loadCSVFile('faq.csv');
  const data = parseCSVContent<Omit<FAQData, 'procedure_id'> & { procedure_id: string }>(content, headers);
  
  return data.map(item => ({
    ...item,
    procedure_id: (item.procedure_id === 'general' ? 'general' : item.procedure_id) as ProcedureId | 'general',
  }));
}

/**
 * Get FAQ items for a procedure (or general)
 */
export function getFAQItems(procedureId?: ProcedureId): FAQItem[] {
  const faqData = loadFAQData();
  
  const generalItems = faqData
    .filter(item => item.category === 'general')
    .map(item => ({ question: item.question, answer: item.answer }));
  
  if (!procedureId) {
    return generalItems;
  }
  
  const procedureItems = faqData
    .filter(item => item.procedure_id === procedureId && item.category === 'procedure')
    .map(item => ({ question: item.question, answer: item.answer }));
  
  return [...procedureItems, ...generalItems];
}


/**
 * Load content data from CSV
 */
export function loadContentData(): ContentData[] {
  const headers: (keyof ContentData)[] = ['content_id', 'section', 'key', 'value', 'language'];
  
  const content = loadCSVFile('content.csv');
  return parseCSVContent<ContentData>(content, headers);
}

/**
 * Get content by section and key
 */
export function getContent(section: string, key: string, language: string = 'en'): string {
  const contentData = loadContentData();
  const item = contentData.find(
    c => c.section === section && c.key === key && c.language === language
  );
  return item?.value || '';
}

/**
 * Get all content for a section
 */
export function getSectionContent(section: string, language: string = 'en'): Record<string, string> {
  const contentData = loadContentData();
  const items = contentData.filter(
    c => c.section === section && c.language === language
  );
  
  const result: Record<string, string> = {};
  items.forEach(item => {
    result[item.key] = item.value;
  });
  return result;
}

/**
 * Get extended FAQ items addressing elderly-specific concerns
 * Reads from faq.csv with category='extended'
 */
export function getExtendedFAQItems(): ExtendedFAQ[] {
  const faqData = loadFAQData();
  
  // Map category from CSV to ExtendedFAQ category
  const categoryMap: Record<string, 'safety' | 'process' | 'cost' | 'aftercare'> = {
    'safety': 'safety',
    'process': 'process',
    'cost': 'cost',
    'aftercare': 'aftercare',
  };
  
  return faqData
    .filter(item => item.category === 'extended')
    .map(item => {
      // Extract category from faq_id (format: extended_safety_1, extended_process_1, etc.)
      const categoryMatch = item.faq_id.match(/extended_(safety|process|cost|aftercare)/);
      const mappedCategory = categoryMatch 
        ? (categoryMap[categoryMatch[1]] || 'safety')
        : 'safety';
      
      return {
        question: item.question,
        answer: item.answer,
        category: mappedCategory,
      };
    });
}

