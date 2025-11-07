/**
 * Test script for TreatmentConnect integration
 * Tests extraction on 3-5 sample URLs
 */

import FirecrawlApp from 'firecrawl';
import { getAllTreatmentConnectUrls } from './config/load-urls.js';
import { extractTreatmentConnectPrices } from './scraper.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';

console.log('🧪 Testing TreatmentConnect Integration');
console.log('='.repeat(60));

// Get sample URLs (first 5)
const allUrls = getAllTreatmentConnectUrls();
const testUrls = allUrls.slice(0, 5);

console.log(`\n📋 Testing ${testUrls.length} URLs:`);
testUrls.forEach((item, i) => {
  console.log(`  ${i + 1}. [${item.city}] [${item.procedure}]`);
  console.log(`     ${item.url}`);
});

console.log('\n🚀 Starting extraction tests...\n');

const results = {
  successful: [],
  failed: [],
  stats: {
    total: testUrls.length,
    successful: 0,
    failed: 0
  }
};

// Test each URL
for (let i = 0; i < testUrls.length; i++) {
  const { url, city, procedure } = testUrls[i];
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Test ${i + 1}/${testUrls.length}: ${procedure} in ${city}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(60));

  try {
    // Import extractTreatmentConnectPrices function
    const { extractTreatmentConnectPrices } = await import('./scraper.js');
    
    // Also import schemas for direct testing
    const schemas = await import('./schemas/index.js');
    const schema = schemas.default.treatmentConnect.schema;
    const prompt = schemas.default.treatmentConnect.getPrompt(procedure, city);
    
    console.log('\n📋 Schema:');
    console.log(JSON.stringify(schema, null, 2).substring(0, 500) + '...');
    
    console.log('\n💬 Prompt (first 300 chars):');
    console.log(prompt.substring(0, 300) + '...');
    
    // Test using extractTreatmentConnectPrices function
    console.log('\n🔍 Testing extractTreatmentConnectPrices()...');
    
    const extractedData = await extractTreatmentConnectPrices(url, procedure, city);
    
    if (extractedData) {
      console.log('\n✅ Extraction successful:');
      console.log(JSON.stringify(extractedData, null, 2));
      
      // Validate structure
      const required = ['procedure_id', 'city', 'cost_min', 'cost_max', 'date', 'source'];
      const missing = required.filter(field => !extractedData[field]);
      
      if (missing.length === 0) {
        console.log('\n✅ All required fields present');
        console.log(`  Hospital: ${extractedData.hospital_name || 'N/A'}`);
        console.log(`  Price: £${extractedData.cost_min} - £${extractedData.cost_max}`);
        console.log(`  Source: ${extractedData.source}`);
        
        results.successful.push({
          url,
          city,
          procedure,
          data: extractedData
        });
        results.stats.successful++;
      } else {
        console.log(`\n⚠️  Missing required fields: ${missing.join(', ')}`);
        results.failed.push({
          url,
          city,
          procedure,
          error: `Missing fields: ${missing.join(', ')}`
        });
        results.stats.failed++;
      }
    } else {
      console.log('\n❌ Extraction returned no data');
      results.failed.push({
        url,
        city,
        procedure,
        error: 'No data returned'
      });
      results.stats.failed++;
    }
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    results.failed.push({
      url,
      city,
      procedure,
      error: error.message
    });
    results.stats.failed++;
  }

  // Rate limiting between tests
  if (i < testUrls.length - 1) {
    console.log('\n⏳ Waiting 6 seconds before next test...');
    await new Promise(resolve => setTimeout(resolve, 6000));
  }
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`  Total tests: ${results.stats.total}`);
console.log(`  ✅ Successful: ${results.stats.successful}`);
console.log(`  ❌ Failed: ${results.stats.failed}`);
console.log(`  Success rate: ${Math.round((results.stats.successful / results.stats.total) * 100)}%`);

if (results.successful.length > 0) {
  console.log('\n✅ Successful extractions:');
  results.successful.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.data.hospital_name} - £${item.data.cost_min} (${item.procedure} in ${item.city})`);
  });
}

if (results.failed.length > 0) {
  console.log('\n❌ Failed extractions:');
  results.failed.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.procedure} in ${item.city}: ${item.error}`);
  });
}

console.log('\n✅ Testing complete!');
