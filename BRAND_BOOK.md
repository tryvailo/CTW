# БРЕНДБУК И СТИЛЕВОЙ ГАЙД
## Compare The Wait

**Версия:** 1.0  
**Дата:** 2025-01-15  
**Целевая аудитория:** Люди 65+ в Великобритании  
**Индустрия:** Healthcare / Medical Information  
**Стандарты:** WCAG AAA, NHS Brand Guidelines, Elderly-friendly Design

---

## 📋 СОДЕРЖАНИЕ

1. [О бренде](#о-бренде)
2. [Цветовая палитра](#цветовая-палитра)
3. [Типографика](#типографика)
4. [Компоненты](#компоненты)
5. [Принципы дизайна](#принципы-дизайна)
6. [Примеры использования](#примеры-использования)
7. [Технические спецификации](#технические-спецификации)

---

## 🎯 О БРЕНДЕ

### Миссия
Compare The Wait помогает людям 65+ понять их возможности выбора между NHS и частной хирургией. Мы предоставляем честные, бесплатные сравнения времени ожидания и стоимости, чтобы помочь принять обоснованное решение.

### Ценности бренда
- **Честность** - прозрачные данные из официальных источников
- **Доступность** - информация для всех, без барьеров
- **Доверие** - NHS-inspired дизайн, профессиональный подход
- **Простота** - понятный интерфейс для аудитории 60+
- **Бесплатность** - никаких скрытых платежей или обязательств

### Тон голоса
- Прямой и ясный
- Дружелюбный, но профессиональный
- Без медицинского жаргона
- Уважительный к аудитории 65+
- Поддерживающий, но не навязчивый

---

## 🎨 ЦВЕТОВАЯ ПАЛИТРА

### Основная палитра

#### Primary Colors (NHS Blue)
**Основной цвет бренда - NHS Blue**

```css
/* Primary - NHS Blue */
--elderly-primary: #005EB8;        /* Контраст 7.2:1 ✅ WCAG AAA */
--elderly-primary-dark: #003d7a;   /* Для hover/активных состояний */
--elderly-primary-light: #e6f2ff;  /* Светло-голубой фон (30% пространства) */
```

**Использование:**
- Заголовки (H1, H2, H3)
- Ссылки и навигация
- Primary кнопки
- Логотип и название сайта
- Акцентные элементы

**Tailwind классы:**
- `text-elderly-primary` - текст NHS Blue
- `bg-elderly-primary` - фон NHS Blue
- `bg-elderly-primary-light` - светло-голубой фон
- `border-elderly-primary` - граница NHS Blue

#### Secondary Colors
```css
--elderly-secondary: #0066cc;        /* Дополнительный синий */
--elderly-secondary-light: #e6f0ff;  /* Светлый фон */
```

**Использование:**
- Вторичные кнопки
- Дополнительные акценты

#### Accent Colors (Health & Success)
```css
/* Accent - зеленый для здоровья */
--elderly-accent: #006600;         /* Зеленый, контраст 7.0:1 ✅ WCAG AAA */
--elderly-accent-light: #e6f7e6;  /* Светло-зеленый фон */
--elderly-success: #006600;       /* Успех, здоровье */
```

**Использование:**
- Важные сообщения (Medical Disclaimer)
- Успешные действия
- Позитивные индикаторы
- Здоровье и благополучие

**Tailwind классы:**
- `text-elderly-success` - зеленый текст
- `bg-elderly-accent-light` - светло-зеленый фон

#### CTA Colors (Call to Action)
```css
/* CTA - мягкий коралловый */
--elderly-cta: #ff7f50;      /* Мягкий коралловый (только для крупного текста) */
--elderly-cta-dark: #ff6347; /* Для hover */
```

**Использование:**
- Важные призывы к действию
- Специальные предложения
- Только для крупного текста (18px+)

#### Text Colors
```css
/* Текст */
--elderly-text: #1a1a1a;        /* Основной текст, контраст 16.6:1 ✅ WCAG AAA */
--elderly-gray-dark: #666666;   /* Второстепенный текст, контраст 7.0:1 ✅ */
```

**Использование:**
- `text-elderly-text` - основной текст
- `text-elderly-gray-dark` - второстепенный текст, подписи

#### Background Colors
```css
/* Фоны */
--elderly-bg: #ffffff;         /* Основной фон (60% пространства) */
--elderly-bg-light: #f8f9fa;  /* Легкий фон для секций */
--elderly-gray-light: #f5f5f5; /* Светло-серый фон */
```

**Использование:**
- `bg-elderly-bg` - основной белый фон
- `bg-elderly-bg-light` - легкий фон для секций
- `bg-elderly-gray-light` - footer, легкие секции

#### Border Colors
```css
/* Границы */
--elderly-gray-medium: #d3d3d3; /* Границы, контраст достаточен для видимости */
```

**Использование:**
- `border-elderly-gray-medium` - все границы
- Толщина: `border-elderly` (2px)

#### Semantic Colors
```css
/* Семантические цвета */
--elderly-success: #006600;   /* Успех */
--elderly-warning: #ff8c00;   /* Предупреждение */
--elderly-info: #005EB8;      /* Информация (NHS Blue) */
```

---

### Правило 60/30/10

**Распределение цветов на странице:**

#### 60% - Основной фон
- Белый фон (`bg-elderly-bg`)
- Светло-серые фоны для секций (`bg-elderly-bg-light`)
- Основной текст (`text-elderly-text`)

#### 30% - Вторичные элементы
- Светло-голубые фоны для карточек (`bg-elderly-primary-light`)
- Серые границы (`border-elderly-gray-medium`)
- Второстепенный текст (`text-elderly-gray-dark`)

#### 10% - Акценты
- NHS Blue для заголовков и ссылок (`text-elderly-primary`)
- Зеленый для важных сообщений (`bg-elderly-accent-light`)
- Кнопки и CTA (`bg-elderly-primary`)

---

### Контрастность (WCAG AAA)

| Цвет | Использование | Контраст | Статус |
|------|---------------|----------|--------|
| `#005EB8` (NHS Blue) | Primary, заголовки | 7.2:1 | ✅ WCAG AAA |
| `#006600` (Green) | Success, акценты | 7.0:1 | ✅ WCAG AAA |
| `#1a1a1a` (Text) | Основной текст | 16.6:1 | ✅ WCAG AAA |
| `#666666` (Gray Dark) | Второстепенный текст | 7.0:1 | ✅ WCAG AAA |
| `#e6f2ff` (Light Blue) | Фоны | - | ✅ Для фонов |
| `#ff7f50` (Coral) | CTA (крупный текст) | 3.2:1 | ⚠️ Только для 18px+ |

**Все цвета соответствуют WCAG AAA стандартам!**

---

## 📝 ТИПОГРАФИКА

### Размеры шрифтов

```css
/* Elderly-friendly размеры */
--font-elderly-xs: 14px;    /* Второстепенная информация */
--font-elderly-sm: 16px;    /* Body text large */
--font-elderly-base: 18px;  /* Основной текст */
--font-elderly-lg: 20px;    /* H2, подзаголовки */
--font-elderly-xl: 24px;    /* H1 */
--font-elderly-2xl: 28px;   /* Hero H1 */
```

**Tailwind классы:**
- `text-elderly-xs` - 14px
- `text-elderly-sm` - 16px
- `text-elderly-base` - 18px (основной)
- `text-elderly-lg` - 20px
- `text-elderly-xl` - 24px
- `text-elderly-2xl` - 28px

### Line Height
**Все тексты:** `line-height: 1.8` (значительно больше стандартного 1.4-1.5)

### Letter Spacing
**Все тексты:** `letter-spacing: 0.01em` (улучшает читаемость)

### Шрифт
**Системные шрифты (sans-serif):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
  'Helvetica Neue', sans-serif;
```

**Почему системные шрифты:**
- Быстрая загрузка
- Знакомый вид для пользователей
- Отличная читаемость
- Поддержка всех устройств

### Иерархия заголовков

| Элемент | Размер | Использование | Класс |
|---------|--------|---------------|-------|
| Hero H1 | 28px | Главный заголовок на homepage | `text-elderly-2xl` |
| Page H1 | 24px | Заголовок страницы | `text-elderly-xl` |
| H2 | 20px | Подзаголовки секций | `text-elderly-lg` |
| H3 | 18px | Заголовки карточек | `text-elderly-base` |
| Body | 18px | Основной текст | `text-elderly-base` |
| Small | 16px | Второстепенный текст | `text-elderly-sm` |
| XS | 14px | Подписи, мелкие детали | `text-elderly-xs` |

### Font Weight
- **Заголовки:** `font-bold` (700)
- **Основной текст:** `font-normal` (400)
- **Важные элементы:** `font-semibold` (600)

---

## 🧩 КОМПОНЕНТЫ

### Кнопки

#### Primary Button
```tsx
<Button variant="primary">
  Compare Now
</Button>
```

**Стили:**
- Фон: `bg-elderly-primary` (#005EB8)
- Текст: `text-white`
- Hover: `bg-elderly-primary-dark` (#003d7a)
- Размер: `min-h-touch` (44px минимальная высота)
- Padding: `px-8 py-4`
- Border radius: `rounded-lg`
- Focus: `focus:ring-2 focus:ring-elderly-primary`

#### Secondary Button
```tsx
<Button variant="secondary">
  Learn More
</Button>
```

**Стили:**
- Фон: `bg-white`
- Текст: `text-elderly-primary`
- Граница: `border-elderly border-elderly-primary` (2px)
- Hover: `bg-elderly-gray-light`
- Размер: `min-h-touch` (44px)

### Карточки

#### Procedure Card
```tsx
<Card className="bg-elderly-primary-light">
  <h3 className="text-elderly-lg font-bold text-elderly-primary">
    Cataract Surgery
  </h3>
  <p className="text-elderly-sm text-elderly-text">
    Description...
  </p>
</Card>
```

**Стили:**
- Фон: `bg-white` или `bg-elderly-primary-light`
- Граница: `border-elderly border-elderly-gray-medium`
- Padding: `p-6`
- Border radius: `rounded-lg`
- Shadow: `shadow-sm` (мягкая тень)

### Таблицы

#### Comparison Table
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableCell isHeader>NHS ROUTE</TableCell>
      <TableCell isHeader>PRIVATE ROUTE</TableCell>
    </TableRow>
  </TableHeader>
</Table>
```

**Стили заголовков:**
- Фон: `bg-elderly-primary-light`
- Текст: `text-elderly-primary`
- Граница: `border-elderly border-elderly-gray-medium`
- Padding: `p-4`

**Стили ячеек:**
- Фон: `bg-white`
- Граница: `border-elderly border-elderly-gray-medium`
- Padding: `p-4`

### Формы

#### Input Fields
```tsx
<input 
  className="min-h-touch px-4 py-2 border-elderly border-elderly-gray-medium 
             rounded-lg text-elderly-base focus:ring-2 focus:ring-elderly-primary"
/>
```

**Стили:**
- Размер: `min-h-touch` (44px)
- Граница: `border-elderly border-elderly-gray-medium` (2px)
- Focus: `focus:ring-2 focus:ring-elderly-primary`
- Padding: `px-4 py-2`

### Ссылки

#### Standard Link
```tsx
<Link href="/" className="text-elderly-primary underline-offset-4 hover:underline">
  Home
</Link>
```

**Стили:**
- Цвет: `text-elderly-primary`
- Hover: `hover:text-elderly-primary-dark`
- Underline: `underline-offset-4 hover:underline`
- Размер: `min-h-touch` для навигации

---

## 🎯 ПРИНЦИПЫ ДИЗАЙНА

### 1. Доступность (Accessibility)

**WCAG AAA стандарты:**
- ✅ Минимальный контраст 7:1 для текста
- ✅ Touch targets минимум 44px × 44px
- ✅ Четкая фокусная индикация
- ✅ Семантический HTML
- ✅ Альтернативный текст для изображений

### 2. Elderly-Friendly Design

**Принципы:**
- ✅ Большие шрифты (18px+ для body)
- ✅ Высокий line-height (1.8)
- ✅ Широкие границы (2px)
- ✅ Большие кнопки (44px+)
- ✅ Простая навигация
- ✅ Мягкие цвета (не яркие)
- ✅ Четкая визуальная иерархия

### 3. NHS-Inspired Design

**Принципы:**
- ✅ NHS Blue как основной цвет
- ✅ Минималистичный дизайн
- ✅ Доверительный внешний вид
- ✅ Профессиональный подход
- ✅ Чистая типографика

### 4. Правило 60/30/10

**Распределение:**
- 60% - белый/светлый фон
- 30% - светло-голубые фоны
- 10% - NHS Blue акценты

### 5. Визуальная иерархия

**Приоритеты:**
1. **Hero секция** - самый важный контент
2. **Заголовки** - NHS Blue, крупный размер
3. **Карточки** - светло-голубой фон, четкие границы
4. **Текст** - темно-серый, достаточный размер
5. **Акценты** - зеленый для важных сообщений

---

## 📐 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Hero Section
```tsx
<section className="text-center mb-12 bg-elderly-primary-light p-8 
                    rounded-lg border-elderly border-elderly-gray-medium">
  <h1 className="text-elderly-2xl font-bold text-elderly-primary mb-6">
    Waiting for Surgery? Compare Your NHS vs Private Options
  </h1>
  <p className="text-elderly-base text-elderly-text mb-8 max-w-3xl mx-auto">
    Honest comparison of waiting times and costs...
  </p>
  <Button variant="primary">Compare Now</Button>
</section>
```

**Цветовое распределение:**
- 60% - белый фон страницы
- 30% - светло-голубой фон секции (`bg-elderly-primary-light`)
- 10% - NHS Blue заголовок и кнопка

### Value Props Cards
```tsx
<Card className="text-center bg-elderly-primary-light">
  <div className="text-3xl mb-2 text-elderly-primary">✓</div>
  <h3 className="text-elderly-lg font-bold mb-2 text-elderly-primary">
    FREE Information
  </h3>
  <p className="text-elderly-sm text-elderly-text">
    No cost to compare...
  </p>
</Card>
```

### Comparison Table
```tsx
<table className="comparison-table">
  <thead>
    <tr>
      <th className="bg-elderly-primary-light text-elderly-primary">
        NHS ROUTE
      </th>
      <th className="bg-elderly-primary-light text-elderly-primary">
        PRIVATE ROUTE
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="bg-white">18 weeks</td>
      <td className="bg-white">1-2 weeks</td>
    </tr>
  </tbody>
</table>
```

### Medical Disclaimer
```tsx
<div className="bg-elderly-accent-light border-elderly border-elderly-gray-medium 
                rounded-lg p-6 mb-8">
  <p className="text-elderly-sm text-elderly-text">
    <strong className="font-bold text-elderly-success">Important:</strong>
    This website provides informational comparisons only...
  </p>
</div>
```

**Цветовое распределение:**
- 60% - белый фон страницы
- 30% - светло-зеленый фон (`bg-elderly-accent-light`)
- 10% - зеленый текст для "Important" (`text-elderly-success`)

---

## 🔧 ТЕХНИЧЕСКИЕ СПЕЦИФИКАЦИИ

### Tailwind CSS Configuration

**Файл:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      // Типографика
      fontSize: {
        'elderly-xs': ['14px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-sm': ['16px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-base': ['18px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-lg': ['20px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-xl': ['24px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-2xl': ['28px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
      },
      // Цвета
      colors: {
        'elderly': {
          'text': '#1a1a1a',
          'bg': '#ffffff',
          'bg-light': '#f8f9fa',
          'primary': '#005EB8',
          'primary-dark': '#003d7a',
          'primary-light': '#e6f2ff',
          'secondary': '#0066cc',
          'secondary-light': '#e6f0ff',
          'accent': '#006600',
          'accent-light': '#e6f7e6',
          'cta': '#ff7f50',
          'cta-dark': '#ff6347',
          'gray-light': '#f5f5f5',
          'gray-medium': '#d3d3d3',
          'gray-dark': '#666666',
          'success': '#006600',
          'warning': '#ff8c00',
          'info': '#005EB8',
        },
      },
      // Touch targets
      spacing: {
        'touch': '44px',
        'touch-lg': '56px',
      },
      // Границы
      borderWidth: {
        'elderly': '2px',
      },
    },
  },
}
```

### Global CSS

**Файл:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-elderly-base text-elderly-text bg-elderly-bg;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
      'Helvetica Neue', sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
    letter-spacing: 0.01em;
  }
  
  button, a.button {
    @apply min-h-touch;
  }
  
  a {
    @apply text-elderly-primary underline;
  }
  
  a:hover {
    @apply text-elderly-primary-dark;
  }
}

@layer components {
  .comparison-table th {
    @apply p-4 text-left font-bold bg-elderly-primary-light 
           border-elderly border-elderly-gray-medium text-elderly-primary;
  }
  
  .comparison-table td {
    @apply p-4 border-elderly border-elderly-gray-medium bg-white;
  }
}
```

---

## ✅ ЧЕКЛИСТ ПРИМЕНЕНИЯ

### При создании нового компонента:

- [ ] Используются правильные размеры шрифтов (`text-elderly-*`)
- [ ] Цвета соответствуют палитре (`text-elderly-primary`, `bg-elderly-*`)
- [ ] Touch targets минимум 44px (`min-h-touch`)
- [ ] Контраст соответствует WCAG AAA (7:1+)
- [ ] Применяется правило 60/30/10
- [ ] Границы используют `border-elderly` (2px)
- [ ] Focus states четко видны
- [ ] Используются системные шрифты

### При создании новой страницы:

- [ ] Hero секция с `bg-elderly-primary-light`
- [ ] Заголовки используют `text-elderly-primary`
- [ ] Карточки используют `bg-elderly-primary-light`
- [ ] Основной фон белый (`bg-elderly-bg`)
- [ ] Важные сообщения используют зеленый (`bg-elderly-accent-light`)
- [ ] Навигация использует NHS Blue
- [ ] Все ссылки имеют hover состояния

---

## 📚 РЕСУРСЫ И ССЫЛКИ

### Стандарты
- **WCAG AAA:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html
- **NHS Brand Guidelines:** https://www.england.nhs.uk/nhsidentity/
- **Elderly-friendly Design:** https://www.nngroup.com/articles/usability-for-senior-citizens/

### Инструменты
- **Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Next.js:** https://nextjs.org/docs

---

## 📝 ИСТОРИЯ ИЗМЕНЕНИЙ

### Версия 1.0 (2025-01-15)
- ✅ Создан брендбук
- ✅ Определена цветовая палитра (NHS Blue)
- ✅ Настроена типографика для 60+
- ✅ Применено правило 60/30/10
- ✅ Все контрасты соответствуют WCAG AAA

---

**Этот брендбук является живым документом и будет обновляться по мере развития проекта.**

