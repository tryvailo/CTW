/**
 * Comprehensive test script for all TreatmentConnect URLs
 * Tests all 49 URLs and generates detailed report on failures
 */

import FirecrawlApp from 'firecrawl';
import { getAllTreatmentConnectUrls, getUrlStatistics } from './config/load-urls.js';
import { extractTreatmentConnectPrices } from './scraper.js';
import schemas from './schemas/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

console.log('🧪 Comprehensive TreatmentConnect Testing');
console.log('='.repeat(60));

// Get all URLs
const allUrls = getAllTreatmentConnectUrls();
const stats = getUrlStatistics();

console.log(`\n📊 Testing Statistics:`);
console.log(`  Total URLs: ${stats.total_urls}`);
console.log(`  By city:`, stats.by_city);
console.log(`  By procedure:`, stats.by_procedure);

console.log(`\n🚀 Starting comprehensive tests...\n`);

const results = {
  successful: [],
  failed: [],
  stats: {
    total: allUrls.length,
    processed: 0,
    successful: 0,
    failed: 0
  },
  timestamp: new Date().toISOString()
};

// Test each URL
for (let i = 0; i < allUrls.length; i++) {
  const { url, city, procedure } = allUrls[i];
  
  const progress = Math.round(((i + 1) / allUrls.length) * 100);
  console.log(`\n[${i + 1}/${allUrls.length}] (${progress}%) Testing: ${procedure} in ${city}`);
  console.log(`  URL: ${url.substring(0, 80)}...`);

  const testResult = {
    url,
    city,
    procedure,
    test_number: i + 1,
    timestamp: new Date().toISOString()
  };

  try {
    // Get schema and prompt for this test
    const schema = schemas.treatmentConnect.schema;
    const prompt = schemas.treatmentConnect.getPrompt(procedure, city);
    
    testResult.schema_used = {
      type: schema.type,
      required_fields: schema.required,
      properties_count: Object.keys(schema.properties).length
    };
    
    testResult.prompt_used = {
      length: prompt.length,
      first_200_chars: prompt.substring(0, 200)
    };

    // Test extraction
    const extractedData = await extractTreatmentConnectPrices(url, procedure, city);
    
    if (extractedData) {
      // Validate structure
      const required = ['procedure_id', 'city', 'cost_min', 'cost_max', 'date', 'source'];
      const missing = required.filter(field => !extractedData[field]);
      
      if (missing.length === 0) {
        testResult.status = 'success';
        testResult.extracted_data = extractedData;
        testResult.price = extractedData.cost_min;
        testResult.hospital_name = extractedData.hospital_name;
        testResult.rating = extractedData.rating;
        
        results.successful.push(testResult);
        results.stats.successful++;
        
        console.log(`  ✅ Success: ${extractedData.hospital_name} - £${extractedData.cost_min}`);
      } else {
        testResult.status = 'failed';
        testResult.error = `Missing required fields: ${missing.join(', ')}`;
        testResult.missing_fields = missing;
        testResult.extracted_data = extractedData; // Save partial data
        
        results.failed.push(testResult);
        results.stats.failed++;
        
        console.log(`  ❌ Failed: Missing fields: ${missing.join(', ')}`);
      }
    } else {
      // Try to get raw Firecrawl response to understand why
      try {
        const rawResult = await app.scrape(url, {
          formats: [{
            type: 'json',
            schema: schema,
            prompt: prompt
          }],
          onlyMainContent: false,
          timeout: 30000
        });

        testResult.status = 'failed';
        testResult.error = 'No data extracted';
        testResult.raw_firecrawl_response = rawResult.json || null;
        testResult.firecrawl_success = rawResult.success || false;
        
        if (rawResult.json) {
          testResult.raw_data_analysis = {
            has_hospital_name: !!rawResult.json.hospital_name,
            has_price_gbp: !!rawResult.json.price_gbp,
            price_gbp_value: rawResult.json.price_gbp,
            hospital_name_value: rawResult.json.hospital_name,
            all_fields: Object.keys(rawResult.json),
            all_values: rawResult.json
          };
        }
        
        results.failed.push(testResult);
        results.stats.failed++;
        
        console.log(`  ❌ Failed: No data extracted`);
        if (rawResult.json) {
          console.log(`     Raw response: price_gbp=${rawResult.json.price_gbp}, hospital_name="${rawResult.json.hospital_name}"`);
        }
      } catch (firecrawlError) {
        testResult.status = 'failed';
        testResult.error = `Firecrawl error: ${firecrawlError.message}`;
        testResult.firecrawl_error = firecrawlError.message;
        testResult.firecrawl_error_stack = firecrawlError.stack;
        
        results.failed.push(testResult);
        results.stats.failed++;
        
        console.log(`  ❌ Failed: ${firecrawlError.message}`);
      }
    }
    
  } catch (error) {
    testResult.status = 'failed';
    testResult.error = error.message;
    testResult.error_stack = error.stack;
    
    results.failed.push(testResult);
    results.stats.failed++;
    
    console.log(`  ❌ Error: ${error.message}`);
  }

  results.stats.processed++;

  // Rate limiting
  if (i < allUrls.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 6000));
  }
}

// Generate detailed report
console.log(`\n${'='.repeat(60)}`);
console.log('📊 Final Statistics');
console.log('='.repeat(60));
console.log(`  Total processed: ${results.stats.processed}`);
console.log(`  ✅ Successful: ${results.stats.successful}`);
console.log(`  ❌ Failed: ${results.stats.failed}`);
console.log(`  Success rate: ${Math.round((results.stats.successful / results.stats.processed) * 100)}%`);

// Save results to file
const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n💾 Full results saved to: ${resultsPath}`);

// Generate failure report
const failureReport = {
  timestamp: new Date().toISOString(),
  total_tests: results.stats.total,
  successful: results.stats.successful,
  failed: results.stats.failed,
  success_rate: `${Math.round((results.stats.successful / results.stats.total) * 100)}%`,
  failed_cases: results.failed.map(f => ({
    test_number: f.test_number,
    url: f.url,
    city: f.city,
    procedure: f.procedure,
    error: f.error,
    missing_fields: f.missing_fields || null,
    prompt_used: f.prompt_used,
    schema_used: f.schema_used,
    raw_firecrawl_response: f.raw_firecrawl_response || null,
    raw_data_analysis: f.raw_data_analysis || null,
    firecrawl_error: f.firecrawl_error || null
  }))
};

const reportPath = path.join(__dirname, 'FAILED_CASES_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(failureReport, null, 2), 'utf-8');
console.log(`💾 Failure report saved to: ${reportPath}`);

// Print summary of failures
if (results.failed.length > 0) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('❌ Failed Cases Summary');
  console.log('='.repeat(60));
  
  results.failed.forEach((failure, i) => {
    console.log(`\n${i + 1}. [${failure.procedure}] in [${failure.city}]`);
    console.log(`   URL: ${failure.url}`);
    console.log(`   Error: ${failure.error}`);
    if (failure.missing_fields) {
      console.log(`   Missing fields: ${failure.missing_fields.join(', ')}`);
    }
    if (failure.raw_data_analysis) {
      console.log(`   Raw data: price_gbp=${failure.raw_data_analysis.price_gbp_value}, hospital_name="${failure.raw_data_analysis.hospital_name_value}"`);
    }
  });
}

console.log('\n✅ Testing complete!');

