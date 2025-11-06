# 🚀 ПРОМПТ ДЛЯ CLAUDE DEEP RESEARCH (БЫСТРОЕ КОПИРОВАНИЕ)

## 📋 БЫСТРЫЕ ШАГИ

1. Открой https://claude.ai
2. Выбери режим **Deep Research**
3. Скопируй промпт ниже
4. Вставь в Claude
5. Жди 15-20 минут
6. Сохрани 3 CSV файла в `data/raw/`

---

## 📝 ПРОМПТ (СКОПИРУЙ ВЕСЬ ТЕКСТ):

```
Collect structured healthcare data from these UK public sources.

TASK 1: NHS WAITING TIMES
Source: My Planned Care (https://www.myplannedcare.nhs.uk/)
Extract and format as CSV:
- procedure_id: cataract, hip, knee (use these exact IDs)
- city: London, Manchester, Birmingham, Leeds, Bristol
- nhs_trust_name: (from website)
- avg_wait_weeks: (integer, current average)
- date: today's date

TASK 2: PRIVATE SURGERY COSTS
Source: PHIN Independent Provider Finder (https://www.phin.org.uk/independent-provider-finder/)
Extract and format as CSV:
- procedure_id: cataract, hip, knee
- city: London, Manchester, Birmingham, Leeds, Bristol
- cost_min_gbp: (minimum price found, integer)
- cost_max_gbp: (maximum price found, integer)
- clinic_count: (number of clinics offering this procedure)
- date: today's date

TASK 3: TOP CLINICS
From PHIN, find top 3-5 cheapest clinics per procedure-city combo.
Format as CSV:
- procedure_id, city, clinic_name, price_gbp, phone_number, website_url

OUTPUT:
Return THREE separate CSV files:
1. nhs_waits.csv (15 rows: 5 cities × 3 procedures)
2. private_costs.csv (15 rows: 5 cities × 3 procedures)
3. clinics.csv (45-75 rows: top 3-5 clinics per combo)

Include:
- Proper CSV headers
- Data quality notes (where data was found, confidence level)
- Last updated timestamp
```

---

## 💾 КУДА СОХРАНИТЬ РЕЗУЛЬТАТЫ

После того как Claude вернет CSV файлы, сохрани их в:

```
data/raw/nhs_waits_claude.csv
data/raw/private_costs_claude.csv
data/raw/clinics_claude.csv
```

---

## 📚 ПОЛНАЯ ИНСТРУКЦИЯ

См. `INSTRUCTIONS_CLAUDE_DEEP_RESEARCH.md` для детальных шагов и troubleshooting.

