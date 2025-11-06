# ПОШАГОВЫЙ ПЛАН: ОТ ИНИЦИАЛИЗАЦИИ ДО ФАЙЛОВ С ДАННЫМИ

**Цель:** Создать готовые CSV файлы с реальными данными для отображения на сайте  
**Время:** 2-3 часа  
**Результат:** 4 CSV файла готовых к использованию в Next.js

---

## 📋 ОБЩАЯ СТРУКТУРА ПЛАНА

```
ШАГ 1: Инициализация проекта
   ↓
ШАГ 2: Подготовка структуры данных
   ↓
ШАГ 3: Сбор данных (NHS + Private)
   ↓
ШАГ 4: Валидация и очистка данных
   ↓
ШАГ 5: Создание финальных CSV файлов
   ↓
ШАГ 6: Проверка готовности данных
```

---

## ШАГ 1: ИНИЦИАЛИЗАЦИЯ ПРОЕКТА

### 1.1 Создание структуры папок

```bash
# Создай корневую папку проекта
mkdir compare-the-wait
cd compare-the-wait

# Создай структуру для данных
mkdir -p public/data
mkdir -p data/raw
mkdir -p data/processed
mkdir -p scripts
```

**Результат:**
```
compare-the-wait/
├── public/
│   └── data/          # Финальные CSV для Next.js
├── data/
│   ├── raw/          # Сырые данные от Claude/источников
│   └── processed/     # Обработанные данные перед финалом
└── scripts/          # Утилиты для обработки данных
```

### 1.2 Проверка исходных документов

**Действия:**
- ✅ Убедись что есть файлы:
  - `elderly_procedures_analysis.csv` - список процедур
  - `cities_for_launch.csv` - список городов
  - `data_sources_explanation.txt` - источники данных

**Время:** 5 минут

---

## ШАГ 2: ПОДГОТОВКА СТРУКТУРЫ ДАННЫХ

### 2.1 Создание шаблонов CSV файлов

**Файл 1: `data/processed/procedures.csv`**

```csv
procedure_id,name,specialty,description,nhs_code
cataract,Cataract Surgery,Ophthalmology,Removal and replacement of cloudy lens,C71
hip,Hip Replacement,Orthopedics,Total hip arthroplasty for arthritis,H08
knee,Knee Replacement,Orthopedics,Total knee arthroplasty for arthritis,H09
```

**Файл 2: `data/processed/nhs_waits.csv` (шаблон)**

```csv
procedure_id,city,nhs_trust,avg_wait_weeks,date,source
```

**Файл 3: `data/processed/private_costs.csv` (шаблон)**

```csv
procedure_id,city,cost_min,cost_max,clinic_count,date,source
```

**Файл 4: `data/processed/clinics.csv` (шаблон)**

```csv
clinic_id,name,city,procedure_id,price,url,phone,last_updated
```

### 2.2 Определение списков для сбора

**Процедуры (3 для MVP):**
- `cataract` - Cataract Surgery
- `hip` - Hip Replacement  
- `knee` - Knee Replacement

**Города (5 для MVP):**
- `London`
- `Manchester`
- `Birmingham`
- `Leeds`
- `Bristol`

**Итого комбинаций:** 3 процедуры × 5 городов = 15 страниц сравнения

**Время:** 10 минут

---

## ШАГ 3: СБОР ДАННЫХ

### 3.1 Метод A: Claude Deep Research (РЕКОМЕНДУЕТСЯ)

**Источник инструкции:** `claude-perplexity-mvp-guide.md`

**Действия:**

1. **Открой claude.ai** (нужен Claude Pro)
2. **Выбери режим "Deep Research"**
3. **Скопируй EXACT PROMPT из `claude-perplexity-mvp-guide.md`:**

