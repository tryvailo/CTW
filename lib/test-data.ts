/**
 * Test script to verify data loading functions
 * Run with: npx ts-node lib/test-data.ts
 */

import {
  loadProcedures,
  loadCities,
  loadNHSWaits,
  loadPrivateCosts,
  loadClinics,
  getComparisonData,
  getAllComparisonCombinations,
} from './data';

console.log('🧪 Testing data loading functions...\n');

// Test 1: Load procedures
console.log('📋 Test 1: Loading procedures');
const procedures = loadProcedures();
console.log(`✅ Loaded ${procedures.length} procedures`);
procedures.forEach(p => {
  console.log(`   - ${p.procedure_id}: ${p.name}`);
});
console.log('');

// Test 2: Load cities
console.log('🏙️  Test 2: Loading cities');
const cities = loadCities();
console.log(`✅ Loaded ${cities.length} cities`);
cities.forEach(c => {
  console.log(`   - ${c.city} (slug: ${c.slug})`);
});
console.log('');

// Test 3: Load NHS waits
console.log('⏱️  Test 3: Loading NHS waits');
const nhsWaits = loadNHSWaits();
console.log(`✅ Loaded ${nhsWaits.length} NHS wait records`);
if (nhsWaits.length > 0) {
  console.log(`   Sample: ${nhsWaits[0].procedure_id} in ${nhsWaits[0].city}: ${nhsWaits[0].avg_wait_weeks} weeks`);
}
console.log('');

// Test 4: Load private costs
console.log('💰 Test 4: Loading private costs');
const privateCosts = loadPrivateCosts();
console.log(`✅ Loaded ${privateCosts.length} private cost records`);
if (privateCosts.length > 0) {
  console.log(`   Sample: ${privateCosts[0].procedure_id} in ${privateCosts[0].city}: £${privateCosts[0].cost_min}-£${privateCosts[0].cost_max}`);
}
console.log('');

// Test 5: Load clinics
console.log('🏥 Test 5: Loading clinics');
const clinics = loadClinics();
console.log(`✅ Loaded ${clinics.length} clinic records`);
if (clinics.length > 0) {
  console.log(`   Sample: ${clinics[0].name} - ${clinics[0].procedure_id} in ${clinics[0].city}: £${clinics[0].price}`);
}
console.log('');

// Test 6: Get comparison data
console.log('🔍 Test 6: Getting comparison data');
const comparisonData = getComparisonData('cataract', 'London');
console.log(`✅ Comparison data for cataract in London:`);
console.log(`   Procedure: ${comparisonData.procedure.name}`);
console.log(`   NHS Wait: ${comparisonData.nhsWait?.avg_wait_weeks || 'N/A'} weeks`);
console.log(`   Private Cost: £${comparisonData.privateCost?.cost_min || 'N/A'}-£${comparisonData.privateCost?.cost_max || 'N/A'}`);
console.log(`   Clinics: ${comparisonData.clinics.length} found`);
console.log('');

// Test 7: Get all combinations
console.log('📊 Test 7: Getting all comparison combinations');
const combinations = getAllComparisonCombinations();
console.log(`✅ Found ${combinations.length} procedure-city combinations`);
console.log(`   Sample combinations:`);
combinations.slice(0, 5).forEach(combo => {
  console.log(`   - ${combo.procedureId} in ${combo.city}`);
});
console.log('');

console.log('✅ All tests completed!');

