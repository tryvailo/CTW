/**
 * Test script for fallback logic
 * Tests that fallback to CSV works when JSON Mode fails
 */

import { getFallbackData } from './utils.js';

console.log('🧪 Testing Fallback Logic');
console.log('='.repeat(60));

// Test 1: NHS Waits fallback
console.log('\n📋 Test 1: NHS Waits Fallback');
const nhsFallback = getFallbackData('nhs_waits');
console.log(`✅ Loaded ${nhsFallback.length} NHS wait records`);
if (nhsFallback.length > 0) {
  console.log('Sample record:', nhsFallback[0]);
  console.log(`✅ Date format: ${nhsFallback[0].date} (should be YYYY-MM-DD)`);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(nhsFallback[0].date)) {
    console.log('✅ Date format is correct');
  } else {
    console.log('❌ Date format is incorrect');
  }
}

// Test 2: Private Costs fallback
console.log('\n📋 Test 2: Private Costs Fallback');
const costsFallback = getFallbackData('private_costs');
console.log(`✅ Loaded ${costsFallback.length} private cost records`);
if (costsFallback.length > 0) {
  console.log('Sample record:', costsFallback[0]);
  console.log(`✅ Date format: ${costsFallback[0].date} (should be YYYY-MM-DD)`);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(costsFallback[0].date)) {
    console.log('✅ Date format is correct');
  } else {
    console.log('❌ Date format is incorrect');
  }
}

// Test 3: Clinics fallback
console.log('\n📋 Test 3: Clinics Fallback');
const clinicsFallback = getFallbackData('clinics');
console.log(`✅ Loaded ${clinicsFallback.length} clinic records`);
if (clinicsFallback.length > 0) {
  console.log('Sample record:', clinicsFallback[0]);
  console.log(`✅ Date format: ${clinicsFallback[0].last_updated} (should be YYYY-MM-DD)`);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(clinicsFallback[0].last_updated)) {
    console.log('✅ Date format is correct');
  } else {
    console.log('❌ Date format is incorrect');
  }
}

// Test 4: Filtering by procedure and city
console.log('\n📋 Test 4: Filtering Fallback Data');
const filteredNHS = nhsFallback.filter(
  r => r.procedure_id === 'cataract' && r.city === 'London'
);
console.log(`✅ Found ${filteredNHS.length} NHS records for cataract in London`);

const filteredCosts = costsFallback.filter(
  r => r.procedure_id === 'cataract' && r.city === 'London'
);
console.log(`✅ Found ${filteredCosts.length} cost records for cataract in London`);

const filteredClinics = clinicsFallback.filter(
  r => r.procedure_id === 'cataract' && r.city === 'London'
);
console.log(`✅ Found ${filteredClinics.length} clinic records for cataract in London`);

console.log('\n' + '='.repeat(60));
console.log('✅ Fallback Logic Tests Complete');
console.log('='.repeat(60));

