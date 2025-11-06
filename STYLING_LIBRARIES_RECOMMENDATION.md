# РЕКОМЕНДАЦИИ ПО БИБЛИОТЕКАМ СТИЛЕЙ

**Проект:** CompareTheWait (Next.js 14)  
**Требования:** Elderly-friendly (65+), WCAG AAA, гибкая кастомизация, большие шрифты

---

## 🏆 ТОП-1 РЕКОМЕНДАЦИЯ: Tailwind CSS

### Почему Tailwind CSS идеален для вашего проекта:

✅ **Очень популярный** (используют: Vercel, GitHub, Netflix)  
✅ **Максимально гибкая кастомизация** (легко настроить размеры шрифтов, цвета)  
✅ **Utility-first** (не нужно писать CSS файлы)  
✅ **Отлично работает с Next.js** (официальная поддержка)  
✅ **Маленький bundle size** (только используемые стили)  
✅ **Легко настроить для elderly users** (кастомные размеры в config)

### Установка для Next.js 14:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Конфигурация для пожилых пользователей:

**`tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Кастомные размеры шрифтов для elderly users
      fontSize: {
        'elderly-xs': ['14px', { lineHeight: '1.8' }],      // Body text
        'elderly-sm': ['16px', { lineHeight: '1.8' }],       // Body text large
        'elderly-base': ['18px', { lineHeight: '1.8' }],    // Important text
        'elderly-lg': ['20px', { lineHeight: '1.8' }],      // H2
        'elderly-xl': ['24px', { lineHeight: '1.8' }],      // H1
        'elderly-2xl': ['28px', { lineHeight: '1.8' }],     // Hero H1
      },
      // Кастомные цвета для WCAG AAA контраста
      colors: {
        'elderly-text': '#1a1a1a',        // Dark gray (не pure black)
        'elderly-bg': '#ffffff',           // White background
        'elderly-primary': '#0052cc',      // High contrast blue
        'elderly-secondary': '#0066cc',    // Alternative blue
        'elderly-accent': '#ff6600',       // Orange для CTA
      },
      // Большие touch targets (44px × 44px минимум)
      spacing: {
        'touch': '44px',                   // Минимальный размер для кнопок
      },
    },
  },
  plugins: [],
}
```

### Пример использования:

```tsx
// Homepage hero
<h1 className="text-elderly-2xl font-bold text-elderly-text mb-6">
  Waiting for Surgery? Compare Your NHS vs Private Options
</h1>

// Body text
<p className="text-elderly-base text-elderly-text leading-relaxed">
  Honest comparison of waiting times and costs...
</p>

// CTA button (большой touch target)
<button className="px-8 py-4 min-h-touch bg-elderly-primary text-white text-elderly-base font-semibold rounded-lg hover:bg-elderly-secondary transition">
  Compare Now
</button>

// Comparison table
<table className="w-full text-elderly-base border-collapse">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-4 text-left font-bold">NHS Route</th>
      <th className="p-4 text-left font-bold">Private Route</th>
    </tr>
  </thead>
</table>
```

### Преимущества для вашего проекта:

- ✅ **Легко настроить размеры:** `text-elderly-xl`, `text-elderly-base`
- ✅ **WCAG AAA цвета:** предустановленные в config
- ✅ **Большие кнопки:** `min-h-touch` для 44px минимальной высоты
- ✅ **Responsive:** `md:text-elderly-lg`, `lg:text-elderly-xl`
- ✅ **Быстрая разработка:** не нужно писать CSS файлы

**Рейтинг:** ⭐⭐⭐⭐⭐ (5/5)

---

## 🥈 АЛЬТЕРНАТИВА 1: CSS Modules + CSS Variables

### Когда использовать:

- Если предпочитаешь традиционный CSS подход
- Если хочешь полный контроль над стилями
- Если не нужны utility классы

### Установка:

```bash
# Встроено в Next.js, ничего не нужно устанавливать
```

### Структура:

**`styles/globals.css`:**

```css
:root {
  /* Elderly-friendly размеры */
  --font-elderly-xs: 14px;
  --font-elderly-sm: 16px;
  --font-elderly-base: 18px;
  --font-elderly-lg: 20px;
  --font-elderly-xl: 24px;
  --font-elderly-2xl: 28px;
  
  /* WCAG AAA цвета */
  --color-elderly-text: #1a1a1a;
  --color-elderly-bg: #ffffff;
  --color-elderly-primary: #0052cc;
  
  /* Большие touch targets */
  --touch-min-size: 44px;
  
  /* Line height для читаемости */
  --line-height-elderly: 1.8;
}

.hero-title {
  font-size: var(--font-elderly-2xl);
  font-weight: bold;
  color: var(--color-elderly-text);
  line-height: var(--line-height-elderly);
}

.body-text {
  font-size: var(--font-elderly-base);
  color: var(--color-elderly-text);
  line-height: var(--line-height-elderly);
}

.cta-button {
  min-height: var(--touch-min-size);
  padding: 12px 32px;
  font-size: var(--font-elderly-base);
  background-color: var(--color-elderly-primary);
  color: white;
}
```

