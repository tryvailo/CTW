/**
 * Check progress of v2.0 test
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');
const logPath = path.join(__dirname, 'test-v2-output.log');

console.log('📊 Checking v2.0 test progress...\n');

// Check if results file exists
if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const timestamp = new Date(results.timestamp);
  const now = new Date();
  const ageMinutes = Math.round((now - timestamp) / 1000 / 60);
  
  console.log('✅ Test results file found');
  console.log(`   Timestamp: ${timestamp.toISOString()} (${ageMinutes} minutes ago)`);
  console.log(`   Processed: ${results.stats.processed}/${results.stats.total}`);
  console.log(`   Successful: ${results.stats.successful}`);
  console.log(`   Failed: ${results.stats.failed}`);
  
  if (results.stats.processed === results.stats.total) {
    const successRate = Math.round((results.stats.successful / results.stats.total) * 100);
    console.log(`   ✅ Test complete! Success rate: ${successRate}%`);
    
    // Compare with v1.0
    console.log(`\n📊 Comparison with v1.0:`);
    console.log(`   v1.0: 33/49 (67%)`);
    console.log(`   v2.0: ${results.stats.successful}/${results.stats.total} (${successRate}%)`);
    console.log(`   Improvement: +${successRate - 67}%`);
  } else {
    console.log(`   Progress: ${Math.round((results.stats.processed / results.stats.total) * 100)}%`);
  }
} else {
  console.log('⏳ Test results file not found yet - test is still running');
}

// Check log file
if (fs.existsSync(logPath)) {
  const logContent = fs.readFileSync(logPath, 'utf-8');
  const lines = logContent.split('\n');
  console.log(`\n📝 Last 5 lines from log:`);
  lines.slice(-5).forEach(line => {
    if (line.trim()) console.log(`   ${line}`);
  });
} else {
  console.log('\n⏳ Log file not found yet');
}

