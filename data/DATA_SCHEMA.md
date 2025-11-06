# СХЕМА ДАННЫХ И СПИСКИ ДЛЯ MVP

## 📋 СПИСОК ПРОЦЕДУР (3 для MVP - TIER 1)

### Процедуры для MVP:

| procedure_id | name | specialty | NHS Code | Описание |
|-------------|------|-----------|----------|----------|
| `cataract` | Cataract Surgery | Ophthalmology | C71 | Removal and replacement of cloudy lens |
| `hip` | Hip Replacement | Orthopedics | H08 | Total hip arthroplasty for arthritis |
| `knee` | Knee Replacement | Orthopedics | H09 | Total knee arthroplasty for arthritis |

**Источник:** `elderly_procedures_analysis.csv` (TIER 1 - highest priority)

**Всего процедур:** 3

---

## 🗺️ СПИСОК ГОРОДОВ (5 для MVP - PHASE 1)

### Города для MVP:

| city | Region | Elderly Pop (65+) | Private Clinic Density | Priority |
|------|--------|-------------------|------------------------|----------|
| `London` | England | ~1.5M | High (50+ major clinics) | START HERE 🎯 |
| `Manchester` | England | ~200k | Medium-High (15+ clinics) | START HERE 🎯 |
| `Birmingham` | England | ~250k | Medium-High (15+ clinics) | START HERE 🎯 |
| `Leeds` | England | ~180k | Medium (10+ clinics) | START HERE 🎯 |
| `Bristol` | England | ~150k | Medium (8+ clinics) | START HERE 🎯 |

**Источник:** `cities_for_launch.csv` (PHASE 1 - MVP)

**Всего городов:** 5

---

## 📊 КОМБИНАЦИИ ДЛЯ СБОРА ДАННЫХ

**Итого комбинаций процедура × город:**
- 3 процедуры × 5 городов = **15 страниц сравнения**

### Матрица комбинаций:

```
                London | Manchester | Birmingham | Leeds | Bristol
───────────────────────────────────────────────────────────────────
cataract       [X]     |    [X]     |    [X]     |  [X]  |  [X]
hip            [X]     |    [X]     |    [X]     |  [X]  |  [X]
knee           [X]     |    [X]     |    [X]     |  [X]  |  [X]
```

**Всего записей в `nhs_waits.csv`:** 15 строк  
**Всего записей в `private_costs.csv`:** 15 строк  
**Всего записей в `clinics.csv`:** 45-75 строк (3-5 клиник на каждую комбинацию)

---

## 📁 СТРУКТУРА CSV ФАЙЛОВ

### 1. procedures.csv

**Путь:** `data/processed/procedures.csv`  
**Статус:** ✅ Заполнен (3 строки)

**Колонки:**
- `procedure_id` - уникальный ID (cataract, hip, knee)
- `name` - полное название процедуры
- `specialty` - медицинская специальность
- `description` - краткое описание
- `nhs_code` - NHS код процедуры

**Пример:**
```csv
procedure_id,name,specialty,description,nhs_code
cataract,Cataract Surgery,Ophthalmology,Removal and replacement of cloudy lens,C71
```

---

### 2. nhs_waits.csv

**Путь:** `data/processed/nhs_waits.csv`  
**Статус:** ⏳ Шаблон готов, нужно заполнить данными

**Колонки:**
- `procedure_id` - ID процедуры (cataract, hip, knee)
- `city` - название города (London, Manchester, Birmingham, Leeds, Bristol)
- `nhs_trust` - название NHS Trust
- `avg_wait_weeks` - среднее ожидание в неделях (целое число)
- `date` - дата обновления (формат: YYYY-MM-DD)
- `source` - источник данных (My Planned Care)

**Пример заполненной строки:**
```csv
procedure_id,city,nhs_trust,avg_wait_weeks,date,source
cataract,London,Imperial College Healthcare NHS Trust,18,2025-01-15,My Planned Care
hip,Manchester,Manchester University NHS Foundation Trust,24,2025-01-15,My Planned Care
knee,Birmingham,University Hospitals Birmingham NHS Trust,22,2025-01-15,My Planned Care
```

**Ожидаемое количество строк:** 15 (3 процедуры × 5 городов)

---

### 3. private_costs.csv

**Путь:** `data/processed/private_costs.csv`  
**Статус:** ⏳ Шаблон готов, нужно заполнить данными

