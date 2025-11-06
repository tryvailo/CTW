# PRD: ElderSurgery - NHS vs Private Surgery Comparison Platform

**Version:** 1.0 (MVP Phase)  
**Date:** November 2025  
**Status:** Ready to Build  
**Target Audience:** UK patients aged 65+, family members  

---

## 1. EXECUTIVE SUMMARY

### One-Liner
**ElderSurgery** is an informational comparison platform that helps elderly UK patients (65+) understand NHS waiting times vs private surgery costs and timelines for common age-related procedures.

### Problem
- **7.7 million patients** on NHS waiting lists (Dec 2024)
- Elderly patients face **18-35 week waits** for orthopedic and ophthalmologic procedures
- **Patients don't know:**
  - Exact NHS wait times in their area
  - How much private surgery actually costs
  - How quickly they could get treated privately
  - Where to find alternatives
- **Information is fragmented** across NHS.uk, clinic websites, and WhatClinic

### Solution
Single comparison platform showing:
1. **NHS Route:** Wait times (sourced from My Planned Care) + Cost (FREE)
2. **Private Route:** Wait times (1-2 weeks typical) + Cost range (sourced from PHIN, clinic websites)
3. **Savings calculator:** "You could save X months by paying £Y"

### Target Geography (MVP)
- **Cities:** London, Manchester, Birmingham, Leeds, Bristol
- **Procedure-City combos:** 5 cities × 3 procedures = 15 pages minimum

### Procedures (MVP)
1. **Cataract Surgery** (ophthalmology, age 65+, 30% prevalence)
2. **Hip Replacement** (orthopedics, age 65-79, high impact)
3. **Knee Replacement** (orthopedics, age 65-79, high impact)

---

## 2. TARGET USER PROFILE

### Primary User (Patient)
- **Age:** 65-85 years old
- **Pain:** Moderate to severe (chronic joint pain, vision loss)
- **Tech comfort:** Low-to-medium (not all tech-savvy)
- **Decision maker:** Often with family input (adult children)
- **Goal:** Get treatment quickly, understand cost, make informed choice
- **Pain points:**
  - Can't read small text
  - Overwhelmed by medical jargon
  - Uncertain about NHS vs private
  - Worried about cost
  - No clear timeline info

### Secondary User (Family Member)
- **Age:** 40-65 (adult children)
- **Role:** Research, comparison, helping parent decide
- **Tech comfort:** Medium-to-high
- **Goal:** Find best option for parent's health

### User Behavior
- **Device:** Desktop (60%), Mobile (40% — larger fonts needed)
- **Session:** 5-10 minutes, typical evening browsing
- **Search keywords:**
  - "cataract surgery cost London"
  - "NHS waiting time knee replacement"
  - "how much does hip surgery cost UK"
  - "private surgery vs NHS wait"
- **Action:** Read, compare, possibly sign up for quotes (PPL future phase)

---

## 3. PRODUCT FEATURES (MVP)

### Core Features

#### 3.1 Comparison Pages (Process × City)
- **URL structure:** `/cataract-london`, `/hip-manchester`, `/knee-birmingham`
- **Content per page:**
  1. **Page header** (H1, Meta): "{Procedure} in {City}: NHS vs Private"
  2. **Comparison table:**
     - NHS Route (left): Wait time, cost, source, date
     - Private Route (right): Wait time, cost range, clinic count, top 3-5 clinics by price
  3. **Mini savings calculator:**
     - Input: Patient's age (optional)
     - Output: "You could save X months" + "Cost £Y for private"
  4. **FAQ section:** 5-10 common questions (pre-written)
  5. **Safety disclaimer:** "This is informational, consult doctor"

