/**
 * Generate human-readable failure report from test results
 * Reads test-results-all-treatmentconnect.json and creates markdown report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');
const reportPath = path.join(__dirname, 'FAILED_CASES_DETAILED_REPORT.md');

// Check if results file exists
if (!fs.existsSync(resultsPath)) {
  console.log('❌ Test results file not found. Please run test-all-treatmentconnect.js first.');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

console.log('📊 Generating failure report...');

// Group failures by error type
const failuresByError = {};
const failuresByProcedure = {};
const failuresByCity = {};

results.failed.forEach(failure => {
  // Group by error type
  const errorType = failure.error || 'Unknown error';
  if (!failuresByError[errorType]) {
    failuresByError[errorType] = [];
  }
  failuresByError[errorType].push(failure);
  
  // Group by procedure
  if (!failuresByProcedure[failure.procedure]) {
    failuresByProcedure[failure.procedure] = [];
  }
  failuresByProcedure[failure.procedure].push(failure);
  
  // Group by city
  if (!failuresByCity[failure.city]) {
    failuresByCity[failure.city] = [];
  }
  failuresByCity[failure.city].push(failure);
});

// Generate markdown report
let report = `# ❌ Отчет по неуспешным кейсам TreatmentConnect

**Дата генерации:** ${new Date().toISOString()}  
**Источник данных:** test-results-all-treatmentconnect.json

---

## 📊 Общая статистика

- **Всего тестов:** ${results.stats.total}
- **✅ Успешных:** ${results.stats.successful}
- **❌ Неудачных:** ${results.stats.failed}
- **Success rate:** ${Math.round((results.stats.successful / results.stats.total) * 100)}%

---

## 🔍 Анализ неудач по типам ошибок

`;

// Error types analysis
Object.entries(failuresByError).forEach(([errorType, failures]) => {
  report += `### ${errorType}\n\n`;
  report += `**Количество:** ${failures.length}\n\n`;
  report += `**Примеры URL:**\n\n`;
  
  failures.slice(0, 5).forEach((failure, i) => {
    report += `${i + 1}. [${failure.procedure}] in [${failure.city}]\n`;
    report += `   - URL: ${failure.url}\n`;
    if (failure.missing_fields) {
      report += `   - Missing fields: ${failure.missing_fields.join(', ')}\n`;
    }
    if (failure.raw_data_analysis) {
      report += `   - Raw data: price_gbp=${failure.raw_data_analysis.price_gbp_value}, hospital_name="${failure.raw_data_analysis.hospital_name_value}"\n`;
    }
    report += `\n`;
  });
  
  if (failures.length > 5) {
    report += `... и еще ${failures.length - 5} случаев\n\n`;
  }
  
  report += `---\n\n`;
});

// Analysis by procedure
report += `## 📋 Анализ по процедурам\n\n`;

Object.entries(failuresByProcedure).forEach(([procedure, failures]) => {
  report += `### ${procedure.toUpperCase()}\n\n`;
  report += `**Неудачных тестов:** ${failures.length}\n\n`;
  report += `**URL которые не работают:**\n\n`;
  
  failures.forEach((failure, i) => {
    report += `${i + 1}. ${failure.url}\n`;
    report += `   - City: ${failure.city}\n`;
    report += `   - Error: ${failure.error}\n`;
    if (failure.raw_data_analysis) {
      report += `   - Raw response: ${JSON.stringify(failure.raw_data_analysis.all_values, null, 2).substring(0, 200)}...\n`;
    }
    report += `\n`;
  });
  
  report += `---\n\n`;
});

// Analysis by city
report += `## 📍 Анализ по городам\n\n`;

Object.entries(failuresByCity).forEach(([city, failures]) => {
  report += `### ${city}\n\n`;
  report += `**Неудачных тестов:** ${failures.length}\n\n`;
  
  failures.forEach((failure, i) => {
    report += `${i + 1}. [${failure.procedure}] - ${failure.url}\n`;
    report += `   - Error: ${failure.error}\n\n`;
  });
  
  report += `---\n\n`;
});

// Detailed list of all failures
report += `## 📝 Детальный список всех неудачных кейсов\n\n`;

results.failed.forEach((failure, i) => {
  report += `### Кейс ${i + 1}: ${failure.procedure} in ${failure.city}\n\n`;
  report += `**URL:** ${failure.url}\n\n`;
  report += `**Процедура:** ${failure.procedure}\n\n`;
  report += `**Город:** ${failure.city}\n\n`;
  report += `**Ошибка:** ${failure.error}\n\n`;
  
  if (failure.missing_fields) {
    report += `**Отсутствующие поля:** ${failure.missing_fields.join(', ')}\n\n`;
  }
  
  if (failure.prompt_used) {
    report += `**Использованный промпт:**\n`;
    report += `\`\`\`\n${failure.prompt_used.first_200_chars}...\n\`\`\`\n\n`;
  }
  
  if (failure.schema_used) {
    report += `**Использованная схема:**\n`;
    report += `- Type: ${failure.schema_used.type}\n`;
    report += `- Required fields: ${failure.schema_used.required_fields.join(', ')}\n`;
    report += `- Properties count: ${failure.schema_used.properties_count}\n\n`;
  }
  
  if (failure.raw_firecrawl_response) {
    report += `**Ответ от Firecrawl:**\n`;
    report += `\`\`\`json\n${JSON.stringify(failure.raw_firecrawl_response, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (failure.raw_data_analysis) {
    report += `**Анализ сырых данных:**\n`;
    report += `- Has hospital_name: ${failure.raw_data_analysis.has_hospital_name}\n`;
    report += `- Has price_gbp: ${failure.raw_data_analysis.has_price_gbp}\n`;
    report += `- price_gbp value: ${failure.raw_data_analysis.price_gbp_value}\n`;
    report += `- hospital_name value: "${failure.raw_data_analysis.hospital_name_value}"\n`;
    report += `- All fields: ${failure.raw_data_analysis.all_fields.join(', ')}\n\n`;
    report += `**Все значения:**\n`;
    report += `\`\`\`json\n${JSON.stringify(failure.raw_data_analysis.all_values, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (failure.firecrawl_error) {
    report += `**Firecrawl ошибка:** ${failure.firecrawl_error}\n\n`;
  }
  
  report += `---\n\n`;
});

// Recommendations
report += `## 💡 Рекомендации\n\n`;

if (failuresByError['No data extracted']) {
  report += `### Для случаев "No data extracted":\n\n`;
  report += `1. Проверить URL вручную - возможно, на странице нет цен\n`;
  report += `2. Проверить структуру страницы - возможно, изменилась\n`;
  report += `3. Использовать fallback на другие источники (PHIN, прямые сайты клиник)\n\n`;
}

if (failuresByError['Missing required fields']) {
  report += `### Для случаев "Missing required fields":\n\n`;
  report += `1. Улучшить промпт для более точного извлечения\n`;
  report += `2. Проверить, действительно ли данные есть на странице\n`;
  report += `3. Сделать некоторые поля опциональными, если они не всегда доступны\n\n`;
}

report += `### Общие рекомендации:\n\n`;
report += `1. ✅ Использовать fallback систему (уже реализована)\n`;
report += `2. ✅ Множественные URL для каждой комбинации city/procedure\n`;
report += `3. ⚠️  Мониторить проблемные URL и обновлять список\n`;
report += `4. ⚠️  Регулярно проверять структуру страниц TreatmentConnect\n\n`;

// Save report
fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`✅ Report generated: ${reportPath}`);

// Print summary
console.log(`\n📊 Summary:`);
console.log(`  Total failures: ${results.failed.length}`);
console.log(`  Error types: ${Object.keys(failuresByError).length}`);
console.log(`  By procedure:`, Object.fromEntries(
  Object.entries(failuresByProcedure).map(([k, v]) => [k, v.length])
));
console.log(`  By city:`, Object.fromEntries(
  Object.entries(failuresByCity).map(([k, v]) => [k, v.length])
));

