/**
 * Quick analysis of test failures
 * Can be run while test is still running (if results file exists)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');

if (!fs.existsSync(resultsPath)) {
  console.log('⏳ Test results not available yet. Test is still running...');
  console.log('   Run this script again after test completes.');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

console.log('📊 Quick Failure Analysis\n');
console.log('='.repeat(60));

// Summary
console.log(`\n📈 Summary:`);
console.log(`  Total: ${results.stats.total}`);
console.log(`  Successful: ${results.stats.successful} (${Math.round((results.stats.successful / results.stats.total) * 100)}%)`);
console.log(`  Failed: ${results.stats.failed} (${Math.round((results.stats.failed / results.stats.total) * 100)}%)`);

// Group by error
const errors = {};
results.failed.forEach(f => {
  const err = f.error || 'Unknown';
  errors[err] = (errors[err] || 0) + 1;
});

console.log(`\n❌ Errors breakdown:`);
Object.entries(errors).forEach(([err, count]) => {
  console.log(`  ${err}: ${count}`);
});

// Group by procedure
const byProcedure = {};
results.failed.forEach(f => {
  byProcedure[f.procedure] = (byProcedure[f.procedure] || 0) + 1;
});

console.log(`\n📋 Failed by procedure:`);
Object.entries(byProcedure).forEach(([proc, count]) => {
  console.log(`  ${proc}: ${count}`);
});

// Group by city
const byCity = {};
results.failed.forEach(f => {
  byCity[f.city] = (byCity[f.city] || 0) + 1;
});

console.log(`\n📍 Failed by city:`);
Object.entries(byCity).forEach(([city, count]) => {
  console.log(`  ${city}: ${count}`);
});

// List all failed URLs
console.log(`\n📝 All failed URLs:\n`);
results.failed.forEach((f, i) => {
  console.log(`${i + 1}. [${f.procedure}] in [${f.city}]`);
  console.log(`   URL: ${f.url}`);
  console.log(`   Error: ${f.error}`);
  if (f.raw_data_analysis) {
    console.log(`   Raw: price_gbp=${f.raw_data_analysis.price_gbp_value}, hospital_name="${f.raw_data_analysis.hospital_name_value}"`);
  }
  console.log('');
});

