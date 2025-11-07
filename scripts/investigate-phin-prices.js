/**
 * Investigation script to understand PHIN price extraction
 * Tests different URLs and approaches to get procedure prices
 */

import FirecrawlApp from 'firecrawl';
import config from './config.js';

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

console.log('🔍 Investigating PHIN Price Extraction');
console.log('='.repeat(60));

// Test URLs to investigate
const testUrls = [
  'https://www.phin.org.uk/',
  'https://www.phin.org.uk/independent-provider-finder/',
  'https://www.phin.org.uk/find-a-provider/',
  'https://www.phin.org.uk/search/',
];

// Test with procedure and city
const testProcedure = 'cataract';
const testCity = 'London';

/**
 * Test scraping a URL and see what we get
 */
async function testUrl(url, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 Testing: ${description}`);
  console.log(`URL: ${url}`);
  console.log('='.repeat(60));

  try {
    // Test 1: Basic scrape
    console.log('\n1️⃣ Basic scrape (HTML + Markdown)...');
    const result1 = await app.v1.scrapeUrl(url, {
      formats: ['html', 'markdown'],
      timeout: 30000,
    });

    const data1 = result1.data || result1;
    console.log(`✅ Success: ${result1.success}`);
    console.log(`📄 Markdown length: ${data1?.markdown?.length || 0}`);
    console.log(`📄 HTML length: ${data1?.html?.length || 0}`);
    
    if (data1?.markdown) {
      const preview = data1.markdown.substring(0, 500);
      console.log(`\n📝 Markdown preview (first 500 chars):`);
      console.log(preview);
      
      // Check for price-related keywords
      const priceKeywords = ['£', 'price', 'cost', 'GBP', 'pound', 'cataract', 'hip', 'knee'];
      const foundKeywords = priceKeywords.filter(kw => 
        preview.toLowerCase().includes(kw.toLowerCase())
      );
      console.log(`\n💰 Price-related keywords found: ${foundKeywords.join(', ') || 'None'}`);
    }

    // Test 2: JSON Mode with our schema
    console.log('\n2️⃣ JSON Mode extraction...');
    const schemas = await import('./schemas/index.js');
    const schema = schemas.default.privateCosts.schema;
    const prompt = schemas.default.privateCosts.getPrompt(testProcedure, testCity);
    
    try {
      const result2 = await app.scrape(url, {
        formats: [{
          type: 'json',
          schema: schema,
          prompt: prompt
        }],
        onlyMainContent: false,
        timeout: 30000
      });

      if (result2 && result2.json) {
        console.log('✅ JSON Mode returned data:');
        console.log(JSON.stringify(result2.json, null, 2));
      } else {
        console.log('⚠️  JSON Mode returned no data');
        if (result2) {
          console.log('Result keys:', Object.keys(result2));
        }
      }
    } catch (jsonError) {
      console.log(`❌ JSON Mode error: ${jsonError.message}`);
    }

    // Test 3: Check for links that might lead to prices
    if (data1?.links) {
      console.log('\n3️⃣ Links found on page:');
      const relevantLinks = data1.links
        .filter(link => 
          link.includes('provider') || 
          link.includes('search') || 
          link.includes('procedure') ||
          link.includes('cost') ||
          link.includes('price')
        )
        .slice(0, 10);
      
      if (relevantLinks.length > 0) {
        console.log('Relevant links:');
        relevantLinks.forEach(link => console.log(`  - ${link}`));
      } else {
        console.log('No relevant links found');
      }
    }

    return { success: true, data: data1 };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test search URL patterns
 */
async function testSearchPatterns() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🔍 Testing Search URL Patterns');
  console.log('='.repeat(60));

  // Common search URL patterns
  const searchPatterns = [
    `https://www.phin.org.uk/search?procedure=${testProcedure}&location=${testCity}`,
    `https://www.phin.org.uk/search?q=${testProcedure}+${testCity}`,
    `https://www.phin.org.uk/providers?procedure=${testProcedure}&city=${testCity}`,
    `https://www.phin.org.uk/independent-provider-finder/?procedure=${testProcedure}&location=${testCity}`,
  ];

  for (const pattern of searchPatterns) {
    console.log(`\n📋 Testing pattern: ${pattern}`);
    try {
      const result = await app.v1.scrapeUrl(pattern, {
        formats: ['html', 'markdown'],
        timeout: 30000,
      });
      
      const data = result.data || result;
      if (data?.markdown) {
        const hasPrices = data.markdown.includes('£') || data.markdown.toLowerCase().includes('price');
        console.log(`  ${hasPrices ? '✅' : '❌'} Contains prices: ${hasPrices}`);
        if (hasPrices) {
          const priceMatch = data.markdown.match(/£[\d,]+/g);
          if (priceMatch) {
            console.log(`  💰 Found prices: ${priceMatch.slice(0, 5).join(', ')}`);
          }
        }
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

/**
 * Main investigation
 */
async function main() {
  console.log(`\nProcedure: ${testProcedure}`);
  console.log(`City: ${testCity}`);
  console.log(`\nTesting ${testUrls.length} URLs...`);

  // Test each URL
  for (const url of testUrls) {
    await testUrl(url, `PHIN URL: ${url}`);
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 6000));
  }

  // Test search patterns
  await testSearchPatterns();

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Investigation Complete');
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