```
Collect structured healthcare data from these UK public sources.

TASK 1: NHS WAITING TIMES
Source: My Planned Care (https://www.myplannedcare.nhs.uk/)
Extract and format as CSV:
- procedure_id: cataract, hip, knee (use these exact IDs)
- city: London, Manchester, Birmingham, Leeds, Bristol
- nhs_trust_name: (from website)
- avg_wait_weeks: (integer, current average)
- date: today's date

TASK 2: PRIVATE SURGERY COSTS
Source: PHIN Independent Provider Finder (https://www.phin.org.uk/independent-provider-finder/)
Extract and format as CSV:
- procedure_id: cataract, hip, knee
- city: London, Manchester, Birmingham, Leeds, Bristol
- cost_min_gbp: (minimum price found, integer)
- cost_max_gbp: (maximum price found, integer)
- clinic_count: (number of clinics offering this procedure)
- date: today's date

TASK 3: TOP CLINICS
From PHIN, find top 3-5 cheapest clinics per procedure-city combo.
Format as CSV:
- procedure_id, city, clinic_name, price_gbp, phone_number, website_url

OUTPUT:
Return THREE separate CSV files:
1. nhs_waits.csv (15 rows: 5 cities × 3 procedures)
2. private_costs.csv (15 rows: 5 cities × 3 procedures)
3. clinics.csv (45-75 rows: top 3-5 clinics per combo)

Include:
- Proper CSV headers
- Data quality notes (where data was found, confidence level)
- Last updated timestamp
```

4. **Жди 15-20 минут** (Claude исследует источники)
5. **Получи 3 CSV файла от Claude**
6. **Сохрани в `data/raw/`:**
   - `data/raw/nhs_waits_claude.csv`
   - `data/raw/private_costs_claude.csv`
   - `data/raw/clinics_claude.csv`

**Время:** 20-25 минут

---

### 3.2 Метод B: Ручной сбор (АЛЬТЕРНАТИВА)

**Если нет Claude Pro**, используй ручной сбор:

**Источники (из `data_sources_explanation.txt`):**

1. **NHS данные:**
   - URL: https://www.myplannedcare.nhs.uk/
   - Что искать: Average wait times по процедурам и городам
   - Заполни: `data/raw/nhs_waits_manual.csv`

2. **Private данные:**
   - URL: https://www.phin.org.uk/independent-provider-finder/
   - Что искать: Price ranges по процедурам и городам
   - Заполни: `data/raw/private_costs_manual.csv`

3. **Клиники:**
   - URL: PHIN + clinic websites (Moorfields, Circle, Spire, etc.)
   - Что искать: Top 3-5 клиник по цене для каждой комбинации
   - Заполни: `data/raw/clinics_manual.csv`

**Время:** 1-2 часа (зависит от скорости)

---

## ШАГ 4: ВАЛИДАЦИЯ И ОЧИСТКА ДАННЫХ

### 4.1 Проверка структуры данных

**Создай скрипт `scripts/validate_data.js`:**

```javascript
// Простая валидация CSV файлов
const fs = require('fs');
const path = require('path');

function validateCSV(filePath, expectedColumns) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  // Проверка заголовков
  const missing = expectedColumns.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    console.error(`❌ Missing columns in ${filePath}:`, missing);
    return false;
  }
  
  // Проверка количества строк
  const dataRows = lines.length - 1; // минус заголовок
  console.log(`✅ ${filePath}: ${dataRows} rows, all columns present`);
  return true;
}

// Валидация
validateCSV('data/raw/nhs_waits_claude.csv', 
  ['procedure_id', 'city', 'nhs_trust', 'avg_wait_weeks', 'date', 'source']);

validateCSV('data/raw/private_costs_claude.csv', 
  ['procedure_id', 'city', 'cost_min', 'cost_max', 'clinic_count', 'date', 'source']);

validateCSV('data/raw/clinics_claude.csv', 
  ['procedure_id', 'city', 'clinic_name', 'price', 'phone', 'url']);
```

**Запуск:**
```bash
node scripts/validate_data.js
```

### 4.2 Проверка полноты данных