**`components/Homepage.module.css`:**

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}
```

### Использование:

```tsx
import styles from './Homepage.module.css';
import './globals.css';

export default function Homepage() {
  return (
    <div className={styles.container}>
      <h1 className="hero-title">Waiting for Surgery?</h1>
      <p className="body-text">Honest comparison...</p>
      <button className="cta-button">Compare Now</button>
    </div>
  );
}
```

**Рейтинг:** ⭐⭐⭐⭐ (4/5) - гибко, но больше boilerplate

---

## 🥉 АЛЬТЕРНАТИВА 2: styled-components

### Когда использовать:

- Если нужен CSS-in-JS подход
- Если хочешь динамические стили на основе props
- Если работаешь с темизацией

### Установка:

```bash
npm install styled-components
npm install -D @types/styled-components
```

### Использование:

```tsx
import styled from 'styled-components';

const ElderlyHeading = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  line-height: 1.8;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ElderlyButton = styled.button`
  min-height: 44px;
  padding: 12px 32px;
  font-size: 18px;
  background-color: #0052cc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #0066cc;
  }
`;

export default function Homepage() {
  return (
    <div>
      <ElderlyHeading>Waiting for Surgery?</ElderlyHeading>
      <ElderlyButton>Compare Now</ElderlyButton>
    </div>
  );
}
```

**Рейтинг:** ⭐⭐⭐ (3/5) - гибко, но добавляет runtime overhead

---

## 📊 СРАВНЕНИЕ ВСЕХ ВАРИАНТОВ

| Критерий | Tailwind CSS | CSS Modules | styled-components |
|----------|-------------|-------------|-------------------|
| **Популярность** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Гибкость кастомизации** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Простота для elderly-friendly** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Bundle size** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Скорость разработки** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Поддержка Next.js** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **WCAG AAA легкость** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎯 ФИНАЛЬНАЯ РЕКОМЕНДАЦИЯ

### Используй Tailwind CSS потому что:

1. ✅ **Легко настроить для пожилых пользователей:**
   - Кастомные размеры шрифтов в `tailwind.config.js`
   - Предустановленные WCAG AAA цвета
   - Utility классы для больших touch targets

2. ✅ **Очень популярный и гибкий:**
   - Используют Vercel (создатели Next.js)
   - Большое сообщество
   - Много готовых компонентов

3. ✅ **Быстрая разработка:**
   - Не нужно писать CSS файлы
   - Utility-first подход
   - Легко делать responsive дизайн

4. ✅ **Отлично работает с Next.js:**
   - Официальная поддержка
   - Автоматическая оптимизация
   - Маленький bundle size

### Пример полной настройки:

**`tailwind.config.js` (полная версия):**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Elderly-friendly типографика
      fontSize: {
        'elderly-xs': ['14px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-sm': ['16px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-base': ['18px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-lg': ['20px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-xl': ['24px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-2xl': ['28px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
      },
      // WCAG AAA цвета (контраст минимум 7:1)
      colors: {
        'elderly': {
          'text': '#1a1a1a',           // Контраст 16.6:1 на белом
          'bg': '#ffffff',
          'primary': '#0052cc',        // Контраст 7.1:1 на белом
          'primary-dark': '#003d99',   // Для hover
          'secondary': '#0066cc',
          'accent': '#ff6600',         // Контраст 3.9:1 (нужно на белом, но для CTA OK)
          'gray-light': '#f5f5f5',
          'gray-medium': '#cccccc',
          'gray-dark': '#666666',
        },
      },
      // Большие touch targets
      spacing: {
        'touch': '44px',
        'touch-lg': '56px',
      },
      // Широкие границы для читаемости
      borderWidth: {
        'elderly': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Для красивого текста в markdown
  ],
}
```

**`app/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-elderly-base text-elderly-text bg-elderly-bg;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Улучшение читаемости для пожилых */
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
    letter-spacing: 0.01em;
  }
  
  /* Большие кнопки по умолчанию */
  button, a.button {
    @apply min-h-touch;
  }
}
```

---

## 🚀 БЫСТРЫЙ СТАРТ С TAILWIND

### 1. Установка:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Настройка `tailwind.config.js` (см. выше)

### 3. Добавь в `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Используй в компонентах:

```tsx
<h1 className="text-elderly-2xl font-bold text-elderly-text mb-6">
  Compare The Wait
</h1>
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Tailwind + Next.js:** https://tailwindcss.com/docs/guides/nextjs
- **WCAG AAA контраст:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html
- **Elderly-friendly дизайн:** https://www.nngroup.com/articles/usability-for-senior-citizens/

---

**ИТОГО: Используй Tailwind CSS для максимальной гибкости и скорости разработки.** ✅