#### 3.2 NHS Data Integration
- **Source:** My Planned Care (https://www.myplannedcare.nhs.uk)
- **Data:** Average wait times per procedure, per city/trust
- **Update frequency:** Weekly (automated via GitHub Actions)
- **Display:** "Average wait: X weeks (data from My Planned Care, updated Nov 2025)"

#### 3.3 Private Data Integration
- **Sources:**
  - PHIN catalogue (https://www.phin.org.uk) — aggregated fees
  - Clinic websites (Moorfields, Practice Plus, Circle, Spire, etc.)
  - CMA consultant registry
- **Data:** Price ranges, clinic counts, top clinics by price
- **Update frequency:** Weekly (automated scraper via Playwright)
- **Display:** "£X-£Y across X clinics (latest data from clinic websites)"

#### 3.4 Calculations & Tools
- **Savings calculator:**
  - Input: None required (pre-populated with data)
  - Display: "Save 16 weeks by paying £3,500"
  - Formula: NHS_wait_weeks - Private_wait_weeks = time saved
  
#### 3.5 SEO & Content
- **H1 per page:** "{Procedure} in {City}: NHS Wait {X} weeks vs Private £{Y}"
- **Meta description:** "Compare NHS waiting times vs private cost for {procedure} in {city}. Free comparison guide."
- **Schema.org:** LocalBusiness, BreadcrumbList
- **Internal links:** Between cities, between procedures

---

## 4. INFORMATION ARCHITECTURE

### Site Structure
```
/
├─ / (Homepage - hub)
├─ /cataract (procedure landing)
│  ├─ /cataract-london
│  ├─ /cataract-manchester
│  ├─ /cataract-birmingham
│  └─ ... (5 cities)
├─ /hip-replacement (procedure landing)
│  ├─ /hip-replacement-london
│  └─ ... (5 cities)
├─ /knee-replacement (procedure landing)
│  ├─ /knee-replacement-london
│  └─ ... (5 cities)
├─ /about
├─ /faq
├─ /privacy-policy
└─ /terms-of-service
```

### Dynamic Page Generation
- **Input:** CSV file with procedure × city data
- **Output:** 15-18 static HTML pages (generated via Next.js SSG)
- **Build time:** ~2 minutes
- **Rebuild trigger:** Weekly (GitHub Actions) or manual on-demand

---

## 5. DATA SCHEMA

### procedures.csv
```
procedure_id, name, specialty, description, nhs_code
cataract, Cataract Surgery, Ophthalmology, Removal and replacement of cloudy lens, C71
hip, Hip Replacement, Orthopedics, Total hip arthroplasty for arthritis, H08
knee, Knee Replacement, Orthopedics, Total knee arthroplasty for arthritis, H09
```

### nhs_waits.csv
```
procedure_id, city, nhs_trust, avg_wait_weeks, date, source
cataract, London, Imperial College Healthcare NHS Trust, 18, 2025-11-01, My Planned Care
hip, Manchester, Manchester University NHS Foundation Trust, 24, 2025-11-01, My Planned Care
knee, Birmingham, University Hospitals Birmingham NHS Trust, 22, 2025-11-01, My Planned Care
```

### private_costs.csv
```
procedure_id, city, cost_min, cost_max, clinic_count, date, source
cataract, London, 2500, 3500, 12, 2025-11-01, PHIN + clinic websites
hip, Manchester, 13000, 15500, 8, 2025-11-01, PHIN + clinic websites
knee, Birmingham, 13000, 15500, 9, 2025-11-01, PHIN + clinic websites
```

### clinics.csv
```
clinic_id, name, city, procedure_id, price, url, phone
moorfields_london, Moorfields Private, London, cataract, 2800, https://moorfields.nhs.uk/private/..., 020-7253-3411
circle_london, Circle Health, London, knee, 14500, https://circlehealthcare.co.uk, 0203-145-9000
```

---

## 6. PAGES & COPY (TEMPLATE)

### Homepage Template
```
Hero Section:
H1: "NHS Wait Times vs Private Surgery: Honest Comparison for Over 65s"
Subheading: "Know your options. Compare waiting times and costs. Make an informed choice."

Quick Links:
- "I'm waiting for cataract surgery"
- "I'm waiting for hip replacement"
- "I'm waiting for knee replacement"

Value Props:
✓ Free to compare (no personal data required)
✓ Real NHS vs private data (updated weekly)
✓ Clear pricing (no hidden costs)
✓ Informational only (no pressure to buy)

CTA: "Find my procedure and city" (dropdown search)
```

### Procedure Comparison Page Template
```
Title: "Cataract Surgery in London: NHS vs Private"
Last Updated: "November 5, 2025"

Navigation Breadcrumb:
Home > Procedures > Cataract > London

MAIN COMPARISON TABLE:
┌──────────────────────────────────────────────────────┐
│ NHS vs Private Surgery Comparison                  │
├──────────────────┬──────────────────────────────────┤
│ NHS Route        │ Private Route                  │
├──────────────────┼──────────────────────────────────┤
│ Waiting Time     │ Waiting Time                  │
│ 18 weeks         │ 1-2 weeks (typical)           │
│ (as of Nov 2025) │ (from booking)                │
│                  │                              │
│ Cost to You      │ Cost to You                   │
│ FREE             │ £2,500 - £3,500              │
│ (taxpayer funded)│ (private pay)                │
│                  │                              │
│ Where           │ Where                        │
│ Your NHS Trust   │ 12 private clinics in London│
│ (depends on area)│ including Moorfields (£2,800)│
│                  │ Circle Eye (£2,500)          │
│ Surgeon          │ Surgeon                      │
│ NHS consultant   │ Often the same surgeon       │
│                  │ (works private part-time)   │
│ Hospital/Clinic  │ Private clinic facilities    │
│ NHS hospital     │ (better amenities typical)  │
│ (standard)       │                              │
│ Recovery         │ Recovery                     │
│ Variable (NHS    │ 1-2 weeks typical           │
│ may slow)        │ (private can be quicker)     │
└────────────────────────────────────────────────────────┘

SAVINGS CALCULATOR:
┌─────────────────────────────────┐
│ Save 16 weeks by going private  │
│ Cost: £3,500                   │
│ That's ~£219 per week saved    │
└─────────────────────────────────┘

TOP CLINICS IN LONDON:
1. Moorfields Private Eye Hospital - £2,800
   ("The NHS's own private clinic")
2. Circle Eye - £2,500
   ("Competitive pricing, good reviews")
3. Spire Eye - £3,200
   ("Premium facilities")
[+ 9 other clinics with prices]

FAQ SECTION:
Q: Can I get cataract surgery on NHS?
A: Yes, but you'll wait 18+ weeks. Private is faster.

Q: Is private surgery better quality?
A: Often the same surgeon. Private = faster, better amenities.

Q: Are there hidden costs?
A: No. £2,500-£3,500 is typically all-inclusive.

Q: What about financing?
A: Some clinics offer payment plans (interest-free).

[Next: Link to "Get Private Quotes" (future PPL phase)]
```

---

## 7. MONETIZATION STRATEGY

### MVP Phase (Months 1-8): Information Only
- **Revenue:** £0 (no monetization yet)
- **Focus:** Build traffic, SEO, audience trust

### Phase 2 (Months 6-8): Display Ads + Affiliate
- **Google AdSense:** Display ads on pages
- **Affiliate links:** Finance, mobility products
- **Target revenue:** £300-500/month

### Phase 3 (Months 9-12): PPL Model Transition
- **Add PPL form:** "Get 3 clinic quotes"
- **Clinic partnerships:** 3-5 clinics on PPL basis
- **Google Ads:** £500-1k/month budget
- **Target revenue:** £5-15k/month PPL + ads

---

## 8. TECHNICAL STACK (MVP)

| Component | Tool | Rationale |
|-----------|------|-----------|
| **Frontend** | Next.js 14 (SSG) | Fast, SEO-ready, easy to generate 15-18 pages |
| **Hosting** | Vercel | Free tier, auto-deployment, fast CDN |
| **Data storage** | Google Sheets (CSV export) | Free, simple, no backend needed |
| **Scraping** | Python + Playwright | Free, reliable for clinic websites |
| **Automation** | GitHub Actions | Free workflow scheduling |
| **SEO** | Google Search Console | Free monitoring |
| **Analytics** | Plausible (privacy-friendly) | Simple, works without cookies |
| **Email** | Resend | Free tier for future PPL notifications |
| **Domains** | Namecheap | £10/year |

---

## 9. SUCCESS METRICS (MVP)

### Traffic Metrics
- **Month 3:** 100-500 visitors/month
- **Month 6:** 3-5k visitors/month
- **Month 12:** 20-100k visitors/month

### Engagement Metrics
- **Avg session time:** 3-5 minutes
- **Pages per session:** 1.5-2
- **Bounce rate:** <60%

### Content Metrics
- **Organic search traffic:** 60%+ by month 6
- **Top keywords ranked:** "NHS vs private cataract", "hip replacement cost London"
- **Click-through rate:** >5% from search

### Business Metrics (Months 6-12)
- **Display ads:** £300-500/month
- **Affiliate commission:** £100-200/month
- **Clinic inquiries:** 3-5 per day by month 12

---

## 10. DEVELOPMENT ROADMAP

### Week 1: Data Collection
- [ ] CSV schema design
- [ ] Collect NHS wait data (My Planned Care)
- [ ] Collect private pricing (PHIN, clinic websites)
- [ ] Create initial 15-18 CSV rows

### Week 2: MVP Build
- [ ] Next.js skeleton (Cursor)
- [ ] Comparison page template (Cursor)
- [ ] Dynamic page generation from CSV (Cursor)
- [ ] Styling (Tailwind CSS)
- [ ] Vercel deployment

### Week 3: Content & Launch
- [ ] Rewrite copy (UK-focused, elderly-friendly)
- [ ] FAQ content
- [ ] Privacy policy / Terms
- [ ] Google Search Console setup
- [ ] Public launch

### Weeks 4-8: SEO & Content
- [ ] Publish 8-12 blog posts (1 per week)
- [ ] Backlink outreach
- [ ] Monitor rankings
- [ ] Iterate copy based on feedback

### Months 3-6: Monetization Prep
- [ ] Google AdSense integration
- [ ] Affiliate partnerships
- [ ] PPL form design (not yet active)
- [ ] Clinic outreach (soft)

### Months 6+: Transition
- [ ] Activate PPL forms
- [ ] Clinic partnerships launch
- [ ] Google Ads testing
- [ ] Scale to 10+ cities

---

## 11. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **NHS data outdated** | Users make decisions on old data | Automate weekly refresh via GitHub Actions |
| **Clinical accuracy** | Liability if data misleading | Clear disclaimers + medical review before launch |
| **Competitor (WhatClinic)** | Traffic competition | Focus on NHS comparison angle (they don't do this) |
| **Clinic data hard to scrape** | Manual data collection slow | Start with 5-6 major clinics, expand gradually |
| **Elderly users can't navigate** | High bounce rate | Large fonts (18px+), clear navigation, minimal steps |
| **Monetization late** | Opportunity cost | Start AdSense month 6, PPL month 9 as planned |

---

## 12. DEFINITION OF DONE (MVP LAUNCH)

- [ ] 15-18 comparison pages live (5 cities × 3 procedures)
- [ ] NHS data current (last updated < 7 days)
- [ ] Private data current (last updated < 7 days)
- [ ] 0 broken links
- [ ] Mobile responsive (tested on iPhone + Android)
- [ ] Accessibility WCAG A (tested with accessibility tool)
- [ ] Google Search Console set up + sitemap submitted
- [ ] Google Analytics working
- [ ] No medical misinformation (reviewed by advisor)
- [ ] 100% uptime for 7 days before launch

---

**Document version:** 1.0  
**Last updated:** November 5, 2025  
**Ready to share with Cursor AI for build?** YES