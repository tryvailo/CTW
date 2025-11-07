/**
 * Final comprehensive failure report generator
 * Creates detailed markdown report with all failed cases
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, 'test-results-all-treatmentconnect.json');
const reportPath = path.join(__dirname, 'FAILED_CASES_DETAILED_REPORT.md');

if (!fs.existsSync(resultsPath)) {
  console.log('❌ Test results file not found.');
  console.log('   Please wait for test-all-treatmentconnect.js to complete.');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

console.log('📊 Generating comprehensive failure report...\n');

// Group failures
const failuresByError = {};
const failuresByProcedure = {};
const failuresByCity = {};
const failuresByPattern = {};

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
  
  // Group by pattern (hospital name pattern)
  const hospitalPattern = failure.url.match(/hospitals\/([^/]+)/)?.[1] || 'unknown';
  if (!failuresByPattern[hospitalPattern]) {
    failuresByPattern[hospitalPattern] = [];
  }
  failuresByPattern[hospitalPattern].push(failure);
});

// Generate markdown report
let report = `# ❌ Детальный отчет по неуспешным кейсам TreatmentConnect

**Дата генерации:** ${new Date().toISOString()}  
**Источник данных:** test-results-all-treatmentconnect.json  
**Всего тестов:** ${results.stats.total}  
**✅ Успешных:** ${results.stats.successful}  
**❌ Неудачных:** ${results.stats.failed}  
**Success rate:** ${Math.round((results.stats.successful / results.stats.total) * 100)}%

---

## 📊 Общая статистика

| Метрика | Значение |
|---------|----------|
| Всего URL протестировано | ${results.stats.total} |
| Успешных извлечений | ${results.stats.successful} |
| Неудачных извлечений | ${results.stats.failed} |
| Success rate | ${Math.round((results.stats.successful / results.stats.total) * 100)}% |

---

## 🔍 Анализ неудач по типам ошибок

`;

// Error types analysis
Object.entries(failuresByError)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([errorType, failures]) => {
    report += `### ${errorType}\n\n`;
    report += `**Количество случаев:** ${failures.length}\n\n`;
    report += `**Процент от всех неудач:** ${Math.round((failures.length / results.stats.failed) * 100)}%\n\n`;
    
    report += `**Список всех URL с этой ошибкой:**\n\n`;
    
    failures.forEach((failure, i) => {
      report += `${i + 1}. **${failure.procedure.toUpperCase()}** in **${failure.city}**\n`;
      report += `   - URL: \`${failure.url}\`\n`;
      report += `   - Test #: ${failure.test_number}\n`;
      
      if (failure.missing_fields && failure.missing_fields.length > 0) {
        report += `   - Отсутствующие поля: ${failure.missing_fields.join(', ')}\n`;
      }
      
      if (failure.raw_data_analysis) {
        report += `   - Анализ сырых данных:\n`;
        report += `     - price_gbp: ${failure.raw_data_analysis.price_gbp_value}\n`;
        report += `     - hospital_name: "${failure.raw_data_analysis.hospital_name_value}"\n`;
        report += `     - Все поля: ${failure.raw_data_analysis.all_fields.join(', ')}\n`;
      }
      
      if (failure.firecrawl_error) {
        report += `   - Firecrawl ошибка: ${failure.firecrawl_error}\n`;
      }
      
      report += `\n`;
    });
    
    report += `---\n\n`;
  });

// Analysis by procedure
report += `## 📋 Анализ по процедурам\n\n`;

Object.entries(failuresByProcedure)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([procedure, failures]) => {
    report += `### ${procedure.toUpperCase()}\n\n`;
    report += `**Неудачных тестов:** ${failures.length}\n\n`;
    report += `**Процент неудач для этой процедуры:** ${Math.round((failures.length / (failures.length + results.successful.filter(s => s.procedure === procedure).length)) * 100)}%\n\n`;
    
    report += `| # | City | URL | Error | Missing Fields |\n`;
    report += `|---|------|-----|-------|----------------|\n`;
    
    failures.forEach((failure, i) => {
      const missing = failure.missing_fields ? failure.missing_fields.join(', ') : '-';
      report += `| ${i + 1} | ${failure.city} | \`${failure.url}\` | ${failure.error} | ${missing} |\n`;
    });
    
    report += `\n---\n\n`;
  });

// Analysis by city
report += `## 📍 Анализ по городам\n\n`;

Object.entries(failuresByCity)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([city, failures]) => {
    report += `### ${city}\n\n`;
    report += `**Неудачных тестов:** ${failures.length}\n\n`;
    
    failures.forEach((failure, i) => {
      report += `${i + 1}. **[${failure.procedure}]** - \`${failure.url}\`\n`;
      report += `   - Error: ${failure.error}\n`;
      if (failure.raw_data_analysis) {
        report += `   - Raw data: price_gbp=${failure.raw_data_analysis.price_gbp_value}, hospital_name="${failure.raw_data_analysis.hospital_name_value}"\n`;
      }
      report += `\n`;
    });
    
    report += `---\n\n`;
  });

// Detailed cases with prompts and schemas
report += `## 📝 Детальный список всех неудачных кейсов с запросами\n\n`;

results.failed.forEach((failure, i) => {
  report += `### Кейс ${i + 1}: ${failure.procedure.toUpperCase()} in ${failure.city}\n\n`;
  report += `**Тест #:** ${failure.test_number}\n\n`;
  report += `**URL:** \`${failure.url}\`\n\n`;
  report += `**Процедура:** ${failure.procedure}\n\n`;
  report += `**Город:** ${failure.city}\n\n`;
  report += `**Ошибка:** ${failure.error}\n\n`;
  
  if (failure.missing_fields && failure.missing_fields.length > 0) {
    report += `**Отсутствующие поля:** ${failure.missing_fields.join(', ')}\n\n`;
  }
  
  if (failure.prompt_used) {
    report += `**Использованный промпт (первые 500 символов):**\n\n`;
    report += `\`\`\`\n${failure.prompt_used.first_200_chars}...\n\`\`\`\n\n`;
    report += `**Полная длина промпта:** ${failure.prompt_used.length} символов\n\n`;
  }
  
  if (failure.schema_used) {
    report += `**Использованная JSON Schema:**\n\n`;
    report += `- Type: \`${failure.schema_used.type}\`\n`;
    report += `- Required fields: \`${failure.schema_used.required_fields.join(', ')}\`\n`;
    report += `- Properties count: ${failure.schema_used.properties_count}\n\n`;
  }
  
  if (failure.raw_firecrawl_response) {
    report += `**Ответ от Firecrawl (JSON Mode):**\n\n`;
    report += `\`\`\`json\n${JSON.stringify(failure.raw_firecrawl_response, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (failure.raw_data_analysis) {
    report += `**Анализ сырых данных:**\n\n`;
    report += `| Параметр | Значение |\n`;
    report += `|----------|----------|\n`;
    report += `| has_hospital_name | ${failure.raw_data_analysis.has_hospital_name} |\n`;
    report += `| has_price_gbp | ${failure.raw_data_analysis.has_price_gbp} |\n`;
    report += `| price_gbp value | ${failure.raw_data_analysis.price_gbp_value} |\n`;
    report += `| hospital_name value | "${failure.raw_data_analysis.hospital_name_value}" |\n`;
    report += `| Все поля | ${failure.raw_data_analysis.all_fields.join(', ')} |\n\n`;
    
    report += `**Все значения из Firecrawl:**\n\n`;
    report += `\`\`\`json\n${JSON.stringify(failure.raw_data_analysis.all_values, null, 2)}\n\`\`\`\n\n`;
  }
  
  if (failure.firecrawl_error) {
    report += `**Firecrawl ошибка:**\n\n`;
    report += `\`\`\`\n${failure.firecrawl_error}\n\`\`\`\n\n`;
  }
  
  if (failure.error_stack) {
    report += `**Stack trace:**\n\n`;
    report += `\`\`\`\n${failure.error_stack}\n\`\`\`\n\n`;
  }
  
  report += `---\n\n`;
});

// Recommendations
report += `## 💡 Рекомендации и решения\n\n`;

if (failuresByError['No data extracted']) {
  report += `### Для случаев "No data extracted" (${failuresByError['No data extracted'].length} случаев):\n\n`;
  report += `**Проблема:** Firecrawl JSON Mode возвращает данные, но все поля пустые или равны 0.\n\n`;
  report += `**Возможные причины:**\n`;
  report += `1. На странице действительно нет цен (страница может быть placeholder или require JavaScript)\n`;
  report += `2. Структура страницы изменилась и LLM не может найти данные\n`;
  report += `3. Страница требует интерактивного взаимодействия (клики, формы)\n\n`;
  report += `**Решения:**\n`;
  report += `1. ✅ Использовать fallback на другие источники (PHIN, прямые сайты клиник) - уже реализовано\n`;
  report += `2. ⚠️  Проверить URL вручную и обновить список, если страницы не содержат цен\n`;
  report += `3. ⚠️  Улучшить промпт для более точного извлечения данных\n`;
  report += `4. ⚠️  Рассмотреть использование других URL паттернов для этих больниц\n\n`;
}

if (failuresByError['Missing required fields']) {
  report += `### Для случаев "Missing required fields" (${failuresByError['Missing required fields'].length} случаев):\n\n`;
  report += `**Проблема:** Некоторые обязательные поля отсутствуют в ответе.\n\n`;
  report += `**Решения:**\n`;
  report += `1. ⚠️  Сделать некоторые поля опциональными, если они не всегда доступны\n`;
  report += `2. ⚠️  Улучшить промпт для более точного извлечения обязательных полей\n`;
  report += `3. ⚠️  Добавить fallback логику для заполнения отсутствующих полей\n\n`;
}

report += `### Общие рекомендации:\n\n`;
report += `1. ✅ **Fallback система работает** - при неудаче используются другие источники\n`;
report += `2. ✅ **Множественные URL** - для каждой комбинации city/procedure есть несколько URL\n`;
report += `3. ⚠️  **Мониторинг** - регулярно проверять проблемные URL\n`;
report += `4. ⚠️  **Обновление списка** - удалять неработающие URL и добавлять новые\n`;
report += `5. ⚠️  **Улучшение промптов** - на основе анализа неудачных кейсов\n\n`;

// Patterns analysis
if (Object.keys(failuresByPattern).length > 0) {
  report += `## 🏥 Анализ по больницам (паттерны URL)\n\n`;
  report += `Некоторые больницы могут иметь проблемы на всех процедурах:\n\n`;
  
  Object.entries(failuresByPattern)
    .filter(([_, failures]) => failures.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([pattern, failures]) => {
      report += `### ${pattern}\n\n`;
      report += `**Неудачных тестов:** ${failures.length}\n\n`;
      report += `**Процедуры:** ${[...new Set(failures.map(f => f.procedure))].join(', ')}\n\n`;
      report += `**Города:** ${[...new Set(failures.map(f => f.city))].join(', ')}\n\n`;
      report += `**Рекомендация:** Проверить все URL для этой больницы, возможно, нужен другой подход.\n\n`;
    });
}

// Save report
fs.writeFileSync(reportPath, report, 'utf-8');
console.log(`✅ Comprehensive report generated: ${reportPath}`);

// Also create JSON summary
const summary = {
  timestamp: new Date().toISOString(),
  total_tests: results.stats.total,
  successful: results.stats.successful,
  failed: results.stats.failed,
  success_rate: `${Math.round((results.stats.successful / results.stats.total) * 100)}%`,
  errors_breakdown: Object.fromEntries(
    Object.entries(failuresByError).map(([k, v]) => [k, v.length])
  ),
  failed_by_procedure: Object.fromEntries(
    Object.entries(failuresByProcedure).map(([k, v]) => [k, v.length])
  ),
  failed_by_city: Object.fromEntries(
    Object.entries(failuresByCity).map(([k, v]) => [k, v.length])
  ),
  failed_urls: results.failed.map(f => ({
    url: f.url,
    procedure: f.procedure,
    city: f.city,
    error: f.error,
    missing_fields: f.missing_fields || null
  }))
};

const summaryPath = path.join(__dirname, 'FAILED_CASES_SUMMARY.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(`✅ Summary JSON generated: ${summaryPath}`);

console.log(`\n📊 Quick Summary:`);
console.log(`  Total failures: ${results.stats.failed}`);
console.log(`  Error types: ${Object.keys(failuresByError).length}`);
console.log(`  Most common error: ${Object.entries(failuresByError).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'N/A'}`);

