// types-matrix.ts
// Shared TypeScript contracts and master mock data for Advantage Teams

export interface AgentPerformance {
  id: string;
  name: string;
  extension: string;
  zohoId: string;
  workStatus: string;
  durationMins: number;
  systemUpdates: number;
  focusRating: number;
  statusTag: 'Attention Needed' | 'Verified';
  aiSummary: string;
}

export interface SurveyLog {
  id: string;
  phone: string;
  agentExt: string;
  durationSec: number;
  status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
  explanation: string;
}

export interface ExtensionMap {
  extension: string;
  mappedName: string;
  zohoUserId: string;
}

// Strictly mirrored Master Dataset based on requirements
export const MASTER_AGENTS: AgentPerformance[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Sarah Jenkins',
    extension: '101',
    zohoId: 'US-101',
    workStatus: 'Away from Phone',
    durationMins: 45,
    systemUpdates: 0,
    focusRating: 12,
    statusTag: 'Attention Needed',
    aiSummary: 'Inactive duration exceeds critical thresholds; 0 discrete updates logged. Highly recommended for re-verification.'
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    name: 'Marcus Vance',
    extension: '102',
    zohoId: 'US-102',
    workStatus: 'Ticket Work',
    durationMins: 15,
    systemUpdates: 14,
    focusRating: 93,
    statusTag: 'Verified',
    aiSummary: 'Maintains tight compliance coverage. Logged 14 high-integrity workstation updates within the current interval.'
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    name: 'Elena Rostova',
    extension: '103',
    zohoId: 'US-103',
    workStatus: 'Away from Phone',
    durationMins: 32,
    systemUpdates: 1,
    focusRating: 18,
    statusTag: 'Attention Needed',
    aiSummary: 'Idle duration check active with single database action. System flag is set for manager review sequence.'
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    name: 'David Kim',
    extension: '104',
    zohoId: 'US-104',
    workStatus: 'Ticket Work',
    durationMins: 20,
    systemUpdates: 9,
    focusRating: 85,
    statusTag: 'Verified',
    aiSummary: 'High-density updates observed. Mapped 9 system changes with 3CX workstation status mapping active.'
  }
];

export const MASTER_SURVEYS: SurveyLog[] = [
  {
    id: 's1',
    phone: '+1 (555) 019-2834',
    agentExt: '102',
    durationSec: 345,
    status: 'Sent',
    explanation: 'Exceeded 2-Minute Minimum Filter. Standard survey dispatched.'
  },
  {
    id: 's2',
    phone: '+1 (555) 014-4921',
    agentExt: '101',
    durationSec: 42,
    status: 'Skipped: Under 2 Minutes',
    explanation: 'Filtered out automatically due to the 2-Minute Minimum Filter.'
  },
  {
    id: 's3',
    phone: '+1 (555) 017-8833',
    agentExt: '104',
    durationSec: 180,
    status: 'Skipped: Daily Cap Hit',
    explanation: 'Suppressed due to the Daily Message Cap rule.'
  }
];

export const DEFAULT_MAPPINGS: ExtensionMap[] = [
  { extension: '101', mappedName: 'Sarah Jenkins', zohoUserId: 'US-101' },
  { extension: '102', mappedName: 'Marcus Vance', zohoUserId: 'US-102' },
  { extension: '103', mappedName: 'Elena Rostova', zohoUserId: 'US-103' },
  { extension: '104', mappedName: 'David Kim', zohoUserId: 'US-104' }
];
