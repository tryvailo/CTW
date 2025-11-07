# 🔍 ЗАДАЧА ДЛЯ CLAUDE AI: Поиск URL для Manchester и замены для неудачных кейсов

**Дата:** 2025-11-07  
**Приоритет:** HIGH  
**Статус:** ⏳ Ожидает выполнения

---

## 📋 КОНТЕКСТ ЗАДАЧИ

### Что мы делаем:
Автоматизируем сбор цен на частные операции в Великобритании через TreatmentConnect.co.uk используя Firecrawl JSON Mode.

### Текущая ситуация:
- ✅ **Success rate: 95%** (37/39 URL работают)
- ⚠️ **Manchester coverage:** Только 3 URL (нужно больше)
- ❌ **2 неудачных URL:** Нужны замены

### Источник данных:
**TreatmentConnect.co.uk** - агрегатор цен от 146 частных больниц UK

**URL Pattern:**
```
https://www.treatmentconnect.co.uk/hospitals/{hospital-slug}/{procedure}
```

**Процедуры:**
- `cataract-surgery`
- `hip-replacement`
- `knee-replacement`

---

## 🎯 ЗАДАЧА 1: Найти новые URL для Manchester

### Проблема:
После очистки неработающих URL осталось только **3 URL для Manchester**:
- `ramsay-springfield-hospital/cataract-surgery` ✅
- `spire-manchester-hospital/hip-replacement` ✅
- `spire-manchester-hospital/knee-replacement` ✅

**Цель:** Найти **6-9 дополнительных URL** для Manchester, чтобы восстановить покрытие до 9-12 URL (как было в v1.0).

### Требования:

1. **Найти URL для следующих комбинаций:**

   **Cataract Surgery (нужно 2-3 URL):**
   - ✅ Есть: `ramsay-springfield-hospital/cataract-surgery`
   - ❌ Нужно найти: 2-3 дополнительных URL

   **Hip Replacement (нужно 2-3 URL):**
   - ✅ Есть: `spire-manchester-hospital/hip-replacement`
   - ❌ Нужно найти: 2-3 дополнительных URL

   **Knee Replacement (нужно 2-3 URL):**
   - ✅ Есть: `spire-manchester-hospital/knee-replacement`
   - ❌ Нужно найти: 2-3 дополнительных URL

2. **Приоритетные больницы для поиска:**

   **Nuffield Health Manchester:**
   - Проверить: `nuffield-health-manchester-hospital/{procedure}`
   - Ожидаемые URL:
     - `nuffield-health-manchester-hospital/cataract-surgery`
     - `nuffield-health-manchester-hospital/hip-replacement`
     - `nuffield-health-manchester-hospital/knee-replacement`

   **BMI The Beaumont Hospital:**
   - Проверить: `bmi-the-beaumont-hospital/{procedure}`
   - Ожидаемые URL:
     - `bmi-the-beaumont-hospital/cataract-surgery`
     - `bmi-the-beaumont-hospital/hip-replacement`
     - `bmi-the-beaumont-hospital/knee-replacement`

   **Spire Alexandra Hospital:**
   - ⚠️ ВАЖНО: Это НЕ "Alexandra Hospital Manchester" (которая не работает)
   - Проверить: `spire-alexandra-hospital/{procedure}`
   - Ожидаемые URL:
     - `spire-alexandra-hospital/cataract-surgery`
     - `spire-alexandra-hospital/hip-replacement`
     - `spire-alexandra-hospital/knee-replacement`

   **Другие возможные больницы:**
   - Ramsay Springfield Hospital (другие процедуры)
   - Circle Health Group больницы в Manchester
   - Другие частные больницы в Manchester area

