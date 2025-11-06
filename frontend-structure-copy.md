# FRONTEND STRUCTURE & COPY

**For Product Managers & Copywriters**  
**Target:** UK elderly (65+)  
**Tone:** Clear, trustworthy, jargon-free, reassuring  
**Design:** Large text (18px+), high contrast, simple navigation  

---

## SITE STRUCTURE & PAGE TEMPLATES

### 1. HOMEPAGE (/index.tsx)

**URL:** https://eldersurgery.co.uk/

**Hero Section**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         NHS Waiting Too Long for Surgery?                 │
│              Check Your Private Options                    │
│                                                             │
│      Compare NHS wait times vs private surgery costs      │
│         for the 3 most common procedures for 65+          │
│                                                             │
│              [Search: Procedure × City ▼]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Copy (H1, 24px):
"Waiting for Surgery? Compare Your NHS vs Private Options"

Subheading (16px, gray):
"Honest comparison of waiting times and costs for cataract, 
hip & knee surgery in major UK cities. Free information, 
no pressure."
```

**Value Props Section**
```
┌──────────┬──────────┬──────────┬──────────┐
│ ✓ FREE   │ ✓ REAL   │ ✓ CLEAR  │ ✓ NO    │
│ Compare  │ NHS &    │ Pricing  │ Personal│
│ anytime  │ Private  │ shown    │ data    │
│          │ data     │ upfront  │ needed  │
└──────────┴──────────┴──────────┴──────────┘

Copy (14px):
"We show you real waiting times from the NHS and real costs 
from private clinics. Everything is free to compare. We 
don't collect your personal information on this page."
```

**Quick Find Section**
```
Copy (14px, bold):
"Most searched by people like you:"

Card Grid (3 columns, mobile: 1 column):

┌─────────────────────────────────┐
│  CATARACT SURGERY               │
│                                 │
│  30% of people over 65 have    │
│  cataracts. Cloudy vision that  │
│  gets worse waiting.            │
│                                 │
│  NHS wait: ~18 weeks            │
│  Private: 1-2 weeks             │
│                                 │
│  [Compare in your city ▶]       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  HIP REPLACEMENT                │
│                                 │
│  Severe hip pain limiting       │
│  your walks and activities?     │
│  25+ week NHS waits.            │
│                                 │
│  NHS wait: ~24 weeks            │
│  Private: 1-2 weeks             │
│                                 │
│  [Compare in your city ▶]       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  KNEE REPLACEMENT               │
│                                 │
│  Bad knees stopping you from    │
│  walking or playing with        │
│  grandchildren? 22+ week waits. │
│                                 │
│  NHS wait: ~22 weeks            │
│  Private: 1-2 weeks             │
│                                 │
│  [Compare in your city ▶]       │
└─────────────────────────────────┘
```

**Search Bar (Hero)**
```
┌──────────────────────────────┐
│ 1. Pick Procedure ▼          │
│    [Cataract ▼]              │
│                              │
│ 2. Pick Your City ▼          │
│    [London ▼]                │
│                              │
│ 3. [Compare Now] (blue CTA)  │
└──────────────────────────────┘

Copy (12px, below):
"Updated Nov 2025 • Free to compare • No personal data needed"
```

**About Section (below fold)**
```
Heading (18px, bold):
"Why compare NHS vs Private?"

Copy (14px):
"7.7 million people are waiting for NHS surgery right now. 
For common procedures like hip and knee replacements, 
waits can be 20+ weeks. Private surgery is often available 
within 1-2 weeks.

But private costs money—£2,500-£15,000 depending on procedure. 
This guide shows you real waiting times and real costs so you 
can make an informed decision.

We update this data weekly from NHS records and clinic 
websites. Everything is free to compare."
```

**Footer**
```
About | Privacy Policy | Terms | Contact | FAQ

Copy (12px, gray):
"ElderSurgery © 2025 | Helping 65+ patients understand 
their options | Not medical advice—always consult your doctor"
```

---

### 2. COMPARISON PAGES (/cataract/[city].tsx)

**URL:** https://eldersurgery.co.uk/cataract-london

**Page Header**
```
Breadcrumb (12px, gray):
Home > Procedures > Cataract > London > Edit

Title (H1, 28px, bold):
"Cataract Surgery in London: NHS vs Private in 2025"

Subtitle (16px, gray):
"Compare NHS waiting times with private surgery options 
in London. Updated November 5, 2025."

