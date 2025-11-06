#!/usr/bin/env node

/**
 * Скрипт проверки Mobile Responsive
 * Проверяет что сайт корректно отображается на мобильных устройствах
 */

const fs = require('fs');
const path = require('path');

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

// Проверка viewport meta tag
function checkViewportMeta() {
  log('\n📱 ПРОВЕРКА MOBILE RESPONSIVE', 'blue');
  log('='.repeat(50), 'blue');

  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    log('❌ Файл layout.tsx не найден', 'red');
    return false;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');
  
  // Проверка viewport meta tag
  const hasViewport = content.includes('viewport') || 
                      content.includes('width=device-width') ||
                      content.includes('initial-scale=1');

  if (hasViewport) {
    log('✅ Viewport meta tag найден', 'green');
  } else {
    log('⚠️  Viewport meta tag не найден', 'yellow');
    log('   Добавьте в layout.tsx:', 'yellow');
    log('   <meta name="viewport" content="width=device-width, initial-scale=1" />', 'yellow');
  }

  // Проверка Tailwind responsive classes
  const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
  if (fs.existsSync(globalsPath)) {
    const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
    log('✅ globals.css найден', 'green');
  }

  // Проверка компонентов на использование responsive классов
  log('\n📋 Проверка компонентов на responsive классы:', 'blue');
  
  const componentsDir = path.join(process.cwd(), 'components');
  const responsivePatterns = [
    /md:/g,
    /lg:/g,
    /sm:/g,
    /xl:/g,
    /flex-col/g,
    /grid-cols-1/g,
  ];

  let foundResponsive = false;
  
  if (fs.existsSync(componentsDir)) {
    const files = getAllFiles(componentsDir, '.tsx');
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasResponsive = responsivePatterns.some(pattern => pattern.test(content));
      if (hasResponsive) {
        foundResponsive = true;
        const relativePath = path.relative(process.cwd(), file);
        log(`   ✅ ${relativePath} - использует responsive классы`, 'green');
      }
    });
  }

  if (!foundResponsive) {
    log('⚠️  Responsive классы не найдены в компонентах', 'yellow');
  }

  // Рекомендации
  log('\n📱 РЕКОМЕНДАЦИИ ДЛЯ MOBILE:', 'blue');
  log('   1. Проверьте сайт в Chrome DevTools (Device Toolbar)', 'yellow');
  log('   2. Тестируйте на реальных устройствах:', 'yellow');
  log('      - iPhone (375px, 414px)', 'yellow');
  log('      - Android (360px, 412px)', 'yellow');
  log('   3. Проверьте touch targets (минимум 44px)', 'yellow');
  log('   4. Проверьте что таблицы читаемы на мобильных', 'yellow');
  log('   5. Проверьте что текст не меньше 14px', 'yellow');

  return true;
}

function getAllFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Проверка touch targets в CSS
function checkTouchTargets() {
  log('\n👆 ПРОВЕРКА TOUCH TARGETS:', 'blue');
  
  const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
  if (fs.existsSync(globalsPath)) {
    const content = fs.readFileSync(globalsPath, 'utf-8');
    
    if (content.includes('min-h-touch') || content.includes('44px')) {
      log('✅ Touch targets настроены (44px минимум)', 'green');
    } else {
      log('⚠️  Touch targets не найдены', 'yellow');
      log('   Убедитесь что кнопки минимум 44px высотой', 'yellow');
    }
  }
}

// Запуск проверок
log('🔍 MOBILE RESPONSIVE CHECK', 'blue');
checkViewportMeta();
checkTouchTargets();
log('\n✅ Проверка завершена', 'green');