3. **Как искать:**

   **Метод 1: Прямая проверка URL**
   ```
   1. Составить список возможных URL на основе известных паттернов
   2. Проверить каждый URL:
      - Открыть в браузере
      - Проверить наличие цены на странице
      - Проверить, что нет сообщения "This hospital is no longer listed"
   3. Записать работающие URL
   ```

   **Метод 2: Поиск через TreatmentConnect**
   ```
   1. Перейти на https://www.treatmentconnect.co.uk
   2. Использовать поиск по городу "Manchester"
   3. Фильтровать по процедурам (cataract, hip, knee)
   4. Собрать URL всех найденных больниц
   5. Проверить каждый URL на наличие цен
   ```

   **Метод 3: Поиск по известным сетям**
   ```
   1. Список сетей: Spire, Nuffield, Circle, Ramsay, BMI
   2. Для каждой сети найти больницы в Manchester
   3. Проверить наличие страниц с ценами для каждой процедуры
   4. Собрать работающие URL
   ```

4. **Критерии валидности URL:**

   ✅ **URL валиден, если:**
   - Страница открывается (200 OK)
   - На странице есть цена в формате "£X,XXX" или "From £X"
   - Нет сообщения "This hospital is no longer listed"
   - Название больницы четко указано
   - Город указан как Manchester или nearby area

   ❌ **URL невалиден, если:**
   - Страница 404 или ошибка
   - Сообщение "This hospital is no longer listed"
   - Нет цены на странице
   - Больница не в Manchester area

