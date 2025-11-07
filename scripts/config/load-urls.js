/**
 * Load TreatmentConnect URLs from external JSON configuration
 * All URLs are stored in config/treatmentconnect-urls.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load URLs from JSON configuration file
 * @returns {Object} URLs organized by city and procedure
 */
export function loadTreatmentConnectUrls() {
  const configPath = path.join(__dirname, 'treatmentconnect-urls.json');
  
  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    const urls = JSON.parse(data);
    return urls;
  } catch (error) {
    console.error(`❌ Error loading TreatmentConnect URLs: ${error.message}`);
    return {};
  }
}

/**
 * Get all URLs as flat array with metadata
 * @returns {Array} Array of {url, city, procedure} objects
 */
export function getAllTreatmentConnectUrls() {
  const urls = loadTreatmentConnectUrls();
  const flatUrls = [];
  
  for (const [city, procedures] of Object.entries(urls)) {
    for (const [procedure, urlList] of Object.entries(procedures)) {
      for (const url of urlList) {
        flatUrls.push({
          url,
          city: city.charAt(0).toUpperCase() + city.slice(1), // Capitalize first letter
          procedure
        });
      }
    }
  }
  
  return flatUrls;
}

/**
 * Get URLs for specific city and procedure
 * @param {string} city - City name (lowercase)
 * @param {string} procedure - Procedure ID (cataract, hip, knee)
 * @returns {Array} Array of URLs
 */
export function getTreatmentConnectUrls(city, procedure) {
  const urls = loadTreatmentConnectUrls();
  const cityKey = city.toLowerCase();
  const procedureKey = procedure.toLowerCase();
  
  if (urls[cityKey] && urls[cityKey][procedureKey]) {
    return urls[cityKey][procedureKey];
  }
  
  return [];
}

/**
 * Get statistics about available URLs
 * @returns {Object} Statistics
 */
export function getUrlStatistics() {
  const urls = loadTreatmentConnectUrls();
  const stats = {
    total_urls: 0,
    by_city: {},
    by_procedure: {
      cataract: 0,
      hip: 0,
      knee: 0
    }
  };
  
  for (const [city, procedures] of Object.entries(urls)) {
    let cityCount = 0;
    for (const [procedure, urlList] of Object.entries(procedures)) {
      const count = urlList.length;
      cityCount += count;
      stats.total_urls += count;
      stats.by_procedure[procedure] = (stats.by_procedure[procedure] || 0) + count;
    }
    stats.by_city[city] = cityCount;
  }
  
  return stats;
}

export default {
  loadTreatmentConnectUrls,
  getAllTreatmentConnectUrls,
  getTreatmentConnectUrls,
  getUrlStatistics
};

