# Advantage Teams: Internal Operations Console

Advantage Teams is a secure, high-performance, and high-density corporate operations dashboard built for tracking 3CX telephony performance, managing active call routing filters, and resolving representative workstation hardware configurations.

Preserving strict compliance, operational integrity, and user data privacy, the platform operates completely **offline-first** with robust self-contained workflows, avoiding any reliance on third-party API endpoints.

---

## 1. Executive Executive Overview

Advantage Teams provides real-time supervisor-level clarity into physical corporate desk phone configurations and ongoing workforce compliance.

- **Unified Status Console**: Seamlessly aligns active 3CX telephony stream data with internal profile records to highlights bottlenecks.
- **Precision Survey Ingestion**: Tracks the state of automated survey dispatches with robust client-side filter logic, protecting customer endpoints from duplicate transmissions.
- **Zero Third-Party Dependency**: Entire operational layer is isolated client-side to ensure compliance and lightning-fast loading speeds under typical internal networking constraints.

---

## 2. Micro-Architecture Blueprint

The platform's frontend architecture is fully decoupled to maximize performance, clean separation of concerns, and complete isolation of type rules and UI representations:

```
/app
├── types-matrix.ts         # Shared contract types & Master dataset
├── validation-schemas.ts   # Zod runtime schema rules & inputs validator
├── use-team-insights.ts    # React state hook state-machine & formula compiler
├── layout-shell.tsx       # Jira Cloud styling frame and left rail navigation
├── view-performance.tsx    # Live workforce review flags & performance monitor
├── view-surveys.tsx        # Split-pane survey dispatch audit & workstation mapper
└── page.tsx                # Lightweight, query-driven router with suspense limits
```

### Decoupled Core Components
1. **`types-matrix.ts`**: Holds unified TypeScript typings (`AgentPerformance`, `SurveyLog`, `ExtensionMap`) alongside the Master Mock Dataset. Consistently serves as the single source of truth for both performance grids and configurations.
2. **`validation-schemas.ts`**: Outlines Zod parsing declarations. Validates hardware extension updates and simulated inbound payload streams against string lengths, formats, and identifiers prior to local memory persistence.
3. **`use-team-insights.ts`**: A pure React custom state hook containing formulas for **Hours Monitored**, **Active Flags**, and **Active Completion Rate**. Houses state management for active text search inputs, filter toggles, draft editing structures, and Zod verification rules.
4. **`layout-shell.tsx`**: Renders the high-density corporate layout utilizing Jira-style spacing properties. Hosts the persistent sidebar navigation matrix, section subgroups, and a secure user profile badge at the bottom frame margin bounds.
5. **`view-performance.tsx`**: A presentation layout displaying high-level performance indicators alongside the real-time review flags table. Prompts immediate supervisor reviews via distinctive color indicator flags.
6. **`view-surveys.tsx`**: Renders a split-screen viewport layout.
   - **Left Panel (60%)**: Renders the **Survey Delivery Log** capturing delivery rules and tracking call duration conditions.
   - **Right Panel (40%)**: Embeds the **Extension Mapping Matrix**, enabling managers to execute inline changes to hardware configurations.
7. **`page.tsx`**: Serves as the high-speed view router. Pulls query parameters natively using Next.js hooks and serves layouts dynamically with zero lag or frame flickering.

---

## 3. Design Tokens & Visual Specifications (Jira Cloud Style)

The console is fully aligned with classic Jira cloud-inspired visual guidelines to support high-density, low-fatigue operations over extended observation intervals:

- **Surface Canvas**: Pure White background elements (`#ffffff`) designed to establish crisp structural margins.
- **Sidebars & Outer Background**: Clinical, soft light-tint gray styling surfaces (`#f4f5f7`) optimizing spatial negative margins.
- **Accent Theme Color**: Deep Corporate Royal Blue (`#0052cc`) used purposefully for active navigation elements and primary controls.
- **Grid Dividers**: Flat, ultra-thin 1px solid slate outline bounds (`#dfe1e6`).
- **Typography Matrix**: Premium corporate font sequence (`Segoe UI`, `system-ui`, `sans-serif`) styled cleanly. Primary copy text is set to rich Charcoal (`#172b4d`) with accessory metadata styled in secondary Steel Gray (`#5e6c84`).
- **Layout Densities**: Compact rows utilizing rigid vertical paddings (`4px`, `8px`, `12px`) to preserve fold space on compact viewport frames.

---

## 4. Human-Centric Presentation Map

In compliance with administrative clarity standards, all variables, headings, and system labels are translated directly to precise, non-technical business vocabulary:

| System / Legacy Identifier | Humanized Presentation Header |
|:---|:---|
| `3CX Telemetry Logs / Ingestion` | **Phone System Sync** |
| `Exceptions / Anomalies Matrix` | **Review Flags** |
| `Productivity Score Evaluation` | **Focus Rating** |
| `120s Filter Gatekeeper` | **2-Minute Minimum Filter** |
| `Deduplication Window Queue` | **Daily Message Cap** |

---

## 5. Master Dataset (Strict System Mirroring)

The internal dashboard is powered by high-integrity, hardcoded workspace mock logs:

### Team Performance Records
- **Sarah Jenkins** (Ext: 101, Zoho ID: `US-101`)  
  *Status*: `Away from Phone` (45 mins) | *Focus Rating*: `12%` | *Tag*: **Attention Needed** (Coral)  
  *Summary*: Inactive duration exceeds critical thresholds; 0 discrete updates logged.
- **Marcus Vance** (Ext: 102, Zoho ID: `US-102`)  
  *Status*: `Ticket Work` (15 mins) | *Focus Rating*: `93%` | *Tag*: **Verified** (Green)  
  *Summary*: Maintains tight compliance coverage. Logged 14 high-integrity updates.
- **Elena Rostova** (Ext: 103, Zoho ID: `US-103`)  
  *Status*: `Away from Phone` (32 mins) | *Focus Rating*: `18%` | *Tag*: **Attention Needed** (Coral)  
  *Summary*: Idle check active. System flag set for manager review sequence.
- **David Kim** (Ext: 104, Zoho ID: `US-104`)  
  *Status*: `Ticket Work` (20 mins) | *Focus Rating*: `85%` | *Tag*: **Verified** (Green)  
  *Summary*: High-density updates observed. Mapped 9 system changes with 3CX active.

### Survey Communications Registers
- **Recipient**: `+1 (555) 019-2834` | *Extension*: 102 | *Duration*: 345s | *Batch Status*: **Sent**
- **Recipient**: `+1 (555) 014-4921` | *Extension*: 101 | *Duration*: 42s | *Batch Status*: **Skipped: Under 2 Minutes**
- **Recipient**: `+1 (555) 017-8833` | *Extension*: 104 | *Duration*: 180s | *Batch Status*: **Skipped: Daily Cap Hit**

---

## 6. Secure Form Delivery Safeguard (Netlify Gateway Protocol)

Should any future operational requirements necessitate the outward transmission of form configurations or compliance logs, the system includes static safeguard hooks to bypass processing middleware:

1. **Endpoint Destination**: Forms must target a secure, static browser handler target located at `/public/_forms.html`.
2. **System Parameter Identification**: Every payload must explicitly inject a distinct `form-name` key and value pair inside standard `FormData` outputs.
3. **Middlware Exclusion Header**: Injected fetch sequences must explicitly configure the following header token:
   ```json
   { "X-Requested-With": "XMLHttpRequest" }
   ```
   This prevents Next.js edge routers from intercepting native multipart inputs unnecessarily.

---

*This document is an internal blueprint, preserve strictly in the workspace root for onboarding and compliance reviews.*