5. **Формат результата:**

   Для каждого найденного URL предоставить:
   ```markdown
   ### [Название больницы] - [Процедура]
   
   **URL:** `https://www.treatmentconnect.co.uk/hospitals/{slug}/{procedure}`
   
   **Проверка:**
   - ✅ Страница открывается
   - ✅ Цена присутствует: £X,XXX
   - ✅ Название больницы: [название]
   - ✅ Город: Manchester
   
   **Цена:** £X,XXX (если видна)
   ```

---

## 🎯 ЗАДАЧА 2: Найти замены для неудачных URL

### Проблема 1: BMI The Sloane Hospital - Hip Replacement (London)

**Неудачный URL:**
```
https://www.treatmentconnect.co.uk/hospitals/bmi-the-sloane-hospital/hip-replacement
```

**Ошибка:** No data extracted (price_gbp=0, hospital_name="")

**Что нужно найти:**
1. **Альтернативные URL для той же больницы:**
   - Проверить другие процедуры: `bmi-the-sloane-hospital/cataract-surgery`
   - Проверить другие процедуры: `bmi-the-sloane-hospital/knee-replacement`
   - Если другие процедуры работают, значит проблема только с hip-replacement

2. **Заменяющие больницы в London для Hip Replacement:**
   - Найти другие London больницы с hip-replacement
   - Приоритет: Spire, Nuffield, Circle, Ramsay, BMI (другие больницы)
   - Убедиться, что URL не дублирует уже существующие

**Текущие работающие London Hip URLs (НЕ ДУБЛИРОВАТЬ):**
- ✅ `circle-the-london-independent-hospital/hip-replacement`
- ✅ `nuffield-health-brentwood-hospital/hip-replacement`
- ✅ `ramsay-rivers-hospital/hip-replacement`
- ✅ `spire-london-east-hospital/hip-replacement`
- ✅ `circle-the-blackheath-hospital/hip-replacement`
- ✅ `practice-plus-ilford-hospital/hip-replacement`
- ❌ `bmi-the-sloane-hospital/hip-replacement` (не работает - НУЖНА ЗАМЕНА)

**Цель:** Найти 1-2 заменяющих URL для hip-replacement в London.

---

### Проблема 2: Practice Plus Group Hospital Emersons Green - Cataract (Bristol)

**Неудачный URL:**
```
https://www.treatmentconnect.co.uk/hospitals/practice-plus-group-hospital-emersons-green/cataract-surgery
```

**Ошибка:** No data extracted (price_gbp=2500, но hospital_name="Hospital Name")

**Что нужно найти:**
1. **Альтернативные URL для той же больницы:**
   - Проверить другие процедуры: `practice-plus-group-hospital-emersons-green/hip-replacement`
   - Проверить другие процедуры: `practice-plus-group-hospital-emersons-green/knee-replacement`
   - Если другие процедуры работают, значит проблема только с cataract-surgery

2. **Заменяющие больницы в Bristol для Cataract Surgery:**
   - Найти другие Bristol больницы с cataract-surgery
   - Приоритет: Spire, Nuffield, Circle, Ramsay, Practice Plus (другие больницы)
   - Убедиться, что URL не дублирует уже существующие

**Текущие работающие Bristol Cataract URLs (НЕ ДУБЛИРОВАТЬ):**
- ✅ `spire-bristol-hospital/cataract-surgery`
- ✅ `nuffield-health-bristol-hospital/cataract-surgery`
- ❌ `practice-plus-group-hospital-emersons-green/cataract-surgery` (не работает - НУЖНА ЗАМЕНА)

**Цель:** Найти 1-2 заменяющих URL для cataract-surgery в Bristol.

---

## 📋 ТЕКУЩИЙ СПИСОК URL (НЕ ДУБЛИРОВАТЬ)

### Manchester (текущие - 3 URL):
- ✅ `ramsay-springfield-hospital/cataract-surgery`
- ✅ `spire-manchester-hospital/hip-replacement`
- ✅ `spire-manchester-hospital/knee-replacement`

### London Hip (текущие - 6 работающих):
- ✅ `circle-the-london-independent-hospital/hip-replacement`
- ✅ `nuffield-health-brentwood-hospital/hip-replacement`
- ✅ `ramsay-rivers-hospital/hip-replacement`
- ✅ `spire-london-east-hospital/hip-replacement`
- ✅ `circle-the-blackheath-hospital/hip-replacement`
- ✅ `practice-plus-ilford-hospital/hip-replacement`

### Bristol Cataract (текущие - 2 работающих):
- ✅ `spire-bristol-hospital/cataract-surgery`
- ✅ `nuffield-health-bristol-hospital/cataract-surgery`

**⚠️ ВАЖНО:** Не добавляйте URL, которые уже есть в этом списке!

---

## 📝 ИНСТРУКЦИИ ДЛЯ ПОИСКА

### Шаг 1: Подготовка

1. **Откройте TreatmentConnect.co.uk в браузере**
2. **Изучите структуру сайта:**
   - Как работает поиск
   - Как формируются URL
   - Какие больницы есть в Manchester, London, Bristol

### Шаг 2: Поиск Manchester URL

1. **Используйте поиск TreatmentConnect:**
   - Город: "Manchester"
   - Процедура: cataract-surgery, hip-replacement, knee-replacement
   - Соберите список всех найденных больниц

2. **Проверьте каждую больницу:**
   - Откройте страницу больницы
   - Проверьте наличие цен для нужных процедур
   - Скопируйте URL страницы с ценой

3. **Приоритетные больницы для проверки:**
   ```
   - Nuffield Health Manchester Hospital
   - BMI The Beaumont Hospital
   - Spire Alexandra Hospital (НЕ Alexandra Hospital Manchester!)
   - Ramsay Springfield Hospital (другие процедуры)
   - Circle Health Group больницы в Manchester
   ```

4. **Проверьте известные сети:**
   - Spire: поиск "Spire Manchester"
   - Nuffield: поиск "Nuffield Manchester"
   - Circle: поиск "Circle Manchester"
   - Ramsay: поиск "Ramsay Manchester"
   - BMI: поиск "BMI Manchester"

### Шаг 3: Поиск замен для London Hip

1. **Проверьте BMI The Sloane Hospital:**
   - Откройте: `bmi-the-sloane-hospital/cataract-surgery`
   - Откройте: `bmi-the-sloane-hospital/knee-replacement`
   - Если работают - значит проблема только с hip-replacement

2. **Найдите альтернативы:**
   - Поиск в TreatmentConnect: "London" + "hip replacement"
   - Проверьте другие BMI больницы в London
   - Проверьте другие сети (Spire, Nuffield, Circle, Ramsay)

3. **Избегайте дубликатов:**
   - Не добавляйте URL, которые уже есть в списке работающих

### Шаг 4: Поиск замен для Bristol Cataract

1. **Проверьте Practice Plus Group Hospital Emersons Green:**
   - Откройте: `practice-plus-group-hospital-emersons-green/hip-replacement`
   - Откройте: `practice-plus-group-hospital-emersons-green/knee-replacement`
   - Если работают - значит проблема только с cataract-surgery

2. **Найдите альтернативы:**
   - Поиск в TreatmentConnect: "Bristol" + "cataract surgery"
   - Проверьте другие Practice Plus больницы в Bristol
   - Проверьте другие сети (Spire, Nuffield, Circle, Ramsay)

3. **Избегайте дубликатов:**
   - Не добавляйте URL, которые уже есть в списке работающих

---

## ✅ КРИТЕРИИ УСПЕХА

### Для Manchester:
- ✅ Найдено минимум **6 новых URL** (2-3 на каждую процедуру)
- ✅ Все URL проверены и работают (есть цены)
- ✅ Нет дубликатов с существующими URL
- ✅ Все больницы в Manchester area

### Для London Hip Replacement:
- ✅ Найдено **1-2 заменяющих URL**
- ✅ URL проверены и работают
- ✅ Нет дубликатов с существующими URL
- ✅ Больницы в London area

### Для Bristol Cataract Surgery:
- ✅ Найдено **1-2 заменяющих URL**
- ✅ URL проверены и работают
- ✅ Нет дубликатов с существующими URL
- ✅ Больницы в Bristol area

---

## 📋 ФОРМАТ ОТЧЕТА

### Структура отчета:

```markdown
# Результаты поиска URL для TreatmentConnect

