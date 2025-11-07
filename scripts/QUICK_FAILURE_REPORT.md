# ❌ Быстрый отчет по неуспешным кейсам (Sample Test)

**Дата:** 2025-11-07T19:24:33.798Z  
**Протестировано:** 9 URL (sample)  
**Успешных:** 6  
**Неудачных:** 3

---

## ❌ Неудачные кейсы

### 1. CATARACT in London

**URL:** `https://www.treatmentconnect.co.uk/hospitals/moorfields-eye-hospital-london/cataract-surgery`

**Процедура:** cataract

**Город:** London

**Ошибка:** No data extracted

**Промпт (первые 300 символов):**
```
You are extracting pricing information from TreatmentConnect.co.uk hospital pages.

CRITICAL RULES:
1. Extract ONLY numeric values for all prices (no currency symbols, no commas)
2. Convert "£2,500" to 2500
3. Convert "£2.5k" to 2500
4. If price shows "From £X", return X as price_min_gbp
5. If singl...
```

**Ответ от Firecrawl:**
```json
{
  "city": "London",
  "postcode": "",
  "price_gbp": 0,
  "avg_uk_price": 0,
  "rating_count": 0,
  "rating_stars": 0,
  "hospital_name": "Hospital Name",
  "price_max_gbp": 0,
  "price_min_gbp": 0,
  "procedure_name": "Cataract Surgery",
  "price_range_uk_max": 0,
  "price_range_uk_min": 0
}
```

---

### 2. KNEE in London

**URL:** `https://www.treatmentconnect.co.uk/hospitals/shirley-oaks-hospital/knee-replacement`

**Процедура:** knee

**Город:** London

**Ошибка:** No data extracted

**Промпт (первые 300 символов):**
```
You are extracting pricing information from TreatmentConnect.co.uk hospital pages.

CRITICAL RULES:
1. Extract ONLY numeric values for all prices (no currency symbols, no commas)
2. Convert "£2,500" to 2500
3. Convert "£2.5k" to 2500
4. If price shows "From £X", return X as price_min_gbp
5. If singl...
```

**Ответ от Firecrawl:**
```json
{
  "city": "London",
  "postcode": "",
  "price_gbp": 0,
  "avg_uk_price": 0,
  "rating_count": 0,
  "rating_stars": 0,
  "hospital_name": "Hospital Name",
  "price_max_gbp": 0,
  "price_min_gbp": 0,
  "procedure_name": "Knee Replacement",
  "price_range_uk_max": 0,
  "price_range_uk_min": 0
}
```

---

### 3. KNEE in London

**URL:** `https://www.treatmentconnect.co.uk/hospitals/the-cavell-hospital/knee-replacement`

**Процедура:** knee

**Город:** London

**Ошибка:** No data extracted

**Промпт (первые 300 символов):**
```
You are extracting pricing information from TreatmentConnect.co.uk hospital pages.

CRITICAL RULES:
1. Extract ONLY numeric values for all prices (no currency symbols, no commas)
2. Convert "£2,500" to 2500
3. Convert "£2.5k" to 2500
4. If price shows "From £X", return X as price_min_gbp
5. If singl...
```

**Ответ от Firecrawl:**
```json
{
  "city": "London",
  "postcode": "",
  "price_gbp": 0,
  "avg_uk_price": 0,
  "rating_count": 0,
  "rating_stars": 0,
  "hospital_name": "",
  "price_max_gbp": 0,
  "price_min_gbp": 0,
  "procedure_name": "Knee Replacement",
  "price_range_uk_max": 0,
  "price_range_uk_min": 0
}
```

---

