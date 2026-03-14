# GigShield — AI-Powered Parametric Income Insurance for India's Gig Economy

> **Guidewire DEVTrails 2026 — University Hackathon**
> Protecting India's last-mile delivery workers from income loss caused by external disruptions.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Our Solution](#2-our-solution)
3. [Persona & Scenarios](#3-persona--scenarios)
4. [Application Workflow](#4-application-workflow)
5. [Weekly Premium Model](#5-weekly-premium-model)
6. [Parametric Triggers](#6-parametric-triggers)
7. [Platform Choice — Web vs Mobile](#7-platform-choice--web-vs-mobile)
8. [AI / ML Integration](#8-ai--ml-integration)
9. [Tech Stack](#9-tech-stack)
10. [System Architecture](#10-system-architecture)
11. [Development Plan](#11-development-plan)
12. [What Makes Us Unique](#12-what-makes-us-unique)

---

## 1. Problem Statement

India has over **15 million platform-based gig delivery workers** working for platforms like Zomato, Swiggy, Zepto, Amazon, and Dunzo. These workers depend entirely on daily deliveries for their income.

When external disruptions occur — heavy rainfall, floods, strikes, curfews, or severe pollution — workers are forced to stop working and lose **20–30% of their monthly income** in a single day. They have no financial safety net and no insurance product exists that specifically covers this type of income loss.

**What we are NOT covering:** Health, life, accidents, or vehicle repairs. We cover **lost income only**.

---

## 2. Our Solution

**GigShield** is a parametric income insurance platform built exclusively for gig delivery workers. A worker enrolls once, pays a small weekly premium, and is automatically protected.

The core idea is simple:
- Worker pays **₹20–₹79 per week** depending on their chosen plan.
- We **continuously monitor** their location area for qualifying disruptions using real-time data APIs.
- Our **ML model validates** whether the disruption data is genuine.
- If a disruption is confirmed, the worker **automatically receives a payout** in their bank account — without opening the app or filing any claim.

We also send a **next-day weather forecast alert** every evening. If heavy rain or a disruption is predicted for tomorrow, the worker gets a notification in advance so they can plan their finances.

---

## 3. Persona & Scenarios

**Chosen Persona:** Food delivery partners — Zomato and Swiggy riders in Tier 1 and Tier 2 Indian cities (Bengaluru, Hyderabad, Chennai, Pune).

### Scenario 1 — Heavy Rainfall (Most Common)

> Ravi is a Zomato delivery partner in Koramangala, Bengaluru. He works 10 hours a day and earns around ₹600–₹800 daily. On a Monday morning, the IMD issues a heavy rainfall warning and rainfall crosses 65mm in his zone. Ravi cannot ride safely and loses a full day's income.
>
> With GigShield: Ravi's location is monitored continuously. The moment rainfall in his zone crosses the threshold, our ML model validates the data, a disruption event is published, and ₹300 is transferred to his UPI account within 60 seconds — without him doing anything.

### Scenario 2 — Proactive Weather Alert

> The evening before a predicted storm, GigShield sends Ravi a WhatsApp message: *"Heavy rainfall is forecast in your area tomorrow. If it crosses our threshold, your payout will be processed automatically."* Ravi can plan his day knowing he has a financial backup.

### Scenario 3 — City-wide Strike

> A sudden transport strike is declared in Hyderabad. Swiggy partner Priya cannot access pickup zones. GigShield detects the strike via news keyword monitoring, validates it, and automatically processes her weekly payout within minutes.

### Scenario 4 — Severe Air Pollution

> AQI in Delhi crosses 300 (Severe category). Outdoor delivery becomes unsafe. GigShield triggers payouts for all active policy holders in the affected zones automatically.

---

## 4. Application Workflow

```
Worker visits website
        ↓
Sign up → select platform (Zomato / Swiggy / Amazon etc.)
        ↓
Choose weekly plan (Basic / Standard / Premium)
        ↓
Pay weekly premium via UPI / Razorpay
        ↓
Policy activated → Worker gets personal dashboard
        ↓
App continuously tracks worker's location (with permission)
        ↓
Location pushed to Message Queue (Kafka / RabbitMQ)
        ↓
ML Model consumes location → checks real-time disruption data
        ↓
   [No disruption] → do nothing
   [Disruption confirmed] → publish disruption.detected event
        ↓
Kafka / RabbitMQ fans event to all subscriber services
        ↓
  ┌─────────────────────────────────────┐
  │  Payment Svc  → Auto payout to UPI  │
  │  Notify Svc   → WhatsApp / SMS alert │
  │  Claims Svc   → Log claim record     │
  │  Fraud Svc    → Validate legitimacy  │
  └─────────────────────────────────────┘
        ↓
Worker dashboard updates → shows payout received
```

---

## 5. Weekly Premium Model

We use a **weekly pricing model** to match the income cycle of gig workers, who earn and spend on a daily/weekly basis rather than monthly.

### Pricing Tiers

| Tier | Weekly Earnings | Weekly Premium | Max Payout / Week |
|------|----------------|---------------|-------------------|
| Basic | ₹3,000 – ₹5,000 | ₹20 | ₹200 |
| Standard | ₹5,000 – ₹8,000 | ₹49 | ₹500 |
| Premium | ₹8,000+ | ₹79 | ₹1,000 |

### How the Premium is Calculated

The base tier price is dynamically adjusted using our **XGBoost ML model** based on the following factors:

- Worker's registered delivery zone (flood-prone vs elevated area)
- Historical disruption frequency in that zone
- Current season (monsoon months carry higher risk)
- Worker's past claim history

The AI model adjusts the premium **±20%** from the base price. A worker in a historically safe zone pays less; a worker in a high-risk flood zone pays more.

**Premium is auto-renewed every Monday** via UPI mandate. Workers can pause coverage at any time from their dashboard.

---

## 6. Parametric Triggers

Parametric insurance means payouts are triggered automatically when a **measurable threshold is crossed** — no manual claim required.

| # | Trigger | Threshold | Data Source | Payout |
|---|---------|-----------|-------------|--------|
| T1 | Heavy rainfall | > 64.5 mm in 24 hours | Open-Meteo / IMD | 100% |
| T2 | Severe air pollution | AQI > 300 (Severe) | WAQI / OpenWeather API | 75% |
| T3 | Extreme heat | Temperature > 45°C | Open-Meteo API | 50% |
| T4 | Flood / disaster alert | IMD Level 2+ alert in zone | ReliefWeb / IMD alerts | 100% |
| T5 | Curfew / strike | Govt advisory detected | NewsAPI keyword detection | 100% |

**Trigger validation flow:**
1. Worker location is matched to a city zone using OpenStreetMap Nominatim.
2. Real-time data is fetched for that zone from the relevant API.
3. ML model cross-checks the data against historical patterns to confirm legitimacy.
4. If confirmed, the disruption event is published to the message broker.

**Idempotency:** A deduplication key (`zone + trigger_type + date`) ensures the same disruption never fires twice for the same window.

---

## 7. Platform Choice — Web vs Mobile

**We chose a Web platform (React PWA).**

### Why Web?

- **Progressive Web App (PWA)** can be installed on Android home screens without requiring a Play Store listing — removing a major friction point for low-income workers.
- Works **offline** for dashboard viewing even with poor connectivity.
- **WhatsApp-first notifications** mean workers do not need to keep the app open — they receive alerts on a channel they already use daily.
- A single codebase serves both the worker-facing app and the insurer admin dashboard.
- Faster to build and iterate during a 6-week hackathon compared to a native mobile app.

### Why Not Native Mobile?

- Requires Play Store / App Store approval cycles.
- Workers on cheap Android devices often have limited storage and resist installing new apps.
- Our zero-touch model means the worker rarely needs to open the app anyway — the system works in the background.

---

## 8. AI / ML Integration

### Models Used

#### 1. Random Forest — Risk Scoring (Onboarding)
- **When:** Called once during worker signup.
- **Input features:** Delivery zone, zone flood history, zone average AQI, platform (Zomato/Swiggy), worker's city, season.
- **Output:** Risk score between 0 and 1.
- **Purpose:** Determines which pricing tier is appropriate and feeds into the premium engine.

#### 2. XGBoost — Dynamic Weekly Premium Prediction
- **When:** Called every Monday on policy renewal.
- **Input features:** Risk score, tier, zone waterlogging index, season flag (monsoon = 1), rolling 30-day claim rate for the zone.
- **Output:** Weekly premium amount in ₹.
- **Purpose:** Ensures pricing is fair, dynamic, and reflects real hyper-local risk — not a flat rate.

#### 3. Isolation Forest — Fraud Detection
- **When:** Called on every disruption event before payout is released.
- **Input features:** Claims per week for this worker, location variance during claimed disruption window, time elapsed since event, claim amount vs average earnings, duplicate IP / device flag.
- **Output:** Anomaly score — flagged if score < -0.1.
- **Purpose:** Catches GPS spoofing, fabricated disruptions, duplicate accounts, and serial claimers.

### Real-Time Data Sources

| Data | API / Source |
|------|-------------|
| Weather (rain, temperature) | Open-Meteo API |
| Air pollution (AQI) | WAQI / OpenWeather API |
| Flood and disaster alerts | ReliefWeb / IMD alerts |
| Traffic conditions | TomTom Traffic API / Google Maps Traffic |
| Strike and curfew detection | NewsAPI (keyword: strike, curfew, bandh, Section 144) |
| Worker location | Browser Geolocation API |
| City and zone mapping | OpenStreetMap Nominatim |

### Tomorrow's Forecast Feature
Every evening at 8 PM, a scheduled cron job fetches the next-day weather forecast for each active worker's zone. If any disruption threshold is predicted to be crossed, a proactive WhatsApp / SMS notification is sent to the worker.

---

## 9. Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | Worker PWA and admin portal |
| TailwindCSS | UI styling |
| React Query | Server state management and caching |
| Chart.js | Dashboard charts and analytics |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | API Gateway and all microservices |
| JWT + Helmet.js | Authentication and security headers |
| express-rate-limit | API rate limiting per user / IP |

### AI / ML
| Technology | Purpose |
|-----------|---------|
| Python 3.11 + FastAPI | ML model serving |
| scikit-learn | Random Forest (risk scoring), Isolation Forest (fraud) |
| XGBoost | Dynamic premium prediction |
| pandas + numpy | Feature engineering pipeline |

### Messaging & Caching
| Technology | Purpose |
|-----------|---------|
| Kafka / RabbitMQ | Message queue (location events) and pub/sub (disruption events) |
| Redis | Caching (weather data, sessions, zone risk scores) and rate limit counters |

### Database
| Technology | Purpose |
|-----------|---------|
| MongoDB + Mongoose | Workers, policies, claims, payouts |

### Payments & Notifications
| Technology | Purpose |
|-----------|---------|
| Razorpay (test mode) | Weekly premium debit and payout transfer |
| Twilio / WhatsApp API | Worker notifications |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker + Docker Compose | Containerization of all services |
| GitHub Actions | CI/CD pipeline per microservice |
| Kubernetes (if time permits) | Container orchestration and scaling |

---

## 10. System Architecture

**Microservices Architecture with Event-Driven Communication.**



```
[Worker Browser]
      ↓
[React PWA / Admin Dashboard]
      ↓
[API Gateway — Node + Express]
[JWT Auth · Rate Limiting · Routing]
      ↓
┌─────────────────────────────────────────────┐
│              Microservices                  │
│  Auth Svc | Policy Svc | Location Svc       │
│  Payment Svc | Notification Svc             │
└─────────────────────────────────────────────┘
      ↓ (Location Svc pushes GPS events)
[Message Queue — Kafka / RabbitMQ]
      ↓
[ML Model — Python FastAPI]
  → Checks rain / flood / strike at location
  → If disruption confirmed → publish event
      ↓
[Pub/Sub — Kafka / RabbitMQ]
      ↓ (fan-out to all subscribers)
┌──────────────────────────────────────────┐
│  Payment Svc  → auto payout to UPI       │
│  Notify Svc   → WhatsApp / SMS           │
│  Claims Svc   → log record, dashboard    │
│  Fraud Svc    → anomaly detection        │
└──────────────────────────────────────────┘

[Redis] → caching weather data, sessions, zone risk scores, rate limit counters
[MongoDB] → persistent storage for all data
[Docker] → all services containerized
[GitHub Actions] → CI/CD per service
```

### Redis Caching Strategy

| Data cached | TTL | Reason |
|-------------|-----|--------|
| Weather / AQI data per zone | 5–10 minutes | Avoid repeated API calls for 500+ workers in same zone |
| Worker session / JWT | 24 hours | Skip MongoDB lookup on every request |
| Zone risk scores | 1 hour | ML model not recomputed on every policy renewal |
| Worker policy details | 15 minutes | Fast dashboard loads |
| Tomorrow's forecast per zone | 12 hours | Single API call serves all workers in a zone |
| Rate limit counters | Per window | Native Redis TTL support |

---

## 11. Development Plan

### Phase 1 — March 4–20: Ideation & Foundation
- [x] Define persona, scenarios, and workflow
- [x] Design weekly premium model and parametric triggers
- [x] Design MongoDB schema for workers, policies, claims
- [ ] Set up GitHub repository and Docker Compose skeleton
- [ ] Set up project folder structure
- [ ] Record 2-minute strategy video

### Phase 2 — March 21–April 4: Automation & Protection
- [ ] Worker registration and KYC flow
- [ ] Policy creation with weekly pricing
- [ ] XGBoost premium model (v1) integrated
- [ ] Location service pushing to Kafka / RabbitMQ
- [ ] ML model consuming from queue and validating disruptions
- [ ] 3 automated parametric triggers live
- [ ] Claims auto-flow via pub/sub
- [ ] 2-minute demo video

### Phase 3 — April 5–17: Scale & Optimise
- [ ] Isolation Forest fraud detection
- [ ] Razorpay test mode payout integration
- [ ] WhatsApp / SMS notifications
- [ ] Worker dashboard (earnings protected, active coverage)
- [ ] Admin dashboard (loss ratio, zone heat map, fraud alerts)
- [ ] Tomorrow's forecast notification feature
- [ ] GitHub Actions CI/CD pipelines
- [ ] Kubernetes setup (if time permits)
- [ ] 5-minute demo video + final pitch deck

### Folder Structure

```
gigshield/
├── services/
│   ├── gateway/          # Node + Express — API gateway
│   ├── auth/             # Registration, login, JWT
│   ├── policy/           # Weekly pricing, auto-renewal
│   ├── location/         # GPS collection, push to queue
│   ├── claims/           # Disruption subscriber, claim logging
│   ├── payment/          # Razorpay integration, UPI payout
│   ├── notification/     # WhatsApp, SMS, forecast alerts
│   ├── fraud/            # Isolation Forest anomaly detection
│   └── ml-engine/        # Python FastAPI — 3 ML models
├── monitor/              # Cron jobs — weather polling, forecast
├── frontend/             # React PWA (worker) + Admin portal
├── docker-compose.yml
├── .github/
│   └── workflows/        # CI/CD pipeline per service
└── README.md
```

---

## 12. What Makes Us Unique

| Feature | GigShield | Traditional Insurance |
|---------|-----------|----------------------|
| Claim process | Zero-touch — fully automatic | Manual form submission |
| Payout time | Under 60 seconds | Days to weeks |
| Pricing | AI-driven, hyper-local, weekly | Flat annual premium |
| Fraud detection | Real-time ML anomaly detection | Manual investigation |
| Proactive alerts | Next-day forecast notifications | None |
| Architecture | Production-grade microservices | N/A |

**We are not building a simple CRUD insurance app. We are building a production-quality, event-driven, AI-powered platform that treats gig workers as first-class citizens and eliminates every friction point between a disruption happening and money reaching the worker's account.**

---

> Built for Guidewire DEVTrails 2026 · Persona: Food delivery partners (Zomato / Swiggy) · Coverage: Income loss only · Pricing: Weekly
