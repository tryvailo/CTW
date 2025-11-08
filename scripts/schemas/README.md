# JSON Schemas for Firecrawl JSON Mode

Этот каталог содержит JSON схемы для извлечения структурированных данных через Firecrawl JSON Mode (LLM Extract).

## 📁 Файлы

- `nhs-waits-schema.js` - Схема для NHS waiting times
- `private-costs-schema.js` - Схема для private surgery costs
- `clinics-schema.js` - Схема для clinic details
- `index.js` - Индексный файл для экспорта всех схем

## 🔧 Использование

```javascript
import schemas from './schemas/index.js';

// Получить схему и prompt для NHS waits
const schema = schemas.nhsWaits.schema;
const prompt = schemas.nhsWaits.getPrompt('cataract', 'London');

// Использовать с Firecrawl
const result = await app.scrape(url, {
  formats: [{
    type: 'json',
    schema: schema,
    prompt: prompt
  }]
});
```

## 📊 Соответствие CSV структуре

### NHS Waits Schema
**CSV поля:** `procedure_id, city, nhs_trust, avg_wait_weeks, date, source`  
**Schema поля:** `avg_wait_weeks, nhs_trust, percent_within_18_weeks, procedure_name, city`  
✅ Соответствует (procedure_id и date добавляются при обработке)

### Private Costs Schema
**CSV поля:** `procedure_id, city, cost_min, cost_max, clinic_count, date, source`  
**Schema поля:** `cost_min_gbp, cost_max_gbp, clinic_count, procedure_name, city`  
✅ Соответствует (procedure_id и date добавляются при обработке)

### Clinics Schema
**CSV поля:** `clinic_id, name, city, procedure_id, price, url, phone, address, rating_stars, rating_count, cqc_rating, hospital_group, last_updated, details_last_updated`  
**Schema поля (массив):** `clinic_name, price_gbp, phone_number, website_url, address, rating_stars, rating_count, cqc_rating, hospital_group`  
✅ Соответствует (clinic_id генерируется, procedure_id добавляется при обработке)

## 📝 Примечания

- Все схемы используют английский язык для prompts
- Схемы валидируются через Firecrawl API
- Prompts генерируются динамически с учетом procedure и city
- Обязательные поля соответствуют требованиям CSV

