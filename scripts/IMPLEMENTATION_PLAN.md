# 🚀 План реализации: Интеграция TreatmentConnect и прямых источников цен

**Дата:** 2025-11-07  
**Основано на:** executive-summary.md, improved-price-sources-solution.md, quick-start-url-list.md, technical-implementation-guide.md  
**Статус:** ✅ Готов к реализации

---

## 📊 Обзор решения

### Трехуровневая система источников:

1. **TIER 1: TreatmentConnect.co.uk** (ОСНОВНОЙ) 🏆
   - Агрегатор 146 частных больниц
   - Структурированные данные в HTML
   - Покрытие всех процедур и городов
   - ~180 price points из одного источника

2. **TIER 2: Прямые сайты клиник** (ВАЛИДАЦИЯ) ✓
   - Spire Healthcare (38 hospitals)
   - Nuffield Health (31 hospitals)
   - Circle Health Group (52 hospitals)
   - Ramsay Health Care (35 hospitals)

3. **TIER 3: NHS PHIN Articles** (КОНТЕКСТ) 📊
   - Дополнительная информация
   - Статистика и averages

---

## 🎯 Цели реализации

### Краткосрочные (Неделя 1):
- ✅ Интегрировать TreatmentConnect как основной источник
- ✅ Обработать 60+ готовых URL из quick-start-url-list.md
- ✅ Собрать 150-200 price points
- ✅ Создать базовую агрегацию по городам

### Среднесрочные (Неделя 2):
- ✅ Добавить прямые сайты клиник для валидации
- ✅ Cross-validate цены между источниками
- ✅ Улучшить качество данных
- ✅ Расширить покрытие до 300+ price points

### Долгосрочные (Неделя 3-4):
- ✅ Автоматизированный pipeline
- ✅ Регулярные обновления (weekly/monthly)
- ✅ Мониторинг качества данных
- ✅ Историческое отслеживание цен

---

## 📋 Этап 1: Подготовка и настройка (День 1)

### 1.1 Обновить конфигурацию

**Файл:** `scripts/config.js`

**Добавить:**
```javascript
urls: {
  // ... существующие URL
  treatmentconnect_base: 'https://www.treatmentconnect.co.uk',
  treatmentconnect_pattern: 'https://www.treatmentconnect.co.uk/hospitals/{hospital}/{procedure}',
  
  // Прямые сайты клиник
  spire_base: 'https://www.spirehealthcare.com',
  nuffield_base: 'https://www.nuffieldhealth.com',
  circle_base: 'https://www.circlehealthgroup.co.uk',
  ramsay_base: 'https://www.ramsayhealth.co.uk'
},

// Маппинг процедур для TreatmentConnect
treatmentconnect_procedures: {
  cataract: 'cataract-surgery',
  hip: 'hip-replacement',
  knee: 'knee-replacement'
}
```

### 1.2 Создать список URL из quick-start-url-list.md

**Файл:** `scripts/treatmentconnect-urls.js`

**Содержимое:**
- Экспортировать массив из 60+ URL
- Организовать по городам и процедурам
- Включить метаданные (city, procedure, hospital)

### 1.3 Обновить JSON схемы

**Файл:** `scripts/schemas/private-costs-schema.js`

**Добавить поддержку TreatmentConnect:**
- Расширить схему для rating_stars, avg_uk_price
- Обновить промпт для TreatmentConnect формата
- Добавить валидацию новых полей

---

## 📋 Этап 2: Интеграция TreatmentConnect (День 2-3)

### 2.1 Создать функцию для TreatmentConnect

**Файл:** `scripts/scraper.js`

**Новая функция:**
```javascript
/**
 * Extract prices from TreatmentConnect.co.uk
 * PRIMARY SOURCE for private costs
 */
export async function extractTreatmentConnectPrices(url, procedure, city) {
  try {
    const schema = schemas.privateCosts.schema; // Обновленная схема
    const prompt = schemas.privateCosts.getTreatmentConnectPrompt(procedure, city);
    
    const jsonData = await scrapeWithJSONMode(url, schema, prompt);
    
    if (!jsonData || !jsonData.price_gbp) {
      return null;
    }
    
    // Transform to CSV format
    return {
      procedure_id: procedure,
      city: city,
      cost_min: jsonData.price_min_gbp || jsonData.price_gbp,
      cost_max: jsonData.price_max_gbp || jsonData.price_gbp,
      clinic_count: 1, // One hospital per URL
      date: new Date().toISOString().split('T')[0],
      source: 'TreatmentConnect',
      hospital_name: jsonData.hospital_name,
      rating: jsonData.rating_stars,
      avg_uk_price: jsonData.avg_uk_price
    };
  } catch (error) {
    console.error(`  ❌ TreatmentConnect extraction failed: ${error.message}`);
    return null;
  }
}
```

