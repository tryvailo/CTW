# Configuration Files Directory

Все конфигурации вынесены во внешние файлы для удобства управления и обновления.

## Структура файлов

### `treatmentconnect-urls.json`
**Назначение:** Список всех URL для TreatmentConnect.co.uk  
**Формат:** JSON с организацией по городам и процедурам  
**Содержимое:** 49 готовых URL для 5 городов и 3 процедур

**Структура:**
```json
{
  "london": {
    "cataract": ["url1", "url2", ...],
    "hip": ["url1", "url2", ...],
    "knee": ["url1", "url2", ...]
  },
  ...
}
```

### `treatmentconnect-config.js`
**Назначение:** Конфигурация для TreatmentConnect источника  
**Содержит:**
- Base URL и паттерны
- Маппинг процедур (internal ID → slug)
- Настройки извлечения данных
- Правила валидации

### `prompts-config.js`
**Назначение:** Все промпты для Firecrawl JSON Mode  
**Содержит:**
- Промпты для TreatmentConnect
- Промпты для Spire Healthcare
- Промпты для Nuffield Health
- Промпты для Circle Health Group
- Функции генерации промптов

### `load-urls.js`
**Назначение:** Утилиты для загрузки URL из JSON  
**Функции:**
- `loadTreatmentConnectUrls()` - загрузить все URL
- `getAllTreatmentConnectUrls()` - получить плоский массив с метаданными
- `getTreatmentConnectUrls(city, procedure)` - получить URL для конкретной комбинации
- `getUrlStatistics()` - статистика по URL

## Использование

### Загрузка URL:
```javascript
import { getAllTreatmentConnectUrls } from './config/load-urls.js';

const urls = getAllTreatmentConnectUrls();
// Returns: [{url, city, procedure}, ...]
```

### Использование конфигурации:
```javascript
import treatmentConnectConfig from './config/treatmentconnect-config.js';

const baseUrl = treatmentConnectConfig.base_url;
const procedureSlug = treatmentConnectConfig.procedure_slugs.cataract;
```

### Использование промптов:
```javascript
import { getTreatmentConnectPrompt } from './config/prompts-config.js';

const prompt = getTreatmentConnectPrompt('cataract', 'London');
```

## Обновление конфигураций

### Добавление новых URL:
1. Открыть `treatmentconnect-urls.json`
2. Добавить URL в соответствующий массив (city → procedure)
3. Сохранить файл

### Изменение промптов:
1. Открыть `prompts-config.js`
2. Изменить соответствующий промпт
3. Сохранить файл

### Изменение настроек:
1. Открыть `treatmentconnect-config.js`
2. Изменить нужные параметры
3. Сохранить файл

## Принципы

✅ **Все конфигурации во внешних файлах** - не хардкод в коде  
✅ **JSON для данных** - легко редактировать  
✅ **JS для логики** - функции и утилиты  
✅ **Разделение ответственности** - каждый файл отвечает за свою область  