**Проверь что есть данные для всех комбинаций:**

- ✅ 3 процедуры × 5 городов = 15 записей в `nhs_waits.csv`
- ✅ 3 процедуры × 5 городов = 15 записей в `private_costs.csv`
- ✅ 3-5 клиник × 15 комбинаций = 45-75 записей в `clinics.csv`

**Если данных не хватает:**
- Заполни недостающие строки вручную
- Используй данные из `elderly_procedures_analysis.csv` как fallback
- Отметь в `source` колонке: "Estimated from market research"

### 4.3 Очистка данных

**Проверь:**
- ✅ Нет пустых значений в ключевых полях
- ✅ Числа в правильном формате (целые числа для weeks, prices)
- ✅ Даты в формате YYYY-MM-DD
- ✅ Нет лишних пробелов в названиях
- ✅ URL начинаются с https://
- ✅ Телефоны в UK формате (020-xxxx-xxxx или +44...)

**Время:** 15-20 минут

---

## ШАГ 5: СОЗДАНИЕ ФИНАЛЬНЫХ CSV ФАЙЛОВ

### 5.1 Создание `procedures.csv`

**Файл:** `public/data/procedures.csv`

**Содержимое:**
```csv
procedure_id,name,specialty,description,nhs_code
cataract,Cataract Surgery,Ophthalmology,Removal and replacement of cloudy lens,C71
hip,Hip Replacement,Orthopedics,Total hip arthroplasty for arthritis,H08
knee,Knee Replacement,Orthopedics,Total knee arthroplasty for arthritis,H09
```

**Источник:** Данные из `elderly_procedures_analysis.csv` (TIER 1 процедуры)

### 5.2 Обработка `nhs_waits.csv`

**Шаги:**

1. **Открой `data/raw/nhs_waits_claude.csv`**
2. **Проверь формат:**
   - `procedure_id` должен быть: `cataract`, `hip`, `knee`
   - `city` должен быть: `London`, `Manchester`, `Birmingham`, `Leeds`, `Bristol`
   - `avg_wait_weeks` - целое число (18, 24, 22, etc.)
   - `date` - формат YYYY-MM-DD
   - `source` - "My Planned Care"

3. **Если нужно исправить:**
   ```bash
   # Открой в Excel/Google Sheets
   # Исправь значения
   # Export как CSV (UTF-8)
   ```

4. **Скопируй в финальную папку:**
   ```bash
   cp data/raw/nhs_waits_claude.csv public/data/nhs_waits.csv
   ```

**Пример финального файла:**
```csv
procedure_id,city,nhs_trust,avg_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,2025-01-15,My Planned Care
cataract,Manchester,Manchester University NHS Foundation Trust,20,2025-01-15,My Planned Care
cataract,Birmingham,University Hospitals Birmingham NHS Trust,19,2025-01-15,My Planned Care
cataract,Leeds,Leeds Teaching Hospitals NHS Trust,21,2025-01-15,My Planned Care
cataract,Bristol,University Hospitals Bristol NHS Trust,18,2025-01-15,My Planned Care
hip,London,Imperial College Healthcare NHS Trust,24,2025-01-15,My Planned Care
hip,Manchester,Manchester University NHS Foundation Trust,26,2025-01-15,My Planned Care
hip,Birmingham,University Hospitals Birmingham NHS Trust,25,2025-01-15,My Planned Care
hip,Leeds,Leeds Teaching Hospitals NHS Trust,27,2025-01-15,My Planned Care
hip,Bristol,University Hospitals Bristol NHS Trust,24,2025-01-15,My Planned Care
knee,London,Imperial College Healthcare NHS Trust,22,2025-01-15,My Planned Care
knee,Manchester,Manchester University NHS Foundation Trust,24,2025-01-15,My Planned Care
knee,Birmingham,University Hospitals Birmingham NHS Trust,23,2025-01-15,My Planned Care
knee,Leeds,Leeds Teaching Hospitals NHS Trust,25,2025-01-15,My Planned Care
knee,Bristol,University Hospitals Bristol NHS Trust,22,2025-01-15,My Planned Care
```