### 2.2 Обновить scrapePHINData()

**Файл:** `scripts/scraper.js`

**Изменения:**
- Переименовать в `scrapePrivateCosts()` (более общее название)
- Добавить приоритет: TreatmentConnect → Direct clinics → Fallback
- Интегрировать обработку TreatmentConnect URL

### 2.3 Создать batch processor

**Файл:** `scripts/batch-processor.js`

**Функционал:**
- Обработка массива URL батчами
- Rate limiting (6 секунд между запросами)
- Retry логика
- Прогресс-трекинг
- Сохранение результатов

---

## 📋 Этап 3: Агрегация данных (День 4)

### 3.1 Создать агрегатор

**Файл:** `scripts/aggregator.js`

**Функции:**
```javascript
/**
 * Aggregate prices by city and procedure
 */
export function aggregatePricesByCity(results) {
  // Группировка по city → procedure
  // Расчет: min, max, average, median
  // Подсчет количества клиник
}

/**
 * Generate city-level statistics
 */
export function generateCityStats(aggregated) {
  // Формат для CSV
  // Соответствие структуре private_costs.csv
}
```

### 3.2 Обновить логику сохранения

**Файл:** `scripts/scraper.js`

**Изменения:**
- После сбора всех данных → агрегация
- Группировка по city + procedure
- Расчет min/max/average
- Сохранение в `private_costs.csv`

---

## 📋 Этап 4: Валидация с прямыми сайтами (Неделя 2)

### 4.1 Добавить поддержку Spire Healthcare

**Файл:** `scripts/scraper.js`

**Новая функция:**
```javascript
async function extractSpirePrices(url, procedure, city) {
  // Использовать spirePrompt из technical-implementation-guide.md
  // Извлечь цены со страниц Spire
  // Валидировать против TreatmentConnect
}
```

### 4.2 Добавить поддержку других сетей

- Nuffield Health
- Circle Health Group
- Ramsay Health Care

### 4.3 Cross-validation

**Файл:** `scripts/validator.js`

**Функционал:**
- Сравнение цен между источниками
- Флаг расхождений (>10% разница)
- Расчет match rate
- Quality scoring

---

## 📋 Этап 5: Тестирование (День 5)

### 5.1 Unit тесты

**Файл:** `scripts/test-treatmentconnect.js`

**Тесты:**
- Извлечение данных из TreatmentConnect URL
- Валидация схемы
- Обработка ошибок
- Агрегация данных

### 5.2 Integration тесты

**Файл:** `scripts/test-integration.js`

**Тесты:**
- Полный цикл: URL → Extraction → Aggregation → CSV
- Проверка формата данных
- Сравнение с ожидаемыми результатами

### 5.3 Manual validation

- Проверить 10 случайных URL вручную
- Сравнить извлеченные цены с реальными
- Документировать расхождения

---

## 📋 Этап 6: Интеграция с существующей системой

### 6.1 Обновить main() функцию

**Файл:** `scripts/scraper.js`

**Изменения:**
```javascript
async function main() {
  // ... существующий код
  
  // НОВОЕ: Обработка TreatmentConnect URL
  const treatmentConnectUrls = await loadTreatmentConnectUrls();
  
  for (const urlData of treatmentConnectUrls) {
    const { url, procedure, city } = urlData;
    
    // Извлечь цены
    const priceData = await extractTreatmentConnectPrices(url, procedure, city);
    
    if (priceData) {
      privateCostsData.push(priceData);
    }
    
    // Rate limiting
    await sleep(6000);
  }
  
  // Агрегация перед сохранением
  const aggregated = aggregatePricesByCity(privateCostsData);
  
  // Сохранение
  // ...
}
```

### 6.2 Обновить fallback логику

**Приоритет:**
1. TreatmentConnect (новый основной)
2. Прямые сайты клиник (валидация)
3. Старые парсеры (fallback)
4. CSV fallback (последний резерв)

---

## 📋 Этап 7: Документация и мониторинг

### 7.1 Обновить документацию

**Файлы:**
- `scripts/SCRAPER_SETUP_COMPLETE.md` - добавить TreatmentConnect
- `scripts/MIGRATION_COMPLETE.md` - обновить статус
- Создать `scripts/TREATMENTCONNECT_GUIDE.md`

### 7.2 Добавить логирование

**Файл:** `scripts/scraper.js`

**Добавить:**
- Логирование источников данных
- Статистика успешных/неуспешных извлечений
- Метрики качества данных

### 7.3 Мониторинг

**Создать:**
- `scripts/monitor.js` - скрипт для проверки качества данных
- Алерты при аномалиях в ценах
- Отслеживание изменений в структуре сайтов

---

## 🔧 Технические детали

### JSON Schema для TreatmentConnect

**Файл:** `scripts/schemas/treatmentconnect-schema.js` (новый)

