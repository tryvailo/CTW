/**
 * Main scraper script for healthcare data
 * Scrapes My Planned Care (NHS waiting times) and PHIN (private costs and clinics)
 * Includes fallback to last successful CSV data if sites are unavailable
 */

import FirecrawlApp from 'firecrawl';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import {
  writeCSV,
  validateRow,
  normalizeProcedureId,
  normalizeCity,
  mapToNHSTrust,
  extractNumberFromText,
  extractCostRange,
  extractPhoneNumber,
  cleanText,
  getFallbackData
} from './utils.js';
import schemas from './schemas/index.js';
import { getAllTreatmentConnectUrls } from './config/load-urls.js';
import treatmentConnectConfig from './config/treatmentconnect-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firecrawl
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// Track results
let nhsWaitsData = [];
let privateCostsData = [];
let clinicsData = [];

const startTime = Date.now();

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrape URL with retry logic (v1 API - for HTML/Markdown)
 */
async function scrapeWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${maxRetries}...`);
      const result = await app.v1.scrapeUrl(url, {
        ...options,
        timeout: config.scraping.timeout
      });

      if (result && (result.markdown || result.html)) {
        return result;
      }

      throw new Error('Empty response from Firecrawl');
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`  ⚠️  Retry ${attempt} failed: ${error.message}`);
      await sleep(2000); // Wait 2 seconds before retry
    }
  }
}

/**
 * Scrape URL with JSON Mode (v2 API - for structured data extraction)
 */
async function scrapeWithJSONMode(url, schema, prompt, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${maxRetries} (JSON Mode)...`);
      const result = await app.scrape(url, {
        formats: [{
          type: 'json',
          schema: schema,
          prompt: prompt
        }],
        onlyMainContent: false,
        timeout: config.scraping.timeout
      });

      // Firecrawl v2 returns JSON directly in result.json (not result.data.json)
      if (result && result.json) {
        return result.json;
      }

      // Fallback: check result.data.json (for compatibility)
      if (result && result.data && result.data.json) {
        return result.data.json;
      }

      throw new Error('Empty JSON response from Firecrawl');
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`  ⚠️  Retry ${attempt} failed: ${error.message}`);
      await sleep(2000); // Wait 2 seconds before retry
    }
  }
}

/**
 * Check if site is available
 */
async function isSiteAvailable(url) {
  try {
    const result = await app.v1.scrapeUrl(url, {
      formats: ['html'],
      timeout: 10000 // Quick check
    });
    return result && (result.html || result.markdown);
  } catch (error) {
    return false;
  }
}

/**
 * Extract NHS waiting times using JSON Mode (LLM Extract)
 * Exported for testing
 */
export async function extractNHSWaitsWithJSONMode(url, procedure, city) {
  try {
    const schema = schemas.nhsWaits.schema;
    const prompt = schemas.nhsWaits.getPrompt(procedure, city);
    
    const jsonData = await scrapeWithJSONMode(url, schema, prompt);
    
    if (!jsonData || !jsonData.avg_wait_weeks || !jsonData.nhs_trust) {
      return null;
    }
    
    // Transform JSON data to CSV format
    return {
      procedure_id: procedure,
      city: city,
      nhs_trust: jsonData.nhs_trust,
      avg_wait_weeks: Math.round(jsonData.avg_wait_weeks),
      date: new Date().toISOString().split('T')[0],
      source: 'My Planned Care'
    };
  } catch (error) {
    console.error(`  ❌ JSON Mode extraction failed: ${error.message}`);
    return null;
  }
}

/**
 * Extract prices from TreatmentConnect.co.uk
 * PRIMARY SOURCE for private costs
 * Exported for testing
 */