### 5.3 Обработка `private_costs.csv`

**Шаги:**

1. **Открой `data/raw/private_costs_claude.csv`**
2. **Проверь формат:**
   - `procedure_id`: `cataract`, `hip`, `knee`
   - `city`: `London`, `Manchester`, `Birmingham`, `Leeds`, `Bristol`
   - `cost_min`: целое число (2500, 13000, etc.)
   - `cost_max`: целое число (3500, 15500, etc.)
   - `clinic_count`: целое число (12, 8, 9, etc.)
   - `date`: YYYY-MM-DD
   - `source`: "PHIN + clinic websites"

3. **Скопируй в финальную папку:**
   ```bash
   cp data/raw/private_costs_claude.csv public/data/private_costs.csv
   ```

**Пример финального файла:**
```csv
procedure_id,city,cost_min,cost_max,clinic_count,date,source
cataract,London,2500,3500,12,2025-01-15,PHIN + clinic websites
cataract,Manchester,2400,3300,8,2025-01-15,PHIN + clinic websites
cataract,Birmingham,2500,3400,9,2025-01-15,PHIN + clinic websites
cataract,Leeds,2400,3300,7,2025-01-15,PHIN + clinic websites
cataract,Bristol,2500,3500,6,2025-01-15,PHIN + clinic websites
hip,London,13000,15500,15,2025-01-15,PHIN + clinic websites
hip,Manchester,12500,15000,10,2025-01-15,PHIN + clinic websites
hip,Birmingham,12800,15300,11,2025-01-15,PHIN + clinic websites
hip,Leeds,12500,15000,9,2025-01-15,PHIN + clinic websites
hip,Bristol,13000,15500,8,2025-01-15,PHIN + clinic websites
knee,London,13000,15500,15,2025-01-15,PHIN + clinic websites
knee,Manchester,12500,15000,10,2025-01-15,PHIN + clinic websites
knee,Birmingham,12800,15300,11,2025-01-15,PHIN + clinic websites
knee,Leeds,12500,15000,9,2025-01-15,PHIN + clinic websites
knee,Bristol,13000,15500,8,2025-01-15,PHIN + clinic websites
```

### 5.4 Обработка `clinics.csv`

**Шаги:**

1. **Открой `data/raw/clinics_claude.csv`**
2. **Создай `clinic_id` для каждой клиники:**
   - Формат: `{clinic_name_lowercase}_{city_lowercase}`
   - Пример: `moorfields_london`, `circle_manchester`

