/**
 * Utilities for CSV handling, data validation, and parsing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Write CSV file from array of objects
 * @param {string} filename - Path to CSV file
 * @param {Array} rows - Array of objects
 * @param {Array} headers - Array of header names
 */
export function writeCSV(filename, rows, headers) {
  if (!rows || rows.length === 0) {
    console.warn(`⚠️  No data to write to ${filename}`);
    return;
  }

  // Create parent directories if needed
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Escape CSV values
  function escapeCSV(value) {
    if (value === null || value === undefined) {
      return '';
    }
    const str = String(value);
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Write headers
  let csvContent = headers.map(escapeCSV).join(',') + '\n';

  // Write rows
  for (const row of rows) {
    const values = headers.map(header => row[header] || '');
    csvContent += values.map(escapeCSV).join(',') + '\n';
  }

  // Write file
  fs.writeFileSync(filename, csvContent, 'utf-8');
  console.log(`✅ Wrote ${rows.length} rows to ${filename}`);
}

/**
 * Validate a data row
 * @param {Object} row - Data row to validate
 * @param {string} procedure - Procedure ID
 * @param {string} city - City name
 * @returns {{isValid: boolean, errors: string[]}}
 */
export function validateRow(row, procedure, city) {
  const errors = [];

  // Check required fields based on file type
  if (row.procedure_id !== procedure) {
    errors.push(`procedure_id mismatch: expected ${procedure}, got ${row.procedure_id}`);
  }

  if (row.city !== city) {
    errors.push(`city mismatch: expected ${city}, got ${row.city}`);
  }

  // Validate wait weeks (for nhs_waits.csv)
  if (row.avg_wait_weeks !== undefined) {
    const weeks = Number(row.avg_wait_weeks);
    if (isNaN(weeks) || weeks < config.validation.min_wait_weeks || weeks > config.validation.max_wait_weeks) {
      errors.push(`Invalid avg_wait_weeks: ${row.avg_wait_weeks} (must be ${config.validation.min_wait_weeks}-${config.validation.max_wait_weeks})`);
    }
  }

  // Validate costs (for private_costs.csv)
  if (row.cost_min_gbp !== undefined) {
    const min = Number(row.cost_min_gbp);
    if (isNaN(min) || min < config.validation.min_cost_gbp || min > config.validation.max_cost_gbp) {
      errors.push(`Invalid cost_min_gbp: ${row.cost_min_gbp} (must be ${config.validation.min_cost_gbp}-${config.validation.max_cost_gbp})`);
    }
  }

  if (row.cost_max_gbp !== undefined && row.cost_min_gbp !== undefined) {
    const min = Number(row.cost_min_gbp);
    const max = Number(row.cost_max_gbp);
    if (max < min) {
      errors.push(`Invalid cost range: min=${min}, max=${max}`);
    }
  }

  // Validate phone number (for clinics.csv)
  if (row.phone_number !== undefined && row.phone_number) {
    const phone = String(row.phone_number);
    const hasValidPattern = config.validation.valid_phone_patterns.some(pattern => 
      phone.includes(pattern)
    );
    if (!hasValidPattern && !phone.startsWith('+44')) {
      errors.push(`Invalid phone number format: ${phone}`);
    }
  }

  // Validate URL (for clinics.csv)
  if (row.website_url !== undefined && row.website_url) {
    const url = String(row.website_url);
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.push(`Invalid URL format: ${url}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Normalize procedure ID from text
 * @param {string} text - Text to match
 * @returns {string|null} - Procedure ID or null
 */
export function normalizeProcedureId(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  for (const [id, config_proc] of Object.entries(config.procedures)) {
    // Check keywords
    if (config_proc.keywords.some(k => lower.includes(k))) {
      return id;
    }
    // Check synonyms
    if (config_proc.synonyms.some(s => lower.includes(s.toLowerCase()))) {
      return id;
    }
  }

  return null;
}

/**
 * Normalize city name
 * @param {string} text - City text
 * @returns {string|null} - Normalized city name or null
 */
export function normalizeCity(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  for (const cityName of config.scraping.cities) {
    if (lower === cityName.toLowerCase()) {
      return cityName;
    }
  }

  return null;
}

/**
 * Get NHS trusts for a city and procedure
 * @param {string} city - City name
 * @param {string} procedure - Procedure ID
 * @returns {string[]} - Array of NHS trust names
 */
export function mapToNHSTrust(city, procedure) {
  const cityKey = city.toLowerCase();
  const cityConfig = config.cities[cityKey];
  
  if (!cityConfig) {
    return [];
  }

  // For cataract, prioritize eye hospitals
  if (procedure === 'cataract') {
    return cityConfig.trusts.filter(t => 
      t.toLowerCase().includes('eye') || 
      t.toLowerCase().includes('ophth') ||
      t.toLowerCase().includes('moorfields')
    ) || cityConfig.trusts;
  }

  // For hip/knee, prioritize ortho hospitals
  if (['hip', 'knee'].includes(procedure)) {
    return cityConfig.trusts.filter(t => 
      t.toLowerCase().includes('ortho') || 
      t.toLowerCase().includes('orthopaedic')
    ) || cityConfig.trusts;
  }

  return cityConfig.trusts;
}

/**
 * Extract number from text (e.g., "18 weeks" → 18)
 * @param {string} text - Text containing number
 * @returns {number|null} - Extracted number or null
 */
export function extractNumberFromText(text) {
  if (!text) return null;
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Extract cost range from text (e.g., "£2,500-£4,000" → {min: 2500, max: 4000})
 * @param {string} text - Price text
 * @returns {{min: number, max: number}|null} - Cost range or null
 */
export function extractCostRange(text) {
  if (!text) return null;

  // Remove £ and commas, extract numbers
  const cleaned = text.replace(/£/g, '').replace(/,/g, '');
  const numbers = cleaned.match(/\d+/g);

  if (!numbers || numbers.length === 0) {
    return null;
  }

  const nums = numbers.map(n => parseInt(n, 10));

  if (nums.length === 1) {
    return { min: nums[0], max: nums[0] };
  }

  return {
    min: Math.min(...nums),
    max: Math.max(...nums)
  };
}

/**
 * Extract phone number from text
 * @param {string} text - Text containing phone
 * @returns {string|null} - Phone number or null
 */
export function extractPhoneNumber(text) {
  if (!text) return null;

  // Match UK phone patterns
  const patterns = [
    /\+44\s?\d{1,4}\s?\d{3,4}\s?\d{3,4}/, // +44 format
    /0\d{2,3}\s?\d{3,4}\s?\d{3,4}/, // 020 format
    /0\d{4}\s?\d{6}/ // 01234 format
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return null;
}

/**
 * Clean and normalize text
 * @param {string} text - Text to clean
 * @returns {string} - Cleaned text
 */
export function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Read CSV file and return as array of objects
 * @param {string} filePath - Path to CSV file
 * @returns {Array} - Array of objects
 */
export function readCSV(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  CSV file not found: ${filePath}`);
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
      return []; // Only headers or empty
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Simple CSV parsing (handle quoted values)
      const values = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
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

      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  } catch (error) {
    console.error(`❌ Error reading CSV ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Get fallback data from last successful CSV files
 * @param {string} fileType - 'nhs_waits', 'private_costs', or 'clinics'
 * @returns {Array} - Array of data rows
 */
export function getFallbackData(fileType) {
  const filePath = config.csvPaths[fileType];
  if (!filePath) {
    console.warn(`⚠️  Unknown file type: ${fileType}`);
    return [];
  }

  const data = readCSV(filePath);
  if (data.length > 0) {
    console.log(`📦 Using fallback data from ${filePath} (${data.length} rows)`);
    // Update last_updated to current date (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];
    return data.map(row => ({
      ...row,
      last_updated: today, // YYYY-MM-DD format for consistency
      date: today // YYYY-MM-DD format
    }));
  }

  return [];
}

