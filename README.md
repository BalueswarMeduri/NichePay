# 🛵 NichePay — AI-Powered Parametric Income Insurance for Zomato Delivery Partners

> **Guidewire DEVTrails 2026 | Phase 1 Submission**
> Team: [Your Team Name] | Platform: Web (PWA)

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

### Step 1 — Registration & Zomato Linking
- Worker downloads NichePay (PWA — no app store needed).
- Registers using their **Zomato Delivery Partner ID**.
- Why Zomato ID? It serves two purposes:
  1. **Verify the worker is currently active** on the Zomato platform.
  2. **Fetch order acceptance data** in real time to validate claims (explained in triggers section).

### Step 2 — Shift Window Selection
During onboarding, the worker selects their typical working shift:

| Shift | Hours |
|---|---|
| Morning | 6 AM – 12 PM |
| Afternoon | 12 PM – 6 PM |
| Night | 6 PM – 9 PM |
| Full Day | 6 AM – 9 PM |

**Why is this important?**
- A part-time morning worker should not receive a payout for an afternoon disruption.
- Shift data allows precise, per-hour payout calculation.
- It also acts as a fraud prevention signal — if GPS activity consistently appears outside the declared shift, the ML model flags it.

### Step 3 — Buy a Weekly Plan
The worker selects and pays for a weekly insurance plan. Premium is charged every Monday. Coverage is active only for the declared shift window on active Zomato login days.

### Step 4 — Disruption Detection (Automated)
NichePay continuously monitors:
- **Weather** (Open-Meteo API) — rain intensity, temperature, cached per pin code in Redis every 30 minutes.
- **Air Quality** (WAQI / OpenWeather API) — AQI levels per zone, cached every 30 minutes.
- **Flood & Disaster Alerts** (ReliefWeb API / IMD RSS) — official government flood and disaster notifications.
- **Traffic** (TomTom Traffic API) — zone accessibility check, used as a supporting signal.
- **Strike / Curfew** (NewsAPI keyword detection) — scans for bandh, hartal, curfew keywords in Telugu/Hindi.
- **Zone Mapping** (OpenStreetMap Nominatim) — maps worker's GPS coordinates to pin code and zone.
- **Zone Manager Manual Override** — admin can manually confirm a disruption (explained in edge cases).

### Step 5 — Eligibility Verification (AI-Powered)
When a disruption trigger fires:
1. Was the worker logged into Zomato today? (Attendance check)
2. Was the disruption within the worker's declared shift window?
3. Did the worker accept zero orders during the disruption period?
4. Does GPS data show the worker was in the affected zone?

All four conditions must pass for payout eligibility.

### Step 6 — Payout Calculation
Payout is **proportional to disrupted hours**, not a flat amount.

```
Payout = (Base Daily Wage × Disrupted Hours) / Total Shift Hours
```

Example: Worker earns ₹700/day on a 9-hour shift. Rain disrupts 3 hours.
```
Payout = (700 × 3) / 9 = ₹233
```
Payout is capped at the weekly coverage limit defined by the chosen plan.

### Step 7 — Instant Credit
Payout is credited instantly via Razorpay (test mode) / UPI simulator. Worker receives an SMS and in-app notification: *"₹233 credited to your UPI for 3 hours of rain disruption today."*

---

## Weekly Premium Model

| Plan | Weekly Premium | Max Weekly Payout | Coverage |
|---|---|---|---|
| Basic | ₹20/week | ₹300/week | Environmental only |
| Standard | ₹35/week | ₹500/week | Environmental + Social |
| Pro | ₹49/week | ₹800/week | All triggers + priority payout |

**Dynamic Pricing:** The ML Risk Engine adjusts the premium up or down by ±₹15 based on the worker's zone risk score (flood-prone areas pay more, historically safe zones pay less).

---

## Platform Choice — Web (PWA) and Why Not Native Mobile

The judges require us to justify this choice explicitly.