3. **Проверь формат:**
   - `clinic_id`: уникальный идентификатор
   - `name`: название клиники
   - `city`: `London`, `Manchester`, `Birmingham`, `Leeds`, `Bristol`
   - `procedure_id`: `cataract`, `hip`, `knee`
   - `price`: целое число (2800, 14500, etc.)
   - `url`: полный URL (https://...)
   - `phone`: UK формат (020-xxxx-xxxx или +44...)
   - `last_updated`: YYYY-MM-DD

4. **Добавь колонку `last_updated`** если её нет

5. **Скопируй в финальную папку:**
   ```bash
   cp data/processed/clinics.csv public/data/clinics.csv
   ```

**Пример финального файла:**
```csv
clinic_id,name,city,procedure_id,price,url,phone,last_updated
moorfields_london_cataract,Moorfields Private Eye Hospital,London,cataract,2800,https://moorfields.nhs.uk/private/cataract,020-7253-3411,2025-01-15
circle_london_cataract,Circle Eye Services,London,cataract,2500,https://circleeye.co.uk,0203-198-0091,2025-01-15
spire_london_cataract,Spire London Eye Hospital,London,cataract,3200,https://spirehealthcare.com/london-eye,020-7483-5155,2025-01-15
...
```

**Время:** 20-30 минут

---

## ШАГ 6: ПРОВЕРКА ГОТОВНОСТИ ДАННЫХ

### 6.1 Финальная проверка структуры

**Проверь что все файлы на месте:**
```bash
ls -la public/data/
```

**Должны быть:**
- ✅ `procedures.csv`
- ✅ `nhs_waits.csv`
- ✅ `private_costs.csv`
- ✅ `clinics.csv`

### 6.2 Проверка количества записей

**Создай скрипт `scripts/check_data.js`:**

```javascript
const fs = require('fs');
const path = require('path');

function countRows(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  return lines.length - 1; // минус заголовок
}

console.log('📊 Data File Check:');
console.log(`procedures.csv: ${countRows('public/data/procedures.csv')} rows (expected: 3)`);
console.log(`nhs_waits.csv: ${countRows('public/data/nhs_waits.csv')} rows (expected: 15)`);
console.log(`private_costs.csv: ${countRows('public/data/private_costs.csv')} rows (expected: 15)`);
console.log(`clinics.csv: ${countRows('public/data/clinics.csv')} rows (expected: 45-75)`);
```

**Запуск:**
```bash
node scripts/check_data.js
```

### 6.3 Проверка качества данных

**Чеклист:**

- ✅ Все 15 комбинаций процедура×город присутствуют в `nhs_waits.csv`
- ✅ Все 15 комбинаций присутствуют в `private_costs.csv`
- ✅ Минимум 3 клиники на каждую комбинацию в `clinics.csv`
- ✅ Все цены в диапазоне (cataract: £2,000-£4,000; hip/knee: £12,000-£16,000)
- ✅ Все wait times разумные (10-35 недель для NHS)
- ✅ Все даты актуальные (в пределах 7 дней)
- ✅ Все URL рабочие (можно проверить вручную несколько)

**Время:** 10-15 минут

---

## 📋 ИТОГОВЫЙ ЧЕКЛИСТ

### ✅ Все шаги выполнены:

- [ ] ШАГ 1: Проект инициализирован, папки созданы
- [ ] ШАГ 2: Шаблоны CSV созданы, списки процедур/городов определены
- [ ] ШАГ 3: Данные собраны (Claude или ручной метод)
- [ ] ШАГ 4: Данные валидированы и очищены
- [ ] ШАГ 5: Финальные CSV файлы созданы в `public/data/`
- [ ] ШАГ 6: Проверка пройдена, все файлы готовы

### 📁 Финальная структура:

```
compare-the-wait/
├── public/
│   └── data/
│       ├── procedures.csv      ✅ (3 строки)
│       ├── nhs_waits.csv       ✅ (15 строк)
│       ├── private_costs.csv   ✅ (15 строк)
│       └── clinics.csv         ✅ (45-75 строк)
├── data/
│   ├── raw/                    (исходные данные)
│   └── processed/              (промежуточные данные)
└── scripts/
    ├── validate_data.js        (опционально)
    └── check_data.js           (опционально)
```

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

**После создания файлов данных:**

1. **Начни разработку фронтенда** (инструкции в `prd-elderly-surgery-guide.md`)
2. **Используй CSV файлы** из `public/data/` в Next.js
3. **Тестируй отображение** данных на страницах сравнения
4. **Настрой автоматизацию** (Неделя 1, инструкции в `firecrawl-cursor-automation.md`)

---

## ⏱️ ОЦЕНКА ВРЕМЕНИ

- **ШАГ 1:** 5 минут
- **ШАГ 2:** 10 минут
- **ШАГ 3:** 20-25 минут (Claude) или 1-2 часа (ручной)
- **ШАГ 4:** 15-20 минут
- **ШАГ 5:** 20-30 минут
- **ШАГ 6:** 10-15 минут

**ИТОГО:** 1.5-2 часа (с Claude) или 2.5-3.5 часа (ручной метод)

---

**Готово! Файлы данных созданы и готовы к использованию в Next.js.** 🎉

