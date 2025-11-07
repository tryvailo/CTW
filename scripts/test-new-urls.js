/**
 * Test script for new URLs found by Claude AI
 * Tests 13 new URLs: 9 Manchester + 2 London Hip + 2 Bristol Cataract
 */

import FirecrawlApp from 'firecrawl';
import { extractTreatmentConnectPrices } from './scraper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';

console.log('🧪 Testing New URLs Found by Claude AI');
console.log('='.repeat(60));

// New URLs to test
const newURLs = {
  manchester: {
    cataract: [
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-highfield-hospital/cataract-surgery',
      'https://www.treatmentconnect.co.uk/hospitals/ramsay-oaklands-hospital/cataract-surgery',
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-alexandra-hospital/cataract-surgery'
    ],
    hip: [
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-highfield-hospital/hip-replacement',
      'https://www.treatmentconnect.co.uk/hospitals/ramsay-oaklands-hospital/hip-replacement',
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-alexandra-hospital/hip-replacement'
    ],
    knee: [
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-highfield-hospital/knee-replacement',
      'https://www.treatmentconnect.co.uk/hospitals/ramsay-oaklands-hospital/knee-replacement',
      'https://www.treatmentconnect.co.uk/hospitals/circle-the-alexandra-hospital/knee-replacement'
    ]
  },
  london: {
    hip: [
      'https://www.treatmentconnect.co.uk/hospitals/bmi-the-blackheath-hospital/hip-replacement',
      'https://www.treatmentconnect.co.uk/hospitals/bmi-hendon-hospital/hip-replacement'
    ]
  },
  bristol: {
    cataract: [
      'https://www.treatmentconnect.co.uk/hospitals/circle-bath-clinic/cataract-surgery',
      'https://www.treatmentconnect.co.uk/hospitals/practice-plus-shepton-mallet-hospital/cataract-surgery'
    ]
  }
};

// Flatten all URLs for testing
const allTestURLs = [];

Object.entries(newURLs).forEach(([city, procedures]) => {
  Object.entries(procedures).forEach(([procedure, urls]) => {
    urls.forEach(url => {
      allTestURLs.push({
        url,
        city,
        procedure: procedure === 'cataract' ? 'cataract' : procedure === 'hip' ? 'hip' : 'knee'
      });
    });
  });
});

console.log(`\n📋 Testing ${allTestURLs.length} new URLs:\n`);

const results = {
  successful: [],
  failed: [],
  stats: {
    total: allTestURLs.length,
    successful: 0,
    failed: 0
  },
  timestamp: new Date().toISOString()
};

// Test each URL
for (let i = 0; i < allTestURLs.length; i++) {
  const { url, city, procedure } = allTestURLs[i];
  
  console.log(`\n[${i + 1}/${allTestURLs.length}] Testing: ${procedure} in ${city}`);
  console.log(`  URL: ${url.substring(0, 80)}...`);

  const testResult = {
    url,
    city,
    procedure,
    test_number: i + 1,
    timestamp: new Date().toISOString()
  };

  try {
    const extractedData = await extractTreatmentConnectPrices(url, procedure, city);
    
    if (extractedData) {
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
        testResult.extracted_data = extractedData;
        
        results.failed.push(testResult);
        results.stats.failed++;
        
        console.log(`  ❌ Failed: Missing fields: ${missing.join(', ')}`);
      }
    } else {
      testResult.status = 'failed';
      testResult.error = 'No data extracted';
      
      results.failed.push(testResult);
      results.stats.failed++;
      
      console.log(`  ❌ Failed: No data extracted`);
    }
  } catch (error) {
    testResult.status = 'failed';
    testResult.error = error.message;
    testResult.error_stack = error.stack;
    
    results.failed.push(testResult);
    results.stats.failed++;
    
    console.log(`  ❌ Error: ${error.message}`);
  }

  // Rate limiting
  if (i < allTestURLs.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 6000));
  }
}

// Generate report
console.log(`\n${'='.repeat(60)}`);
console.log('📊 Final Statistics');
console.log('='.repeat(60));
console.log(`  Total processed: ${results.stats.processed || results.stats.total}`);
console.log(`  ✅ Successful: ${results.stats.successful}`);
console.log(`  ❌ Failed: ${results.stats.failed}`);
console.log(`  Success rate: ${Math.round((results.stats.successful / results.stats.total) * 100)}%`);

// Save results
const resultsPath = path.join(__dirname, 'test-results-new-urls.json');
fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n💾 Results saved to: ${resultsPath}`);

// Print summary
if (results.successful.length > 0) {
  console.log(`\n✅ Successful extractions (${results.successful.length}):`);
  results.successful.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.hospital_name} - £${item.price} (${item.procedure} in ${item.city})`);
  });
}

if (results.failed.length > 0) {
  console.log(`\n❌ Failed extractions (${results.failed.length}):`);
  results.failed.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.procedure} in ${item.city}: ${item.error}`);
    console.log(`     URL: ${item.url}`);
  });
}

console.log('\n✅ Testing complete!');

