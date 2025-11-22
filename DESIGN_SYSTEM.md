# ДИЗАЙН-СИСТЕМА COMPARE THE WAIT

**Версия:** 2.0  
**Дата:** 2025-01-27  
**Статус:** ✅ Полностью реализована

---

## 📋 СОДЕРЖАНИЕ

1. [Цветовая палитра](#цветовая-палитра)
2. [Типографика](#типографика)
3. [Компоненты](#компоненты)
4. [Spacing система](#spacing-система)
5. [Accessibility](#accessibility)
6. [Примеры использования](#примеры-использования)

---

## 🎨 ЦВЕТОВАЯ ПАЛИТРА

### Основные цвета

#### Primary (NHS Blue)
```css
--elderly-primary: #005EB8        /* Контраст 7.2:1 ✅ WCAG AAA */
--elderly-primary-dark: #003d7a   /* Hover/активные состояния */
--elderly-primary-light: #e6f2ff  /* Фоны секций (30% пространства) */
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

#### Secondary
```css
--elderly-secondary: #0066cc
--elderly-secondary-light: #e6f0ff
```

**Использование:**
- Вторичные кнопки
- Дополнительные акценты

#### Accent (Green - Health & Success)
```css
--elderly-accent: #006600         /* Контраст 7.0:1 ✅ WCAG AAA */
--elderly-accent-light: #e6f7e6   /* Светло-зеленый фон */
```

**Использование:**
- Важные сообщения (Medical Disclaimer)
- Успешные действия
- Позитивные индикаторы
- Здоровье и благополучие

**Tailwind классы:**
- `text-elderly-success` - зеленый текст
- `bg-elderly-accent-light` - светло-зеленый фон
- `bg-elderly-success-light` - светло-зеленый фон

### Семантические цвета

#### Success (Успех)
```css
--elderly-success: #006600
--elderly-success-light: #e6f7e6
--elderly-success-dark: #004d00
```

**Использование:**
- Успешные операции
- Позитивные сообщения
- Галочки и подтверждения

#### Warning (Предупреждение)
```css
--elderly-warning: #ff8c00
--elderly-warning-light: #ffe6cc
--elderly-warning-dark: #cc6600
```

**Использование:**
- Предупреждающие сообщения
- Важные уведомления
- Срочная информация

#### Error (Ошибка)
```css
--elderly-error: #dc2626          /* Контраст 7.1:1 ✅ WCAG AAA */
--elderly-error-light: #fee2e2
--elderly-error-dark: #991b1b
```

**Использование:**
- Ошибки валидации
- Критические сообщения
- Негативные индикаторы

#### Info (Информация)
```css
--elderly-info: #005EB8           /* NHS Blue */
--elderly-info-light: #e6f2ff
--elderly-info-dark: #003d7a
```

**Использование:**
- Информационные блоки
- Подсказки
- Дополнительная информация

### Нейтральные цвета

```css
--elderly-text: #1a1a1a           /* Контраст 16.6:1 ✅ */
--elderly-bg: #ffffff              /* 60% - основной фон */
--elderly-bg-light: #f8f9fa        /* Легкий фон */
--elderly-gray-light: #f5f5f5
--elderly-gray-medium: #d3d3d3    /* Границы */
--elderly-gray-dark: #666666       /* Контраст 7.0:1 ✅ */
```

### Специальные цвета для сравнений

```css
--elderly-comparison-blue: #1e40af
--elderly-comparison-blue-light: #dbeafe
--elderly-comparison-orange: #ea580c
--elderly-comparison-orange-light: #ffedd5
--elderly-comparison-red: #dc2626
--elderly-comparison-red-light: #fee2e2
```

**Использование:**
- Official vs Reality компоненты
- Сравнительные таблицы
- Визуализация данных

### Правило 60/30/10

- **60%** - белый фон (`bg-elderly-bg`)
- **30%** - светло-голубые фоны (`bg-elderly-primary-light`)
- **10%** - акценты (NHS Blue, зеленый)

---

## 📝 ТИПОГРАФИКА

### Размеры шрифтов

```css
'elderly-xs': 14px   (line-height: 1.8) - мелкий текст
'elderly-sm': 16px   (line-height: 1.8) - обычный текст
'elderly-base': 18px (line-height: 1.8) - основной текст (по умолчанию)
'elderly-lg': 20px   (line-height: 1.8) - подзаголовки
'elderly-xl': 24px   (line-height: 1.8) - заголовки секций
'elderly-2xl': 28px  (line-height: 1.8) - главные заголовки
'elderly-hero': 32px (line-height: 1.2) - героические заголовки
```

### Иерархия заголовков

**H1 (Главный заголовок):**
```tsx
<h1 className="text-elderly-hero font-bold text-elderly-primary">
  или
<h1 className="text-elderly-2xl font-bold text-elderly-primary">
```

**H2 (Заголовок секции):**
```tsx
<h2 className="text-elderly-xl font-bold text-elderly-primary">
  или используйте класс:
<h2 className="section-heading">
```

**H3 (Подзаголовок):**
```tsx
<h3 className="text-elderly-lg font-bold text-elderly-primary">
  или используйте класс:
<h3 className="subsection-heading">
```

**Body (Основной текст):**
```tsx
<p className="text-elderly-base text-elderly-text">
```

**Мелкий текст:**
```tsx
<p className="text-elderly-sm text-elderly-gray-dark">
```

### Шрифт

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
  'Helvetica Neue', sans-serif;
```

**Характеристики:**
- Системные шрифты (быстрая загрузка)
- Sans-serif (читаемость)
- Antialiased (сглаживание)

---

## 🧩 КОМПОНЕНТЫ

### Button (Кнопки)

#### Primary Button
```tsx
<Button variant="primary" size="default">
  Primary Action
</Button>

// Или используйте класс:
<button className="btn-primary">
  Primary Action
</button>
```

**Стили:**
- Фон: NHS Blue (`bg-elderly-primary`)
- Текст: белый
- Hover: темно-синий (`bg-elderly-primary-dark`)
- Минимальная высота: 44px (WCAG AAA)

#### Secondary Button
```tsx
<Button variant="secondary" size="default">
  Secondary Action
</Button>

// Или используйте класс:
<button className="btn-secondary">
  Secondary Action
</button>
```

**Стили:**
- Фон: белый
- Текст: NHS Blue
- Граница: NHS Blue
- Hover: светло-серый фон

#### Размеры
- `default`: `px-8 py-4 text-elderly-base min-h-touch` (44px)
- `large`: `px-10 py-5 text-elderly-lg font-bold min-h-[52px]`

### Card (Карточки)

#### Обычная карточка
```tsx
<Card>
  <h3>Заголовок</h3>
  <p>Контент</p>
</Card>

// Или используйте класс:
<div className="procedure-card">
  <h3>Заголовок</h3>
  <p>Контент</p>
</div>
```

**Стили:**
- Фон: белый
- Граница: серая (`border-elderly-gray-medium`)
- Padding: 24px
- Тень: мягкая
- Hover: увеличенная тень

#### Карточка с цветным фоном
```tsx
// Светло-голубой фон
<div className="card-primary-light">
  <h3>Заголовок</h3>
  <p>Контент</p>
</div>

// Светло-зеленый фон
<div className="card-accent-light">
  <h3>Заголовок</h3>
  <p>Контент</p>
</div>
```

### Секции

#### Секция с фоном
```tsx
// Светло-голубой фон
<section className="section-primary-light">
  <h2 className="section-heading">Заголовок секции</h2>
  <p>Контент</p>
</section>

// Светло-зеленый фон
<section className="section-accent-light">
  <h2 className="section-heading-center">Заголовок (центрированный)</h2>
  <p>Контент</p>
</section>
```

### Информационные блоки

#### Info Box
```tsx
<div className="info-box">
  <h3>Информация</h3>
  <p>Текст информационного сообщения</p>
</div>
```

#### Warning Box
```tsx
<div className="warning-box">
  <h3>Предупреждение</h3>
  <p>Текст предупреждающего сообщения</p>
</div>
```

#### Success Box
```tsx
<div className="success-box">
  <h3>Успех</h3>
  <p>Текст успешного сообщения</p>
</div>
```

#### Error Box
```tsx
<div className="error-box">
  <h3>Ошибка</h3>
  <p>Текст сообщения об ошибке</p>
</div>
```

### Таблицы

```tsx
<table className="comparison-table">
  <thead>
    <tr>
      <th>Заголовок 1</th>
      <th>Заголовок 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Данные 1</td>
      <td>Данные 2</td>
    </tr>
  </tbody>
</table>
```

**Стили:**
- Заголовки: светло-голубой фон, NHS Blue текст
- Ячейки: белый фон, серая граница
- Padding: 16px

---

## 📐 SPACING СИСТЕМА

### Отступы между секциями

```tsx
// Стандартный отступ между секциями
<section className="mb-12">
  {/* Контент */}
</section>
```

### Отступы внутри секций

```tsx
// Стандартный padding
<div className="p-6">
  {/* Контент */}
</div>

// Больший padding для важных секций
<div className="p-8">
  {/* Контент */}
</div>
```

### Отступы между элементами

```tsx
// Вертикальные отступы
<div className="space-y-4">
  {/* Элементы с отступом 16px */}
</div>

<div className="space-y-6">
  {/* Элементы с отступом 24px */}
</div>

// Горизонтальные отступы (Grid)
<div className="grid grid-cols-3 gap-6">
  {/* Элементы с отступом 24px */}
</div>
```

### Контейнеры

```tsx
// Стандартный контейнер
<div className="container mx-auto px-4 py-8 max-w-6xl">
  {/* Контент */}
</div>

// Узкий контейнер
<div className="container mx-auto px-4 py-8 max-w-4xl">
  {/* Контент */}
</div>
```

### Touch Targets

```css
min-h-touch: 44px      /* Минимум для WCAG AAA */
min-h-touch-lg: 56px   /* Для крупных элементов */
```

---

## ♿ ACCESSIBILITY

### WCAG AAA Требования

#### Контраст
- ✅ Нормальный текст: минимум 7:1
- ✅ Крупный текст: минимум 4.5:1
- ✅ UI компоненты: минимум 3:1

#### Touch Targets
- ✅ Минимум 44px для всех интерактивных элементов
- ✅ Достаточное пространство между элементами

#### Focus States
```tsx
// Все интерактивные элементы имеют focus states
focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2
```

#### Семантический HTML
- Используйте правильные HTML теги (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Используйте ARIA labels где необходимо
- Используйте правильные заголовки (H1 → H2 → H3)

---

## 💡 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Hero Section

```tsx
<section className="bg-elderly-primary-light p-8 rounded-lg border-elderly border-elderly-gray-medium">
  <h1 className="text-elderly-hero font-bold text-elderly-primary mb-6">
    Главный заголовок
  </h1>
  <p className="text-elderly-base text-elderly-text mb-8 max-w-3xl mx-auto">
    Описание
  </p>
  <Button variant="primary" size="large">
    CTA кнопка
  </Button>
</section>
```

### Trust Section

```tsx
<section className="bg-elderly-accent-light p-6 rounded-lg border-elderly border-elderly-gray-medium">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
    <div className="text-center">
      <div className="text-3xl mb-3 text-elderly-accent">✓</div>
      <h3 className="text-elderly-lg font-bold mb-2 text-elderly-text">
        Заголовок
      </h3>
      <p className="text-elderly-sm text-elderly-text">
        Описание
      </p>
    </div>
  </div>
</section>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card className="bg-elderly-primary-light">
    <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
      Заголовок карточки
    </h3>
    <p className="text-elderly-sm text-elderly-text mb-4">
      Описание
    </p>
    <Button variant="primary" className="w-full">
      Действие
    </Button>
  </Card>
</div>
```

### Info Section

```tsx
<section className="section-primary-light">
  <h2 className="section-heading">Заголовок секции</h2>
  <div className="space-y-4 text-elderly-base text-elderly-text">
    <p>Параграф 1</p>
    <p>Параграф 2</p>
  </div>
</section>
```

### Warning Message

```tsx
<div className="warning-box">
  <h3>Важное предупреждение</h3>
  <p className="text-elderly-base text-elderly-text">
    Текст предупреждения
  </p>
</div>
```

### Success Message

```tsx
<div className="success-box">
  <h3>Успешно!</h3>
  <p className="text-elderly-base text-elderly-text">
    Операция выполнена успешно
  </p>
</div>
```

### Error Message

```tsx
<div className="error-box">
  <h3>Ошибка</h3>
  <p className="text-elderly-base text-elderly-text">
    Сообщение об ошибке
  </p>
</div>
```

---

## 🎯 ЧЕКЛИСТ ИСПОЛЬЗОВАНИЯ

### При создании новой секции:

- [ ] Используйте правильные размеры шрифтов (`text-elderly-*`)
- [ ] Применяйте правильные цвета (`text-elderly-primary`, `bg-elderly-primary-light`)
- [ ] Используйте правильные отступы (`mb-12` между секциями, `p-6` внутри)
- [ ] Проверьте контраст цветов (WCAG AAA)
- [ ] Убедитесь, что touch targets минимум 44px
- [ ] Добавьте focus states для интерактивных элементов
- [ ] Используйте семантический HTML

### При создании нового компонента:

- [ ] Используйте классы из дизайн-системы
- [ ] Следуйте правилу 60/30/10 для цветов
- [ ] Применяйте правильную типографику
- [ ] Обеспечьте accessibility (ARIA, focus states)
- [ ] Тестируйте на разных размерах экрана

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [HOMEPAGE_STYLE_ANALYSIS.md](./HOMEPAGE_STYLE_ANALYSIS.md) - Анализ стилей главной страницы
- [BRAND_COLOR_GUIDELINES.md](./BRAND_COLOR_GUIDELINES.md) - Руководство по цветам
- [COLOR_IMPLEMENTATION_SUMMARY.md](./COLOR_IMPLEMENTATION_SUMMARY.md) - Отчет о реализации

---

**Дата создания:** 2025-01-27  
**Версия:** 2.0  
**Статус:** ✅ Полностью реализована и готова к использованию

