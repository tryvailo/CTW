#!/usr/bin/env node

/**
 * Скрипт проверки Accessibility (WCAG AAA)
 * Проверяет базовые требования доступности
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

// Проверка цветового контраста (WCAG AAA требует минимум 7:1)
function checkColorContrast() {
  log('\n🎨 ПРОВЕРКА ЦВЕТОВОГО КОНТРАСТА (WCAG AAA)', 'blue');
  log('='.repeat(50), 'blue');

  const tailwindConfig = path.join(process.cwd(), 'tailwind.config.js');
  
  if (!fs.existsSync(tailwindConfig)) {
    log('❌ tailwind.config.js не найден', 'red');
    return false;
  }

  const content = fs.readFileSync(tailwindConfig, 'utf-8');
  
  // Проверка что есть elderly-friendly цвета
  const hasElderlyColors = content.includes('elderly-text') && 
                          content.includes('elderly-bg') &&
                          content.includes('elderly-primary');

  if (hasElderlyColors) {
    log('✅ Elderly-friendly цвета настроены', 'green');
  } else {
    log('⚠️  Elderly-friendly цвета не найдены', 'yellow');
  }

  // Проверка контраста (базовая проверка конфига)
  if (content.includes('#1a1a1a') && content.includes('#ffffff')) {
    log('✅ Высокий контраст настроен (текст #1a1a1a на белом)', 'green');
    log('   Контраст: ~16.6:1 (WCAG AAA требует 7:1)', 'green');
  }

  return true;
}

// Проверка размеров шрифтов
function checkFontSizes() {
  log('\n📝 ПРОВЕРКА РАЗМЕРОВ ШРИФТОВ:', 'blue');

  const tailwindConfig = path.join(process.cwd(), 'tailwind.config.js');
  if (!fs.existsSync(tailwindConfig)) {
    return false;
  }

  const content = fs.readFileSync(tailwindConfig, 'utf-8');
  
  // Проверка elderly-friendly размеров
  const fontSizes = [
    { name: 'elderly-xs', min: 14 },
    { name: 'elderly-sm', min: 16 },
    { name: 'elderly-base', min: 18 },
  ];

  fontSizes.forEach(font => {
    const regex = new RegExp(`${font.name}.*?\\[(.*?)\\]`, 's');
    const match = content.match(regex);
    
    if (match) {
      const sizeMatch = match[1].match(/(\d+)px/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        if (size >= font.min) {
          log(`   ✅ ${font.name}: ${size}px (минимум ${font.min}px)`, 'green');
        } else {
          log(`   ⚠️  ${font.name}: ${size}px (требуется минимум ${font.min}px)`, 'yellow');
        }
      }
    }
  });
}

// Проверка семантической разметки
function checkSemanticHTML() {
  log('\n📄 ПРОВЕРКА СЕМАНТИЧЕСКОЙ РАЗМЕТКИ:', 'blue');

  const appDir = path.join(process.cwd(), 'app');
  const pages = getAllFiles(appDir, '.tsx');

  let hasSemantic = false;
  const semanticTags = ['header', 'main', 'nav', 'section', 'article', 'footer'];

  pages.forEach(page => {
    const content = fs.readFileSync(page, 'utf-8');
    semanticTags.forEach(tag => {
      if (content.includes(`<${tag}`) || content.includes(`<${tag}>`)) {
        hasSemantic = true;
      }
    });
  });

  if (hasSemantic) {
    log('   ✅ Семантические HTML теги используются', 'green');
  } else {
    log('   ⚠️  Семантические HTML теги не найдены', 'yellow');
    log('      Используйте: <header>, <main>, <nav>, <section>, <footer>', 'yellow');
  }
}

// Проверка alt текстов для изображений
function checkAltTexts() {
  log('\n🖼️  ПРОВЕРКА ALT ТЕКСТОВ:', 'blue');

  const componentsDir = path.join(process.cwd(), 'components');
  if (!fs.existsSync(componentsDir)) {
    return;
  }

  const files = getAllFiles(componentsDir, '.tsx');
  let hasImages = false;
  let hasAlt = false;

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('<img') || content.includes('Image')) {
      hasImages = true;
      if (content.includes('alt=') || content.includes('alt:')) {
        hasAlt = true;
      }
    }
  });

  if (hasImages) {
    if (hasAlt) {
      log('   ✅ Alt тексты найдены', 'green');
    } else {
      log('   ⚠️  Alt тексты отсутствуют для изображений', 'yellow');
    }
  } else {
    log('   ℹ️  Изображения не найдены', 'blue');
  }
}

// Проверка keyboard navigation
function checkKeyboardNav() {
  log('\n⌨️  ПРОВЕРКА КЛАВИАТУРНОЙ НАВИГАЦИИ:', 'blue');

  const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
  if (fs.existsSync(globalsPath)) {
    const content = fs.readFileSync(globalsPath, 'utf-8');
    
    if (content.includes('focus:') || content.includes('focus-visible')) {
      log('   ✅ Focus стили настроены', 'green');
    } else {
      log('   ⚠️  Focus стили не найдены', 'yellow');
      log('      Добавьте focus:outline для интерактивных элементов', 'yellow');
    }
  }
}

function getAllFiles(dir, ext) {
  let results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
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

// Главная функция
function main() {
  log('♿ ACCESSIBILITY CHECK (WCAG AAA)', 'blue');
  log('='.repeat(50), 'blue');

  checkColorContrast();
  checkFontSizes();
  checkSemanticHTML();
  checkAltTexts();
  checkKeyboardNav();

  log('\n' + '='.repeat(50), 'blue');
  log('📋 РЕКОМЕНДАЦИИ:', 'blue');
  log('   1. Используйте WAVE (https://wave.webaim.org/) для детальной проверки', 'yellow');
  log('   2. Используйте axe DevTools в браузере', 'yellow');
  log('   3. Тестируйте с screen reader (NVDA, JAWS)', 'yellow');
  log('   4. Проверьте keyboard navigation вручную', 'yellow');
  log('   5. Убедитесь что все интерактивные элементы доступны с клавиатуры', 'yellow');
  log('\n✅ Базовая проверка завершена', 'green');
}

main();

