#!/usr/bin/env node

/**
 * Скрипт Lighthouse Audit
 * Проверяет Performance, Accessibility, Best Practices, SEO
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

async function runLighthouse(url, port = 3000) {
  return new Promise((resolve) => {
    log(`\n🔍 Запуск Lighthouse для: ${url}`, 'blue');
    log('   ⚠️  Lighthouse требует Chrome/Chromium', 'yellow');
    log('   Если не установлен, используйте Chrome DevTools вручную', 'yellow');
    
    const fullUrl = `http://localhost:${port}${url}`;
    const outputPath = path.join(process.cwd(), 'lighthouse-report.json');
    
    // Проверка что lighthouse доступен
    try {
      execSync('npx lighthouse --version', { stdio: 'ignore' });
    } catch (err) {
      log('   ⚠️  Lighthouse не найден через npx', 'yellow');
      log('   💡 АЛЬТЕРНАТИВА: Используйте Chrome DevTools', 'yellow');
      log('      1. Откройте http://localhost:3000 в Chrome', 'yellow');
      log('      2. Откройте DevTools (F12)', 'yellow');
      log('      3. Перейдите на вкладку Lighthouse', 'yellow');
      log('      4. Выберите категории и нажмите "Generate report"', 'yellow');
      resolve(null);
      return;
    }
    
    // Запуск lighthouse
    const lighthouse = spawn('npx', [
      'lighthouse',
      fullUrl,
      '--output=json',
      '--output-path=' + outputPath,
      '--chrome-flags="--headless"',
      '--only-categories=performance,accessibility,best-practices,seo',
    ], {
      shell: true,
      stdio: 'inherit',
    });

    lighthouse.on('close', (code) => {
      if (code === 0) {
        try {
          if (fs.existsSync(outputPath)) {
            const report = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            resolve(report);
          } else {
            resolve(null);
          }
        } catch (err) {
          log('   ⚠️  Не удалось прочитать отчет', 'yellow');
          resolve(null);
        }
      } else {
        log(`   ⚠️  Lighthouse завершился с кодом ${code}`, 'yellow');
        resolve(null);
      }
    });
  });
}

function analyzeReport(report) {
  if (!report || !report.categories) {
    return null;
  }

  const categories = report.categories;
  const results = {};

  Object.keys(categories).forEach(category => {
    const score = Math.round(categories[category].score * 100);
    results[category] = score;
  });

  return results;
}

function printResults(results, url) {
  log('\n' + '='.repeat(50), 'blue');
  log(`📊 LIGHTHOUSE РЕЗУЛЬТАТЫ: ${url}`, 'blue');
  log('='.repeat(50), 'blue');

  if (!results) {
    log('⚠️  Результаты недоступны', 'yellow');
    log('   Запустите Lighthouse вручную в браузере', 'yellow');
    return;
  }

  const thresholds = {
    performance: 85,
    accessibility: 90,
    'best-practices': 85,
    seo: 90,
  };

  Object.keys(results).forEach(category => {
    const score = results[category];
    const threshold = thresholds[category] || 80;
    const status = score >= threshold ? '✅' : '❌';
    const color = score >= threshold ? 'green' : 'red';

    log(`${status} ${category.toUpperCase()}: ${score}/100 (минимум ${threshold})`, color);
  });

  // Проверка всех категорий
  const allPassed = Object.keys(results).every(
    category => results[category] >= (thresholds[category] || 80)
  );

  if (allPassed) {
    log('\n✅ ВСЕ КАТЕГОРИИ ПРОШЛИ ПРОВЕРКУ!', 'green');
  } else {
    log('\n❌ НЕКОТОРЫЕ КАТЕГОРИИ НЕ ПРОШЛИ', 'red');
    log('   См. lighthouse-report.json для деталей', 'yellow');
  }
}

async function main() {
  log('🚀 LIGHTHOUSE AUDIT', 'blue');
  log('='.repeat(50), 'blue');
  log('⚠️  Убедитесь что dev сервер запущен (npm run dev)', 'yellow');
  log('   Нажмите Enter когда сервер будет готов...', 'yellow');

  // Простая проверка главной страницы
  const url = '/';
  const port = 3000;

  try {
    const report = await runLighthouse(url, port);
    const results = analyzeReport(report);
    printResults(results, url);
  } catch (err) {
    log(`\n❌ Ошибка: ${err.message}`, 'red');
    log('\n💡 АЛЬТЕРНАТИВНЫЙ СПОСОБ:', 'yellow');
    log('   1. Запустите dev сервер: npm run dev', 'yellow');
    log('   2. Откройте Chrome DevTools', 'yellow');
    log('   3. Перейдите на вкладку Lighthouse', 'yellow');
    log('   4. Выберите категории и нажмите "Generate report"', 'yellow');
    process.exit(1);
  }
}

main();