### We chose: Web App built as a Progressive Web App (PWA)

### Why not a native Android/iOS app?

| Factor | Native App | PWA (Our Choice) |
|---|---|---|
| Installation | Requires Play Store download | Opens directly in browser — zero friction |
| Device storage | Takes 50–150 MB | Zero storage used |
| Update deployment | User must manually update | Auto-updates on every visit |
| Offline support | Full | Partial (service workers cache key screens) |
| Development cost | Separate Android + iOS builds | One codebase for all devices |
| Target user comfort | Many delivery workers avoid app installs | WhatsApp link → opens instantly in Chrome |

### Why PWA works perfectly for Zomato delivery partners
Zomato delivery partners are already using their phones constantly for the Zomato Partner App. They are comfortable with Chrome on Android. A PWA can be shared via a simple WhatsApp link — the most natural distribution channel for this demographic. They tap the link, the app opens, they register in under 2 minutes. No Play Store, no permissions dialog, no storage worries.

Additionally, PWAs support **push notifications** (for payout alerts), **background sync** (for GPS pinging while the screen is off), and **home screen install prompts** — giving a near-native experience without the friction of app store distribution.

### Why not a desktop web app only?
Delivery partners are on the move. All interactions — going online, checking payout status, viewing coverage — happen on a mobile screen. The PWA is built **mobile-first** with a responsive layout that also works on desktop for the admin/insurer dashboard.

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

**Solution:** NichePay uses hourly weather polling (cached in Redis). Payout is calculated only for the hours the trigger was active AND the worker had zero order activity. Post-rain earnings are not compensated.

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

### Edge Case 5 — Shift Mismatch
**Problem:** Worker declared Morning shift (6 AM–12 PM) but disruption occurred at 3 PM.

**Solution:** All disruption triggers are evaluated only within the worker's declared shift window. A 3 PM trigger has zero effect on a morning-shift worker's policy.

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

## System Architecture

### Microservices

| Service | Responsibility |
|---|---|
| Auth Service | Zomato ID login, JWT session management |
| User Service | Worker profile, shift window, KYC |
| Policy Service | Plan purchase, premium billing, weekly renewal |
| Disruption Engine | Weather + news polling, zone-level trigger evaluation |
| ML Risk Service | Premium scoring, payout eligibility, fraud detection |
| Claims Service | Claim creation, eligibility check, payout calculation |
| Payment Service | Razorpay test mode / UPI mock payout processing |
| Notification Service | SMS, WhatsApp (Twilio sandbox), in-app push |
| Dashboard Service | Worker dashboard + Admin/Insurer analytics dashboard |
| Dummy Zomato Service | Simulated Zomato Partner API (login status, order data) |
| External Admin Service | Zone Manager panel for manual strike/curfew confirmation |

### Message Queue Flow (RabbitMQ)

```
Worker goes Online
       ↓
Location + Shift data pushed to RabbitMQ [location.update queue]
       ↓
ML Risk Service consumes → evaluates zone risk → updates worker score
       ↓
Disruption Engine fires trigger (weather/strike threshold met)
       ↓
Event pushed to RabbitMQ [disruption.detected queue]
       ↓
ML Service consumes → runs eligibility scoring
       ↓
If eligible → publishes to RabbitMQ Pub/Sub [claim.eligible topic]
       ↓
Multiple consumers subscribe:
  ├── Payment Service    → processes payout via Razorpay/UPI
  ├── Notification Service → sends SMS + push alert to worker
  └── Dashboard Service  → updates admin analytics in real time
```

### Caching Strategy (Redis)
- Weather data per pin code: TTL 30 minutes
- Worker session tokens: TTL 24 hours
- GPS ping buffer (last known location): TTL 15 minutes
- Rate limiting counters: TTL 1 minute

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
| Payment | Razorpay Test Mode / UPI Simulator |
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
- [ ] GitHub repository setup with this README
- [ ] 2-minute strategy video

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
