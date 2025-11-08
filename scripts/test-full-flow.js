/**
 * Test full flow for 2 clinics with minimal data
 * Tests complete two-stage parsing (procedure page + main hospital page)
 */

import FirecrawlApp from 'firecrawl';
import { extractTreatmentConnectPrices, extractHospitalDetails, getMainHospitalUrl } from './scraper.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// Test clinics - выбираем клиники с минимальными данными из базы
const testClinics = [
  {
    name: 'Premier Eye Clinic',
    city: 'London',
    procedure: 'cataract',
    url: 'https://www.treatmentconnect.co.uk/hospitals/spire-london-east-hospital/cataract-surgery'
  },
  {
    name: 'Joint Care Hospital',
    city: 'Manchester',
    procedure: 'hip',
    url: 'https://www.treatmentconnect.co.uk/hospitals/spire-manchester-hospital/hip-replacement'
  }
];

async function testFullFlow() {
  console.log('🧪 Testing Full Flow for 2 Clinics with Minimal Data');
  console.log('='.repeat(80));
  
  const results = [];
  
  for (const clinic of testClinics) {
    console.log(`\n📋 Testing: ${clinic.name} (${clinic.procedure} in ${clinic.city})`);
    console.log(`   URL: ${clinic.url}`);
    console.log('-'.repeat(80));
    
    try {
      // Stage 1: Parse procedure page (price)
      console.log('\n🔍 Stage 1: Parsing procedure page for price...');
      const costData = await extractTreatmentConnectPrices(clinic.url, clinic.procedure, clinic.city);
      
      if (!costData) {
        console.log('❌ Stage 1 failed: No data extracted');
        results.push({
          clinic: clinic.name,
          success: false,
          error: 'Stage 1 failed: No data extracted'
        });
        continue;
      }
      
      console.log('✅ Stage 1 Success:');
      console.log(`   Hospital Name: ${costData.hospital_name || 'N/A'}`);
      console.log(`   Price: £${costData.cost_min || costData.cost_max || 'N/A'}`);
      console.log(`   URL (from procedure page): ${costData.url || 'N/A'}`);
      console.log(`   Phone (from procedure page): ${costData.phone || 'N/A'}`);
      console.log(`   Address (from procedure page): ${costData.address || 'N/A'}`);
      
      // Stage 2: Parse main hospital page (details)
      console.log('\n🔍 Stage 2: Parsing main hospital page for details...');
      const mainHospitalUrl = getMainHospitalUrl(clinic.url);
      
      if (!mainHospitalUrl) {
        console.log('⚠️  Could not determine main hospital URL, skipping Stage 2');
        results.push({
          clinic: clinic.name,
          success: true,
          stage1: costData,
          stage2: null,
          merged: costData
        });
        continue;
      }
      
      console.log(`   Main Hospital URL: ${mainHospitalUrl}`);
      const hospitalDetails = await extractHospitalDetails(mainHospitalUrl, clinic.city);
      
      if (!hospitalDetails) {
        console.log('⚠️  Stage 2 failed: No details extracted');
        results.push({
          clinic: clinic.name,
          success: true,
          stage1: costData,
          stage2: null,
          merged: costData
        });
        continue;
      }
      
      console.log('✅ Stage 2 Success:');
      console.log(`   Hospital Name: ${hospitalDetails.hospital_name || 'N/A'}`);
      console.log(`   Website URL: ${hospitalDetails.website_url || 'N/A'}`);
      console.log(`   Phone: ${hospitalDetails.phone_number || 'N/A'}`);
      console.log(`   Address: ${hospitalDetails.address || 'N/A'}`);
      console.log(`   Rating: ${hospitalDetails.rating_stars || 'N/A'}/5.0 (${hospitalDetails.rating_count || 0} reviews)`);
      console.log(`   CQC Rating: ${hospitalDetails.cqc_rating || 'N/A'}`);
      console.log(`   Hospital Group: ${hospitalDetails.hospital_group || 'N/A'}`);
      
      // Merge data
      const mergedData = {
        clinic_id: `${costData.hospital_name?.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${clinic.city.toLowerCase()}_${clinic.procedure}`,
        name: costData.hospital_name,
        city: clinic.city,
        procedure_id: clinic.procedure,
        price: Math.round(costData.cost_min || costData.cost_max || 0),
        url: hospitalDetails.website_url || costData.url || '',
        phone: hospitalDetails.phone_number || costData.phone || '',
        address: hospitalDetails.address || costData.address || '',
        rating_stars: hospitalDetails.rating_stars || costData.rating || null,
        rating_count: hospitalDetails.rating_count || null,
        cqc_rating: hospitalDetails.cqc_rating || null,
        hospital_group: hospitalDetails.hospital_group || null,
        last_updated: new Date().toISOString().split('T')[0],
        details_last_updated: new Date().toISOString().split('T')[0]
      };
      
      console.log('\n✅ Merged Data (Final Result):');
      console.log(JSON.stringify(mergedData, null, 2));
      
      results.push({
        clinic: clinic.name,
        success: true,
        stage1: costData,
        stage2: hospitalDetails,
        merged: mergedData
      });
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      results.push({
        clinic: clinic.name,
        success: false,
        error: error.message
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.clinic}:`);
    if (result.success) {
      console.log('   ✅ Success');
      console.log(`   - Price: £${result.merged.price}`);
      console.log(`   - URL: ${result.merged.url || 'Not available'}`);
      console.log(`   - Phone: ${result.merged.phone || 'Not available'}`);
      console.log(`   - Address: ${result.merged.address || 'Not available'}`);
      console.log(`   - Rating: ${result.merged.rating_stars || 'N/A'}/5.0`);
      console.log(`   - CQC: ${result.merged.cqc_rating || 'N/A'}`);
      console.log(`   - Group: ${result.merged.hospital_group || 'N/A'}`);
    } else {
      console.log(`   ❌ Failed: ${result.error}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Successfully processed: ${successCount}/${results.length} clinics`);
}

// Run test
testFullFlow().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

