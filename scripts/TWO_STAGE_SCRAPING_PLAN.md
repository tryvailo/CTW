# План реализации двухэтапного парсинга

## Логика пользователя

### Режим "fast" (каждые 2 недели)
- Парсим только страницу процедуры: `/hospitals/{hospital}/{procedure}`
- Обновляем только: `price` (цена)
- НЕ трогаем: `url`, `phone`, `address` (если они уже есть в CSV)

### Режим "full" (раз в 3 месяца)
- Парсим страницу процедуры: `/hospitals/{hospital}/{procedure}` → цена
- Парсим главную страницу: `/hospitals/{hospital}/` → детали (url, phone, address, rating, CQC)
- Обновляем все поля

## Архитектура

### 1. Аргументы командной строки
```bash
node scripts/scraper.js --mode=fast   # Только цены (каждые 2 недели)
node scripts/scraper.js --mode=full   # Все данные (раз в 3 месяца)
node scripts/scraper.js               # По умолчанию: fast
```

### 2. Структура CSV
Добавить поле `details_last_updated`:
```csv
clinic_id,name,city,procedure_id,price,url,phone,last_updated,details_last_updated
```

### 3. Логика мержинга данных

#### Режим "fast":
1. Читаем существующий CSV
2. Для каждой клиники:
   - Обновляем только `price` и `last_updated`
   - Оставляем `url`, `phone`, `address` без изменений
   - `details_last_updated` не меняем

#### Режим "full":
1. Читаем существующий CSV
2. Для каждой клиники:
   - Обновляем `price` и `last_updated` (со страницы процедуры)
   - Обновляем `url`, `phone`, `address` (с главной страницы)
   - Обновляем `details_last_updated` (сегодняшняя дата)

### 4. GitHub Actions

#### Би-недельное обновление (цены):
```yaml
name: Bi-Weekly Price Update
on:
  schedule:
    - cron: '0 9 1,15 * *'  # 1st and 15th of every month
  workflow_dispatch:
jobs:
  update-prices:
    steps:
      - run: node scripts/scraper.js --mode=fast
```

#### Квартальное обновление (детали):
```yaml
name: Quarterly Clinic Details Update
on:
  schedule:
    - cron: '0 9 1 1,4,7,10 *'  # 1st of Jan, Apr, Jul, Oct
  workflow_dispatch:
jobs:
  update-details:
    steps:
      - run: node scripts/scraper.js --mode=full
```

## Реализация

### Шаги:
1. ✅ Создать схему для главной страницы больницы (`hospital-details-schema.js`)
2. ✅ Создать промпт для главной страницы (`prompts-config.js`)
3. ✅ Создать функцию `extractHospitalDetails()`
4. ✅ Создать функцию `getMainHospitalUrl()`
5. ⏳ Добавить аргументы командной строки
6. ⏳ Модифицировать `scrapePrivateCosts()` для поддержки режимов
7. ⏳ Добавить логику мержинга данных
8. ⏳ Обновить структуру CSV (добавить `details_last_updated`)
9. ⏳ Создать два GitHub Actions workflow

