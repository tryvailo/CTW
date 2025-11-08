#!/usr/bin/env node

/**
 * Скрипт валидации CSV файлов данных
 * Проверяет структуру, полноту и формат данных
 */

const fs = require('fs');
const path = require('path');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateCSV(filePath, expectedColumns, expectedRows = null) {
  log(`\n📄 Проверка: ${filePath}`, 'blue');
  
  if (!fs.existsSync(filePath)) {
    log(`❌ Файл не найден: ${filePath}`, 'red');
    return { valid: false, errors: [`Файл не найден`] };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0]?.split(',').map(h => h.trim());
  
  if (!headers || headers.length === 0) {
    log(`❌ Файл пустой или без заголовков`, 'red');
    return { valid: false, errors: [`Файл пустой`] };
  }

  const errors = [];
  const warnings = [];

  // Проверка заголовков
  const missing = expectedColumns.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    errors.push(`Отсутствуют колонки: ${missing.join(', ')}`);
  }

  const extra = headers.filter(col => !expectedColumns.includes(col));
  if (extra.length > 0) {
    warnings.push(`Лишние колонки: ${extra.join(', ')}`);
  }

  // Проверка количества строк
  const dataRows = lines.length - 1; // минус заголовок
  if (expectedRows !== null && dataRows !== expectedRows) {
    warnings.push(`Ожидалось строк: ${expectedRows}, найдено: ${dataRows}`);
  }

  // Проверка данных
  const dataIssues = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim());
    if (row.length !== headers.length) {
      dataIssues.push(`Строка ${i + 1}: Неправильное количество колонок`);
    }
  }

  if (dataIssues.length > 0) {
    errors.push(...dataIssues.slice(0, 5)); // Показываем первые 5 ошибок
  }

  // Результат
  if (errors.length > 0) {
    log(`❌ Ошибки:`, 'red');
    errors.forEach(err => log(`   - ${err}`, 'red'));
  }
  
  if (warnings.length > 0) {
    log(`⚠️  Предупреждения:`, 'yellow');
    warnings.forEach(warn => log(`   - ${warn}`, 'yellow'));
  }

  if (errors.length === 0) {
    log(`✅ Валидация пройдена: ${dataRows} строк данных`, 'green');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    rows: dataRows,
    columns: headers.length,
  };
}

function validateNHSWaits(filePath) {
  const result = validateCSV(
    filePath,
    ['procedure_id', 'city', 'nhs_trust', 'avg_wait_weeks', 'date', 'source'],
    15
  );

  if (!result.valid) return result;

  // Дополнительные проверки
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const procedures = ['cataract', 'hip', 'knee'];
  const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'];
  
  const errors = [];
  const foundCombinations = new Set();

  for (let i = 1; i < lines.length; i++) {
    const [procedure_id, city, nhs_trust, avg_wait_weeks, date, source] = 
      lines[i].split(',').map(c => c.trim());

    // Проверка procedure_id
    if (!procedures.includes(procedure_id)) {
      errors.push(`Строка ${i + 1}: Неизвестный procedure_id: ${procedure_id}`);
    }

    // Проверка city
    if (!cities.includes(city)) {
      errors.push(`Строка ${i + 1}: Неизвестный city: ${city}`);
    }

    // Проверка avg_wait_weeks (должно быть число)
    if (isNaN(parseInt(avg_wait_weeks))) {
      errors.push(`Строка ${i + 1}: avg_wait_weeks не является числом: ${avg_wait_weeks}`);
    }

    // Проверка даты (формат YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Строка ${i + 1}: Неправильный формат даты: ${date}`);
    }

    foundCombinations.add(`${procedure_id}-${city}`);
  }

  // Проверка полноты (должно быть 15 комбинаций)
  if (foundCombinations.size !== 15) {
    errors.push(`Не хватает комбинаций. Найдено: ${foundCombinations.size}, ожидалось: 15`);
  }

  if (errors.length > 0) {
    result.valid = false;
    result.errors.push(...errors);
    log(`❌ Дополнительные ошибки:`, 'red');
    errors.forEach(err => log(`   - ${err}`, 'red'));
  }

  return result;
}

function validatePrivateCosts(filePath) {
  const result = validateCSV(
    filePath,
    ['procedure_id', 'city', 'cost_min', 'cost_max', 'clinic_count', 'date', 'source'],
    15
  );

  if (!result.valid) return result;

  // Дополнительные проверки
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    const [procedure_id, city, cost_min, cost_max, clinic_count, date, source] = 
      lines[i].split(',').map(c => c.trim());

    // Проверка цен (должны быть числа)
    if (isNaN(parseInt(cost_min)) || isNaN(parseInt(cost_max))) {
      errors.push(`Строка ${i + 1}: Цены не являются числами`);
    }

    // Проверка что cost_min < cost_max
    if (parseInt(cost_min) >= parseInt(cost_max)) {
      errors.push(`Строка ${i + 1}: cost_min (${cost_min}) >= cost_max (${cost_max})`);
    }

    // Проверка clinic_count
    if (isNaN(parseInt(clinic_count)) || parseInt(clinic_count) < 1) {
      errors.push(`Строка ${i + 1}: clinic_count не является положительным числом: ${clinic_count}`);
    }
  }

  if (errors.length > 0) {
    result.valid = false;
    result.errors.push(...errors);
    log(`❌ Дополнительные ошибки:`, 'red');
    errors.forEach(err => log(`   - ${err}`, 'red'));
  }

  return result;
}