export async function extractTreatmentConnectPrices(url, procedure, city) {
  try {
    const schema = schemas.treatmentConnect.schema;
    const prompt = schemas.treatmentConnect.getPrompt(procedure, city);
    
    const jsonData = await scrapeWithJSONMode(url, schema, prompt);
    
    // Debug: log what we got (only in verbose mode or on first few attempts)
    if (jsonData) {
      console.log(`  📋 TreatmentConnect returned:`, JSON.stringify(jsonData, null, 2));
    } else {
      console.log(`  ⚠️  TreatmentConnect returned null or undefined`);
      return null;
    }
    
    // Validate required fields (from config)
    const requiredFields = treatmentConnectConfig.validation.required_fields;
    const missingFields = requiredFields.filter(field => !jsonData[field]);
    
    if (missingFields.length > 0) {
      console.log(`  ⚠️  Missing required fields: ${missingFields.join(', ')}`);
      return null;
    }
    
    // Validate price range (from config)
    const priceRanges = treatmentConnectConfig.validation.price_ranges[procedure];
    if (priceRanges) {
      const price = jsonData.price_gbp;
      if (price < priceRanges.min || price > priceRanges.max) {
        console.log(`  ⚠️  Price £${price} outside expected range for ${procedure} (${priceRanges.min}-${priceRanges.max})`);
        // Don't return null, just warn - prices can vary, but log for review
      }
    }
    
    // Transform TreatmentConnect data to CSV format
    return {
      procedure_id: procedure,
      city: city,
      cost_min: Math.round(jsonData.price_min_gbp || jsonData.price_gbp),
      cost_max: Math.round(jsonData.price_max_gbp || jsonData.price_gbp),
      clinic_count: 1, // One hospital per URL
      date: new Date().toISOString().split('T')[0],
      source: treatmentConnectConfig.source_name,
      // Additional metadata (will be used for aggregation)
      hospital_name: jsonData.hospital_name,
      rating: jsonData.rating_stars || null,
      avg_uk_price: jsonData.avg_uk_price || null,
      url: url
    };
  } catch (error) {
    console.error(`  ❌ TreatmentConnect extraction failed: ${error.message}`);
    return null;
  }
}

/**
 * Extract private costs using JSON Mode (LLM Extract)
 * FALLBACK method - used when TreatmentConnect is not available
 * Exported for testing
 */
export async function extractPHINCostsWithJSONMode(url, procedure, city) {
  try {
    const schema = schemas.privateCosts.schema;
    const prompt = schemas.privateCosts.getPrompt(procedure, city);
    
    const jsonData = await scrapeWithJSONMode(url, schema, prompt);
    
    // Debug: log what we got
    if (jsonData) {
      console.log(`  📋 JSON Mode returned:`, JSON.stringify(jsonData, null, 2));
    } else {
      console.log(`  ⚠️  JSON Mode returned null or undefined`);
    }
    
    if (!jsonData || !jsonData.cost_min_gbp || !jsonData.cost_max_gbp) {
      console.log(`  ⚠️  Missing required fields: cost_min_gbp=${!!jsonData?.cost_min_gbp}, cost_max_gbp=${!!jsonData?.cost_max_gbp}`);
      return null;
    }
    
    // Transform JSON data to CSV format
    return {
      procedure_id: procedure,
      city: city,
      cost_min: Math.round(jsonData.cost_min_gbp),
      cost_max: Math.round(jsonData.cost_max_gbp),
      clinic_count: jsonData.clinic_count ? Math.round(jsonData.clinic_count) : 0,
      date: new Date().toISOString().split('T')[0],
      source: 'PHIN + clinic websites'
    };
  } catch (error) {
    console.error(`  ❌ JSON Mode extraction failed: ${error.message}`);
    return null;
  }
}

/**
 * Extract clinic details using JSON Mode (LLM Extract)
 * Exported for testing
 */
export async function extractClinicsWithJSONMode(url, procedure, city) {
  try {
    const schema = schemas.clinics.schema;
    const prompt = schemas.clinics.getPrompt(procedure, city);
    
    const jsonDataArray = await scrapeWithJSONMode(url, schema, prompt);
    
    if (!jsonDataArray || !Array.isArray(jsonDataArray) || jsonDataArray.length === 0) {
      return [];
    }
    
    // Transform JSON data array to CSV format
    return jsonDataArray.map(clinic => {
      // Generate clinic_id
      const clinicId = `${clinic.clinic_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${city.toLowerCase()}_${procedure}`;
      
      return {
        clinic_id: clinicId,
        name: clinic.clinic_name,
        city: city,
        procedure_id: procedure,
        price: Math.round(clinic.price_gbp),
        url: clinic.website_url || '',
        phone: clinic.phone_number || '',
        last_updated: new Date().toISOString().split('T')[0]
      };
    });
  } catch (error) {
    console.error(`  ❌ JSON Mode extraction failed: ${error.message}`);
    return [];
  }
}

/**
 * Parse NHS waiting times from HTML/markdown
 * FALLBACK FUNCTION - Used if JSON Mode fails
 */
