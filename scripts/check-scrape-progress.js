/**
 * Check progress of full scrape
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../public/data');
const logPath = path.join(__dirname, 'full-scrape-output.log');

console.log('📊 Checking scrape progress...\n');

// Check CSV files
const csvFiles = {
  nhs_waits: path.join(dataDir, 'nhs_waits.csv'),
  private_costs: path.join(dataDir, 'private_costs.csv'),
  clinics: path.join(dataDir, 'clinics.csv')
};

Object.entries(csvFiles).forEach(([name, filePath]) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const dataRows = lines.length - 1; // Exclude header
    
    const stats = fs.statSync(filePath);
    const modified = new Date(stats.mtime);
    const ageMinutes = Math.round((Date.now() - modified.getTime()) / 1000 / 60);
    
    console.log(`✅ ${name}.csv:`);
    console.log(`   Rows: ${dataRows}`);
    console.log(`   Last modified: ${modified.toISOString()} (${ageMinutes} minutes ago)`);
    
    if (dataRows > 0) {
      // Show first few rows
      const rows = lines.slice(1, 4);
      console.log(`   Sample rows:`);
      rows.forEach((row, i) => {
        const cols = row.split(',');
        console.log(`     ${i + 1}. ${cols[0]} in ${cols[1] || 'N/A'}`);
      });
    }
    console.log('');
  } else {
    console.log(`⏳ ${name}.csv: Not found yet\n`);
  }
});

// Check log
if (fs.existsSync(logPath)) {
  const logContent = fs.readFileSync(logPath, 'utf-8');
  const lines = logContent.split('\n');
  console.log(`📝 Last 10 lines from log:`);
  lines.slice(-10).forEach(line => {
    if (line.trim()) console.log(`   ${line}`);
  });
} else {
  console.log('⏳ Log file not found yet');
}

