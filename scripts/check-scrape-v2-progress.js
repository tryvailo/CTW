/**
 * Check progress of v2 scrape (with TreatmentConnect)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logPath = path.join(__dirname, 'full-scrape-v2-output.log');
const dataDir = path.join(__dirname, '../public/data');

console.log('📊 Checking v2 scrape progress (with TreatmentConnect)...\n');

// Check log for TreatmentConnect activity
if (fs.existsSync(logPath)) {
  const logContent = fs.readFileSync(logPath, 'utf-8');
  const lines = logContent.split('\n');
  
  // Count TreatmentConnect successes
  const tcSuccesses = lines.filter(l => l.includes('TreatmentConnect: Found cost data')).length;
  const tcAttempts = lines.filter(l => l.includes('Trying TreatmentConnect')).length;
  const fallbacks = lines.filter(l => l.includes('Using CSV fallback')).length;
  
  console.log(`📈 TreatmentConnect Activity:`);
  console.log(`   Attempts: ${tcAttempts}`);
  console.log(`   Successes: ${tcSuccesses}`);
  console.log(`   Fallbacks: ${fallbacks}`);
  
  // Show recent TreatmentConnect activity
  const recentTC = lines.filter(l => l.includes('TreatmentConnect')).slice(-10);
  if (recentTC.length > 0) {
    console.log(`\n📝 Recent TreatmentConnect activity:`);
    recentTC.forEach(line => {
      if (line.trim()) console.log(`   ${line.trim()}`);
    });
  }
  
  // Check if scrape is complete
  if (lines.some(l => l.includes('Scraping complete!'))) {
    console.log(`\n✅ Scrape complete!`);
    
    // Check CSV files
    const csvFiles = {
      nhs_waits: path.join(dataDir, 'nhs_waits.csv'),
      private_costs: path.join(dataDir, 'private_costs.csv'),
      clinics: path.join(dataDir, 'clinics.csv')
    };
    
    console.log(`\n📊 CSV Files:`);
    Object.entries(csvFiles).forEach(([name, filePath]) => {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());
        const dataRows = lines.length - 1;
        
        // Check for TreatmentConnect source
        const tcRows = lines.filter(l => l.includes('TreatmentConnect')).length;
        
        const stats = fs.statSync(filePath);
        const modified = new Date(stats.mtime);
        const ageMinutes = Math.round((Date.now() - modified.getTime()) / 1000 / 60);
        
        console.log(`   ${name}.csv: ${dataRows} rows, ${tcRows} from TreatmentConnect, updated ${ageMinutes}m ago`);
      }
    });
  } else {
    console.log(`\n⏳ Scrape still running...`);
    console.log(`\n📝 Last 5 lines:`);
    lines.slice(-5).forEach(line => {
      if (line.trim()) console.log(`   ${line.trim()}`);
    });
  }
} else {
  console.log('⏳ Log file not found yet');
}

