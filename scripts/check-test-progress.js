/**
 * Quick script to check test progress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');
const logPath = path.join(__dirname, 'test-output.log');

console.log('📊 Checking test progress...\n');

// Check if results file exists
if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  console.log('✅ Test results file found');
  console.log(`   Processed: ${results.stats.processed}/${results.stats.total}`);
  console.log(`   Successful: ${results.stats.successful}`);
  console.log(`   Failed: ${results.stats.failed}`);
  console.log(`   Progress: ${Math.round((results.stats.processed / results.stats.total) * 100)}%`);
} else {
  console.log('⏳ Test results file not found yet - test is still running');
}

// Check log file
if (fs.existsSync(logPath)) {
  const logContent = fs.readFileSync(logPath, 'utf-8');
  const lines = logContent.split('\n');
  console.log(`\n📝 Last 10 lines from log:`);
  lines.slice(-10).forEach(line => console.log(`   ${line}`));
} else {
  console.log('\n⏳ Log file not found yet');
}

