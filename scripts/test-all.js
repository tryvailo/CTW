#!/usr/bin/env node

/**
 * Master скрипт для всех проверок
 * Запускает все тесты последовательно
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const tests = [
  {
    name: 'Проверка страниц и ссылок',
    script: 'test-pages.js',
    description: 'Проверяет что все страницы доступны и нет 404',
  },
  {
    name: 'Mobile Responsive',
    script: 'test-mobile.js',
    description: 'Проверяет mobile responsive дизайн',
  },
  {
    name: 'Accessibility (WCAG AAA)',
    script: 'test-accessibility.js',
    description: 'Проверяет требования доступности',
  },
  {
    name: 'Lighthouse Audit',
    script: 'test-lighthouse.js',
    description: 'Проверяет Performance, Accessibility, SEO',
  },
];

function runTest(test) {
  return new Promise((resolve) => {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`🧪 ${test.name}`, 'cyan');
    log(`${'='.repeat(60)}`, 'cyan');
    log(`📝 ${test.description}`, 'blue');

    const scriptPath = path.join(__dirname, test.script);
    const testProcess = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true,
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ ${test.name} - ПРОЙДЕН`, 'green');
        resolve({ name: test.name, passed: true });
      } else {
        log(`\n❌ ${test.name} - ОШИБКИ`, 'red');
        resolve({ name: test.name, passed: false, code });
      }
    });
  });
}

async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('🚀 ЗАПУСК ВСЕХ ПРОВЕРОК', 'blue');
  log('='.repeat(60), 'blue');
  log('\n⚠️  Убедитесь что dev сервер запущен:', 'yellow');
  log('   npm run dev', 'yellow');
  log('\nНажмите Enter чтобы начать...', 'yellow');

  // Ждем Enter (простая реализация)
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });

  const results = [];

  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    
    // Небольшая пауза между тестами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Итоговый отчет
  log('\n' + '='.repeat(60), 'blue');
  log('📊 ИТОГОВЫЙ ОТЧЕТ', 'blue');
  log('='.repeat(60), 'blue');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    const color = result.passed ? 'green' : 'red';
    log(`${status} ${result.name}`, color);
  });

  log('\n' + '='.repeat(60), 'blue');
  log(`✅ Пройдено: ${passed}/${results.length}`, passed === results.length ? 'green' : 'yellow');
  log(`❌ Ошибок: ${failed}`, failed > 0 ? 'red' : 'green');
  log('='.repeat(60), 'blue');

  if (failed > 0) {
    log('\n⚠️  Некоторые проверки не прошли', 'yellow');
    log('   Проверьте детали выше и исправьте ошибки', 'yellow');
    process.exit(1);
  } else {
    log('\n🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ!', 'green');
    log('   Проект готов к деплою!', 'green');
    process.exit(0);
  }
}

main();