**Колонки:**
- `procedure_id` - ID процедуры (cataract, hip, knee)
- `city` - название города (London, Manchester, Birmingham, Leeds, Bristol)
- `cost_min` - минимальная цена в GBP (целое число, без символа £)
- `cost_max` - максимальная цена в GBP (целое число, без символа £)
- `clinic_count` - количество клиник, предлагающих процедуру (целое число)
- `date` - дата обновления (формат: YYYY-MM-DD)
- `source` - источник данных (PHIN + clinic websites)

**Пример заполненной строки:**
```csv
procedure_id,city,cost_min,cost_max,clinic_count,date,source
cataract,London,2500,3500,12,2025-01-15,PHIN + clinic websites
hip,Manchester,12500,15000,10,2025-01-15,PHIN + clinic websites
knee,Birmingham,12800,15300,11,2025-01-15,PHIN + clinic websites
```

**Ожидаемое количество строк:** 15 (3 процедуры × 5 городов)

**Ожидаемые диапазоны цен:**
- `cataract`: £2,400-£3,500
- `hip`: £12,500-£15,500
- `knee`: £12,500-£15,500

---

### 4. clinics.csv

**Путь:** `data/processed/clinics.csv`  
**Статус:** ⏳ Шаблон готов, нужно заполнить данными

**Колонки:**
- `clinic_id` - уникальный ID клиники (формат: `{clinic_name_lowercase}_{city_lowercase}_{procedure_id}`)
- `name` - название клиники
- `city` - город (London, Manchester, Birmingham, Leeds, Bristol)
- `procedure_id` - ID процедуры (cataract, hip, knee)
- `price` - цена в GBP (целое число, без символа £)
- `url` - URL сайта клиники (полный URL с https://)
- `phone` - телефон в UK формате (020-xxxx-xxxx или +44...)
- `last_updated` - дата последнего обновления (формат: YYYY-MM-DD)

**Пример заполненной строки:**
```csv
clinic_id,name,city,procedure_id,price,url,phone,last_updated
moorfields_london_cataract,Moorfields Private Eye Hospital,London,cataract,2800,https://moorfields.nhs.uk/private/cataract,020-7253-3411,2025-01-15
circle_london_cataract,Circle Eye Services,London,cataract,2500,https://circleeye.co.uk,0203-198-0091,2025-01-15
spire_london_cataract,Spire London Eye Hospital,London,cataract,3200,https://spirehealthcare.com/london-eye,020-7483-5155,2025-01-15
```

**Ожидаемое количество строк:** 45-75 (3-5 клиник на каждую из 15 комбинаций)

**Правила для `clinic_id`:**
- Используй lowercase
- Замени пробелы на подчеркивания
- Формат: `{clinic_name}_{city}_{procedure_id}`
- Примеры:
  - `moorfields_london_cataract`
  - `circle_manchester_hip`
  - `spire_birmingham_knee`

---

## ✅ ПРОВЕРКА ГОТОВНОСТИ

### Чеклист перед заполнением данных:

- [x] Создана папка `data/processed/`
- [x] Создан `procedures.csv` с 3 процедурами
- [x] Создан шаблон `nhs_waits.csv`
- [x] Создан шаблон `private_costs.csv`
- [x] Создан шаблон `clinics.csv`
- [x] Определены 3 процедуры (cataract, hip, knee)
- [x] Определены 5 городов (London, Manchester, Birmingham, Leeds, Bristol)
- [x] Подсчитано количество комбинаций (15)

### Следующий шаг:

📝 **ШАГ 3: Сбор данных** (см. `STEP_BY_STEP_DATA_PREPARATION.md`)

---

## 📚 ИСТОЧНИКИ ДАННЫХ

### NHS данные:
- **Источник:** My Planned Care (https://www.myplannedcare.nhs.uk/)
- **Что искать:** Average wait times по процедурам и городам
- **Формат:** CSV файл с колонками выше

### Private данные:
- **Источник:** PHIN Independent Provider Finder (https://www.phin.org.uk/independent-provider-finder/)
- **Что искать:** Price ranges по процедурам и городам
- **Формат:** CSV файл с колонками выше

### Клиники:
- **Источник:** PHIN + clinic websites (Moorfields, Circle, Spire, etc.)
- **Что искать:** Top 3-5 клиник по цене для каждой комбинации
- **Формат:** CSV файл с колонками выше

**Подробнее:** см. `data_sources_explanation.txt`