function parseNHSWaitingTimes(html, markdown, procedure, city) {
  const data = [];
  
  // Try to extract from markdown (easier to parse)
  if (markdown) {
    // Look for patterns like "18 weeks", "average wait", "median wait"
    const waitTimePatterns = [
      /(?:average|mean|median)\s+(?:wait|waiting)\s+(?:time|period)[:\s]+(\d+)\s+weeks?/i,
      /(\d+)\s+weeks?\s+(?:average|mean|median)/i,
      /waiting\s+time[:\s]+(\d+)\s+weeks?/i
    ];

    for (const pattern of waitTimePatterns) {
      const match = markdown.match(pattern);
      if (match) {
        const weeks = parseInt(match[1], 10);
        const trusts = mapToNHSTrust(city, procedure);
        
        for (const trust of trusts) {
          data.push({
            procedure_id: procedure,
            city: city,
            nhs_trust: trust,
            avg_wait_weeks: weeks,
            date: new Date().toISOString().split('T')[0],
            source: 'My Planned Care'
          });
        }
        break;
      }
    }
  }

  // If no data found, try HTML parsing
  if (data.length === 0 && html) {
    // Look for table rows or data cells
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/i);
    if (tableMatch) {
      const tableHtml = tableMatch[0];
      const rowMatches = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
      
      if (rowMatches) {
        for (const row of rowMatches) {
          const cellMatches = row.match(/<td[^>]*>([^<]+)<\/td>/gi);
          if (cellMatches) {
            for (const cell of cellMatches) {
              const weeks = extractNumberFromText(cell);
              if (weeks && weeks >= 0 && weeks <= 100) {
                const trusts = mapToNHSTrust(city, procedure);
                for (const trust of trusts) {
                  data.push({
                    procedure_id: procedure,
                    city: city,
                    nhs_trust: trust,
                    avg_wait_weeks: weeks,
                    date: new Date().toISOString().split('T')[0],
                    source: 'My Planned Care'
                  });
                }
                break;
              }
            }
          }
        }
      }
    }
  }

  return data;
}

/**
 * Parse PHIN costs from HTML/markdown
 * FALLBACK FUNCTION - Used if JSON Mode fails
 */
function parsePHINCosts(html, markdown, procedure, city) {
  const data = [];

  if (markdown) {
    // Look for price ranges
    const pricePatterns = [
      /£[\d,]+-£[\d,]+/g,
      /£[\d,]+\s*to\s*£[\d,]+/gi,
      /from\s*£[\d,]+/gi
    ];

    const prices = [];
    for (const pattern of pricePatterns) {
      const matches = markdown.match(pattern);
      if (matches) {
        prices.push(...matches);
      }
    }

    if (prices.length > 0) {
      const ranges = prices.map(extractCostRange).filter(r => r !== null);
      if (ranges.length > 0) {
        const minCost = Math.min(...ranges.map(r => r.min));
        const maxCost = Math.max(...ranges.map(r => r.max));
        const clinicCount = ranges.length;

        data.push({
          procedure_id: procedure,
          city: city,
          cost_min: minCost,
          cost_max: maxCost,
          clinic_count: clinicCount,
          date: new Date().toISOString().split('T')[0],
          source: 'PHIN + clinic websites'
        });
      }
    }
  }

  return data;
}

/**
 * Parse PHIN clinics from HTML/markdown
 * FALLBACK FUNCTION - Used if JSON Mode fails
 */
