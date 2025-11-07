# 🚀 БЫСТРАЯ СПРАВКА: Задача для Claude AI

**Файл с полной задачей:** `CLAUDE_TASK_FIND_MANCHESTER_AND_REPLACEMENT_URLS.md`

---

## 🎯 ЧТО НУЖНО СДЕЛАТЬ

### 1. Найти 6-9 новых URL для Manchester
- Cataract: +2-3 URL
- Hip: +2-3 URL  
- Knee: +2-3 URL

### 2. Найти замены для 2 неработающих URL
- London Hip: замена для `bmi-the-sloane-hospital/hip-replacement`
- Bristol Cataract: замена для `practice-plus-group-hospital-emersons-green/cataract-surgery`

---

## 🔍 ГДЕ ИСКАТЬ

**Источник:** https://www.treatmentconnect.co.uk

**URL Pattern:**
```
https://www.treatmentconnect.co.uk/hospitals/{hospital-slug}/{procedure}
```

**Процедуры:**
- `cataract-surgery`
- `hip-replacement`
- `knee-replacement`

---

## ✅ КРИТЕРИИ ВАЛИДНОСТИ

URL валиден, если:
- ✅ Страница открывается (200 OK)
- ✅ Есть цена в формате "£X,XXX"
- ✅ Нет сообщения "This hospital is no longer listed"
- ✅ Название больницы четко указано

---

## 📋 ПРИОРИТЕТНЫЕ БОЛЬНИЦЫ

### Для Manchester:
1. Nuffield Health Manchester Hospital
2. BMI The Beaumont Hospital
3. Spire Alexandra Hospital (НЕ Alexandra Hospital Manchester!)
4. Другие Spire/Nuffield/Circle/Ramsay/BMI в Manchester

### Для London Hip:
- Другие BMI больницы в London
- Другие Spire/Nuffield/Circle/Ramsay в London

### Для Bristol Cataract:
- Другие Practice Plus больницы в Bristol
- Другие Spire/Nuffield/Circle/Ramsay в Bristol

---

## 📊 ФОРМАТ РЕЗУЛЬТАТА

Для каждого найденного URL:
```markdown
### [Название больницы] - [Процедура]

**URL:** `https://www.treatmentconnect.co.uk/hospitals/{slug}/{procedure}`

**Проверка:**
- ✅ Страница открывается
- ✅ Цена присутствует: £X,XXX
- ✅ Название больницы: [название]
- ✅ Город: [Manchester/London/Bristol]

**Цена:** £X,XXX
```

---

**Полная инструкция:** См. `CLAUDE_TASK_FIND_MANCHESTER_AND_REPLACEMENT_URLS.md`