Last Updated (12px, light gray):
"Last updated: November 5, 2025 • Data refreshed weekly"
```

**Main Comparison Table (CRITICAL SECTION)**
```
┌──────────────────────────────────────────────────────────────┐
│ NHS vs Private: Cataract Surgery in London                  │
├──────────────────────────┬──────────────────────────────────┤
│ NHS ROUTE (Left)         │ PRIVATE ROUTE (Right)           │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                 │
│ WAITING TIME             │ WAITING TIME                    │
│ ─────────────────        │ ─────────────────               │
│ About 18 weeks           │ 1-2 weeks                       │
│ (4+ months)              │ (next available date)           │
│                          │                                 │
│ That's 4 months of:      │ Often within:                   │
│ • Blurry vision          │ • A few days to 2 weeks         │
│ • Safety concerns        │ • From initial booking          │
│ • Slower daily life      │ • Book online or by phone       │
│                          │                                 │
│─────────────────────────┼─────────────────────────────────│
│                          │                                 │
│ COST TO YOU              │ COST TO YOU                     │
│ ─────────────────        │ ─────────────────               │
│ FREE                     │ £2,500 - £3,500                 │
│ (paid by NHS/taxes)      │ (per eye)                       │
│                          │                                 │
│ 1 eye: Free              │ Moorfields: £2,800              │
│ 2 eyes: Free             │ Circle Eye: £2,500              │
│ Consultation: Free       │ Spire Eye: £3,200               │
│ Follow-up: Free          │ Oculoplastic: £3,000            │
│                          │ (+ 8 other clinics)             │
│─────────────────────────┼─────────────────────────────────│
│                          │                                 │
│ WHERE                    │ WHERE                           │
│ ─────────────────        │ ─────────────────               │
│ Local NHS Trust:         │ In London:                      │
│ Imperial College         │ 12 private clinics offering     │
│ Healthcare NHS Trust     │ cataract surgery                │
│ (depending on your area) │                                 │
│                          │ Most are in central London      │
│ Referred by GP or        │ Easy parking or public          │
│ optician                 │ transport access                │
│                          │                                 │
│─────────────────────────┼─────────────────────────────────│
│                          │                                 │
│ THE SURGEON              │ THE SURGEON                     │
│ ─────────────────        │ ─────────────────               │
│ NHS consultant           │ Often the same surgeon who      │
│ (excellent quality)      │ works for NHS in private        │
│                          │ practice part-time              │
│ Usually high standard    │                                 │
│ (all have medical        │ Same qualifications and         │
│ training)                │ experience as NHS               │
│                          │                                 │
│─────────────────────────┼─────────────────────────────────│
│                          │                                 │
│ THE FACILITY             │ THE FACILITY                    │
│ ─────────────────        │ ─────────────────               │
│ NHS hospital             │ Private clinic                  │
│ Good equipment           │                                 │
│ (shared with other       │ Newer, often more modern       │
│ procedures)              │ equipment                       │
│                          │                                 │
│ Standard hospital        │ Often more comfortable:         │
│ environment              │ • Single rooms (sometimes)      │
│ (may be busy)            │ • Quieter wards                 │
│                          │ • Better parking                │
│                          │ • Shorter waits between         │
│                          │   appointments                  │
│─────────────────────────┼─────────────────────────────────│
│                          │                                 │
│ RECOVERY TIME            │ RECOVERY TIME                   │
│ ─────────────────        │ ─────────────────               │
│ 4-6 weeks typical        │ 2-4 weeks typical              │
│                          │                                 │
│ (NHS may schedule        │ (private may be quicker        │
│ follow-ups slower)       │ scheduling)                     │
│                          │                                 │
│ Eye drops daily for      │ Same drops, but private         │
│ weeks                    │ nurse may call to check         │
│                          │                                 │
│─────────────────────────┼─────────────────────────────────│
│ Choose NHS if:           │ Choose Private if:              │
│ • You can wait 4 months  │ • You want faster surgery      │
│ • Cost is concern        │ • Willing to pay £2-3.5k       │
│ • Want NHS safety net    │ • Want slightly better comfort  │
│                          │ • Have health insurance        │
│                          │   (may cover cost)             │
│                          │                                 │
└──────────────────────────┴──────────────────────────────────┘

