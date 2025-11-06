# FIRECRAWL + CURSOR: ПОЛНАЯ АВТОМАТИЗАЦИЯ СБОРА ДАННЫХ

**Настройка автоматического еженедельного обновления данных за 2-3 часа (один раз)**

---

## 🚀 КОГДА ИСПОЛЬЗОВАТЬ

✅ **Используй Firecrawl + Cursor если:**
- Сайт уже запущен (или через неделю после MVP)
- Хочешь автоматические еженедельные обновления (не работать руками)
- Планируешь масштабировать на 50+ городов
- Готов потратить 2-3 часа на setup один раз

❌ **НЕ используй Firecrawl если:**
- Хочешь запустить MVP ТАС ЖЕ (используй Claude Deep Research вместо)
- У тебя нет GitHub Actions знания (но это учишь быстро)

---

## 💰 СТОИМОСТЬ

```
Firecrawl API: £10-50/месяц (в зависимости от volume)
Cursor AI: уже используешь
GitHub Actions: £0 (included в GitHub)
────────────────────────────────
TOTAL: £10-50/месяц за полную автоматизацию
```

---

## 🛠️ STEP 1: Зарегистрироваться на Firecrawl

### 1.1 Открой Firecrawl

```
https://www.firecrawl.dev/
```

### 1.2 Зарегистрируйся

```
- Click "Sign Up"
- Use email (рекомендуется Gmail)
- Confirm email
```

### 1.3 Получи API Key

```
1. После регистрации → Dashboard
2. Find "API Key" (usually in Settings)
3. Copy твой API key (выглядит как: fc_xxxxxxxxxxxxxxx)
4. Сохрани в безопасном месте (потом нужно добавить в GitHub Secrets)
```

---

## 🛠️ STEP 2: Cursor напишет код за тебя

### 2.1 Открой Cursor

### 2.2 Скажи Cursor этот EXACT PROMPT

```
Create a Node.js script using Firecrawl that:

1. SCRAPE NHS WAITING TIMES:
   - Use Firecrawl to scrape https://www.myplannedcare.nhs.uk/
   - Extract average wait times for:
     * Cataract surgery
     * Hip replacement  
     * Knee replacement
   - For these cities: London, Manchester, Birmingham, Leeds, Bristol
   - Output: CSV file with columns:
     procedure_id, city, nhs_trust_name, avg_wait_weeks, last_updated
   - Save to: public/data/nhs_waits.csv

2. SCRAPE PRIVATE SURGERY COSTS:
   - Use Firecrawl to scrape https://www.phin.org.uk/independent-provider-finder/
   - Extract price ranges for same procedures and cities
   - Output: CSV file with columns:
     procedure_id, city, cost_min_gbp, cost_max_gbp, clinic_count, last_updated
   - Save to: public/data/private_costs.csv

3. SCRAPE TOP CLINICS:
   - Extract top 3-5 clinics per procedure-city combo from PHIN
   - Output: CSV file with columns:
     procedure_id, city, clinic_name, price_gbp, phone_number, website_url, last_updated
   - Save to: public/data/clinics.csv

REQUIREMENTS:
- Use my Firecrawl API key (will pass as environment variable FIRECRAWL_API_KEY)
- Handle errors gracefully (log to console)
- Add date timestamp to all records
- Make sure CSV output is clean and properly formatted
- Run without requiring any browser (headless)
- Save all files to /public/data/ directory

Include:
1. Main scraping script (scraper.js or scraper.mjs)
2. CSV parsing/formatting utility
3. Error handling for failed scrapes
4. Logging to console for debugging

Use the firecrawl npm package. Install with: npm install @firecrawl/sdk
```

### 2.3 Что получишь

Cursor напишет:
- `scripts/scraper.js` (основной скрипт)
- `scripts/utils.js` (helper функции для CSV)
- `package.json` (с dependencies)

---

## 🛠️ STEP 3: GitHub Actions Setup

### 3.1 Создать GitHub Actions workflow

В твоем GitHub репозитории создай файл:

```
.github/workflows/weekly-data-update.yml
```

### 3.2 Copy этот YAML в файл

```yaml
name: Weekly Data Update

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM GMT
  workflow_dispatch:  # Allow manual trigger

jobs:
  update-data:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run scraper
        env:
          FIRECRAWL_API_KEY: ${{ secrets.FIRECRAWL_API_KEY }}
        run: node scripts/scraper.js
      
      - name: Commit changes
        run: |
          git config user.name "DataBot"
          git config user.email "bot@eldersurgery.com"
          git add public/data/*.csv
          git commit -m "Auto: Update NHS and private surgery data" || echo "No changes to commit"
      
      - name: Push changes
        run: git push
      
      - name: Trigger Vercel deployment
        run: |
          curl -X POST https://api.vercel.com/v1/deployments \
            -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"gitSource":{"type":"github","ref":"main"}}'
```

