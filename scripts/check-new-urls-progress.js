/**
 * Check progress of new URLs test
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-new-urls.json');
const logPath = path.join(__dirname, 'test-new-urls-output.log');

console.log('📊 Checking new URLs test progress...\n');

if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  const timestamp = new Date(results.timestamp);
  const now = new Date();
  const ageMinutes = Math.round((now - timestamp) / 1000 / 60);
  
  console.log('✅ Test results file found');
  console.log(`   Timestamp: ${timestamp.toISOString()} (${ageMinutes} minutes ago)`);
  console.log(`   Total: ${results.stats.total}`);
  console.log(`   Successful: ${results.stats.successful}`);
  console.log(`   Failed: ${results.stats.failed}`);
  
  if (results.stats.total > 0) {
    const successRate = Math.round((results.stats.successful / results.stats.total) * 100);
    console.log(`   ✅ Success rate: ${successRate}%`);
  }
} else {
  console.log('⏳ Test results file not found yet - test is still running');
}

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