Copy (under table, 12px, italic):
"Data sources: NHS My Planned Care (Imperial College Healthcare 
Trust), PHIN consultant registry, clinic websites. Updated weekly. 
This is informational only—consult your doctor before deciding."
```

**Savings Calculator**
```
┌─────────────────────────────────────┐
│  💰 SAVINGS CALCULATOR             │
├─────────────────────────────────────┤
│                                     │
│  If you go private instead of NHS: │
│                                     │
│  TIME SAVED: 16 weeks              │
│  (18 weeks wait → 1-2 week wait)   │
│                                     │
│  That's 4 months shorter!          │
│                                     │
│  COST: £3,000 (average private)     │
│                                     │
│  Annual cost: £3,000               │
│  That's £250/month                 │
│  Or £58/week                       │
│                                     │
│  Is it worth it?                   │
│  • Getting your sight back in     │
│    16 weeks instead of 4 months   │
│  • Walking, reading, driving      │
│    4 months sooner                │
│  • Peace of mind & known timeline │
│                                     │
│ Everyone's different—only you can │
│ decide if private is right for you.│
│                                     │
└─────────────────────────────────────┘
```

**Top Clinics in London**
```
Heading (16px, bold):
"12 Private Clinics Offering Cataract Surgery in London"

Copy (12px):
"These are 12 clinics we found offering cataract surgery in 
London in 2025. Prices updated weekly. Clinic order is by 
lowest to highest cost."

Clinic List (card per clinic):

Card 1:
┌───────────────────────────────────┐
│ #1. Moorfields Private Hospital   │
│                                   │
│ Price: £2,800 per eye            │
│                                   │
│ 📍 Harley Street, London          │
│ ☎️ 020-7253-3411                  │
│ 🌐 moorfields.nhs.uk/private     │
│                                   │
│ Known as: NHS's own private arm  │
│ Info: Same surgeons as NHS, but  │
│ private waiting list             │
│                                   │
│ [Get quotes] [Visit website]     │
└───────────────────────────────────┘

Card 2:
┌───────────────────────────────────┐
│ #2. Circle Eye Services           │
│                                   │
│ Price: £2,500 per eye            │
│                                   │
│ 📍 Central London                 │
│ ☎️ 0203-198-0091                  │
│ 🌐 circleeye.co.uk               │
│                                   │
│ Known as: Budget-friendly option │
│ Info: Quick appointments,        │
│ competitive pricing              │
│                                   │
│ [Get quotes] [Visit website]     │
└───────────────────────────────────┘

[... 10 more clinic cards with same format]
```

**FAQ Section**
```
Heading (16px, bold):
"Frequently Asked Questions About Cataract Surgery"

Q1: "Can I get cataract surgery on the NHS?"
A: "Yes. If you have a cataract that affects your vision, 
you can get it on the NHS for free. You'll be referred by 
your optician or GP. The wait is typically 18 weeks in 
London."

Q2: "Is private cataract surgery better quality?"
A: "Usually the same quality. Many private surgeons are the 
same consultants who work for the NHS. The difference is 
mainly speed (1-2 weeks vs 18 weeks) and comfort (quieter 
clinic vs busy hospital). The surgery itself is similar."

Q3: "What does the £2,500-£3,500 cost include?"
A: "Usually: pre-op tests, the surgery itself, implant, 
post-op visit. It does NOT usually include: glasses/contacts 
after (different prescription), complications if they arise 
(check with clinic)."

Q4: "Can I get private surgery faster if I'm in pain?"
A: "Yes. Many private clinics can offer surgery within 
1-2 weeks. Some urgent cases available within days. Call 
the clinic directly with your situation."

Q5: "What if I can't afford private?"
A: "NHS is free and will treat you—you just wait longer. 
Some private clinics offer payment plans (0% interest). 
Health insurance sometimes covers it. Ask your clinic."

Q6: "Is there a risk I'm a 'bad candidate' for surgery?"
A: "Cataract surgery is very safe. Your surgeon will check 
this at consultation. Age alone (65+) is not a barrier—many 
90-year-olds have successful cataract surgery."

Q7: "How do I know which clinic to choose?"
A: "Ask: Is the surgeon a qualified consultant? How long 
have they done cataract surgery? Will they use premium 
implants? What's their revision rate? Call 2-3 clinics 
and compare."

Q8: "Do I need health insurance for private?"
A: "No. You can pay directly. Some clinics offer payment 
plans. Health insurance (PMI) may cover it if you have it."
```

**Related Comparisons**
```
Heading (14px):
"More comparisons for you:"

Links (inline, 12px):
- Hip Replacement in London vs NHS
- Knee Replacement in London vs NHS
- Cataract Surgery in Manchester vs NHS
- Cataract Surgery in Birmingham vs NHS
- All procedures in London
```

**Footer**
```
Privacy | Terms | FAQ | Contact

"ElderSurgery © 2025 — Helping people 65+ compare surgery 
options. Data updated weekly. Not medical advice."
```

---

### 3. PROCEDURE LANDING PAGE (/cataract/index.tsx)

**URL:** https://eldersurgery.co.uk/cataract

**Header**
```
H1 (28px, bold):
"Cataract Surgery: NHS Wait Times vs Private Costs by City"

