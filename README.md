# Compare The Wait

Информационный сайт для сравнения NHS ожиданий vs Private стоимости хирургических процедур для пожилых пациентов (65+) в UK.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для production

```bash
npm run build
```

### Запуск production сервера

```bash
npm start
```

## 📁 Структура проекта

```
compare-the-wait/
├── app/                    # Next.js App Router
│   ├── globals.css        # Tailwind CSS стили
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React компоненты
├── public/
│   └── data/              # CSV файлы с данными
├── tailwind.config.js     # Конфигурация Tailwind (elderly-friendly)
└── package.json
```

## 🎨 Tailwind CSS - Elderly-Friendly настройка

Проект использует Tailwind CSS с кастомной конфигурацией для пожилых пользователей:

### Размеры шрифтов

- `text-elderly-xs` - 14px (мелкий текст)
- `text-elderly-sm` - 16px (обычный текст)
- `text-elderly-base` - 18px (основной текст, по умолчанию)
- `text-elderly-lg` - 20px (подзаголовки)
- `text-elderly-xl` - 24px (заголовки)
- `text-elderly-2xl` - 28px (главные заголовки)

### Цвета (WCAG AAA контраст)

- `text-elderly-text` - #1a1a1a (темно-серый текст)
- `bg-elderly-bg` - #ffffff (белый фон)
- `bg-elderly-primary` - #0052cc (основной синий)
- `bg-elderly-accent` - #ff6600 (оранжевый для CTA)

### Touch targets

- `min-h-touch` - 44px (минимальный размер для кнопок, WCAG AAA)

### Примеры использования

```tsx
// Большой заголовок
<h1 className="text-elderly-2xl font-bold text-elderly-text">
  Waiting for Surgery?
</h1>

// Основной текст
<p className="text-elderly-base text-elderly-text">
  Honest comparison of waiting times...
</p>

// CTA кнопка (большой touch target)
<button className="btn-primary">
  Compare Now
</button>

// Карточка процедуры
<div className="procedure-card">
  <h2 className="text-elderly-xl font-bold">Cataract Surgery</h2>
  <p className="text-elderly-base">NHS wait: 18 weeks</p>
</div>
```

## 📊 Данные

CSV файлы должны быть размещены в `public/data/`:

- `procedures.csv` - список процедур
- `nhs_waits.csv` - NHS ожидания по процедурам и городам
- `private_costs.csv` - Private цены по процедурам и городам
- `clinics.csv` - список клиник

См. `STEP_BY_STEP_DATA_PREPARATION.md` для инструкций по созданию данных.

## 🛠️ Технологии

- **Next.js 14** - React framework с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - utility-first CSS framework
- **Static Site Generation (SSG)** - статическая генерация страниц

## 📚 Документация

- `EXECUTIVE_SUMMARY_LAUNCH.txt` - главное резюме проекта
- `prd-elderly-surgery-guide.md` - полный PRD
- `frontend-structure-copy.md` - структура и копирайтинг
- `STEP_BY_STEP_DATA_PREPARATION.md` - план создания данных
- `STYLING_LIBRARIES_RECOMMENDATION.md` - выбор библиотек стилей

## 🎯 Следующие шаги

1. ✅ Tailwind CSS настроен
2. ⏳ Создать CSV файлы с данными (см. STEP_BY_STEP_DATA_PREPARATION.md)
3. ⏳ Разработать компоненты сравнения
4. ⏳ Создать страницы процедур × города
5. ⏳ Настроить SEO и metadata

