# 🔍 Отчет: Исследование проблемы с извлечением цен из PHIN

**Дата:** 2025-11-07  
**Проблема:** JSON Mode возвращает `cost_min_gbp: 0` и `cost_max_gbp: 0` для всех процедур

## 📋 Текущая ситуация

### Используемые URL
1. **Основной URL:** `https://www.phin.org.uk/independent-provider-finder/`
2. **Fallback URL:** `https://www.phin.org.uk/`
3. **Альтернативные URL (протестированы):**
   - `https://www.phin.org.uk/find-a-provider/`
   - `https://www.phin.org.uk/search/`

### Текущие запросы

#### 1. JSON Mode запрос
```javascript
// URL: https://www.phin.org.uk/independent-provider-finder/
// Method: app.scrape() с JSON Mode
{
  formats: [{
    type: 'json',
    schema: privateCostsSchema,
    prompt: "Extract private surgery cost information for cataract in London..."
  }],
  onlyMainContent: false,
  timeout: 30000
}
```

#### 2. Промпт для извлечения
```
Extract private surgery cost information for cataract in London.

Look for:
1. Minimum cost in GBP (British Pounds) - the lowest price found
2. Maximum cost in GBP (British Pounds) - the highest price found
3. Number of clinics offering this procedure (count how many different clinics/prices you see)

The procedure might be referred to as:
- Cataract Surgery, Eye Surgery, Lens Extraction

The city is: London

Prices might be shown as:
- "£2,500 - £4,000"
- "From £2,500"
- "£2,500 to £4,000"
- Individual clinic prices in a list or table
```

## 🔍 Обнаруженные проблемы

### Проблема 1: Cookie Consent блокирует контент
**Наблюдение:**
- Все URL возвращают только страницу cookie consent
- Markdown содержит только: "Help us help you", "Necessary cookies", "Analytics cookies"
- Нет реального контента с ценами

**Пример ответа:**
```
Markdown preview:
# Help us help you
Can you help us improve our website for you and other people looking for health information?
Necessary cookies Always enabled
...
```

### Проблема 2: JavaScript-зависимый контент
**Наблюдение:**
- PHIN использует JavaScript для загрузки данных
- Поиск провайдеров требует интерактивного взаимодействия
- Firecrawl может не выполнять JavaScript полностью

### Проблема 3: Нет прямых URL с результатами
**Наблюдение:**
- Протестированные search URL patterns не работают:
  - `https://www.phin.org.uk/search?procedure=cataract&location=London` - не существует
  - `https://www.phin.org.uk/providers?procedure=cataract&city=London` - не существует
- PHIN использует форму поиска, а не URL-параметры

## 💡 Возможные решения

### Решение 1: Использовать альтернативные источники данных
**Описание:** Вместо PHIN использовать прямые сайты клиник

**URL источников:**
1. **Moorfields Private** (Cataract):
   - `https://moorfields.nhs.uk/private/cataract/cost`
   - `https://moorfields.nhs.uk/private/eye-conditions/cataract-surgery`

2. **Practice Plus Group**:
   - `https://practiceplusgroup.com/hip-replacement-costs`
   - `https://practiceplusgroup.com/knee-replacement-costs`
   - `https://practiceplusgroup.com/cataract-surgery-costs`

3. **Circle Health Group**:
   - `https://circlehealthgroup.co.uk/private-knee-replacement`
   - `https://circlehealthgroup.co.uk/private-hip-replacement`
   - `https://circlehealthgroup.co.uk/private-cataract-surgery`

4. **Spire Healthcare**:
   - `https://spirehealthcare.com/conditions-treatments/cataract-surgery/`
   - `https://spirehealthcare.com/conditions-treatments/hip-replacement/`
   - `https://spirehealthcare.com/conditions-treatments/knee-replacement/`

5. **Ramsay Health**:
   - `https://ramsayhealth.co.uk/treatments/cataract-surgery`
   - `https://ramsayhealth.co.uk/treatments/hip-replacement`
   - `https://ramsayhealth.co.uk/treatments/knee-replacement`

6. **Nuffield Health**:
   - `https://nuffieldhealth.com/treatments/cataract-surgery`
   - `https://nuffieldhealth.com/treatments/hip-replacement`
   - `https://nuffieldhealth.com/treatments/knee-replacement`

**Преимущества:**
- ✅ Прямые URL с ценами
- ✅ Не требуют JavaScript
- ✅ Структурированные данные
- ✅ Актуальные цены

**Недостатки:**
- ⚠️ Нужно скрапить несколько сайтов
- ⚠️ Разные форматы данных

### Решение 2: Использовать Firecrawl с JavaScript рендерингом
**Описание:** Включить полный JavaScript рендеринг для PHIN

**Изменения в коде:**
```javascript
const result = await app.scrape(url, {
  formats: [{
    type: 'json',
    schema: schema,
    prompt: prompt
  }],
  onlyMainContent: false,
  timeout: 30000,
  // Добавить параметры для JavaScript
  waitFor: 5000, // Ждать 5 секунд для загрузки JS
  screenshot: false
});
```

**Преимущества:**
- ✅ Может обойти cookie consent
- ✅ Выполнит JavaScript

**Недостатки:**
- ⚠️ Может не работать, если требуется интерактивное взаимодействие
- ⚠️ Медленнее

### Решение 3: Комбинированный подход
**Описание:** Использовать несколько источников и агрегировать данные

**Стратегия:**
1. Попробовать PHIN с JavaScript рендерингом
2. Если не работает → скрапить прямые сайты клиник
3. Агрегировать цены из всех источников
4. Вычислить min/max и количество клиник

**Преимущества:**
- ✅ Более полные данные
- ✅ Fallback на несколько источников
- ✅ Более точные цены

## 📊 Рекомендация

**Рекомендуемое решение:** **Решение 3 (Комбинированный подход)**

**Причины:**
1. PHIN требует интерактивного взаимодействия, которое сложно автоматизировать
2. Прямые сайты клиник содержат актуальные цены
3. Комбинированный подход даст более полную картину

**План реализации:**
1. Создать список URL для каждого типа процедуры
2. Скрапить каждый URL с JSON Mode
3. Агрегировать результаты (min, max, count)
4. Сохранить в `private_costs.csv`

## 🔧 Следующие шаги

1. ✅ Создать конфигурацию с URL клиник для каждой процедуры
2. ✅ Обновить `extractPHINCostsWithJSONMode()` для работы с несколькими URL
3. ✅ Добавить агрегацию данных из нескольких источников
4. ✅ Протестировать на реальных данных

## 📝 Текущий код

### Где используется:
- `scripts/scraper.js` → `scrapePHINData()` → `extractPHINCostsWithJSONMode()`
- URL: `config.urls.phin_provider` или `config.urls.phin_home`
- Схема: `scripts/schemas/private-costs-schema.js`
- Промпт: `scripts/schemas/private-costs-schema.js` → `privateCostsPrompt()`

### Текущий результат:
```json
{
  "city": "London",
  "clinic_count": 0,
  "cost_max_gbp": 0,
  "cost_min_gbp": 0,
  "procedure_name": "Cataract Surgery"
}
```

**Проблема:** Все значения = 0, потому что на странице нет реального контента с ценами (только cookie consent).

