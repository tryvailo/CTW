# ИСПРАВЛЕНИЕ ОШИБОК

## Проблема 1: Стили не применяются (белый фон)

**Проблема:** Tailwind CSS стили не видны на странице.

**Причина:** 
- CSS файл загружается (`app_globals_71f961d1.css`)
- Но возможно стили Tailwind не компилируются правильно в dev режиме

**Решение:**
1. Перезапустить dev сервер
2. Проверить что Tailwind CSS правильно настроен
3. Очистить кеш Next.js

**Проверка стилей:**
- Стили определены в `tailwind.config.js` ✅
- `globals.css` импортирует Tailwind директивы ✅  
- `layout.tsx` импортирует `globals.css` ✅

**Действия:**
```bash
# Остановить текущий сервер
pkill -f "next dev"

# Очистить кеш
rm -rf .next

# Перезапустить
npm run dev
```

---

## Проблема 2: 404 на `/comparison/cataract/london`

**Проблема:** Страница сравнения возвращает 404.

**Причина:** 
- `generateStaticParams()` создает slug из city name напрямую
- Но `getCityBySlug()` ищет по slug из CSV
- Несоответствие между slug в generateStaticParams и getCityBySlug

**Решение:**
- Исправлено: `generateStaticParams()` теперь использует slug из CSV данных через `loadCities()`
- `getCityBySlug()` уже был исправлен для case-insensitive поиска ✅

**Исправления:**
1. ✅ `generateStaticParams()` теперь использует `loadCities()` для получения правильного slug
2. ✅ `getCityBySlug()` использует case-insensitive сравнение

**Проверка:**
- CSV файл `cities.csv` содержит slug: `london` ✅
- `getCityBySlug('london')` должен найти город ✅

---

## Следующие шаги

1. Перезапустить dev сервер с очисткой кеша
2. Проверить что страница `/comparison/cataract/london` работает
3. Проверить что стили применяются