Subtitle (16px):
"Compare 5 UK cities. See how long you'll wait on NHS vs 
going private."
```

**City Cards Grid**
```
┌─────────────────────────────┐
│ LONDON                      │
│ (1.5M people 65+)           │
│                             │
│ NHS Wait: 18 weeks          │
│ Private: 1-2 weeks          │
│ Private Cost: £2,500-£3,500 │
│                             │
│ Clinics: 12 in London       │
│                             │
│ [Compare in London] >       │
└─────────────────────────────┘

[Same for Manchester, Birmingham, Leeds, Bristol]
```

---

### 4. FAQ PAGE (/faq)

**General Q&A for all procedures + elderly-specific guidance**

---

### 5. ABOUT PAGE (/about)

**Who we are, mission, team credibility, data sources**

---

## COPY STYLE GUIDELINES

### Tone
- **Reassuring:** "You're not alone. 7.7M people waiting."
- **Clear:** No medical jargon. Explain in simple English.
- **Respectful:** Treat elderly as capable, not patronizing.
- **Honest:** Admit limitations, don't oversell private.

### Word Choice
| ❌ Avoid | ✅ Use |
|---------|--------|
| "RTT targets" | "NHS waiting time" |
| "Arthroplasty" | "Knee/hip replacement" |
| "Elective procedure" | "Optional surgery (not emergency)" |
| "Comorbidities" | "Other health conditions" |
| "Clinical indicators" | "Factors your doctor considers" |
| "Liaise with" | "Talk to" |

### Sentence Length
- **Elderly users:** Shorter sentences (< 15 words per sentence)
- **Max paragraph:** 3-4 sentences
- **Use bullets** for lists

### Typography for Elderly Users
- **H1:** 24-28px, bold
- **H2:** 18-20px, bold
- **Body:** 14-16px (not 12px)
- **Line height:** 1.8 (not 1.4)
- **Color:** Dark gray on light (not pure black—easier on eyes)
- **Contrast:** Minimum WCAG AAA

### Mobile First
- Assume 40% traffic from mobile
- Touch targets: 44px × 44px (not small)
- Avoid sidebars (use full width)
- Stack vertically, not horizontally

---

## EXAMPLE: FULL CATARACT-LONDON PAGE (COPY ONLY)

```
┌─────────────────────────────────────────────────────────┐
│ Home > Cataract > London                               │
│                                                         │
│ CATARACT SURGERY IN LONDON:                            │
│ NHS VS PRIVATE IN 2025                                 │
│                                                         │
│ Compare NHS waiting times with private surgery options │
│ in London. Updated November 5, 2025.                   │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ NHS vs Private Comparison Table (See Above)      │  │
│ │                                                   │  │
│ │ NHS: 18 weeks | Private: 1-2 weeks              │  │
│ │ Cost: FREE     | Cost: £2,500-£3,500            │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ 💰 SAVE 16 WEEKS by going private (costs £3,000)     │
│                                                         │
│ ──────────────────────────────────────────────────    │
│                                                         │
│ 12 PRIVATE CLINICS IN LONDON                          │
│                                                         │
│ [Clinic cards shown above]                            │
│                                                         │
│ ──────────────────────────────────────────────────    │
│                                                         │
│ QUESTIONS?                                            │
│                                                         │
│ Q: Can I get cataract surgery on NHS?                │
│ A: Yes, free. You'll wait 18+ weeks in London.       │
│                                                         │
│ Q: Is private surgery better?                        │
│ A: Same quality, faster. You pay £2-3.5k.            │
│                                                         │
│ Q: What's included in the £3,000 cost?               │
│ A: Pre-op tests, surgery, implant, 1 post-op visit. │
│                                                         │
│ [See all FAQs]                                        │
│                                                         │
│ ──────────────────────────────────────────────────    │
│                                                         │
│ MORE COMPARISONS                                      │
│                                                         │
│ • Hip Replacement in London                          │
│ • Knee Replacement in London                         │
│ • Cataract Surgery in Manchester                     │
│ • Cataract Surgery in Birmingham                     │
│ • See all procedures                                 │
│                                                         │
│ ──────────────────────────────────────────────────    │
│                                                         │
│ ElderSurgery © 2025                                  │
│ Privacy | Terms | Contact                            │
│                                                         │
│ "Helping 65+ patients understand their options"      │
└─────────────────────────────────────────────────────────┘
```

---

**Document Ready for:**
- Frontend developer (React/Next.js)
- UX designer (wireframes)
- Cursor AI prompting
- Content management