function validateClinics(filePath) {
  const result = validateCSV(
    filePath,
    ['clinic_id', 'name', 'city', 'procedure_id', 'price', 'url', 'phone', 'address', 'rating_stars', 'rating_count', 'cqc_rating', 'hospital_group', 'last_updated', 'details_last_updated'],
    null // Может быть 45-75 строк
  );

  if (!result.valid) return result;

  // Проверка минимального количества
  if (result.rows < 45) {
    result.warnings.push(`Мало клиник: ${result.rows}. Ожидается минимум 45 (3 клиники × 15 комбинаций)`);
  }

  // Дополнительные проверки
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    // Parse CSV line (handle quoted values with commas)
    const values = [];
    let current = '';
    let inQuotes = false;
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const [
      clinic_id, name, city, procedure_id, price, url, phone, address,
      rating_stars, rating_count, cqc_rating, hospital_group, last_updated, details_last_updated
    ] = values;

    // Проверка URL
    if (url && url.trim() !== '' && !url.startsWith('https://') && !url.startsWith('http://')) {
      errors.push(`Строка ${i + 1}: URL не начинается с https:// или http://: ${url}`);
    }

    // Проверка цены
    if (isNaN(parseInt(price)) || parseInt(price) < 1000) {
      errors.push(`Строка ${i + 1}: price не является валидным числом: ${price}`);
    }

    // Проверка рейтинга (если указан)
    if (rating_stars && rating_stars.trim() !== '') {
      const rating = parseFloat(rating_stars);
      if (isNaN(rating) || rating < 0 || rating > 5) {
        errors.push(`Строка ${i + 1}: rating_stars должен быть числом от 0 до 5: ${rating_stars}`);
      }
    }

    // Проверка количества отзывов (если указано)
    if (rating_count && rating_count.trim() !== '') {
      const count = parseInt(rating_count);
      if (isNaN(count) || count < 0) {
        errors.push(`Строка ${i + 1}: rating_count должен быть положительным целым числом: ${rating_count}`);
      }
    }

    // Проверка CQC рейтинга (если указан)
    if (cqc_rating && cqc_rating.trim() !== '') {
      const validCQCRatings = ['Outstanding', 'Good', 'Requires improvement', 'Inadequate'];
      if (!validCQCRatings.includes(cqc_rating)) {
        errors.push(`Строка ${i + 1}: cqc_rating должен быть одним из: ${validCQCRatings.join(', ')}: ${cqc_rating}`);
      }
    }

    // Проверка даты last_updated
    if (last_updated && !/^\d{4}-\d{2}-\d{2}$/.test(last_updated)) {
      errors.push(`Строка ${i + 1}: Неправильный формат даты last_updated: ${last_updated}`);
    }

    // Проверка даты details_last_updated (если указана)
    if (details_last_updated && details_last_updated.trim() !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(details_last_updated)) {
      errors.push(`Строка ${i + 1}: Неправильный формат даты details_last_updated: ${details_last_updated}`);
    }
  }

  if (errors.length > 0) {
    result.valid = false;
    result.errors.push(...errors);
    log(`❌ Дополнительные ошибки:`, 'red');
    errors.forEach(err => log(`   - ${err}`, 'red'));
  }

  return result;
}

// Главная функция
function main() {
  log('🔍 ВАЛИДАЦИЯ ДАННЫХ', 'blue');
  log('='.repeat(50), 'blue');

  const results = {
    nhs_waits: null,
    private_costs: null,
    clinics: null,
  };

  // Проверка nhs_waits.csv
  const nhsPath = 'data/processed/nhs_waits.csv';
  results.nhs_waits = validateNHSWaits(nhsPath);

  // Проверка private_costs.csv
  const privatePath = 'data/processed/private_costs.csv';
  results.private_costs = validatePrivateCosts(privatePath);

  // Проверка clinics.csv
  const clinicsPath = 'data/processed/clinics.csv';
  results.clinics = validateClinics(clinicsPath);

  // Итоговый отчет
  log('\n' + '='.repeat(50), 'blue');
  log('📊 ИТОГОВЫЙ ОТЧЕТ', 'blue');
  log('='.repeat(50), 'blue');

  const allValid = Object.values(results).every(r => r && r.valid);
  
  if (allValid) {
    log('\n✅ ВСЕ ФАЙЛЫ ВАЛИДНЫ!', 'green');
    log(`   - nhs_waits.csv: ${results.nhs_waits.rows} строк`, 'green');
    log(`   - private_costs.csv: ${results.private_costs.rows} строк`, 'green');
    log(`   - clinics.csv: ${results.clinics.rows} строк`, 'green');
  } else {
    log('\n❌ ОБНАРУЖЕНЫ ОШИБКИ', 'red');
    Object.entries(results).forEach(([name, result]) => {
      if (result && !result.valid) {
        log(`   - ${name}: ${result.errors.length} ошибок`, 'red');
      }
    });
    process.exit(1);
  }
}

// Запуск
main();

