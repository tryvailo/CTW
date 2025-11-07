/**
 * Research script to explore My Planned Care and PHIN website structures
 * Uses Firecrawl API to understand data extraction points
 */

const FirecrawlApp = require('firecrawl').default;
const fs = require('fs');
const path = require('path');

// API Key from user
const FIRECRAWL_API_KEY = 'fc-864a2c592f884561aa6887041fafcaf8';

// Initialize Firecrawl
const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

// Output directory for research results
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'research');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Save research data to file
 */
function saveResearch(name, data) {
  const filePath = path.join(OUTPUT_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Saved: ${filePath}`);
}

/**
 * Explore My Planned Care homepage structure
 */
async function exploreMyPlannedCare() {
  console.log('\n🔍 Exploring My Planned Care...');
  console.log('URL: https://www.myplannedcare.nhs.uk/');
  
  try {
    const result = await app.v1.scrapeUrl('https://www.myplannedcare.nhs.uk/', {
      formats: ['html', 'markdown'],
      timeout: 30000,
    });
    
    // Firecrawl v1 returns data at top level, not in result.data
    const data = result.data || result;
    
    saveResearch('myplannedcare-homepage', {
      url: 'https://www.myplannedcare.nhs.uk/',
      success: result.success,
      markdown: data?.markdown?.substring(0, 5000) || 'N/A',
      htmlLength: data?.html?.length || 0,
      metadata: data?.metadata || {},
      links: data?.links?.slice(0, 30) || [],
    });
    
    console.log('✅ My Planned Care homepage scraped');
    
    // Try to find search or location selection
    if (result.data?.markdown) {
      console.log('\n📄 First 500 chars of markdown:');
      console.log(result.data.markdown.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Error scraping My Planned Care:', error.message);
  }
}

/**
 * Explore PHIN homepage structure
 */
async function explorePHIN() {
  console.log('\n🔍 Exploring PHIN...');
  console.log('URL: https://www.phin.org.uk/');
  
  try {
    const result = await app.v1.scrapeUrl('https://www.phin.org.uk/', {
      formats: ['html', 'markdown'],
      timeout: 30000,
    });
    
    // Firecrawl v1 returns data at top level
    const data = result.data || result;
    
    saveResearch('phin-homepage', {
      url: 'https://www.phin.org.uk/',
      success: result.success,
      markdown: data?.markdown?.substring(0, 5000) || 'N/A',
      htmlLength: data?.html?.length || 0,
      metadata: data?.metadata || {},
      links: data?.links?.slice(0, 30) || [],
    });
    
    if (data?.markdown) {
      console.log('\n📄 First 1000 chars of PHIN markdown:');
      console.log(data.markdown.substring(0, 1000));
    }
    
    console.log('✅ PHIN homepage scraped');
    
    if (result.data?.markdown) {
      console.log('\n📄 First 500 chars of markdown:');
      console.log(result.data.markdown.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Error scraping PHIN:', error.message);
  }
}

/**
 * Try to find specific procedure pages on My Planned Care
 */
async function exploreMyPlannedCareProcedure() {
  console.log('\n🔍 Exploring My Planned Care - Cataract Surgery...');
  
  // Try different possible URLs
  const urls = [
    'https://www.myplannedcare.nhs.uk/',
    'https://www.myplannedcare.nhs.uk/find-my-hospital',
    'https://www.myplannedcare.nhs.uk/search',
  ];
  
  for (const url of urls) {
    try {
      console.log(`\nTrying: ${url}`);
      const result = await app.v1.scrapeUrl(url, {
        formats: ['markdown'],
        timeout: 30000,
      });
      
      if (result.data?.markdown) {
        const filename = url.split('/').pop() || 'root';
        saveResearch(`myplannedcare-${filename}`, {
          url,
          markdown: result.data.markdown.substring(0, 3000),
          links: result.data?.links?.slice(0, 30) || [],
        });
        console.log(`✅ Found content at ${url}`);
      }
    } catch (error) {
      console.log(`⚠️  ${url}: ${error.message}`);
    }
  }
}

/**
 * Try to find PHIN provider finder
 */
async function explorePHINProviderFinder() {
  console.log('\n🔍 Exploring PHIN Provider Finder...');
  
  const urls = [
    'https://www.phin.org.uk/independent-provider-finder/',
    'https://www.phin.org.uk/find-a-provider/',
    'https://www.phin.org.uk/search/',
  ];
  
  for (const url of urls) {
    try {
      console.log(`\nTrying: ${url}`);
      const result = await app.v1.scrapeUrl(url, {
        formats: ['markdown'],
        timeout: 30000,
      });
      
      if (result.data?.markdown) {
        const filename = url.split('/').filter(Boolean).pop() || 'root';
        saveResearch(`phin-${filename}`, {
          url,
          markdown: result.data.markdown.substring(0, 3000),
          links: result.data?.links?.slice(0, 30) || [],
        });
        console.log(`✅ Found content at ${url}`);
      }
    } catch (error) {
      console.log(`⚠️  ${url}: ${error.message}`);
    }
  }
}

/**
 * Main research function
 */
async function main() {
  console.log('🚀 Starting website structure research...');
  console.log('='.repeat(60));
  
  // Explore homepages
  await exploreMyPlannedCare();
  await explorePHIN();
  
  // Explore specific sections
  await exploreMyPlannedCareProcedure();
  await explorePHINProviderFinder();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Research complete!');
  console.log(`📁 Results saved to: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review the JSON files in scripts/research/');
  console.log('2. Identify the correct URLs and data extraction points');
  console.log('3. Create the main scraper.js based on findings');
}

// Run research
main().catch(console.error);

