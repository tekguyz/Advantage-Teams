# Advantage Teams Workspace

![Advantage Teams Share Logo](https://advantage-teams.vercel.app/api/og)

A high-density, real-time enterprise operations workspace and performance tracking console. **Advantage Teams** maps hardware telecommunication event data (originating from a connected **3CX IP-PBX**) directly to **Zoho CRM / Zoho Desk** contacts, driving automated out-of-context satisfaction survey campaigns over **Twilio SMS** based on custom, supervisor-configured filters.

---

## 🚀 Canonical Metadata & Baseline References

- **Production Canonical URL:** [https://advantage-teams.vercel.app/](https://advantage-teams.vercel.app/)
- **Core Design System:** Conforms with strict Atlassian Jira Cloud design guidelines, featuring a persistent high-contrast sidebar, balanced data densities, theme-aware responsive palettes, and micro-interaction animations.
- **Theme Support:** Fully theme-aware supporting seamless dark-mode/light-mode swapping on standard Tailwind CSS v4 variables.

---

## 🛠️ System Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15+ (App Router) | Core React framework leveraging Vercel Edge functions. |
| **Language** | TypeScript (Strict Mode) | Strong relational parameter contracts across ingestion lines. |
| **Styling** | Tailwind CSS v4 | Flexible utility utilities, no inline declarations. |
| **Icons** | Lucide React | Uniform SVG icon representation across tabs. |
| **Telemetry Insights**| D3.js & Recharts | Interactive high-resolution timeline charts and analytics grids. |
| **Ingestion DB** | Edge-Compatible Store | Highly resilient concurrent local read/write session engine. |
| **OpenGraph Assets** | `@vercel/og` | Programmatic social sharing graphics rendered on the Edge runtime. |

---

## 🏗️ System Architecture & Data Topology

```
                  ┌─────────────────────────────────┐
                  │   3CX IP-PBX Telephony System   │
                  └────────────────┬────────────────┘
                                   │
                      (Raw webhook event on hangup)
                                   ▼
                  ┌─────────────────────────────────┐
                  │  /api/calls Ingestion Endpoint  │ <--- Ingestion Throttle
                  └────────────────┬────────────────┘
                                   │
                  (Relational hardware ext lookup)
                                   ▼
                  ┌─────────────────────────────────┐
                  │      Advantage Teams Core       │ <--- Resolves Extension ──► Zoho ID
                  └────────────────┬────────────────┘
                                   │
                    (Guardrails & Compliance checks)
                                   ├─────────────────────────────┐
                        [If Active call > 120s]                  ▼ [If short/caps]
                                   │                           Skipped Logs Cache
                                   ▼
                  ┌─────────────────────────────────┐
                  │      Twilio SMS Dispatcher      │
                  └────────────────┬────────────────┘
                                   │
                       (Outbound survey sequence)
                                   ▼
                  ┌─────────────────────────────────┐
                  │   Zoho Desk Ticket Append API   │
                  └─────────────────────────────────┘
```

---

## ⚙️ Environment Variables Declarations (`.env`)

Configure the following variables in your local environment file (`.env` or `.env.local`). A reference is provided in `.env.example`.

```env
# REQUIRED: Google Gemini API Credentials
GEMINI_API_KEY="AI_Studio_Secret_Key"

# REQUIRED: Absolute deployment baseline URL for OpenGraph metadata resolution
APP_URL="https://advantage-teams.vercel.app/"
```

---

## 📦 Local Installation & Startup Guide

Follow these sequential blocks to bootstrap the application workspace developer engine:

```bash
# 1. Install standard package dependencies
npm install

# 2. Spin up the Next.js local development server (Bound exclusively to Port 3000)
npm run dev

# 3. Compile a pristine production package bundle
npm run build

# 4. Initiate local developer linter to verify syntactical safety
npm run lint
```

---

## 📁 Key File Map

- `app/layout.tsx` - App runtime containing canonical Base64 theme-aware inline favicon declaration.
- `app/api/og/route.tsx` - Vercel Edge Runtime serverless endpoint generating programmatic 1200x630 social share graphics.
- `app/api/calls/route.ts` - REST endpoint for receiving webhook registrations from 3CX.
- `components/dashboard/layout-shell.tsx` - Confluence-style application template enclosing views and incorporating the **Interactive Support Drawer**.
- `types/types-ingestion.ts` - Strict relational object shape models including telemetry, profile, and pending surveys.
