/**
 * Quick test on sample URLs to get fast failure report
 * Tests 15 URLs (3 per procedure) for quick analysis
 */

import FirecrawlApp from 'firecrawl';
import { getAllTreatmentConnectUrls } from './config/load-urls.js';
import { extractTreatmentConnectPrices } from './scraper.js';
import schemas from './schemas/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-864a2c592f884561aa6887041fafcaf8';

console.log('🧪 Quick Sample Test (15 URLs)');
console.log('='.repeat(60));

// Get sample: 3 URLs per procedure (total 9 URLs)
const allUrls = getAllTreatmentConnectUrls();
const sampleUrls = [];

// Get 3 URLs for each procedure
['cataract', 'hip', 'knee'].forEach(procedure => {
  const procedureUrls = allUrls.filter(u => u.procedure === procedure);
  sampleUrls.push(...procedureUrls.slice(0, 3));
});

console.log(`\n📋 Testing ${sampleUrls.length} sample URLs (3 per procedure)`);

const results = {
  successful: [],
  failed: [],
  stats: { total: sampleUrls.length, successful: 0, failed: 0 }
};

for (let i = 0; i < sampleUrls.length; i++) {
  const { url, city, procedure } = sampleUrls[i];
  
  console.log(`\n[${i + 1}/${sampleUrls.length}] ${procedure} in ${city}`);
  
  const testResult = {
    url,
    city,
    procedure,
    schema: schemas.treatmentConnect.schema,
    prompt: schemas.treatmentConnect.getPrompt(procedure, city)
  };

  try {
    const data = await extractTreatmentConnectPrices(url, procedure, city);
    
    if (data) {
      testResult.status = 'success';
      testResult.data = data;
      results.successful.push(testResult);
      results.stats.successful++;
      console.log(`  ✅ Success: £${data.cost_min}`);
    } else {
      testResult.status = 'failed';
      testResult.error = 'No data extracted';
      
      // Get raw response
      const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
      const raw = await app.scrape(url, {
        formats: [{ type: 'json', schema: testResult.schema, prompt: testResult.prompt }],
        onlyMainContent: false,
        timeout: 30000
      });
      
      testResult.raw_response = raw.json || null;
      results.failed.push(testResult);
      results.stats.failed++;
      console.log(`  ❌ Failed: No data`);
    }
  } catch (error) {
    testResult.status = 'failed';
    testResult.error = error.message;
    results.failed.push(testResult);
    results.stats.failed++;
    console.log(`  ❌ Error: ${error.message}`);
  }
  
  await new Promise(r => setTimeout(r, 6000));
}

// Generate quick report
let report = `# ❌ Быстрый отчет по неуспешным кейсам (Sample Test)

**Дата:** ${new Date().toISOString()}  
**Протестировано:** ${sampleUrls.length} URL (sample)  
**Успешных:** ${results.stats.successful}  
**Неудачных:** ${results.stats.failed}

---

## ❌ Неудачные кейсы

`;

results.failed.forEach((f, i) => {
  report += `### ${i + 1}. ${f.procedure.toUpperCase()} in ${f.city}\n\n`;
  report += `**URL:** \`${f.url}\`\n\n`;
  report += `**Процедура:** ${f.procedure}\n\n`;
  report += `**Город:** ${f.city}\n\n`;
  report += `**Ошибка:** ${f.error}\n\n`;
  report += `**Промпт (первые 300 символов):**\n\`\`\`\n${f.prompt.substring(0, 300)}...\n\`\`\`\n\n`;
  report += `**Ответ от Firecrawl:**\n\`\`\`json\n${JSON.stringify(f.raw_response, null, 2)}\n\`\`\`\n\n`;
  report += `---\n\n`;
});

const reportPath = path.join(__dirname, 'QUICK_FAILURE_REPORT.md');
fs.writeFileSync(reportPath, report, 'utf-8');

console.log(`\n📊 Results: ${results.stats.successful}/${results.stats.total} successful`);
console.log(`💾 Quick report: ${reportPath}`);

