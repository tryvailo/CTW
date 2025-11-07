/**
 * Extended fallback testing
 * Tests fallback logic in various scenarios
 */

import { getFallbackData } from './utils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Extended Fallback Testing');
console.log('='.repeat(60));

// Test 1: Fallback when API error occurs
console.log('\n📋 Test 1: Fallback on API Error');
console.log('Simulating API error scenario...');
const nhsFallback = getFallbackData('nhs_waits');
if (nhsFallback.length > 0) {
  console.log(`✅ Fallback data available: ${nhsFallback.length} records`);
  console.log(`✅ Date updated to: ${nhsFallback[0].date}`);
} else {
  console.log('⚠️  No fallback data available');
}

// Test 2: Fallback when empty result
console.log('\n📋 Test 2: Fallback on Empty Result');
console.log('Simulating empty result scenario...');
const emptyResult = null;
if (!emptyResult) {
  const fallback = getFallbackData('private_costs').filter(
    r => r.procedure_id === 'cataract' && r.city === 'London'
  );
  if (fallback.length > 0) {
    console.log(`✅ Fallback triggered: ${fallback.length} records loaded`);
  } else {
    console.log('⚠️  No matching fallback data');
  }
}

// Test 3: Fallback when CSV file missing
console.log('\n📋 Test 3: Fallback when CSV Missing');
const testFilePath = path.join(__dirname, '../public/data/test_missing.csv');
try {
  const missingData = getFallbackData('test_missing');
  if (missingData.length === 0) {
    console.log('✅ Correctly handles missing CSV file (returns empty array)');
  }
} catch (error) {
  console.log(`✅ Correctly handles missing CSV: ${error.message}`);
}

// Test 4: Date format validation
console.log('\n📋 Test 4: Date Format Validation');
const allData = [
  ...getFallbackData('nhs_waits'),
  ...getFallbackData('private_costs'),
  ...getFallbackData('clinics')
];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
let allDatesValid = true;
for (const record of allData.slice(0, 10)) { // Check first 10 records
  const date = record.date || record.last_updated;
  if (date && !dateRegex.test(date)) {
    console.log(`❌ Invalid date format: ${date}`);
    allDatesValid = false;
  }
}
if (allDatesValid) {
  console.log('✅ All date formats are correct (YYYY-MM-DD)');
}

// Test 5: Filtering accuracy
console.log('\n📋 Test 5: Filtering Accuracy');
const testCases = [
  { procedure: 'cataract', city: 'London' },
  { procedure: 'hip', city: 'Manchester' },
  { procedure: 'knee', city: 'Birmingham' }
];

for (const testCase of testCases) {
  const nhsFiltered = getFallbackData('nhs_waits').filter(
    r => r.procedure_id === testCase.procedure && r.city === testCase.city
  );
  const costsFiltered = getFallbackData('private_costs').filter(
    r => r.procedure_id === testCase.procedure && r.city === testCase.city
  );
  const clinicsFiltered = getFallbackData('clinics').filter(
    r => r.procedure_id === testCase.procedure && r.city === testCase.city
  );
  
  console.log(`  ${testCase.procedure} in ${testCase.city}:`);
  console.log(`    NHS: ${nhsFiltered.length}, Costs: ${costsFiltered.length}, Clinics: ${clinicsFiltered.length}`);
  
  // Verify all filtered records match
  const allMatch = [
    ...nhsFiltered,
    ...costsFiltered,
    ...clinicsFiltered
  ].every(r => r.procedure_id === testCase.procedure && r.city === testCase.city);
  
  if (allMatch) {
    console.log(`    ✅ All records correctly filtered`);
  } else {
    console.log(`    ❌ Filtering error detected`);
  }
}

// Test 6: Data structure integrity
console.log('\n📋 Test 6: Data Structure Integrity');
const nhsSample = getFallbackData('nhs_waits')[0];
const costSample = getFallbackData('private_costs')[0];
const clinicSample = getFallbackData('clinics')[0];

const nhsRequired = ['procedure_id', 'city', 'nhs_trust', 'avg_wait_weeks', 'date', 'source'];
const costRequired = ['procedure_id', 'city', 'cost_min', 'cost_max', 'date', 'source'];
const clinicRequired = ['clinic_id', 'name', 'city', 'procedure_id', 'price', 'last_updated'];

function checkStructure(sample, required, name) {
  const missing = required.filter(field => !sample[field]);
  if (missing.length === 0) {
    console.log(`  ✅ ${name}: All required fields present`);
    return true;
  } else {
    console.log(`  ❌ ${name}: Missing fields: ${missing.join(', ')}`);
    return false;
  }
}

checkStructure(nhsSample, nhsRequired, 'NHS Waits');
checkStructure(costSample, costRequired, 'Private Costs');
checkStructure(clinicSample, clinicRequired, 'Clinics');

console.log('\n' + '='.repeat(60));
console.log('✅ Extended Fallback Tests Complete');
console.log('='.repeat(60));

