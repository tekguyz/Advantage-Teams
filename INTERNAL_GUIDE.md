# Advantage Teams: Internal Operations Guidance

This document serves as the master playbook for the **Advantage Teams Workspace**. It outlines functional characteristics, joint telecommunication-CRM logic matrices, compliance guardrails, and instructions for training stakeholders.

---

## 💎 1. High-Level Core Value Proposition

In high-volume call centers, customer satisfaction audits usually trigger hours after contact occurs, yielding low completion rates and stale feedback. **Advantage Teams** solves this by providing **near-zero latency, transaction-triggered SMS feedback looping**:

1. **Immediate Reaction:** As soon as an agent hangs up an active telephone call on a physical handset, the transaction is registered.
2. **Instant Delivery:** Within milliseconds, the platform parses compliance filters and instructs the gateway to dispatch a feedback request directly to the client's telephone.
3. **Closing the Loop:** When the client fills out the 1-click text survey scale, the results append directly onto their Zoho Desk historical account profile via custom Zoho Map Extension links.

---

## 📊 2. Deep Dive: The 4 Workspace views

The application workspace layout splits into 4 specialized enterprise-grade views, accessible via the persistent Left Navigation Rail:

```
┌────────────────────────────────────────────────────────┐
│                        VIEWPORT                        │
├───────────────┬────────────────────────────────────────┤
│               │                                        │
│  [OVERVIEW]   │  • High-Density Metrics (Survey VoD)   │
│               │  • Historical Ingestion Timelines (D3) │
│               │                                        │
│  [TEAM PERF]  │  • Active Representative Matrix        │
│               │  • System Focus Metrics & Exception Alerts│
│               │                                        │
│   [SURVEYS]   │  • Pending Outbound Dispatch Queue     │
│               │  • Carrier Gateway Dispatch Log        │
│               │                                        │
│  [SETTINGS]   │  • Extension-to-Zoho Id Map Registrar  │
│               │  • Global Throttle Parameters          │
└───────────────┴────────────────────────────────────────┘
```

### 1️⃣ Overview Dashboard
- **Target Audience:** Operational Directors and Call Center Supervisors.
- **Primary Function:** Spot check operational consistency, current text carrier statuses (e.g., *Twilio SMS*), overall positive response rates ($CSAT$), and real-time webhook flow speeds.
- **Key Visuals:** A D3-powered timeline representing raw hourly Call Ingest packets vs successfully parsed Surveys, and high-contrast KPI banner tiles.

### 2️⃣ Team Performance Matrix
- **Target Audience:** Shift Leads and Human Resource Supervisors.
- **Primary Function:** Monitor agent output volumes, extension assignments, and calculated **Focus Ratings**.
- **The Focus rating Formula:**
  $$\text{Focus Level (\%)} = \frac{\text{System Updates (Count)}}{\text{Call Duration (Minutes)}} \times 100$$
- **Jira-Style Alerting Trigger:** If a representative records high online durations but performs zero active CRM record system updates, the system throws a yellow `Review Required` status bubble, opening a slide-out audit review drawer for the supervisor to override compliance status.

### 3️⃣ Survey Center Dispatch
- **Target Audience:** Compliance Officers.
- **Primary Function:** Inspect outbound dispatches that are queuing or have already cleared. Supervisors can view details like recipient phone, caller representative, dispatch timestamp, and outcome status (*Sent*, *Pending*, *Skipped*).
- **Manual Control:** Provides instant manual purging and single-click execution of outbound batches for test environments.

### 4️⃣ Member Settings Layout (Extension Map)
- **Target Audience:** Systems Administrators.
- **Primary Function:** The core database mapping tables routing physical hardware extensions to CRM keys.
- **The Mapping contract:**
  - `Physical extension Number` (e.g., `104`)
  - `Representative Name` (e.g., `Marcus Aurelius`)
  - `Zoho Member ID` (e.g., `zoho-usr-97011`)
  - `Status Toggle` to instantly halt survey activity on specific personnel.

---

## 🚫 3. Pipeline Safeguards & Anti-Spam Control

To shield client phone registers from spam and comply with telecommunications laws, Advantage Teams implements a strict **Twin-Gate Guardrail Policy** inside `/utils/survey-engine.ts`:

### ⏱️ Guardrail A: The 120-Second Active Hang-Up Rule
- **The Issue:** Telephony networks see thousands of silent drops, automated IVR disconnects, voicemail redirects, and wrong numbers. Triggering surveys on these ruins CSAT accuracy.
- **The Rule:** Any incoming call packet reporting a duration **under 120 seconds (2 minutes)** is immediately skipped. High-Density logs mark these with a specific error flag: `Skipped: Under 2 min limit`.

### 🛡️ Guardrail B: Anti-Spam Daily Frequency Ceiling
- **The Issue:** Multiple call transfers or multiple support tickets within a single business day shouldn't spam a customer's cellphone with repeated texts.
- **The Rule:** The SMS gateway tracks a 24-hour cache. Only **one feedback dispatch is allowed per customer telephone number inside a 24-hour cycle**. Any secondary dispatches target are automatically suppressed.

---

## ❓ 4. Interactive Help Center (Sidebar Footer Badge)

For stakeholders who need an in-app walkthrough while evaluating the platform, we have added a dedicated **Help & Support Center** inside `/components/dashboard/layout-shell.tsx`, marked by the Help `?` icon right beside the Theme Toggle:

1. **System Version Banner:** Validates standard LTS status and confirms real-time hook mapping capabilities.
2. **Interactive Architectural Blueprint:** Features an inline schematic flow chart documenting telemetry flows.
3. **Exploratory FAQ Accordion:** Provides quick-expand answers addressing common questions about 3CX call log triggers, Zoo Zoho integration mapping, and Twilio SMS carrier behaviors.
4. **Guardrail Overview Panel:** Clearly shows compliance specifications to stakeholders so they understand exactly why some call events exhibit skipped telemetry states.
