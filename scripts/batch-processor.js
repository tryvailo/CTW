/**
 * Batch Processor for TreatmentConnect URLs
 * Handles processing multiple URLs with rate limiting and error handling
 * All configuration is external (from config files)
 */

import { getAllTreatmentConnectUrls, getUrlStatistics } from './config/load-urls.js';
import treatmentConnectConfig from './config/treatmentconnect-config.js';
import config from './config.js';

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process URLs in batches with rate limiting
 * @param {Function} processUrl - Function to process each URL (url, city, procedure) => Promise<result>
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Results with statistics
 */
export async function processBatch(processUrl, options = {}) {
  const {
    batchSize = 5, // Process 5 URLs at a time
    delayBetweenBatches = 10000, // 10 seconds between batches
    delayBetweenUrls = config.scraping.rate_limit_delay, // 6 seconds between URLs
    maxRetries = 2,
    onProgress = null // Callback for progress updates
  } = options;

  // Get all URLs from configuration
  const allUrls = getAllTreatmentConnectUrls();
  const stats = getUrlStatistics();
  
  console.log(`\n📊 Batch Processing Statistics:`);
  console.log(`  Total URLs: ${stats.total_urls}`);
  console.log(`  Batch size: ${batchSize}`);
  console.log(`  Estimated batches: ${Math.ceil(stats.total_urls / batchSize)}`);
  console.log(`  Delay between URLs: ${delayBetweenUrls}ms`);
  console.log(`  Delay between batches: ${delayBetweenBatches}ms`);

  const results = {
    successful: [],
    failed: [],
    skipped: [],
    stats: {
      total: allUrls.length,
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0
    }
  };

  // Split into batches
  const batches = [];
  for (let i = 0; i < allUrls.length; i += batchSize) {
    batches.push(allUrls.slice(i, i + batchSize));
  }

  console.log(`\n🚀 Starting batch processing (${batches.length} batches)...\n`);

  // Process each batch
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Batch ${batchIndex + 1}/${batches.length} (${batch.length} URLs)`);
    console.log('='.repeat(60));

    // Process URLs in batch sequentially (to respect rate limits)
    for (let urlIndex = 0; urlIndex < batch.length; urlIndex++) {
      const urlData = batch[urlIndex];
      const { url, city, procedure } = urlData;
      
      console.log(`\n[${urlIndex + 1}/${batch.length}] Processing: ${procedure} in ${city}`);
      console.log(`  URL: ${url.substring(0, 80)}...`);

      let attempt = 0;
      let success = false;

      // Retry logic
      while (attempt < maxRetries && !success) {
        attempt++;
        
        try {
          const result = await processUrl(url, city, procedure);
          
          if (result) {
            results.successful.push({
              ...urlData,
              result,
              attempt
            });
            results.stats.successful++;
            success = true;
            console.log(`  ✅ Success (attempt ${attempt})`);
          } else {
            if (attempt === maxRetries) {
              results.skipped.push({
                ...urlData,
                reason: 'No data extracted',
                attempt
              });
              results.stats.skipped++;
              console.log(`  ⚠️  Skipped: No data extracted`);
            } else {
              console.log(`  ⚠️  Attempt ${attempt} returned no data, retrying...`);
            }
          }
        } catch (error) {
          if (attempt === maxRetries) {
            results.failed.push({
              ...urlData,
              error: error.message,
              attempt
            });
            results.stats.failed++;
            console.log(`  ❌ Failed after ${attempt} attempts: ${error.message}`);
          } else {
            console.log(`  ⚠️  Attempt ${attempt} failed: ${error.message}, retrying...`);
            await sleep(2000 * attempt); // Exponential backoff
          }
        }
      }

      results.stats.processed++;

      // Progress callback
      if (onProgress) {
        onProgress({
          processed: results.stats.processed,
          total: results.stats.total,
          successful: results.stats.successful,
          failed: results.stats.failed,
          skipped: results.stats.skipped,
          percentage: Math.round((results.stats.processed / results.stats.total) * 100)
        });
      }

      // Rate limiting between URLs (except last URL in batch)
      if (urlIndex < batch.length - 1) {
        await sleep(delayBetweenUrls);
      }
    }

    // Delay between batches (except last batch)
    if (batchIndex < batches.length - 1) {
      console.log(`\n⏳ Waiting ${delayBetweenBatches}ms before next batch...`);
      await sleep(delayBetweenBatches);
    }
  }

  // Final statistics
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Batch Processing Complete`);
  console.log('='.repeat(60));
  console.log(`  Total processed: ${results.stats.processed}`);
  console.log(`  ✅ Successful: ${results.stats.successful}`);
  console.log(`  ❌ Failed: ${results.stats.failed}`);
  console.log(`  ⚠️  Skipped: ${results.stats.skipped}`);
  console.log(`  Success rate: ${Math.round((results.stats.successful / results.stats.processed) * 100)}%`);

  return results;
}

/**
 * Process URLs for specific city and procedure
 * @param {Function} processUrl - Function to process each URL
 * @param {string} city - City name
 * @param {string} procedure - Procedure ID
 * @param {Object} options - Processing options
 * @returns {Promise<Array>} Array of results
 */
export async function processCityProcedure(processUrl, city, procedure, options = {}) {
  const { getTreatmentConnectUrls } = await import('./config/load-urls.js');
  const urls = getTreatmentConnectUrls(city.toLowerCase(), procedure);
  
  if (urls.length === 0) {
    console.log(`⚠️  No URLs found for ${procedure} in ${city}`);
    return [];
  }

  console.log(`\n📋 Processing ${urls.length} URLs for ${procedure} in ${city}`);

  const results = [];
  const delayBetweenUrls = options.delayBetweenUrls || config.scraping.rate_limit_delay;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n[${i + 1}/${urls.length}] ${url}`);

    try {
      const result = await processUrl(url, city, procedure);
      if (result) {
        results.push(result);
        console.log(`  ✅ Success`);
      } else {
        console.log(`  ⚠️  No data extracted`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }

    // Rate limiting
    if (i < urls.length - 1) {
      await sleep(delayBetweenUrls);
    }
  }

  return results;
}

export default {
  processBatch,
  processCityProcedure
};
