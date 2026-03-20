# 🛵 NichePay — AI-Powered Parametric Income Insurance for Zomato Delivery Partners

> **Guidewire DEVTrails 2026 | Phase 1 Submission**
> Team: MATRIX | Platform: Web (PWA)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Our Solution — NichePay](#our-solution--nichepay)
3. [Persona & Scenarios](#persona--scenarios)
4. [How the Insurance Model Works](#how-the-insurance-model-works)
5. [Application Workflow](#application-workflow)
6. [Weekly Premium Model](#weekly-premium-model)
7. [Parametric Triggers](#parametric-triggers)
8. [Edge Cases & Solutions](#edge-cases--solutions)
9. [AI/ML Integration](#aiml-integration)
10. [Fraud Detection](#fraud-detection)
11. [System Architecture](#system-architecture)
12. [Tech Stack](#tech-stack)
13. [Development Plan](#development-plan)
14. [Additional Features](#additional-features)

---

## Problem Statement

India's Zomato delivery partners are the backbone of our fast-paced food economy. However, external disruptions — heavy rain, extreme heat, severe pollution, curfews, and local strikes — can reduce or completely halt their working hours, causing them to lose **20–30% of their monthly income**.

Currently, gig workers have **zero income protection** against these uncontrollable events. When disruptions occur, they bear the full financial loss with no safety net.

**NichePay solves this.**

---

## Our Solution — NichePay

NichePay is an **AI-powered parametric income insurance platform** exclusively built for **Zomato food delivery partners**. It automatically detects real-world disruptions using live data, verifies worker activity through Zomato platform integration, and **instantly pays out lost wages** — with zero manual claim filing.

### Core Principles
- **Coverage**: Loss of income only. No vehicle repair, no health, no accident coverage.
- **Pricing**: Weekly premium model aligned with the gig worker's earnings cycle.
- **Automation**: Zero-touch claims — disruption detected → eligibility verified → payout credited.
- **Fairness**: Payout is proportional to actual hours disrupted, not a flat amount.

---

## Persona & Scenarios

### Who We Serve
**Zomato Food Delivery Partners** — two-wheeler delivery agents operating in Tier 1 and Tier 2 Indian cities.

### Persona Profile
| Attribute | Details |
|---|---|
| Name | Ravi (representative persona) |
| Platform | Zomato Delivery Partner |
| Average Daily Earning | ₹600–₹900/day |
| Working Style | Full-time or Part-time |
| Device | Android smartphone |
| Language | Telugu / Hindi |
| Pain Point | No income on rainy/disrupted days |

### Scenario 1 — Heavy Rain (Environmental)
Ravi is online on Zomato from 6 AM. It starts raining heavily at 9 AM. He cannot safely ride and stops accepting orders. NichePay detects the rainfall trigger, confirms Ravi was online but accepted zero orders during the rain window, and automatically credits a proportional payout to his UPI account.

### Scenario 2 — Local Strike (Social)
A bandh is called in Ravi's area. He logs into Zomato but cannot access pickup locations. NichePay detects the strike via news APIs and zone manager confirmation, verifies Ravi was online with zero order activity, and processes the payout.

### Scenario 3 — Part-Time Worker
Ravi only works mornings (6 AM–12 PM). A disruption occurs at 2 PM. Since it is outside his declared shift window, no payout is triggered. This protects the platform from false claims.

---

## How the Insurance Model Works

NichePay follows the **Risk Pool Model** — the foundation of all insurance.

### The Core Idea

Every worker contributes a small weekly premium into a shared pool. Not all workers face disruptions every week. The pool from unaffected workers funds the payouts for affected workers.

### Example with Numbers

```
Total workers enrolled  : 1,000
Weekly premium per worker: ₹30
Total pool collected     : ₹30,000

Workers facing disruption: 30% = 300 workers
Payout per worker        : ₹50 (example, based on hours disrupted)
Total payout             : ₹15,000

Pool remaining           : ₹15,000
  → Carried forward as claims reserve for next week
  → Covers operations, reinsurance, and platform profit
```

### Why This Works
- Not every zone gets rain every week.
- Not every worker is online during every disruption.
- Statistical averaging across thousands of workers makes the model financially sustainable.

### Profit & Sustainability Breakdown (per ₹49/week premium)

| Bucket | Amount | Purpose |
|---|---|---|
| Claims Reserve | ₹22 | Pay actual weekly claims |
| Reinsurance Buffer | ₹8 | Cover catastrophic event weeks |
| Operations | ₹10 | Tech, APIs, salaries |
| Platform Profit | ₹9 | NichePay margin |

At 10,000 enrolled workers, NichePay generates approximately **₹90,000 profit per week**.

### Who Holds the Money?
For the hackathon, NichePay simulates the full insurance lifecycle. In the real-world model, NichePay would partner with a licensed Indian insurer (e.g., Bajaj Allianz, HDFC Ergo) who holds the risk pool, while NichePay operates as the technology and distribution platform. Zomato can optionally act as an embedded distribution partner, auto-deducting the premium from weekly partner earnings.

---

## Application Workflow

NichePay has two distinct flows running in parallel — a one-time **plan purchase flow** and a continuous **automated claim flow**.

---

### Flow A — Plan Purchase (One-Time)

#### Step 1 — Registration & Zomato Linking
- Worker opens NichePay (PWA — no app store needed).
- Registers using their **Zomato Delivery Partner ID**.
- Why Zomato ID? Two reasons:
  1. **Verify the worker is currently active** on the Zomato platform — if Zomato marks them inactive, coverage auto-pauses.
  2. **Fetch real-time order acceptance data** during disruption windows to validate claim eligibility.

#### Step 2 — Plan Selection & Payment (PayPal)
- Worker selects a weekly plan (Basic / Standard / Pro).
- Payment is processed via **PayPal**.
- On successful payment, Policy Service records the active plan.
- Notification Service sends a confirmation SMS: *"Your NichePay coverage is active this week."*

> **No shift window selection needed.** NichePay covers the worker for the full calendar day and only pays for hours they were actually logged into Zomato — so part-time and full-time workers are handled fairly without any manual input.

---

### Flow B — Automated Claim (Runs Continuously)

#### Step 3 — Zone Registration Service (Once at Login)
- When the worker opens NichePay and goes online for the day, the app captures their GPS location **once** via Browser Geolocation API.
- OpenStreetMap Nominatim resolves the coordinates to a pincode and zone name.
- This zone is stored in Redis under the worker's daily key (TTL 24 hours).
- That single pincode is used for **all disruption lookups for the entire day** — no further GPS tracking needed.

Why only once? Zomato assigns delivery orders within a 15 km radius of the worker's login location. The worker's zone doesn't change during the day — so one capture is enough to know which zone's weather data applies to them.

```
Worker goes online in NichePay
        ↓
Single GPS capture → Nominatim resolves to pincode + zone
        ↓
Redis: worker:wk_abc123:zone → "520001" (TTL 24hr)
        ↓
One event pushed to RabbitMQ direct queue [location.update]
        ↓
ML service uses this pincode all day for disruption lookups
```

- Admin Dashboard can also push manual strike/curfew confirmations into the same queue.

#### Step 4 — ML Service Builds the Day's Disruption Array
The ML Service picks up each location event and builds a full-day disruption picture for the worker's zone:

1. **Redis cache check first** — look up zone disruption data for today's date + pin code.
   - **Cache hit** → return cached disruption array immediately (no API call).
   - **Cache miss** → call external APIs (Open-Meteo, WAQI, NewsAPI), fetch data, store result in Redis (TTL 30 min).

2. **Location radius match** — if another worker in the same zone (within 2–3 km) already has a cached result, reuse it. No duplicate API calls.

3. **Disruption array stored per calendar date per zone:**
```json
{
  "date": "2026-03-18",
  "zone": "Vijayawada-Zone3",
  "disruptions": [
    { "time": "03:00–05:00", "type": "rain", "level": "heavy"  },
    { "time": "19:00–24:00", "type": "rain", "level": "medium" }
  ]
}
```

4. Rain crossing midnight is split cleanly at the day boundary:
   - `23:00–24:00` is stored under March 18's array.
   - `00:00–01:00` is stored under March 19's array.
   - Nothing is missed, nothing is double-counted.

#### Step 5 — Daily Cron Job (6 AM Next Day)

**What is a cron job?**
A cron job is a scheduled task that runs automatically at a specific time every day — like an alarm clock for your server. You define the time once and it fires every single day without any manual trigger. In NichePay, we use **Bull** (a Redis-backed job queue) to schedule this, because it is already using Redis and it handles failures gracefully — if the server crashes and restarts, Bull remembers the job was not processed and retries it automatically.

```js
// How it is set up in code
const payoutQueue = new Bull('daily-payout', { redis: process.env.REDIS_URL })

payoutQueue.add({}, {
  repeat: { cron: '0 6 * * *', tz: 'Asia/Kolkata' }
})

payoutQueue.process(async () => {
  await processYesterdayPayouts()  // the main logic runs here
})
```

The cron expression `'0 6 * * *'` means: fire at minute 0, hour 6, every day, every month, every weekday. The timezone is set to `Asia/Kolkata` (IST) so it always fires at 6 AM India time regardless of which country the server is hosted in.

---

**Why 6 AM — and not midnight?**

The most obvious time to process "today's data" would be midnight (00:00). But this causes a serious problem for NichePay.

Consider Ravi — he works an evening shift and is still online on Zomato at 11:30 PM. If we run the cron at midnight, his last 90 minutes of activity have not been fully recorded yet when the calculation starts. We would miss his late-night hours, and his payout would be wrong.

By running at **6 AM**, we give a full 6-hour buffer after midnight. Every worker — even those who work until 1 or 2 AM — has long since logged off. The entire previous day is complete. Nothing is missed.

```
Example — why midnight fails:

Ravi works until 1:00 AM on March 19 (this counts as March 18 data)

Midnight cron fires at 00:00 on March 19:
  Ravi's activity from 23:00–01:00 not yet fully stored
  Calculation runs on incomplete data ❌

6 AM cron fires at 06:00 on March 19:
  Ravi logged off at 1:00 AM — 5 hours ago
  All data for March 18 is complete and stored ✅
  Calculation is accurate ✅
```

By the time the 6 AM cron completes and payouts are processed, it is around 6:05–6:10 AM. Most delivery workers wake up between 7–9 AM. **The money is in their UPI before they even pick up their phone.** That is the experience we are building.

---

**What the cron actually does — step by step:**

```
6:00 AM on March 19 — cron fires for all active workers

Step 1: Fetch yesterday's date
  yesterday = "2026-03-18"

Step 2: Get March 18's disruption array from MongoDB
  [
    { time: "07:00–09:00", type: "rain",  level: "heavy"  },
    { time: "14:00–16:00", type: "rain",  level: "medium" },
    { time: "19:00–24:00", type: "AQI",   level: "severe" }
  ]

Step 3: For each active policy holder — run eligibility checks

  Check A — Zomato login confirmation
    → Did the worker log into Zomato on March 18?
    → If NO → skip this worker entirely (voluntary day off)
    → If YES → continue to next check

  Check B — Order acceptance per disruption window
    → For each disruption window in the array:
       Did the worker accept zero orders during that time?
       If rain was 7–9 AM but worker accepted 3 orders → those 2 hours do NOT count
       If rain was 7–9 AM and worker accepted zero orders → 2 hours COUNT

  Check C — Cross-match result
    → Only hours where BOTH are true count:
       login = true  AND  orders accepted = 0

Step 4: Sum up all disrupted hours that passed both checks

Step 5: Isolation Forest fraud check
    → Is the claim pattern normal compared to other workers?
    → Anomaly score < 0.3 → auto approve
    → Anomaly score 0.3–0.6 → hold for manual review
    → Anomaly score > 0.6 → block and flag

Step 6: If approved → publish event to RabbitMQ pub/sub fanout

  Three consumers pick it up simultaneously:
  ├── Queue 1 → Payment Service    → calculates amount, credits UPI
  ├── Queue 2 → Notification Service → sends SMS: "₹175 credited for Mar 18"
  └── Queue 3 → Dashboard Service  → updates admin loss ratio + analytics
```

**Full worked example — Ravi on March 18:**

```
Ravi logs into Zomato at 6:00 AM ✅
Zomato login = confirmed for March 18

Disruption array for March 18:
  07:00–09:00 → Heavy rain
  14:00–16:00 → Medium rain

Order check per window:
  07:00–09:00 → Ravi accepted 0 orders → 2 hours COUNT ✅
  14:00–16:00 → Ravi accepted 2 orders (light rain, continued working) → 0 hours count ❌

Total disrupted hours = 2
Login hours that day  = 16  (6 AM to 10 PM)
Daily wage            = ₹700

Payout = (700 ÷ 16) × 2 = ₹87.50

Fraud score = 0.14 → auto approved

Payment of ₹87.50 credited to Ravi's UPI at 6:05 AM on March 19
SMS sent: "NichePay: ₹87.50 credited for 2hrs heavy rain on Mar 18"
Ravi wakes up at 8 AM and sees the credit in his UPI ✅
```

#### Step 6 — Payout Calculation
Payout is based on **actual login hours that day**, not a fixed shift window. This makes it fair for both part-time and full-time workers automatically.

```
Payout = (Daily Wage ÷ Login Hours that day) × Total Disrupted Hours
```

**Example — Ravi works 6 AM to 10 PM (16 hours). Rain from 7–9 AM and 2–4 PM:**

```
Weather data for March 18:
  00:00–06:00 → No rain        ← Ravi not logged in, irrelevant
  07:00–09:00 → Heavy rain     ← Ravi logged in ✅, zero orders ✅ → 2hrs COUNT
  09:00–14:00 → No rain        ← Ravi working normally
  14:00–16:00 → Medium rain    ← Ravi logged in ✅, zero orders ✅ → 2hrs COUNT
  16:00–22:00 → No rain        ← Ravi working normally
  22:00–24:00 → No rain        ← Ravi logged out, irrelevant

Total disrupted hours = 4
Login hours that day  = 16
Daily wage            = ₹700

Payout = (700 ÷ 16) × 4 = ₹175
```

Payout is capped at the weekly coverage limit of the chosen plan.

---

## Weekly Premium Model

| Plan | Weekly Premium | Max Weekly Payout | Coverage |
|---|---|---|---|
| Basic | ₹20/week | ₹300/week | Environmental only |
| Standard | ₹35/week | ₹500/week | Environmental + Social |
| Pro | ₹49/week | ₹800/week | All triggers + priority payout |

**Dynamic Pricing:** The ML Risk Engine adjusts the premium up or down by ±₹15 based on the worker's zone risk score (flood-prone areas pay more, historically safe zones pay less).

---

## Platform Choice — Web (PWA)

For this hackathon, we are building NichePay as a **web-based Progressive Web App (PWA)**. This is a deliberate choice based on speed of development and the constraints of a 6-week timeline — not a permanent architectural decision.

### Why Web for the Hackathon

- One codebase serves all devices — Android, iOS, desktop — without separate builds.
- No Play Store or App Store approval process, which would eat into our development time.
- Shareable via a simple WhatsApp link — workers tap it, the app opens in Chrome instantly, no installation needed.
- PWAs support push notifications for payout alerts and background sync for zone registration at login.
- The admin/insurer dashboard works naturally on desktop from the same codebase.
- Auto-updates on every visit — no manual update step for workers.

### Real-World Roadmap — Native App

A web app has real limitations for delivery workers who are constantly on the move with poor connectivity. In the production version beyond this hackathon, NichePay would ship as a **native Android app** (React Native), because:

- Full offline support — worker can go online even without internet, syncs when connection restores.
- Background location access without needing the browser open.
- Better performance on low-end Android devices (₹5,000–₹8,000 range — the typical Zomato partner phone).
- Home screen presence — workers are more likely to open a dedicated app daily than a browser tab.
- Native push notifications are more reliable than PWA push on Android.

For Phase 1 and Phase 2 of this hackathon, the PWA delivers full functionality. The native app is the natural next step post-hackathon.

---

## Parametric Triggers

A parametric trigger is a measurable, verifiable real-world condition that automatically initiates a claim — no manual filing needed.

### Environmental Triggers

| Trigger | Threshold | Data Source |
|---|---|---|
| Heavy Rainfall | > 50 mm/hr | OpenWeatherMap / IMD |
| Extreme Heat | > 45°C | OpenWeatherMap |
| Severe AQI | > 400 | CPCB AQI API |
| Flood Alert | Government flood warning issued | NDMA API |

### Social Triggers

| Trigger | Verification Method |
|---|---|
| Local Bandh / Strike | NewsAPI keywords + Zone Manager confirmation |
| Curfew | Government alert API + Zone Manager confirmation |
| Sudden Zone Closure | Zone Manager manual trigger |

**Important:** For social triggers, two-stage verification is mandatory (see Edge Cases below).

---

## Edge Cases & Solutions

### Edge Case 1 — Rain Stops Mid-Shift
**Problem:** It rains from 8 AM to 10 AM, then stops. Worker goes back to work at 11 AM and earns normally. If we give a full-day payout, it's unfair to the pool.

**Solution:** The disruption array stores exact time windows. The Claims Controller only counts windows where both conditions are true — rain active AND worker accepted zero orders. Post-rain hours where the worker resumed accepting orders are not counted. Payout is calculated only for the exact disrupted hours, not the full day.

---

### Edge Case 2 — Worker Has a Personal Holiday (Intentional Offline)
**Problem:** Worker has a family function and decides not to work. It also happens to rain. He could falsely claim a payout.

**Solution:** Zomato login check. On the Zomato Partner App, a delivery partner must go "Online" to receive orders — this acts as a daily attendance marker. If the worker never logged into Zomato that day, NichePay considers the day as a voluntary off day and **no payout is issued**.

---

### Edge Case 3 — Strikes / Curfews (No Real-Time API Data)
**Problem:** Local bandhs are often unannounced and not in any API. How do we verify?

**Solution — Two-Stage Verification:**

**Stage 1 — Automated Detection:**
- NewsAPI and Google News RSS are scanned for Telugu/Hindi keywords: "bandh", "curfew", "hartal", "strike", "బంద్", "కర్ఫ్యూ" in the affected district.
- NDMA and state government emergency APIs are checked.

**Stage 2 — Zone Manager Confirmation:**
- Each city zone has an assigned NichePay Zone Manager (or Zomato Fleet Manager in the real-world model).
- If automated detection flags a possible disruption, the Zone Manager receives an alert in the admin panel: *"Possible bandh reported in Guntur Zone 3. Confirm?"*
- Zone Manager clicks Confirm → trigger is approved → all eligible workers in that zone receive payouts.
- This human-in-the-loop step prevents false positives from social media noise.

---

### Edge Case 4 — Worker Left Zomato / Inactive
**Problem:** Worker buys a plan but quietly quits Zomato. Later claims a disruption payout.

**Solution:** Weekly Zomato activity check. If the worker has zero Zomato logins for 2 consecutive weeks, the policy auto-pauses and premium billing stops. Worker is notified: *"Your coverage is paused — no activity detected. Resume by logging into Zomato."*

---

### Edge Case 5 — Rain Crosses Midnight (e.g. 11 PM to 1 AM)
**Problem:** Rain starts on March 18 at 11 PM and ends on March 19 at 1 AM. Calculating at midnight would split this event across two runs and risk missing or double-counting it.

**Solution:** When storing disruption data, the ML service splits rain events cleanly at the day boundary (00:00). The March 18 disruption array stores `23:00–24:00`. The March 19 array stores `00:00–01:00`. Each date's array is self-contained. The 6 AM cron processes each date independently — nothing is missed, nothing is double-counted.

---

### Edge Case 6 — Weather API Cost & Performance
**Problem:** With 10,000+ workers, calling the weather API per worker per request is expensive and slow.

**Solution — Zone-Level Redis Caching:**
- Weather data is fetched once per pin code every 30 minutes.
- Stored in Redis: key = `weather:pincode:522001`, TTL = 1800 seconds.
- All workers in the same pin code share one cached reading.
- 10,000 workers across 50 pin codes = only 50 API calls per 30 minutes, not 10,000.

---

## AI/ML Integration

NichePay uses three dedicated ML models, each solving a distinct problem in the pipeline.

---

### Model 1 — Random Forest → Risk Scoring (at Signup)

**When it runs:** During worker registration, once.

**Purpose:** Assess the baseline risk level of a worker based on their location and profile. This score determines which premium tier they start on.

**Input Features:**
- Worker's pin code / city zone
- Historical disruption frequency in that zone (flood days, strike days, heat wave days per year)
- Zone type (urban dense, semi-urban, industrial, residential)
- Seasonal risk factor (current month — monsoon season scores higher)
- Worker's declared shift window

**Output:** Risk Score (0–100)
- 0–30 → Low risk zone → Base premium applies
- 31–60 → Medium risk zone → +₹8 added to premium
- 61–100 → High risk zone (flood-prone, strike-heavy) → +₹15 added to premium

**Example:** Worker registering in Kondapalli (flood zone, score: 74) → Pro plan costs ₹64/week instead of ₹49/week.

**Why Random Forest?** It handles mixed data types (categorical zone data + numerical historical stats) well and is highly interpretable — judges can see exactly which features drove the score.

---

### Model 2 — XGBoost → Dynamic Weekly Premium Prediction

**When it runs:** Every Monday morning (weekly re-scoring for active policies).

**Purpose:** Adjust the worker's premium for the upcoming week based on fresh real-time risk data — not just the static signup profile.

**Input Features:**
- Current week's weather forecast (rain probability, heat index from Open-Meteo)
- Current AQI forecast (WAQI API)
- Active flood/disaster alerts in the zone (ReliefWeb / IMD)
- Traffic congestion score for the zone (TomTom Traffic API)
- Worker's claim history from last 4 weeks
- Number of disruption days in the same zone last week

**Output:** Adjusted weekly premium for the upcoming week (Base ± ₹15 dynamic adjustment)

**Example:** A heavy monsoon forecast for Vijayawada next week → XGBoost predicts high disruption probability → premium increases by ₹12 for all workers in that zone for that week.

**Why XGBoost?** Handles time-series-like tabular data with high accuracy and is the industry standard for structured prediction tasks like insurance pricing.

---

### Model 3 — Isolation Forest → Fraud Detection

**When it runs:** Every time a claim eligibility check is triggered.

**Purpose:** Detect anomalous behavior patterns that suggest fraudulent claims — without needing labelled fraud data (unsupervised).

**How Isolation Forest Works Here:**
Isolation Forest learns what "normal" worker behavior looks like (typical GPS movement, order acceptance patterns, claim timing). Any data point that is unusually easy to isolate (i.e., behaves very differently from the norm) gets a high anomaly score.

**Features fed into the model:**
- GPS coordinates at time of claim vs registered work zone
- Accelerometer data (phone moving or stationary?)
- Time between Zomato login and claim trigger (suspiciously short?)
- Number of claims filed by this worker in last 30 days
- Number of other workers in same pin code also claiming at the same time
- Order acceptance rate in the 2 hours before trigger fired

**Output:** Anomaly Score (0–1)
- < 0.3 → Normal → Auto-approve
- 0.3–0.6 → Suspicious → Hold for manual review
- > 0.6 → High fraud risk → Block payout, flag account

**Why Isolation Forest?** We don't have labelled fraud data at launch. Isolation Forest is perfect for anomaly detection on unlabelled data — it finds outliers without needing historical fraud examples.

---

### Real-Time Data Sources

| Data Type | Source | Usage in NichePay |
|---|---|---|
| Weather (rain, temperature) | Open-Meteo API (free, no key needed) | Primary environmental trigger |
| Air Pollution (AQI) | WAQI API / OpenWeather API | AQI > 400 trigger for pollution disruption |
| Flood & Disasters | ReliefWeb API / IMD Alerts RSS | Flood zone trigger + risk scoring |
| Traffic Congestion | TomTom Traffic API / Google Maps Traffic | Zone accessibility check, risk scoring input |
| Strike / Curfew | NewsAPI (keyword detection) | Social trigger detection (bandh, hartal, curfew) |
| Worker Location | Browser Geolocation API | Real-time zone validation, GPS fraud check |
| City & Zone Mapping | OpenStreetMap Nominatim | Pin code → zone name → risk zone mapping |

### Caching Strategy for APIs (Redis)
- Weather + AQI data per pin code: TTL 30 minutes (zone-level, not per-worker)
- Flood/disaster alerts: TTL 60 minutes
- Traffic data per zone: TTL 15 minutes
- Nominatim geocoding results: TTL 24 hours (addresses don't change)
- Worker GPS last known location: TTL 15 minutes

---

## Fraud Detection

### Signals Monitored

| Signal | Description |
|---|---|
| GPS Spoofing | Phone reports location but accelerometer shows zero motion |
| Zone Mismatch | Worker claims disruption in a zone different from their GPS location |
| Claim Velocity | Same worker claiming disruptions across multiple zones in one week |
| Crowd Anomaly | Worker claims rain disruption but zero other workers in same pin code claimed it |
| Login-Claim Gap | Worker logs into Zomato suspiciously late exactly when disruption trigger fires |
| Order Suppression | Worker was accepting orders before trigger, suspiciously goes offline at trigger time |

### Fraud Response
- Low risk → payout proceeds normally.
- Medium risk → payout held, manual review within 24 hours.
- High risk → payout blocked, worker notified, account flagged for investigation.

---

## Adversarial Defense & Anti-Spoofing Strategy

> **Context — The Market Crash Scenario:**
> A coordinated syndicate of 500 delivery workers used GPS spoofing apps to fake their locations inside a severe weather zone, triggering mass false payouts and draining a platform's liquidity pool. Simple GPS verification is no longer enough. This section describes how NichePay's architecture detects and stops this — at the individual level and at the ring level.

---

### 1. The Differentiation — Genuine Worker vs GPS Spoofer

A genuine delivery partner who is stranded in heavy rain behaves very differently from someone sitting at home running a GPS spoofing app. NichePay cross-checks six independent signals to tell them apart.

#### Signal 1 — Accelerometer vs GPS consistency
A GPS spoofing app can fake coordinates. It cannot fake the phone's accelerometer. A worker genuinely stuck in rain will show micro-movements — shifting in their seat, checking the phone, slight vibrations. A spoofer sitting at home shows a perfectly stationary accelerometer while the GPS claims they are in a storm zone.

**Detection rule:** If GPS places the worker in a disruption zone but accelerometer shows zero motion for more than 20 consecutive minutes → anomaly flag raised.

#### Signal 2 — Network cell tower triangulation
GPS coordinates come from the spoofing app. But the phone's cellular network connection is determined by which physical cell tower it is connected to — and that cannot be faked by an app. NichePay cross-checks the GPS-reported location against the cell tower region the phone is connected to via the browser's Network Information API.

**Detection rule:** If GPS says the worker is in Vijayawada Zone 3 but the cell tower places them in a completely different district → hard flag, claim blocked immediately.

#### Signal 3 — Zomato order activity cross-check
A genuine stranded worker tried to work and could not. A spoofer never intended to work. NichePay checks the Zomato order timeline for the hours before the disruption window started. A genuine worker will show normal order acceptance activity in the morning, then a drop when disruption hit. A spoofer typically shows zero order activity all day — they never went online to work.

**Detection rule:** Worker with zero order activity in the 3 hours before the disruption window started → elevated suspicion score. Combined with other signals → flag.

#### Signal 4 — Login timing vs disruption trigger timing
A genuine worker logs into Zomato at their normal time, works, then gets disrupted. A spoofer logs in suspiciously close to the moment a disruption trigger activates — because they are watching the weather app and timing their fake login accordingly.

**Detection rule:** If Zomato login timestamp is within 8 minutes of the disruption trigger firing → anomaly flag. Genuine workers do not time their login to the weather.

#### Signal 5 — Historical zone consistency
Every worker has a home zone — the pincode where they registered and where they typically work. NichePay stores 4 weeks of zone history per worker. A genuine stranded worker is almost always stranded in their own zone. A spoofer may spoof into whatever zone has the highest severity disruption that day, which may be far from where they actually live.

**Detection rule:** If the claimed disruption zone is more than 25 km from the worker's historical home zone and they have never worked that zone before → high suspicion score.

---

### 2. The Data — Detecting a Coordinated Fraud Ring

Individual GPS spoofing is detectable. A coordinated ring of 500 workers is detectable at the network level — their behaviour shows statistical patterns that no genuine disruption event ever produces.

#### Ring Signal 1 — Simultaneous claim spike in a zone
In a genuine disruption, claims come in gradually as workers realise they cannot work. In a coordinated ring, hundreds of claims fire within a very tight time window — because the Telegram group sent a message saying "activate now."

**Detection rule:** If more than 50 new claims from the same zone arrive within a 15-minute window → automatic pool freeze for that zone, Zone Manager alerted immediately. No payouts released until human review.

#### Ring Signal 2 — Claim rate vs zone's historical baseline
NichePay stores historical claim rates per zone per disruption type. If it rained in Vijayawada Zone 3 in previous monsoons, we know roughly how many workers typically claim. A ring attack produces a claim count 3x to 10x higher than the historical baseline for that zone and disruption severity.

**Detection rule:** If current zone claim count exceeds 2.5x the historical average for that disruption type → ring alert triggered.

#### Ring Signal 3 — Device fingerprint clustering
Each worker's device has a fingerprint — browser user agent, screen resolution, device memory, installed fonts — collected at registration. Legitimate workers all have different devices. A fraud ring using the same GPS spoofing app on similar devices or sharing device profiles will show device fingerprint clustering.

**Detection rule:** If more than 15 claims in the same zone share matching or near-identical device fingerprints → coordinated fraud flag. Entire cluster held for investigation.

#### Ring Signal 4 — Social graph analysis
Fraud rings organise socially — Telegram groups, WhatsApp chats. NichePay cannot access those directly, but it can detect the social graph through referral patterns. If 200 workers who all registered on the same day, in the same 2-hour window, via the same referral link, all claim simultaneously → the registration pattern itself is a signal.

**Detection rule:** Workers who registered in the same time cluster (within 1 hour of each other) and claim in the same disruption event → cohort flag added to all their claims.

#### Ring Signal 5 — IP address clustering at registration
GPS spoofing rings often register accounts in bulk from the same location or using the same VPN exit node. NichePay hashes and stores the IP address at registration. A large number of accounts registered from the same IP subnet is a strong signal of coordinated account creation.

**Detection rule:** More than 10 accounts registered from the same /24 IP subnet → all accounts in that subnet are tagged as potentially coordinated. Claims from tagged accounts require manual approval.

---

### 3. The UX Balance — Flagging Bad Actors Without Punishing Honest Workers

This is the most important constraint. A genuine worker experiencing a real network drop during heavy rain may trigger some of the same signals as a spoofer — their accelerometer may show less movement if they are sheltering, their network may be weak causing cell tower data to be unreliable. NichePay's response system is designed to never punish an honest worker.

#### Principle 1 — No single signal blocks a payout

No individual signal by itself results in a blocked payout. Every signal contributes to a composite anomaly score. Only when the total score crosses a threshold does a claim get held — and even then, it is held for review, not rejected.

```
Composite Anomaly Score = weighted sum of all signals

Score < 0.3  → Auto-approve, payout immediately
Score 0.3–0.5 → Hold 24 hours, send worker a verification prompt
Score 0.5–0.7 → Hold 48 hours, Zone Manager manual review
Score > 0.7   → Block, worker notified with explanation, appeal available
```

#### Principle 2 — The verification prompt (not a punishment)

When a claim is held at the 0.3–0.5 range, the worker receives a simple SMS and in-app prompt:

*"We are verifying your claim for March 18. Please confirm you were in [zone name] during [time window] by replying YES. This takes 10 seconds."*

A genuine stranded worker confirms in seconds. A spoofer who is actually at home in a different zone will either not respond or confirm a zone they are not in — which the system cross-checks against the cell tower data.

This prompt resolves the vast majority of genuine-but-flagged cases within minutes, and the payout is released immediately upon confirmation.

#### Principle 3 — Network drop is not a spoofing signal

Genuine workers in heavy rain often have poor network connectivity. If a worker's GPS signal drops and reconnects, or if cell tower data is temporarily unavailable, NichePay does not treat this as a spoofing signal. The system uses the last confirmed GPS position and cell tower region before the network drop and holds that as the worker's location for the duration of the outage.

**Rule:** A network drop of under 90 minutes during a verified disruption window does not increase the anomaly score. It is an expected side effect of the disruption itself.

#### Principle 4 — Appeal with zero friction

If a worker's claim is blocked and they believe it is wrong, the appeal process requires only two steps: confirm their Zomato partner ID and upload one piece of supporting evidence (a photo, a screenshot of the Zomato partner app showing them online, or a screenshot of the weather alert from that day). The Zone Manager reviews within 4 hours and releases the payout if legitimate.

Workers are never asked to prove a negative. The burden of proof is on the fraud model, not the worker.

#### Principle 5 — Ring detection does not punish non-ring members

If a coordinated ring is detected in a zone, only the workers whose individual anomaly scores are elevated AND who match the ring clustering signals are held. Innocent workers in the same zone who show normal behaviour patterns receive their payouts immediately and are unaffected by the ring investigation.

---

### Summary — Defense Architecture

| Threat | Detection Method | Response |
|---|---|---|
| Individual GPS spoofing | Accelerometer + cell tower mismatch | Anomaly score elevated, verification prompt |
| Perfectly stationary spoofer | Accelerometer zero motion + GPS movement | Hard flag, claim held |
| Spoofer in wrong zone | Cell tower vs GPS zone mismatch | Immediate block |
| Coordinated ring (timing) | Simultaneous claim spike > 50 in 15 min | Zone pool freeze, human review |
| Coordinated ring (volume) | Claims 2.5x above historical baseline | Ring alert, cohort investigation |
| Bulk fake registrations | IP subnet clustering at signup | Accounts tagged, claims require manual approval |
| Device fingerprint sharing | Identical device profiles across claims | Cluster flag, investigation |
| Genuine network drop | Signal gap under 90 min during disruption | No penalty, last known location held |
| Genuine but flagged | Composite score 0.3–0.5 | Verification SMS, payout on confirmation |
| Wrongly blocked honest worker | Zero-friction appeal | Zone Manager review within 4 hours |

---

## System Architecture

![WhatsApp Image 2026-03-18 at 7 16 50 PM](https://github.com/user-attachments/assets/54688519-d2d9-475b-86c7-322792d4417e)


NichePay is built around two separate flows that share infrastructure but operate independently.

---

### Flow A — Plan Purchase

```
Auth Service (Zomato ID login)
       ↓
Policy Service (plan choice — no shift window needed)
       ↓
Payment Service (PayPal — one-time weekly fee)
       ↓
Notification Service (plan confirmed SMS)
```

---

### Flow B — Automated Claim

```
At login (once per day):
Zone Registration Service (single GPS capture)
        ↓
Nominatim resolves GPS → pincode + zone name
        ↓
Redis: worker:wk_abc123:zone → "520001" (TTL 24hr)
        ↓
One event pushed to RabbitMQ direct queue [location.update]
  ← Admin Dashboard also feeds here (manual strike confirm)
        ↓
ML Service consumes:
  1. Check Redis cache for zone disruption data (date + pincode key)
     ├── Cache hit  → return cached disruption array
     └── Cache miss → call Open-Meteo / WAQI / NewsAPI
                      → split midnight-crossing rain at day boundary
                      → store under date key in Redis (TTL 30 min)
                      → location radius match (2–3 km)
  2. Random Forest → zone risk score
  3. Stores: { date, zone, disruptions: [{time, type, level}] }

────────────────────────────────────────────
Next day at 6 AM — Daily Cron Job fires:
────────────────────────────────────────────
  Fetches YESTERDAY's complete disruption array (00:00–23:59)
        ↓
Claims Controller — for each active worker:
  1. Was worker logged into Zomato yesterday? (attendance)
  2. For each disruption window:
     → Login = true AND orders accepted = 0 → hours COUNT
  3. Total disrupted hours accumulated
  4. Isolation Forest fraud check on full day pattern
        ↓
If eligible → publish to RabbitMQ pub/sub fanout [claim.eligible]
        ↓
  ├── Queue 1 → Payment Service    (payout = wage÷loginHrs × disruptedHrs)
  ├── Queue 2 → Notification Service (SMS + push to worker)
  └── Queue 3 → Dashboard Service   (admin analytics update)
```

---

### Microservices

| Service | Flow | Responsibility |
|---|---|---|
| Auth Service | A | Zomato ID login, JWT session management |
| Policy Service | A | Plan selection, weekly billing (no shift window) |
| Payment Service | A + B | PayPal for plan purchase; UPI/Razorpay for claim payout |
| Notification Service | A + B | Plan confirmed SMS; payout alert SMS + push |
| Zone Registration Service | B | Single GPS capture at login, resolves to pincode via Nominatim, stores in Redis |
| ML Service | B | Redis check, API fallback, date-keyed disruption array, Random Forest + XGBoost |
| Daily Cron Service | B | Fires 6 AM daily, processes yesterday for all active workers |
| Claims Controller | B | Login + order checks per disruption window, publishes to pub/sub |
| Dashboard Service | B | Admin analytics, loss ratio, claim history |
| Dummy Zomato Service | B | Simulated Zomato Partner API (login status, order timeline) |
| Admin Dashboard | B | Zone Manager panel for manual strike/curfew confirmation |

---

### Redis Usage (Two Separate Roles)

| Redis Instance | Role | Keys & TTL |
|---|---|---|
| Redis (cache) | Worker zone (once per day), disruption data by date, sessions | `worker:wk_abc123:zone` TTL 24hr · `disruptions:2026-03-18:522001` TTL 24hr · sessions TTL 24hr |
| Redis (job queue) | Daily cron job (6 AM) + weather polling cron (30 min) | Bull job queue |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (PWA — mobile first) |
| Backend | Node.js + Express.js |
| Message Queue | RabbitMQ (queues + pub/sub) |
| Database | MongoDB (users, policies, claims, events) |
| Cache | Redis (weather, sessions, GPS buffer) |
| ML — Risk Scoring | Python + Flask + Random Forest (scikit-learn) |
| ML — Premium Pricing | Python + Flask + XGBoost |
| ML — Fraud Detection | Python + Flask + Isolation Forest (scikit-learn) |
| Payment — Plan Purchase | PayPal (plan fee collection) |
| Payment — Claim Payout | Razorpay Test Mode / UPI Simulator |
| Notifications | Twilio SMS sandbox |
| Weather & Temperature | Open-Meteo API (free, no API key required) |
| Air Quality (AQI) | WAQI API / OpenWeather API |
| Flood & Disaster Alerts | ReliefWeb API / IMD Alerts RSS |
| Traffic Data | TomTom Traffic API / Google Maps Traffic |
| Strike / Curfew Detection | NewsAPI (keyword detection) |
| Worker Location | Browser Geolocation API |
| City & Zone Mapping | OpenStreetMap Nominatim |
| Government Alerts | NDMA API + IMD RSS |
| Hosting (dev) | Railway / Render (free tier) |

---

## Development Plan

### Phase 1 (March 4–20) — Ideation & Foundation ✅
- [x] Problem research and persona definition
- [x] Insurance model design (Risk Pool)
- [x] Edge case identification and solutions
- [x] System architecture design
- [x] Tech stack finalization
- [x] GitHub repository setup with this README
- [x] 2-minute strategy video

### Phase 2 (March 21–April 4) — Automation & Protection
- Worker registration with Zomato ID linking
- Shift window selection UI
- Plan purchase + weekly premium billing
- Disruption Engine (weather API + Redis cache)
- ML premium scoring service
- Basic claims pipeline (trigger → eligibility → payout)
- RabbitMQ integration
- Dummy Zomato service

### Phase 3 (April 5–17) — Scale & Optimise
- Advanced fraud detection (GPS spoofing, crowd anomaly)
- Zone Manager admin panel (strike/curfew confirmation)
- Full pub/sub architecture for payment + notification
- Worker dashboard (earnings protected, active coverage)
- Admin/Insurer dashboard (loss ratios, predictive analytics)
- Razorpay test mode payout simulation
- Final pitch deck + 5-minute demo video

---

## Additional Features

### Smart Work Advisory (AI Recommendation Engine)

**Problem:** Workers don't know when risk is high or when to work to maximize safe earning hours. They currently make zero informed decisions about their shift timing relative to incoming disruptions.

**Feature:** NichePay's ML model proactively pushes personalized advisory notifications to each worker based on their shift window, location zone, and real-time + forecast data.

**Example Notifications:**
- *"🌧️ Heavy rain expected in your zone at 3 PM. Try to complete your shift before 2 PM to maximize earnings."*
- *"🌫️ AQI in Guntur is 380 and rising. Avoid shifts longer than 3 hours today."*
- *"☀️ Clear weather all day tomorrow. High order demand expected — great day to go online early."*
- *"⚠️ Strike keywords detected in your area. Low order activity expected today. Your coverage is active if you go online."*

**How It Works:**
- Open-Meteo API provides hourly weather forecasts for the next 24–48 hours.
- WAQI API provides next-day AQI predictions.
- ML model (XGBoost) combines forecast data + historical disruption patterns for the worker's specific zone to predict disruption probability per time slot.
- If disruption probability for an upcoming slot exceeds 60%, an advisory is generated and pushed via in-app notification + SMS.
- Advisories are personalized per worker's declared shift window — a night shift worker gets night-specific advisories, not morning ones.

**Impact:**
- Workers earn more by working during safe windows instead of losing hours to avoidable disruptions.
- Fewer claims are filed because workers proactively avoid disruptions → healthier claims pool → lower premiums over time.
- Builds deep trust and daily engagement with NichePay — workers open the app not just to claim but to plan their day.
- Differentiates NichePay from any passive insurance product — this is an **active income protection companion**.

---

## Production Quality & Scalability

NichePay is not a hackathon prototype — it is built with production-grade standards from day one.

- **Microservices architecture** — every service owns a single responsibility (auth, claims, payments, ML, notifications). Independent, deployable, and replaceable.
- **Event-driven design** — services communicate via RabbitMQ, not direct HTTP calls. One service going down never cascades to others.
- **Caching at every layer** — Redis caches weather data, sessions, and GPS pings. Reduces external API calls by over 95% under load.
- **Rate limiting** — all public endpoints are rate-limited via Redis counters. Prevents abuse and API cost spikes.
- **Reusable, modular code** — shared utilities (zone resolver, eligibility checker, payout calculator) are extracted into internal libraries used across services.
- **Security by default** — JWT auth on all endpoints, sensitive data encrypted at rest, zero hardcoded secrets (all via `.env`).
- **Horizontally scalable** — stateless services can be scaled independently behind a load balancer as worker count grows.
- **Graceful degradation** — if the ML service is unavailable, the system falls back to rule-based eligibility so workers are never unfairly blocked from payouts.

---

## Coverage Exclusions (Mandatory per Problem Statement)

NichePay strictly does **NOT** cover:
- Vehicle repairs or damage
- Health or medical expenses
- Life insurance
- Accident compensation
- Any personal or voluntary off days

---

*NichePay — Protecting Every Delivery, Every Week.*
