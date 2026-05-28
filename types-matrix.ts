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

export interface CallEvent {
  processed_at: string;
  agent_extension: string;
  customer_phone: string;
  call_duration_seconds: number;
  delivery_status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
}

export const MASTER_AGENTS: AgentPerformance[] = [
  {
    id: 'a101',
    name: 'Sarah Jenkins',
    extension: '101',
    zohoId: 'ZO-8842-A',
    workStatus: 'Away from Phone',
    durationMins: 45,
    systemUpdates: 0,
    focusRating: 0,
    statusTag: 'Attention Needed',
    aiSummary: 'Inactive duration exceeds critical thresholds; 0 discrete updates logged.'
  },
  {
    id: 'a102',
    name: 'Marcus Vance',
    extension: '102',
    zohoId: 'ZO-3329-D',
    workStatus: 'Ticket Work',
    durationMins: 15,
    systemUpdates: 14,
    focusRating: 9,
    statusTag: 'Attention Needed',
    aiSummary: 'Maintains compliance coverage. Logged 14 high-integrity updates.'
  },
  {
    id: 'a103',
    name: 'Elena Rostova',
    extension: '103',
    zohoId: 'ZO-7711-X',
    workStatus: 'Away from Phone',
    durationMins: 32,
    systemUpdates: 1,
    focusRating: 0,
    statusTag: 'Attention Needed',
    aiSummary: 'Idle duration check active with single database action. Flag set.'
  },
  {
    id: 'a104',
    name: 'David Kim',
    extension: '104',
    zohoId: 'ZO-4910-K',
    workStatus: 'Ticket Work',
    durationMins: 20,
    systemUpdates: 9,
    focusRating: 5,
    statusTag: 'Attention Needed',
    aiSummary: 'High-density updates observed. Mapped 9 system changes with 3CX active.'
  },
  {
    id: 'a105',
    name: 'Nolan Davies',
    extension: '105',
    zohoId: 'ZO-1049-M',
    workStatus: 'Away from Phone',
    durationMins: 110,
    systemUpdates: 0,
    focusRating: 0,
    statusTag: 'Attention Needed',
    aiSummary: 'Extended away status logged. Attention needed due to session inactivity.'
  },
  {
    id: 'a106',
    name: 'Emily Watson',
    extension: '106',
    zohoId: 'ZO-6622-Y',
    workStatus: 'Available',
    durationMins: 10,
    systemUpdates: 22,
    focusRating: 22,
    statusTag: 'Attention Needed',
    aiSummary: 'Excellent performance. Fully compliant across all standard intervals.'
  },
  {
    id: 'a107',
    name: 'Jacob Miller',
    extension: '107',
    zohoId: 'ZO-9011-L',
    workStatus: 'Ticket Work',
    durationMins: 18,
    systemUpdates: 12,
    focusRating: 7,
    statusTag: 'Attention Needed',
    aiSummary: 'Consistently logged updates. Device health index verified green.'
  },
  {
    id: 'a108',
    name: 'Chloe Bennet',
    extension: '108',
    zohoId: 'ZO-5544-H',
    workStatus: 'In Call',
    durationMins: 8,
    systemUpdates: 5,
    focusRating: 6,
    statusTag: 'Attention Needed',
    aiSummary: 'Active live call handled. Survey dispatch pending completion.'
  },
  {
    id: 'a109',
    name: 'Adrian Peterson',
    extension: '109',
    zohoId: 'ZO-4022-P',
    workStatus: 'DND',
    durationMins: 55,
    systemUpdates: 2,
    focusRating: 0,
    statusTag: 'Attention Needed',
    aiSummary: 'Unusual long-running DND state. Requires manager intervention.'
  },
  {
    id: 'a110',
    name: 'Clara Bow',
    extension: '110',
    zohoId: 'ZO-3819-C',
    workStatus: 'Away from Phone',
    durationMins: 40,
    systemUpdates: 1,
    focusRating: 0,
    statusTag: 'Attention Needed',
    aiSummary: 'Device idle time threshold breached with insufficient keystroke activity.'
  },
  {
    id: 'a111',
    name: 'Victor Vance',
    extension: '111',
    zohoId: 'ZO-2204-V',
    workStatus: 'Available',
    durationMins: 5,
    systemUpdates: 19,
    focusRating: 38,
    statusTag: 'Attention Needed',
    aiSummary: 'Active system monitoring confirms baseline productivity targets met.'
  },
  {
    id: 'a112',
    name: 'Lisa Judd',
    extension: '112',
    zohoId: 'ZO-4911-W',
    workStatus: 'Ticket Work',
    durationMins: 12,
    systemUpdates: 11,
    focusRating: 9,
    statusTag: 'Attention Needed',
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

export function generateSimulationRecords(): CallEvent[] {
  const extList = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'];
  const baseTime = new Date("2026-05-28T16:00:00Z").getTime();
  return Array.from({ length: 300 }, (_, i) => {
    // Generate predictable totals: Sent = 123, Skipped Short = 105, Duplicate = 72
    const status = i < 123 ? 'Sent' : (i < 228 ? 'Skipped: Under 2 Minutes' : 'Skipped: Daily Cap Hit');
    return {
      processed_at: new Date(baseTime - i * 36000).toISOString(),
      agent_extension: extList[i % 12],
      customer_phone: `+1 (555) 019-${2200 + (i * 13) % 7700}`,
      call_duration_seconds: status === 'Skipped: Under 2 Minutes' ? 10 + (i % 109) : 121 + (i % 400),
      delivery_status: status as any
    };
  });
}
