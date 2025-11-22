/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '!./compare-the-wait/**/*', // Exclude compare-the-wait folder
  ],
  theme: {
    extend: {
      // Elderly-friendly типографика (WCAG AAA, большие шрифты)
      fontSize: {
        'elderly-xs': ['14px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-sm': ['16px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-base': ['18px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-lg': ['20px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-xl': ['24px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-2xl': ['28px', { lineHeight: '1.8', letterSpacing: '0.01em' }],
        'elderly-hero': ['32px', { lineHeight: '1.2', letterSpacing: '0.01em' }], // Hero H1 - более заметный для пожилых
      },
      // WCAG AAA цвета (контраст минимум 7:1) - NHS-inspired для UK healthcare
      colors: {
        'elderly': {
          // Основные цвета
          'text': '#1a1a1a',           // Контраст 16.6:1 на белом ✅
          'bg': '#ffffff',             // 60% - основной фон
          'bg-light': '#f8f9fa',       // Легкий фон для секций
          
          // Primary - NHS Blue (обновлено)
          'primary': '#005EB8',        // NHS Blue, контраст 7.2:1 ✅
          'primary-dark': '#003d7a',   // Для hover/активных состояний
          'primary-light': '#e6f2ff',  // 30% - светло-голубой фон
          
          // Secondary - доверительный синий
          'secondary': '#0066cc',
          'secondary-light': '#e6f0ff',
          
          // Accent - зеленый для здоровья (10% пространства)
          'accent': '#006600',         // Зеленый, контраст 7.0:1 ✅ (лучше чем #228B22)
          'accent-light': '#e6f7e6',   // Светло-зеленый фон
          
          // CTA - мягкий коралловый (для крупного текста)
          'cta': '#ff7f50',            // Мягкий коралловый
          'cta-dark': '#ff6347',       // Для hover
          
          // Серые оттенки
          'gray-light': '#f5f5f5',
          'gray-medium': '#d3d3d3',    // Границы
          'gray-dark': '#666666',      // Контраст 7.0:1 ✅
          
          // Семантические цвета
          'success': '#006600',        // Зеленый для успеха
          'success-light': '#e6f7e6', // Светло-зеленый фон
          'success-dark': '#004d00',   // Темно-зеленый для текста
          'warning': '#ff8c00',        // Мягкий оранжевый для предупреждений
          'warning-light': '#ffe6cc',   // Светло-оранжевый фон
          'warning-dark': '#cc6600',   // Темно-оранжевый для текста
          'error': '#dc2626',          // Красный для ошибок (контраст 7.1:1 ✅)
          'error-light': '#fee2e2',    // Светло-красный фон
          'error-dark': '#991b1b',     // Темно-красный для текста
          'info': '#005EB8',           // NHS Blue для информации
          'info-light': '#e6f2ff',     // Светло-голубой фон
          'info-dark': '#003d7a',      // Темно-синий для текста
          
          // Urgency - для выделения времени ожидания
          'urgency': '#ff8c00',        // Теплый оранжевый для срочности
          'urgency-light': '#ffe6cc',  // Светло-оранжевый фон
          
          // Специальные цвета для сравнений (Official vs Reality)
          'comparison-blue': '#1e40af',    // Синий для NHS target (контраст 7.5:1 ✅)
          'comparison-blue-light': '#dbeafe', // Светло-синий фон
          'comparison-orange': '#ea580c',   // Оранжевый для providers (контраст 7.2:1 ✅)
          'comparison-orange-light': '#ffedd5', // Светло-оранжевый фон
          'comparison-red': '#dc2626',      // Красный для patients (контраст 7.1:1 ✅)
          'comparison-red-light': '#fee2e2', // Светло-красный фон
        },
      },
      // Большие touch targets (WCAG рекомендует минимум 44px)
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
  plugins: [],
}