function parsePHINClinics(html, markdown, procedure, city) {
  const data = [];

  if (markdown) {
    // Look for clinic names and prices
    // This is a simplified parser - may need adjustment based on actual PHIN structure
    const lines = markdown.split('\n');
    let currentClinic = null;

    for (const line of lines) {
      // Look for clinic names (usually in headings or bold)
      if (line.match(/^#{1,3}\s+.+/) || line.match(/\*\*.+\*\*/)) {
        const clinicName = cleanText(line.replace(/^#+\s+/, '').replace(/\*\*/g, ''));
        if (clinicName && clinicName.length > 3) {
          currentClinic = {
            procedure_id: procedure,
            city: city,
            clinic_name: clinicName,
            price: null,
            phone_number: '',
            website_url: '',
            last_updated: new Date().toISOString().split('T')[0]
          };
        }
      }

      // Look for prices
      if (currentClinic && line.match(/£[\d,]+/)) {
        const costRange = extractCostRange(line);
        if (costRange) {
          currentClinic.price = costRange.min; // Use min as representative price
        }
      }

      // Look for phone numbers
      if (currentClinic && !currentClinic.phone_number && line.match(/\+44|0\d{2,3}/)) {
        const phone = extractPhoneNumber(line);
        if (phone) {
          currentClinic.phone_number = phone;
        }
      }

      // Look for URLs
      if (currentClinic && !currentClinic.website_url && line.match(/https?:\/\//)) {
        const urlMatch = line.match(/https?:\/\/[^\s\)]+/);
        if (urlMatch) {
          currentClinic.website_url = urlMatch[0];
        }
      }

      // If we have enough data, save clinic
      if (currentClinic && currentClinic.clinic_name && currentClinic.price) {
        // Generate clinic_id
        const clinicId = `${currentClinic.clinic_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${city.toLowerCase()}_${procedure}`;
        data.push({
          clinic_id: clinicId,
          ...currentClinic
        });
        currentClinic = null;
      }
    }
  }

  return data;
}

/**
 * Scrape NHS waiting times
 * Uses JSON Mode (LLM Extract) as primary method, falls back to regex parser, then CSV
 */
async function scrapeNHSWaits(procedure, city) {
  try {
    const url = config.urls.nhs_wait_times;
    console.log(`\n[${procedure} in ${city}] Scraping NHS waiting times...`);

    // Try JSON Mode first (primary method)
    console.log(`  🔍 Trying JSON Mode extraction...`);
    const jsonData = await extractNHSWaitsWithJSONMode(url, procedure, city);
    
    if (jsonData) {
      nhsWaitsData.push(jsonData);
      console.log(`  ✅ JSON Mode: Found NHS wait time data`);
      return;
    }

    // Fallback to regex parser
    console.log(`  ⚠️  JSON Mode returned no data, trying regex parser...`);
    try {
      const result = await scrapeWithRetry(url, {
        formats: ['html', 'markdown']
      });
      const parsed = parseNHSWaitingTimes(result.html, result.markdown, procedure, city);
      
      if (parsed.length > 0) {
        nhsWaitsData.push(...parsed);
        console.log(`  ✅ Regex parser: Found ${parsed.length} NHS wait time record(s)`);
        return;
      }
    } catch (parseError) {
      console.log(`  ⚠️  Regex parser failed: ${parseError.message}`);
    }

    // Final fallback: use CSV data
    console.log(`  📦 Using CSV fallback data`);
    const fallback = getFallbackData('nhs_waits').filter(
      r => r.procedure_id === procedure && r.city === city
    );
    if (fallback.length > 0) {
      nhsWaitsData.push(...fallback);
      console.log(`  📦 Using ${fallback.length} fallback record(s) from CSV`);
    } else {
      console.log(`  ⚠️  No fallback data available`);
    }
  } catch (error) {
    console.error(`  ❌ Error scraping NHS waits: ${error.message}`);
    console.log(`  📦 Using CSV fallback data`);
    const fallback = getFallbackData('nhs_waits').filter(
      r => r.procedure_id === procedure && r.city === city
    );
    if (fallback.length > 0) {
      nhsWaitsData.push(...fallback);
      console.log(`  📦 Using ${fallback.length} fallback record(s) from CSV`);
    }
  }
}

/**
 * Scrape private costs and clinics
 * Uses TreatmentConnect as PRIMARY source, falls back to PHIN, then regex, then CSV
 * Renamed from scrapePHINData to reflect multiple sources
 */
async function scrapePrivateCosts(procedure, city) {
  try {
    console.log(`\n[${procedure} in ${city}] Scraping private costs...`);

    // ===== EXTRACT COSTS =====
    // PRIORITY 1: TreatmentConnect (PRIMARY SOURCE)
    console.log(`  🔍 Trying TreatmentConnect (PRIMARY)...`);
    const { getTreatmentConnectUrls } = await import('./config/load-urls.js');
    const treatmentConnectUrls = getTreatmentConnectUrls(city.toLowerCase(), procedure);
    
    let costData = null;
    
    // Try each TreatmentConnect URL for this city/procedure
    if (treatmentConnectUrls.length > 0) {
      for (const url of treatmentConnectUrls) {
        try {
          costData = await extractTreatmentConnectPrices(url, procedure, city);
          if (costData) {
            console.log(`  ✅ TreatmentConnect: Found cost data from ${costData.hospital_name || 'unknown hospital'}`);
            break; // Success, stop trying other URLs
          }
        } catch (error) {
          console.log(`  ⚠️  TreatmentConnect URL failed: ${error.message}`);
          continue; // Try next URL
        }
        
        // Rate limiting between TreatmentConnect URLs
        await sleep(2000);
      }
    } else {
      console.log(`  ⚠️  No TreatmentConnect URLs found for ${procedure} in ${city}`);
    }
    
    // PRIORITY 2: PHIN (FALLBACK)
    if (!costData) {
      console.log(`  🔍 TreatmentConnect returned no data, trying PHIN (FALLBACK)...`);
      const phinUrl = config.urls.phin_provider || config.urls.phin_home;
      costData = await extractPHINCostsWithJSONMode(phinUrl, procedure, city);
    
      // PRIORITY 3: Regex parser (FALLBACK)
      if (!costData) {
        console.log(`  ⚠️  PHIN returned no cost data, trying regex parser (FALLBACK)...`);
        try {
          const result = await scrapeWithRetry(phinUrl, {
            formats: ['html', 'markdown']
          });
          const parsedCosts = parsePHINCosts(result.html, result.markdown, procedure, city);
          if (parsedCosts.length > 0) {
            costData = parsedCosts[0]; // Take first result
            console.log(`  ✅ Regex parser: Found cost data`);
          }
        } catch (parseError) {
          console.log(`  ⚠️  Regex parser failed: ${parseError.message}`);
        }
      } else {
        console.log(`  ✅ PHIN: Found cost data`);
      }
    }

    if (costData) {
      privateCostsData.push(costData);
    } else {
      // Final fallback: use CSV data
      console.log(`  📦 Using CSV fallback for costs`);
      const fallback = getFallbackData('private_costs').filter(
        r => r.procedure_id === procedure && r.city === city
      );
      if (fallback.length > 0) {
        privateCostsData.push(...fallback);
        console.log(`  📦 Using ${fallback.length} cost fallback record(s) from CSV`);
      }
    }

    // ===== EXTRACT CLINICS =====
    // Note: Clinics extraction still uses PHIN (TreatmentConnect doesn't provide clinic details)
    console.log(`  🔍 Trying JSON Mode for clinics...`);
    const phinUrl = config.urls.phin_provider || config.urls.phin_home;
    let clinicDataArray = await extractClinicsWithJSONMode(phinUrl, procedure, city);
    
    if (!clinicDataArray || clinicDataArray.length === 0) {
      // Fallback to regex parser
      console.log(`  ⚠️  JSON Mode returned no clinic data, trying regex parser...`);
      try {
        const result = await scrapeWithRetry(phinUrl, {
          formats: ['html', 'markdown']
        });
        clinicDataArray = parsePHINClinics(result.html, result.markdown, procedure, city);
        if (clinicDataArray.length > 0) {
          console.log(`  ✅ Regex parser: Found ${clinicDataArray.length} clinic(s)`);
        }
      } catch (parseError) {
        console.log(`  ⚠️  Regex parser failed: ${parseError.message}`);
      }
    } else {
      console.log(`  ✅ JSON Mode: Found ${clinicDataArray.length} clinic(s)`);
    }

    if (clinicDataArray && clinicDataArray.length > 0) {
      clinicsData.push(...clinicDataArray);
    } else {
      // Final fallback: use CSV data
      console.log(`  📦 Using CSV fallback for clinics`);
      const fallback = getFallbackData('clinics').filter(
        r => r.procedure_id === procedure && r.city === city
      );
      if (fallback.length > 0) {
        clinicsData.push(...fallback);
        console.log(`  📦 Using ${fallback.length} clinic fallback record(s) from CSV`);
      }
    }
  } catch (error) {
    console.error(`  ❌ Error scraping PHIN: ${error.message}`);
    console.log(`  📦 Using CSV fallback data`);
    
    // Use fallback for costs
    const costFallback = getFallbackData('private_costs').filter(
      r => r.procedure_id === procedure && r.city === city
    );
    if (costFallback.length > 0) {
      privateCostsData.push(...costFallback);
      console.log(`  📦 Using ${costFallback.length} cost fallback record(s) from CSV`);
    }

    // Use fallback for clinics
    const clinicFallback = getFallbackData('clinics').filter(
      r => r.procedure_id === procedure && r.city === city
    );
    if (clinicFallback.length > 0) {
      clinicsData.push(...clinicFallback);
      console.log(`  📦 Using ${clinicFallback.length} clinic fallback record(s) from CSV`);
    }
  }
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting healthcare data scraper...');
  console.log('='.repeat(60));

  // Check site availability
  console.log('\n📡 Checking site availability...');
  const nhsAvailable = await isSiteAvailable(config.urls.nhs_wait_times);
  const phinAvailable = await isSiteAvailable(config.urls.phin_home);

  console.log(`  My Planned Care: ${nhsAvailable ? '✅ Available' : '❌ Unavailable (will use fallback)'}`);
  console.log(`  PHIN: ${phinAvailable ? '✅ Available' : '❌ Unavailable (will use fallback)'}`);

  // Generate all combinations
  const combinations = [];
  for (const procedure of config.scraping.procedures) {
    for (const city of config.scraping.cities) {
      combinations.push({ procedure, city });
    }
  }

  console.log(`\n📊 Scraping ${combinations.length} combinations...`);

  // Scrape each combination
  for (let i = 0; i < combinations.length; i++) {
    const { procedure, city } = combinations[i];
    console.log(`\n[${i + 1}/${combinations.length}] Processing ${procedure} in ${city}...`);

    // Scrape NHS waits (if available, otherwise use fallback)
    if (nhsAvailable) {
      await scrapeNHSWaits(procedure, city);
      await sleep(config.scraping.rate_limit_delay);
    } else {
      console.log(`  📦 Using fallback for NHS waits`);
      const fallback = getFallbackData('nhs_waits').filter(
        r => r.procedure_id === procedure && r.city === city
      );
      if (fallback.length > 0) {
        nhsWaitsData.push(...fallback);
      }
    }

    // Scrape private costs (TreatmentConnect → PHIN → fallback)
    // TreatmentConnect should always be tried, regardless of PHIN availability
    await scrapePrivateCosts(procedure, city);
    await sleep(config.scraping.rate_limit_delay);
  }

  // Validate and filter data
  console.log('\n🔍 Validating data...');
  const validatedNHS = nhsWaitsData.filter(row => {
    const validation = validateRow(row, row.procedure_id, row.city);
    if (!validation.isValid) {
      console.warn(`  ⚠️  Invalid row: ${validation.errors.join(', ')}`);
    }
    return validation.isValid;
  });

  const validatedCosts = privateCostsData.filter(row => {
    const validation = validateRow(row, row.procedure_id, row.city);
    if (!validation.isValid) {
      console.warn(`  ⚠️  Invalid row: ${validation.errors.join(', ')}`);
    }
    return validation.isValid;
  });

  const validatedClinics = clinicsData.filter(row => {
    const validation = validateRow(row, row.procedure_id, row.city);
    if (!validation.isValid) {
      console.warn(`  ⚠️  Invalid row: ${validation.errors.join(', ')}`);
    }
    return validation.isValid;
  });

  // Write CSV files
  console.log('\n💾 Writing CSV files...');
  
  const nhsHeaders = ['procedure_id', 'city', 'nhs_trust', 'avg_wait_weeks', 'date', 'source'];
  writeCSV(config.csvPaths.nhs_waits, validatedNHS, nhsHeaders);

  const costHeaders = ['procedure_id', 'city', 'cost_min', 'cost_max', 'clinic_count', 'date', 'source'];
  writeCSV(config.csvPaths.private_costs, validatedCosts, costHeaders);

  const clinicHeaders = ['clinic_id', 'name', 'city', 'procedure_id', 'price', 'url', 'phone', 'last_updated'];
  writeCSV(config.csvPaths.clinics, validatedClinics, clinicHeaders);

  // Summary
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log('\n' + '='.repeat(60));
  console.log('✅ Scraping complete!');
  console.log(`📊 Results:`);
  console.log(`   NHS waits: ${validatedNHS.length} rows`);
  console.log(`   Private costs: ${validatedCosts.length} rows`);
  console.log(`   Clinics: ${validatedClinics.length} rows`);
  console.log(`⏱️  Total time: ${totalTime}s`);
  console.log('='.repeat(60));

  process.exit(0);
}

// Run main function
// Only run main() if this script is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('scraper.js')) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