### 3.3 Add Secrets to GitHub

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add TWO secrets:

```
Name: FIRECRAWL_API_KEY
Value: (твой Firecrawl API key)

Name: VERCEL_TOKEN
Value: (твой Vercel token - получи в Vercel Settings)
```

---

## 🛠️ STEP 4: Тестирование

### 4.1 Тестируй скрипт локально

```bash
# Install dependencies
npm install

# Set environment variable
export FIRECRAWL_API_KEY=fc_xxxxxxxxxxxxxxx

# Run scraper
node scripts/scraper.js
```

### 4.2 Проверь результаты

```
ls -la public/data/

Должны быть три файла:
✅ nhs_waits.csv
✅ private_costs.csv
✅ clinics.csv
```

### 4.3 Проверь CSV format

```bash
head -5 public/data/nhs_waits.csv
head -5 public/data/private_costs.csv
head -5 public/data/clinics.csv
```

### 4.4 Если работает: commit и push

```bash
git add scripts/scraper.js
git add .github/workflows/weekly-data-update.yml
git add public/data/
git commit -m "Setup Firecrawl automation"
git push
```

---

## ⚙️ TROUBLESHOOTING

### Проблема 1: "Firecrawl API returns 401 (Unauthorized)"

**Решение:**
- Проверь что FIRECRAWL_API_KEY правильный
- Проверь что API key added в GitHub Secrets
- Попробуй создать новый API key на Firecrawl

### Проблема 2: "Timeout while scraping My Planned Care"

**Решение:**
- My Planned Care иногда slow
- Добавь timeout в Firecrawl: `timeout: 30000`
- Retry logic в скрипте

### Проблема 3: "CSV format неправильный"

**Решение:**
- Проверь что все quotes правильные
- Убедись что нет запятых в data (они ломают CSV)
- Используй CSV library вместо string concat

### Проблема 4: "GitHub Actions не запускается"

**Решение:**
- Проверь workflow YAML синтаксис
- Убедись что secrets добавлены
- Trigger вручную: Actions tab → Run workflow

---

## 📊 РЕЗУЛЬТАТ

После setup:

```
✅ Каждый ПОНЕДЕЛЬНИК в 9 AM GMT:
   1. GitHub Actions запускает скрипт
   2. Firecrawl скрейпит My Planned Care + PHIN
   3. CSV файлы обновляются
   4. Данные коммитятся в GitHub
   5. Vercel автоматически rebuild
   6. LIVE website с новыми данными

⏱️ Твое время: 0 минут (полная автоматизация)
💰 Стоимость: £10-50/месяц Firecrawl
🔄 Frequency: Еженедельно, без сбоев
```

---

## 🎯 КОГДА СКРИПТ СЛОМАЕТСЯ

Если website структура изменится (My Planned Care или PHIN обновят сайт):

```
Признаки:
❌ CSV файлы пусты
❌ Data неправильный
❌ GitHub Actions fail notifications

Решение:
1. Открой Cursor
2. Скажи: "My Planned Care website structure changed. 
   Update the scraper to extract data from the new format."
3. Cursor обновит код
4. Push и готово!

Время fix: 15-30 минут (один раз в год максимум)
```

---

## 📈 МАСШТАБИРОВАНИЕ

### Добавить новые города

```
В scripts/scraper.js найди:
const CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol']

Добавь: 
const CITIES = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 
                'Edinburgh', 'Glasgow', 'Cardiff', 'Leeds', ...]

Script автоматически скрейпит все города
```

### Добавить новые процедуры

```
const PROCEDURES = ['cataract', 'hip', 'knee']

Добавь:
const PROCEDURES = ['cataract', 'hip', 'knee', 'hernia', 'gallbladder', ...]

Script скрейпит все процедуры
```

---

## 💡 ФИНАЛЬНЫЙ WORKFLOW

### День запуска MVP:

```
1. Claude Deep Research (30 минут) → CSV → Deploy → LIVE
```

### Неделя после запуска:

```
1. Setup Firecrawl + Cursor (2-3 часа)
2. GitHub Actions workflow
3. Test локально
4. Push and deploy
```

### Месяц 1+:

```
1. Автоматический еженедельный refresh (ночью, без участия)
2. Ты fokus на marketing + SEO
3. Вот и все! 
```

---

**ИТОГО: 2-3 часа setup один раз = вечная автоматизация**