#!/usr/bin/env node

/**
 * Скрипт проверки всех страниц и ссылок
 * Проверяет что все страницы доступны и нет 404 ошибок
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

// Список всех страниц для проверки
const pages = [
  '/',
  '/procedures',
  '/procedures/cataract',
  '/procedures/hip',
  '/procedures/knee',
  '/comparison/cataract/london',
  '/comparison/cataract/manchester',
  '/comparison/cataract/birmingham',
  '/comparison/cataract/leeds',
  '/comparison/cataract/bristol',
  '/comparison/hip/london',
  '/comparison/hip/manchester',
  '/comparison/hip/birmingham',
  '/comparison/hip/leeds',
  '/comparison/hip/bristol',
  '/comparison/knee/london',
  '/comparison/knee/manchester',
  '/comparison/knee/birmingham',
  '/comparison/knee/leeds',
  '/comparison/knee/bristol',
  '/about',
  '/faq',
  '/privacy-policy',
  '/terms-of-service',
];

async function checkPage(url, port = 3000) {
  return new Promise((resolve) => {
    const fullUrl = `http://localhost:${port}${url}`;
    const https = require('https');
    const http = require('http');
    const client = fullUrl.startsWith('https') ? https : http;

    const req = client.get(fullUrl, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode === 200,
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false,
        error: 'Timeout',
      });
    });
  });
}

async function checkAllPages() {
  log('\n🔍 ПРОВЕРКА ВСЕХ СТРАНИЦ', 'blue');
  log('='.repeat(50), 'blue');

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const page of pages) {
    const result = await checkPage(page);
    results.push(result);

    if (result.ok) {
      log(`✅ ${page} - ${result.status}`, 'green');
      passed++;
    } else {
      log(`❌ ${page} - ${result.status || 'ERROR'} ${result.error || ''}`, 'red');
      failed++;
    }
  }

  log('\n' + '='.repeat(50), 'blue');
  log('📊 ИТОГОВЫЙ ОТЧЕТ', 'blue');
  log('='.repeat(50), 'blue');
  log(`✅ Успешно: ${passed}`, 'green');
  log(`❌ Ошибки: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`📄 Всего проверено: ${pages.length}`, 'blue');

  if (failed > 0) {
    log('\n❌ СТРАНИЦЫ С ОШИБКАМИ:', 'red');
    results
      .filter(r => !r.ok)
      .forEach(r => {
        log(`   - ${r.url} (${r.status || r.error})`, 'red');
      });
    process.exit(1);
  } else {
    log('\n✅ ВСЕ СТРАНИЦЫ ДОСТУПНЫ!', 'green');
    process.exit(0);
  }
}

// Проверка что сервер запущен
checkPage('/').then((result) => {
  if (!result.ok) {
    log('⚠️  Dev сервер не запущен!', 'yellow');
    log('Запустите: npm run dev', 'yellow');
    log('Затем запустите этот скрипт снова.', 'yellow');
    process.exit(1);
  } else {
    checkAllPages();
  }
});