```javascript
export const treatmentConnectSchema = {
  type: "object",
  properties: {
    hospital_name: { type: "string" },
    procedure_name: { type: "string" },
    price_gbp: { type: "number" },
    price_min_gbp: { type: "number" },
    price_max_gbp: { type: "number" },
    city: { type: "string" },
    rating_stars: { type: "number" },
    rating_count: { type: "integer" },
    avg_uk_price: { type: "number" }
  },
  required: ["hospital_name", "procedure_name", "price_gbp", "city"]
};
```

### Промпт для TreatmentConnect

**Файл:** `scripts/schemas/private-costs-schema.js`

**Добавить функцию:**
```javascript
export const getTreatmentConnectPrompt = (procedure, city) => {
  return `Extract pricing information from TreatmentConnect.co.uk hospital pages.

CRITICAL RULES:
1. Extract ONLY numeric values for all prices (no currency symbols, no commas)
2. Convert "£2,500" to 2500
3. If price shows "From £X", return X as price_min_gbp
4. Extract hospital name from H1 heading (format: "Hospital Name | Procedure £X")
5. City is usually shown in the address section
6. Rating is shown as "X out of 5 stars" - extract the X value
7. Look for "Average UK price: £X" for avg_uk_price

EXAMPLE:
H1: "Spire London East Hospital | Cataract Surgery £2,000"
Extract: hospital_name="Spire London East Hospital", price_gbp=2000

RETURN:
- Only the JSON object matching the schema
- No explanatory text`;
};
```

---

## 📊 Ожидаемые результаты

### После Недели 1:
- ✅ 150-200 price points собрано
- ✅ 5 городов покрыто
- ✅ 3 процедуры покрыты
- ✅ Базовая агрегация работает
- ✅ CSV файлы обновлены

### После Недели 2:
- ✅ 300-400 price points собрано
- ✅ Cross-validation работает
- ✅ Quality metrics внедрены
- ✅ Документация обновлена

### После Недели 3-4:
- ✅ Автоматизированный pipeline
- ✅ 600+ price points в базе
- ✅ Регулярные обновления
- ✅ Мониторинг качества

---

## ✅ Чеклист реализации

### День 1: Подготовка
- [ ] Обновить `config.js` с TreatmentConnect URL
- [ ] Создать `treatmentconnect-urls.js` с 60+ URL
- [ ] Обновить JSON схемы
- [ ] Протестировать на 3-5 URL

### День 2-3: Интеграция
- [ ] Создать `extractTreatmentConnectPrices()`
- [ ] Обновить `scrapePHINData()` → `scrapePrivateCosts()`
- [ ] Создать batch processor
- [ ] Обработать все 60+ URL

### День 4: Агрегация
- [ ] Создать `aggregator.js`
- [ ] Реализовать агрегацию по городам
- [ ] Обновить логику сохранения CSV
- [ ] Протестировать агрегацию

### День 5: Тестирование
- [ ] Unit тесты для TreatmentConnect
- [ ] Integration тесты
- [ ] Manual validation (10 URL)
- [ ] Исправить найденные проблемы

### Неделя 2: Валидация
- [ ] Добавить поддержку Spire
- [ ] Добавить поддержку Nuffield
- [ ] Добавить поддержку Circle
- [ ] Реализовать cross-validation
- [ ] Обновить документацию

### Неделя 3-4: Автоматизация
- [ ] Настроить scheduled runs
- [ ] Добавить мониторинг
- [ ] Историческое отслеживание
- [ ] Финальное тестирование

---

## 🚨 Риски и митигация

### Риск 1: Изменение структуры TreatmentConnect
**Митигация:**
- Мониторинг изменений структуры
- Fallback на прямые сайты клиник
- Регулярное тестирование

### Риск 2: Rate limiting
**Митигация:**
- Соблюдение 6-секундной задержки
- Batch processing
- Retry с exponential backoff

### Риск 3: Неактуальные цены
**Митигация:**
- Регулярные обновления (weekly/monthly)
- Timestamp tracking
- Валидация против прямых источников

---

## 📝 Следующие шаги

### Немедленно (сегодня):
1. ✅ Изучить все 4 документа
2. ⏭️ Обновить `config.js`
3. ⏭️ Создать `treatmentconnect-urls.js`
4. ⏭️ Протестировать на 5 URL

### Эта неделя:
1. ⏭️ Интегрировать TreatmentConnect
2. ⏭️ Обработать 60+ URL
3. ⏭️ Создать агрегацию
4. ⏭️ Обновить CSV файлы

### Следующая неделя:
1. ⏭️ Добавить валидацию
2. ⏭️ Cross-validate цены
3. ⏭️ Улучшить качество
4. ⏭️ Автоматизировать

---

**Статус:** ✅ План готов к реализации  
**Приоритет:** 🔥 Высокий  
**Оценка времени:** 2-4 недели до production

