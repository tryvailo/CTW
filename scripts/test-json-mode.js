/**
 * Test script for JSON Mode extraction functions
 * Tests all three extraction methods on real URLs
 */

import FirecrawlApp from 'firecrawl';
import config from './config.js';
// Import functions directly - scraper.js won't run main() when imported
import {
  extractNHSWaitsWithJSONMode,
  extractPHINCostsWithJSONMode,
  extractClinicsWithJSONMode
} from './scraper.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// Test URLs
const TEST_URLS = {
  nhs: config.urls.nhs_wait_times,
  phin: config.urls.phin_home
};

// Test cases
const TEST_CASES = [
  { procedure: 'cataract', city: 'London' },
  { procedure: 'hip', city: 'Manchester' },
  { procedure: 'knee', city: 'Birmingham' }
];

/**
 * Test NHS Waiting Times extraction
 */
async function testNHSWaits(procedure, city) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing NHS Waits: ${procedure} in ${city}`);
  console.log('='.repeat(60));

  try {
    const result = await extractNHSWaitsWithJSONMode(
      TEST_URLS.nhs,
      procedure,
      city
    );

    if (result) {
      console.log('✅ SUCCESS: Data extracted');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      
      // Validate structure
      const requiredFields = ['procedure_id', 'city', 'nhs_trust', 'avg_wait_weeks', 'date', 'source'];
      const missingFields = requiredFields.filter(field => !result[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present');
      } else {
        console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
      }
      
      // Validate data types
      if (typeof result.avg_wait_weeks === 'number' && result.avg_wait_weeks >= 0) {
        console.log(`✅ avg_wait_weeks is valid: ${result.avg_wait_weeks}`);
      } else {
        console.log(`❌ Invalid avg_wait_weeks: ${result.avg_wait_weeks}`);
      }
      
      return { success: true, data: result };
    } else {
      console.log('❌ FAILED: No data extracted');
      return { success: false, data: null };
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Private Costs extraction
 */
async function testPHINCosts(procedure, city) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing PHIN Costs: ${procedure} in ${city}`);
  console.log('='.repeat(60));

  try {
    const result = await extractPHINCostsWithJSONMode(
      TEST_URLS.phin,
      procedure,
      city
    );

    if (result) {
      console.log('✅ SUCCESS: Data extracted');
      console.log('📊 Result:', JSON.stringify(result, null, 2));
      
      // Validate structure
      const requiredFields = ['procedure_id', 'city', 'cost_min', 'cost_max', 'date', 'source'];
      const missingFields = requiredFields.filter(field => !result[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present');
      } else {
        console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
      }
      
      // Validate data types and ranges
      if (typeof result.cost_min === 'number' && result.cost_min > 0) {
        console.log(`✅ cost_min is valid: £${result.cost_min}`);
      } else {
        console.log(`❌ Invalid cost_min: ${result.cost_min}`);
      }
      
      if (typeof result.cost_max === 'number' && result.cost_max >= result.cost_min) {
        console.log(`✅ cost_max is valid: £${result.cost_max}`);
      } else {
        console.log(`❌ Invalid cost_max: ${result.cost_max}`);
      }
      
      return { success: true, data: result };
    } else {
      console.log('❌ FAILED: No data extracted');
      return { success: false, data: null };
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test Clinic Details extraction
 */
async function testClinics(procedure, city) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Testing Clinics: ${procedure} in ${city}`);
  console.log('='.repeat(60));

  try {
    const result = await extractClinicsWithJSONMode(
      TEST_URLS.phin,
      procedure,
      city
    );

    if (result && Array.isArray(result) && result.length > 0) {
      console.log(`✅ SUCCESS: ${result.length} clinic(s) extracted`);
      console.log('📊 First clinic:', JSON.stringify(result[0], null, 2));
      
      // Validate structure
      const requiredFields = ['clinic_id', 'name', 'city', 'procedure_id', 'price', 'url', 'phone', 'last_updated'];
      const firstClinic = result[0];
      const missingFields = requiredFields.filter(field => !firstClinic[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present in first clinic');
      } else {
        console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
      }
      
      // Validate data types
      if (typeof firstClinic.price === 'number' && firstClinic.price > 0) {
        console.log(`✅ price is valid: £${firstClinic.price}`);
      } else {
        console.log(`❌ Invalid price: ${firstClinic.price}`);
      }
      
      console.log(`📋 Total clinics: ${result.length}`);
      
      return { success: true, data: result, count: result.length };
    } else {
      console.log('❌ FAILED: No clinics extracted');
      return { success: false, data: [], count: 0 };
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main test function
 */
async function main() {
  console.log('🚀 Starting JSON Mode Testing');
  console.log('='.repeat(60));
  console.log(`API Key: ${FIRECRAWL_API_KEY.substring(0, 10)}...`);
  console.log(`Test URLs:`);
  console.log(`  NHS: ${TEST_URLS.nhs}`);
  console.log(`  PHIN: ${TEST_URLS.phin}`);
  console.log('='.repeat(60));

  const results = {
    nhsWaits: [],
    phinCosts: [],
    clinics: []
  };

  // Test each case
  for (const testCase of TEST_CASES) {
    const { procedure, city } = testCase;
    
    // Test NHS Waits
    const nhsResult = await testNHSWaits(procedure, city);
    results.nhsWaits.push({ ...testCase, ...nhsResult });
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Test PHIN Costs
    const costResult = await testPHINCosts(procedure, city);
    results.phinCosts.push({ ...testCase, ...costResult });
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Test Clinics
    const clinicResult = await testClinics(procedure, city);
    results.clinics.push({ ...testCase, ...clinicResult });
    
    // Wait between test cases
    await new Promise(resolve => setTimeout(resolve, 6000));
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const nhsSuccess = results.nhsWaits.filter(r => r.success).length;
  const costSuccess = results.phinCosts.filter(r => r.success).length;
  const clinicSuccess = results.clinics.filter(r => r.success).length;

  console.log(`\nNHS Waits: ${nhsSuccess}/${TEST_CASES.length} successful`);
  console.log(`PHIN Costs: ${costSuccess}/${TEST_CASES.length} successful`);
  console.log(`Clinics: ${clinicSuccess}/${TEST_CASES.length} successful`);

  const totalClinics = results.clinics.reduce((sum, r) => sum + (r.count || 0), 0);
  console.log(`\nTotal clinics extracted: ${totalClinics}`);

  // Save results to file
  const fs = await import('fs');
  const resultsPath = 'scripts/test-results.json';
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n💾 Results saved to: ${resultsPath}`);

  console.log('\n✅ Testing complete!');
}

// Run tests
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