## 1. Manchester URLs

### Cataract Surgery
- [Больница 1] - URL, цена, проверка ✅
- [Больница 2] - URL, цена, проверка ✅

### Hip Replacement
- [Больница 1] - URL, цена, проверка ✅
- [Больница 2] - URL, цена, проверка ✅

### Knee Replacement
- [Больница 1] - URL, цена, проверка ✅
- [Больница 2] - URL, цена, проверка ✅

## 2. London Hip Replacement Replacements

- [Больница] - URL, цена, проверка ✅
- [Больница] - URL, цена, проверка ✅

## 3. Bristol Cataract Surgery Replacements

- [Больница] - URL, цена, проверка ✅
- [Больница] - URL, цена, проверка ✅

## 4. Проверка проблемных URL

### BMI The Sloane Hospital
- cataract-surgery: [работает/не работает]
- knee-replacement: [работает/не работает]

### Practice Plus Group Hospital Emersons Green
- hip-replacement: [работает/не работает]
- knee-replacement: [работает/не работает]
```

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **НЕ путать:**
   - "Alexandra Hospital Manchester" (не работает) ≠ "Spire Alexandra Hospital" (может работать)
   - Проверяйте точные названия больниц

2. **Проверка URL:**
   - Всегда открывайте URL в браузере перед добавлением
   - Проверяйте наличие цены
   - Проверяйте отсутствие сообщения "no longer listed"

3. **Формат URL:**
   - Всегда используйте полный URL: `https://www.treatmentconnect.co.uk/hospitals/{slug}/{procedure}`
   - Slug должен быть в формате kebab-case (lowercase-with-hyphens)

4. **Приоритет:**
   - Сначала проверьте известные сети (Spire, Nuffield, Circle, Ramsay, BMI)
   - Затем ищите другие частные больницы

5. **Качество данных:**
   - Предпочитайте больницы с четко указанными ценами
   - Избегайте больниц с "guide prices" или "prices on request"

---

## 🎯 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

После выполнения задачи:

1. **Manchester:** 9-12 URL (сейчас 3)
2. **London Hip:** 7-8 работающих URL (сейчас 6, +1-2 замены)
3. **Bristol Cataract:** 3-4 работающих URL (сейчас 2, +1-2 замены)

**Общий результат:**
- Увеличение покрытия Manchester
- Замена 2 неработающих URL
- Улучшение success rate с 95% до 97-98%

---

**Статус:** ⏳ Ожидает выполнения  
**Приоритет:** HIGH  
**Время выполнения:** 1-2 часа

