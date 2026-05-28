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

export interface ExtensionMapping {
  extension: string;
  mappedName: string;
  zohoUserId: string;
}

// Alias for backwards compatibility
export interface ExtensionMap extends ExtensionMapping {}

// 12 full-time support agents from Sarah Jenkins to Lisa Judd
export const MASTER_AGENTS: AgentPerformance[] = [
  {
    id: 'a101',
    name: 'Sarah Jenkins',
    extension: '101',
    zohoId: 'US-101',
    workStatus: 'Away from Phone',
    durationMins: 45,
    systemUpdates: 0,
    focusRating: 12,
    statusTag: 'Attention Needed',
    aiSummary: 'Inactive duration exceeds critical thresholds; 0 discrete updates logged.'
  },
  {
    id: 'a102',
    name: 'Marcus Vance',
    extension: '102',
    zohoId: 'US-102',
    workStatus: 'Ticket Work',
    durationMins: 15,
    systemUpdates: 14,
    focusRating: 93,
    statusTag: 'Verified',
    aiSummary: 'Maintains tight compliance coverage. Logged 14 high-integrity updates.'
  },
  {
    id: 'a103',
    name: 'Elena Rostova',
    extension: '103',
    zohoId: 'US-103',
    workStatus: 'Away from Phone',
    durationMins: 32,
    systemUpdates: 1,
    focusRating: 18,
    statusTag: 'Attention Needed',
    aiSummary: 'Idle duration check active with single database action. Flag set.'
  },
  {
    id: 'a104',
    name: 'David Kim',
    extension: '104',
    zohoId: 'US-104',
    workStatus: 'Ticket Work',
    durationMins: 20,
    systemUpdates: 9,
    focusRating: 85,
    statusTag: 'Verified',
    aiSummary: 'High-density updates observed. Mapped 9 system changes with 3CX active.'
  },
  {
    id: 'a105',
    name: 'Nolan Davies',
    extension: '105',
    zohoId: 'US-105',
    workStatus: 'Away from Phone',
    durationMins: 110,
    systemUpdates: 0,
    focusRating: 5,
    statusTag: 'Attention Needed',
    aiSummary: 'Extended away status logged. Attention needed due to session inactivity.'
  },
  {
    id: 'a106',
    name: 'Emily Watson',
    extension: '106',
    zohoId: 'US-106',
    workStatus: 'Available',
    durationMins: 10,
    systemUpdates: 22,
    focusRating: 98,
    statusTag: 'Verified',
    aiSummary: 'Excellent performance. Fully compliant across all standard intervals.'
  },
  {
    id: 'a107',
    name: 'Jacob Miller',
    extension: '107',
    zohoId: 'US-107',
    workStatus: 'Ticket Work',
    durationMins: 18,
    systemUpdates: 12,
    focusRating: 89,
    statusTag: 'Verified',
    aiSummary: 'Consistently logged updates. Device health index verified green.'
  },
  {
    id: 'a108',
    name: 'Chloe Bennet',
    extension: '108',
    zohoId: 'US-108',
    workStatus: 'In Call',
    durationMins: 8,
    systemUpdates: 5,
    focusRating: 91,
    statusTag: 'Verified',
    aiSummary: 'Active live call handled. Survey dispatch pending completion.'
  },
  {
    id: 'a109',
    name: 'Adrian Peterson',
    extension: '109',
    zohoId: 'US-109',
    workStatus: 'DND',
    durationMins: 55,
    systemUpdates: 2,
    focusRating: 25,
    statusTag: 'Attention Needed',
    aiSummary: 'Unusual long-running DND state. Requires manager intervention.'
  },
  {
    id: 'a110',
    name: 'Clara Bow',
    extension: '110',
    zohoId: 'US-110',
    workStatus: 'Away from Phone',
    durationMins: 40,
    systemUpdates: 1,
    focusRating: 14,
    statusTag: 'Attention Needed',
    aiSummary: 'Device idle time threshold breached with insufficient keystroke activity.'
  },
  {
    id: 'a111',
    name: 'Victor Vance',
    extension: '111',
    zohoId: 'US-111',
    workStatus: 'Available',
    durationMins: 5,
    systemUpdates: 19,
    focusRating: 95,
    statusTag: 'Verified',
    aiSummary: 'Active system monitoring confirms baseline productivity targets met.'
  },
  {
    id: 'a112',
    name: 'Lisa Judd',
    extension: '112',
    zohoId: 'US-112',
    workStatus: 'Ticket Work',
    durationMins: 12,
    systemUpdates: 11,
    focusRating: 90,
    statusTag: 'Verified',
    aiSummary: 'Strong technical support performance. Commits logged across assignments.'
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

export const DEFAULT_MAPPINGS: ExtensionMapping[] = MASTER_AGENTS.map(agent => ({
  extension: agent.extension,
  mappedName: agent.name,
  zohoUserId: agent.zohoId
}));
