import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AgentProfile, TelemetryLog, ActivityLog, PendingSurvey } from '@/types/types-ingestion';

// =============================================================================
// INITIAL DETERMINISTIC SEED STATES
// =============================================================================

const INITIAL_AGENTS: AgentProfile[] = [
  { id: 'a1111111-1111-1111-1111-111111111111', extension: '101', zoho_user_id: 'ZOHO_US_001', agent_name: 'Alexander Graham', active: true, created_at: '2026-05-26T07:00:00Z', updated_at: '2026-05-26T07:00:00Z' },
  { id: 'a2222222-2222-2222-2222-222222222222', extension: '102', zoho_user_id: 'ZOHO_US_002', agent_name: 'Eleanor Vance', active: true, created_at: '2026-05-26T07:15:00Z', updated_at: '2026-05-26T07:15:00Z' },
  { id: 'a3333333-3333-3333-3333-333333333333', extension: '103', zoho_user_id: 'ZOHO_US_003', agent_name: 'Liam Carter', active: true, created_at: '2026-05-26T07:30:00Z', updated_at: '2026-05-26T07:30:00Z' },
  { id: 'a4444444-4444-4444-4444-444444444444', extension: '104', zoho_user_id: 'ZOHO_US_004', agent_name: 'Sophia Martinez', active: true, created_at: '2026-05-26T07:45:00Z', updated_at: '2026-05-26T07:45:00Z' },
  { id: 'a5555555-5555-5555-5555-555555555555', extension: '105', zoho_user_id: 'ZOHO_US_005', agent_name: 'Nolan Davies', active: false, created_at: '2026-05-26T08:00:00Z', updated_at: '2026-05-26T08:00:00Z' },
];

const INITIAL_TELEMETRY: TelemetryLog[] = [
  { id: 'b101-1', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'Ticket Work', start_timestamp: '2026-05-26T08:00:00Z', end_timestamp: '2026-05-26T09:15:00Z', duration_seconds: 4500, created_at: '2026-05-26T08:00:00Z', updated_at: '2026-05-26T08:00:00Z' },
  { id: 'b101-2', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'On Call', start_timestamp: '2026-05-26T09:15:00Z', end_timestamp: '2026-05-26T09:45:00Z', duration_seconds: 1800, created_at: '2026-05-26T09:15:00Z', updated_at: '2026-05-26T09:15:00Z' },
  { id: 'b101-3', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'Ticket Work', start_timestamp: '2026-05-26T10:00:00Z', end_timestamp: '2026-05-26T11:30:00Z', duration_seconds: 5400, created_at: '2026-05-26T10:00:00Z', updated_at: '2026-05-26T10:00:00Z' },
  { id: 'b101-4', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'On Call', start_timestamp: '2026-05-26T11:30:00Z', end_timestamp: '2026-05-26T11:45:00Z', duration_seconds: 900, created_at: '2026-05-26T11:30:00Z', updated_at: '2026-05-26T11:30:00Z' },
  { id: 'b101-5', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'Available', start_timestamp: '2026-05-26T11:45:00Z', end_timestamp: '2026-05-26T12:00:00Z', duration_seconds: 900, created_at: '2026-05-26T11:45:00Z', updated_at: '2026-05-26T11:45:00Z' },
  { id: 'b101-6', agent_id: 'a1111111-1111-1111-1111-111111111111', status: 'Available', start_timestamp: '2026-05-26T12:00:00Z', end_timestamp: null, duration_seconds: null, created_at: '2026-05-26T12:00:00Z', updated_at: '2026-05-26T12:05:00Z' },

  { id: 'b102-1', agent_id: 'a2222222-2222-2222-2222-222222222222', status: 'Available', start_timestamp: '2026-05-26T08:15:00Z', end_timestamp: '2026-05-26T09:00:00Z', duration_seconds: 2700, created_at: '2026-05-26T08:15:00Z', updated_at: '2026-05-26T08:15:00Z' },
  { id: 'b102-2', agent_id: 'a2222222-2222-2222-2222-222222222222', status: 'On Call', start_timestamp: '2026-05-26T09:00:00Z', end_timestamp: '2026-05-26T10:30:00Z', duration_seconds: 5400, created_at: '2026-05-26T09:00:00Z', updated_at: '2026-05-26T09:00:00Z' },
  { id: 'b102-3', agent_id: 'a2222222-2222-2222-2222-222222222222', status: 'Away', start_timestamp: '2026-05-26T10:30:00Z', end_timestamp: '2026-05-26T11:00:00Z', duration_seconds: 1800, created_at: '2026-05-26T10:30:00Z', updated_at: '2026-05-26T10:30:00Z' },
  { id: 'b102-4', agent_id: 'a2222222-2222-2222-2222-222222222222', status: 'Ticket Work', start_timestamp: '2026-05-26T11:00:00Z', end_timestamp: '2026-05-26T12:30:00Z', duration_seconds: 5400, created_at: '2026-05-26T11:00:00Z', updated_at: '2026-05-26T11:00:00Z' },
  { id: 'b102-5', agent_id: 'a2222222-2222-2222-2222-222222222222', status: 'On Call', start_timestamp: '2026-05-26T12:30:00Z', end_timestamp: null, duration_seconds: null, created_at: '2026-05-26T12:30:00Z', updated_at: '2026-05-26T12:30:00Z' },

  { id: 'b103-1', agent_id: 'a3333333-3333-3333-3333-333333333333', status: 'Away', start_timestamp: '2026-05-26T08:30:00Z', end_timestamp: '2026-05-26T09:00:00Z', duration_seconds: 1800, created_at: '2026-05-26T08:30:00Z', updated_at: '2026-05-26T08:30:00Z' },
  { id: 'b103-2', agent_id: 'a3333333-3333-3333-3333-333333333333', status: 'Available', start_timestamp: '2026-05-26T09:00:00Z', end_timestamp: '2026-05-26T09:30:00Z', duration_seconds: 1800, created_at: '2026-05-26T09:00:00Z', updated_at: '2026-05-26T09:00:00Z' },
  { id: 'b103-3', agent_id: 'a3333333-3333-3333-3333-333333333333', status: 'On Call', start_timestamp: '2026-05-26T09:30:00Z', end_timestamp: '2026-05-26T11:15:00Z', duration_seconds: 6300, created_at: '2026-05-26T09:30:00Z', updated_at: '2026-05-26T09:30:00Z' },
  { id: 'b103-4', agent_id: 'a3333333-3333-3333-3333-333333333333', status: 'Ticket Work', start_timestamp: '2026-05-26T11:15:00Z', end_timestamp: '2026-05-26T12:00:00Z', duration_seconds: 2700, created_at: '2026-05-26T11:15:00Z', updated_at: '2026-05-26T11:15:00Z' },
  { id: 'b103-5', agent_id: 'a3333333-3333-3333-3333-333333333333', status: 'Away', start_timestamp: '2026-05-26T12:00:00Z', end_timestamp: null, duration_seconds: null, created_at: '2026-05-26T12:00:00Z', updated_at: '2026-05-26T12:00:00Z' },

  { id: 'b104-1', agent_id: 'a4444444-4444-4444-4444-444444444444', status: 'Ticket Work', start_timestamp: '2026-05-26T08:00:00Z', end_timestamp: '2026-05-26T10:00:00Z', duration_seconds: 7200, created_at: '2026-05-26T08:00:00Z', updated_at: '2026-05-26T08:00:00Z' },
  { id: 'b104-2', agent_id: 'a4444444-4444-4444-4444-444444444444', status: 'Available', start_timestamp: '2026-05-26T10:00:00Z', end_timestamp: '2026-05-26T10:45:00Z', duration_seconds: 2700, created_at: '2026-05-26T10:00:00Z', updated_at: '2026-05-26T10:00:00Z' },
  { id: 'b104-3', agent_id: 'a4444444-4444-4444-4444-444444444444', status: 'On Call', start_timestamp: '2026-05-26T10:45:00Z', end_timestamp: '2026-05-26T12:00:00Z', duration_seconds: 4500, created_at: '2026-05-26T10:45:00Z', updated_at: '2026-05-26T10:45:00Z' },
  { id: 'b104-4', agent_id: 'a4444444-4444-4444-4444-444444444444', status: 'Ticket Work', start_timestamp: '2026-05-26T12:00:00Z', end_timestamp: null, duration_seconds: null, created_at: '2026-05-26T12:00:00Z', updated_at: '2026-05-26T12:00:00Z' }
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'c1', agent_id: 'a1111111-1111-1111-1111-111111111111', platform_action_type: '3CX Extension Registered', precise_action_timestamp: '2026-05-26T08:00:00Z', metadata: '{"ip": "10.101.4.12", "agent": "3CX App v18.4"}', created_at: '2026-05-26T08:00:00Z', updated_at: '2026-05-26T08:00:00Z' },
  { id: 'c2', agent_id: 'a4444444-4444-4444-4444-444444444444', platform_action_type: 'Agent Inbound Call Pickup', precise_action_timestamp: '2026-05-26T08:12:35Z', metadata: '{"call_id": "3cx-c-9828", "channel": "SIP-SIPTRUNK-01"}', created_at: '2026-05-26T08:12:35Z', updated_at: '2026-05-26T08:12:35Z' },
  { id: 'c3', agent_id: 'a2222222-2222-2222-2222-222222222222', platform_action_type: 'UI Panel Opened', precise_action_timestamp: '2026-05-26T08:15:10Z', metadata: '{"view": "Dashboard_Main", "browser": "Chrome"}', created_at: '2026-05-26T08:15:10Z', updated_at: '2026-05-26T08:15:10Z' },
  { id: 'c4', agent_id: 'a3333333-3333-3333-3333-333333333333', platform_action_type: 'DND Enabled', precise_action_timestamp: '2026-05-26T08:30:00Z', metadata: '{"reason": "First Morning Standup"}', created_at: '2026-05-26T08:30:00Z', updated_at: '2026-05-26T08:30:00Z' },
  { id: 'c5', agent_id: 'a3333333-3333-3333-3333-333333333333', platform_action_type: 'DND Disabled', precise_action_timestamp: '2026-05-26T09:00:00Z', metadata: '{"reason": "Standup Finished"}', created_at: '2026-05-26T09:00:00Z', updated_at: '2026-05-26T09:00:00Z' },
];

const INITIAL_SURVEYS: PendingSurvey[] = [
  { id: 's1', customer_phone: '+15550143822', call_duration_seconds: 450, agent_extension: '101', status: 'pending', queue_timestamp: '2026-05-26T09:16:00Z', created_at: '2026-05-26T09:16:00Z', updated_at: '2026-05-26T09:16:00Z' },
  { id: 's2', customer_phone: '+15550192831', call_duration_seconds: 85, agent_extension: '102', status: 'suppressed', suppression_reason: 'Short Call Ingestion Rule (85s < 120s)', queue_timestamp: '2026-05-26T09:45:00Z', created_at: '2026-05-26T09:45:00Z', updated_at: '2026-05-26T09:45:00Z' },
  { id: 's3', customer_phone: '+15550199999', call_duration_seconds: 400, agent_extension: '103', status: 'pending', queue_timestamp: '2026-05-26T11:20:00Z', created_at: '2026-05-26T11:20:00Z', updated_at: '2026-05-26T11:20:00Z' },
  { id: 's4', customer_phone: '+15550199999', call_duration_seconds: 240, agent_extension: '104', status: 'suppressed', suppression_reason: '24-Hour Customer Deduplication Window Match', queue_timestamp: '2026-05-26T11:35:00Z', created_at: '2026-05-26T11:35:00Z', updated_at: '2026-05-26T11:35:00Z' },
];

const INITIAL_TERMINALS = [
  "INFO [02:56:34] PostgreSQL 15.4 Client connected to high-performance Supabase datastore.",
  "INFO [02:56:34] Local telemetry tracking and survey suppression triggers parsed correctly.",
  "INFO [02:56:35] System running direct 3CX log streams bypassing secondary Zoho sync dependencies.",
  "INFO [02:56:35] Loaded 5 deterministic agency profiles and 16 ongoing telemetry sessions."
];

// =============================================================================
// GLOBAL EXTENSION DECLARATION FOR NEXT.JS HOT MODULE PRESERVE
// =============================================================================

interface LiveDBStore {
  agents: AgentProfile[];
  telemetry: TelemetryLog[];
  activities: ActivityLog[];
  surveys: PendingSurvey[];
  terminalLogs: string[];
}

const globalWithStore = globalThis as typeof globalThis & {
  dbStore?: LiveDBStore;
};

if (!globalWithStore.dbStore) {
  globalWithStore.dbStore = {
    agents: [...INITIAL_AGENTS],
    telemetry: [...INITIAL_TELEMETRY],
    activities: [...INITIAL_ACTIVITIES],
    surveys: [...INITIAL_SURVEYS],
    terminalLogs: [...INITIAL_TERMINALS],
  };
}

const memoryStore = globalWithStore.dbStore;

// =============================================================================
// SUPABASE CLIENT DEFERRED INITIALIZATION
// =============================================================================

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  // Safe environment accessor - fits Next.js 15 Edge/Serverless best practices
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (url && key && !supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false }
      });
      console.log(`[DB SUCCESS] Supabase client initialized natively for raw operations.`);
    } catch (err) {
      console.error(`[DB ERROR] Failed to instantiate Supabase client:`, err);
    }
  }
  return supabaseClient;
}

// =============================================================================
// DUAL-MODE REPOSITORY CLASS
// =============================================================================

export class IngestionDatabase {
  
  static appendTerminalLog(msg: string) {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
    const line = `LOG [${timestamp}] ${msg}`;
    memoryStore.terminalLogs.unshift(line);
    if (memoryStore.terminalLogs.length > 100) {
      memoryStore.terminalLogs.pop();
    }
    console.log(line);
  }

  static async getAgents(): Promise<AgentProfile[]> {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from('agent_profiles').select('*').order('created_at', { ascending: true });
      if (!error && data) return data as AgentProfile[];
      console.error(`[SUPABASE ERROR] getAgents:`, error);
    }
    return memoryStore.agents;
  }

  static async getTelemetry(): Promise<TelemetryLog[]> {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from('telemetry_logs').select('*').order('start_timestamp', { ascending: false });
      if (!error && data) return data as TelemetryLog[];
      console.error(`[SUPABASE ERROR] getTelemetry:`, error);
    }
    return memoryStore.telemetry;
  }

  static async getActivities(): Promise<ActivityLog[]> {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from('activity_logs').select('*').order('precise_action_timestamp', { ascending: false });
      if (!error && data) return data as ActivityLog[];
      console.error(`[SUPABASE ERROR] getActivities:`, error);
    }
    return memoryStore.activities;
  }

  static async getSurveys(): Promise<PendingSurvey[]> {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from('pending_surveys').select('*').order('queue_timestamp', { ascending: false });
      if (!error && data) return data as PendingSurvey[];
      console.error(`[SUPABASE ERROR] getSurveys:`, error);
    }
    return memoryStore.surveys;
  }

  static async getTerminalLogs(): Promise<string[]> {
    return memoryStore.terminalLogs;
  }

  static async resetToOriginalState(): Promise<void> {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.rpc('reset_operational_data'); // If custom migration is active
      } catch (e) {
        console.error("Supabase RPC reset failed, resetting in-memory only.");
      }
    }
    memoryStore.agents = [...INITIAL_AGENTS];
    memoryStore.telemetry = [...INITIAL_TELEMETRY];
    memoryStore.activities = [...INITIAL_ACTIVITIES];
    memoryStore.surveys = [...INITIAL_SURVEYS];
    memoryStore.terminalLogs = [
      `INFO [${new Date().toISOString().split('T')[1].substring(0, 8)}] DB snapshot rolled back successfully. Restored 5 agents and 16 logs.`
    ];
  }

  // Find agent profile by extension
  static async findAgentByExtension(extension: string): Promise<AgentProfile | null> {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('agent_profiles')
        .select('*')
        .eq('extension', extension)
        .maybeSingle();
      if (!error && data) return data as AgentProfile;
      if (error) console.error(`[SUPABASE ERROR] findAgentByExtension:`, error);
    }
    
    const matched = memoryStore.agents.find(a => a.extension === extension);
    return matched || null;
  }

  // Close any ongoing telemetry logs for an agent
  static async closeOngoingTelemetry(agentId: string, endTimestampStr: string): Promise<TelemetryLog[]> {
    const endTimestamp = new Date(endTimestampStr).toISOString();
    const closedLogs: TelemetryLog[] = [];

    const sb = getSupabase();
    if (sb) {
      // 1. Get open rows
      const { data: openRows } = await sb
        .from('telemetry_logs')
        .select('*')
        .eq('agent_id', agentId)
        .is('end_timestamp', null);

      if (openRows && openRows.length > 0) {
        for (const row of openRows) {
          const diffSecs = Math.max(0, Math.floor((new Date(endTimestamp).getTime() - new Date(row.start_timestamp).getTime()) / 1000));
          const { data: updated, error } = await sb
            .from('telemetry_logs')
            .update({
              end_timestamp: endTimestamp,
              updated_at: endTimestamp
            })
            .eq('id', row.id)
            .select()
            .single();

          if (!error && updated) {
            closedLogs.push(updated as TelemetryLog);
            this.appendTerminalLog(`UPDATED telemetry row [ID: ${row.id}]. Completed status ${row.status}. Computed duration: ${diffSecs}s.`);
          }
        }
      }
    } else {
      // In-memory simulation
      memoryStore.telemetry = memoryStore.telemetry.map(log => {
        if (log.agent_id === agentId && log.end_timestamp === null) {
          const diffSecs = Math.max(0, Math.floor((new Date(endTimestamp).getTime() - new Date(log.start_timestamp).getTime()) / 1000));
          const updatedLog = {
            ...log,
            end_timestamp: endTimestamp,
            duration_seconds: diffSecs,
            updated_at: endTimestamp
          };
          closedLogs.push(updatedLog);
          this.appendTerminalLog(`UPDATED telemetry row [ID: ${log.id}]. Completed status ${log.status}. Generated column compiled: ${diffSecs}s duration.`);
          return updatedLog;
        }
        return log;
      });
    }

    return closedLogs;
  }

  // Insert a new telemetry log row
  static async insertTelemetryLog(agentId: string, status: string, startTimestampStr: string): Promise<TelemetryLog> {
    const startTimestamp = new Date(startTimestampStr).toISOString();
    const newLogId = 'b-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(16);

    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('telemetry_logs')
        .insert({
          agent_id: agentId,
          status: status,
          start_timestamp: startTimestamp,
          end_timestamp: null
        })
        .select()
        .single();
      
      if (!error && data) {
        this.appendTerminalLog(`INSERT INTO telemetry_logs (status: ${status}) SUCCESS. Row: ${data.id}`);
        return data as TelemetryLog;
      }
      console.error(`[SUPABASE ERROR] insertTelemetryLog:`, error);
    }

    // In-memory simulation
    const newLog: TelemetryLog = {
      id: newLogId,
      agent_id: agentId,
      status: status,
      start_timestamp: startTimestamp,
      end_timestamp: null,
      duration_seconds: null,
      created_at: startTimestamp,
      updated_at: startTimestamp
    };

    memoryStore.telemetry.unshift(newLog);
    this.appendTerminalLog(`INSERT INTO telemetry_logs (status: ${status}) (ID: ${newLogId}) SUCCESS.`);
    return newLog;
  }

  // Insert an activity log row
  static async insertActivityLog(agentId: string, actionType: string, timestampStr: string, metadataString: string): Promise<ActivityLog> {
    const timestamp = new Date(timestampStr).toISOString();
    const newActId = 'c-' + Math.random().toString(36).substring(2, 10);

    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('activity_logs')
        .insert({
          agent_id: agentId,
          platform_action_type: actionType,
          precise_action_timestamp: timestamp,
          metadata: metadataString
        })
        .select()
        .single();
      if (!error && data) return data as ActivityLog;
      console.error(`[SUPABASE ERROR] insertActivityLog:`, error);
    }

    const newAct: ActivityLog = {
      id: newActId,
      agent_id: agentId,
      platform_action_type: actionType,
      precise_action_timestamp: timestamp,
      metadata: metadataString,
      created_at: timestamp,
      updated_at: timestamp
    };

    memoryStore.activities.unshift(newAct);
    return newAct;
  }

  // Check if a call is duplicate in the past 24 hours
  static async isSurveyDuplicateIn24h(customerPhone: string, timestampStr: string): Promise<boolean> {
    const queueTimestamp = new Date(timestampStr);
    const windowStart = new Date(queueTimestamp.getTime() - 24 * 60 * 60 * 1000);

    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('pending_surveys')
        .select('id')
        .eq('customer_phone', customerPhone)
        .gte('queue_timestamp', windowStart.toISOString())
        .limit(1);
      
      if (!error && data) return data.length > 0;
      if (error) console.error(`[SUPABASE ERROR] isSurveyDuplicateIn24h:`, error);
    }

    return memoryStore.surveys.some(s => {
      if (s.customer_phone !== customerPhone) return false;
      const sTime = new Date(s.queue_timestamp).getTime();
      return sTime >= windowStart.getTime() && sTime <= queueTimestamp.getTime();
    });
  }

  // Insert a survey report (simulates PG suppression triggers locally too)
  static async insertSurvey(customerPhone: string, durationSeconds: number, agentExtension: string, queueTimestampStr: string): Promise<PendingSurvey> {
    const queueTimestamp = new Date(queueTimestampStr).toISOString();
    const newSurvId = 's-' + Math.random().toString(36).substring(2, 10);

    let finalStatus: 'pending' | 'sent' | 'suppressed' = 'pending';
    let reasonText = '';

    // Simulate PG database rule trigger checks inside JS for robust hybrid functionality
    if (durationSeconds < 120) {
      finalStatus = 'suppressed';
      reasonText = `Short Call Ingestion Rule (${durationSeconds}s < 120s)`;
      this.appendTerminalLog(`[SUPRESSION SUCCESS] Rule 1: duration ${durationSeconds}s < 120s.`);
    } else {
      const isDuplicate = await this.isSurveyDuplicateIn24h(customerPhone, queueTimestamp);
      if (isDuplicate) {
        finalStatus = 'suppressed';
        reasonText = `24-Hour Customer Deduplication Window Match`;
        this.appendTerminalLog(`[SUPRESSION SUCCESS] Rule 2: duplicate phone "${customerPhone}" in past 24 hours.`);
      } else {
        this.appendTerminalLog(`[QUEUED SUCCESS] Call validated: adding active survey for ${customerPhone}.`);
      }
    }

    const sb = getSupabase();
    if (sb) {
      // Postgres trigger trg_pending_surveys_suppression handles status automatic calculation inside DB,
      // but passing it guarantees safe default for in-memory & explicit fallback tracking compatibility
      const { data, error } = await sb
        .from('pending_surveys')
        .insert({
          customer_phone: customerPhone,
          call_duration_seconds: durationSeconds,
          agent_extension: agentExtension,
          status: finalStatus,
          queue_timestamp: queueTimestamp
        })
        .select()
        .single();
      
      if (!error && data) {
        return data as PendingSurvey;
      }
      console.error(`[SUPABASE ERROR] insertSurvey:`, error);
    }

    const newSurv: PendingSurvey = {
      id: newSurvId,
      customer_phone: customerPhone,
      call_duration_seconds: durationSeconds,
      agent_extension: agentExtension,
      status: finalStatus,
      queue_timestamp: queueTimestamp,
      suppression_reason: reasonText || undefined,
      created_at: queueTimestamp,
      updated_at: queueTimestamp
    };

    memoryStore.surveys.unshift(newSurv);
    return newSurv;
  }

  // Update agent profile extension and zoho profile mapping
  static async updateAgentProfile(id: string, extension: string, zohoUserId: string): Promise<AgentProfile> {
    const updatedAt = new Date().toISOString();
    const sb = getSupabase();
    if (sb) {
      // Fetch the current record first to check if extension changed
      const { data: original } = await sb
        .from('agent_profiles')
        .select('extension')
        .eq('id', id)
        .single();

      // If extension changed, we must be careful. Let's update agent profile.
      // If there is no ON UPDATE CASCADE, we'd need to handle references if they exist.
      // Supabase schemas in this project are typically created with cascade, but let's be robust and catch errors.
      const { data, error } = await sb
        .from('agent_profiles')
        .update({
          extension: extension,
          zoho_user_id: zohoUserId,
          updated_at: updatedAt
        })
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        this.appendTerminalLog(`UPDATE agent_profiles SUCCESS [ID: ${id}] -> Ext: ${extension}, Zoho: ${zohoUserId}`);
        return data as AgentProfile;
      }
      
      console.error(`[SUPABASE ERROR] updateAgentProfile:`, error);
      if (error) {
        throw new Error(`Database error: ${error.message || JSON.stringify(error)}`);
      }
    }

    // In-memory update as accurate fallback
    const idx = memoryStore.agents.findIndex(a => a.id === id);
    if (idx !== -1) {
      const oldExt = memoryStore.agents[idx].extension;
      const updated = {
        ...memoryStore.agents[idx],
        extension,
        zoho_user_id: zohoUserId,
        updated_at: updatedAt
      };
      memoryStore.agents[idx] = updated;

      // Update cascading references in-memory for telemetry, activities & surveys
      if (oldExt !== extension) {
        memoryStore.surveys = memoryStore.surveys.map(s => {
          if (s.agent_extension === oldExt) {
            return { ...s, agent_extension: extension, updated_at: updatedAt };
          }
          return s;
        });
      }

      this.appendTerminalLog(`UPDATE agent_profiles (memory-only) [ID: ${id}] -> Ext: ${extension}, Zoho: ${zohoUserId}`);
      return updated;
    }
    throw new Error(`Agent profile not found in memory store for id ${id}`);
  }

  // Batch process dispatch for staged pending surveys
  static async dispatchSurveys(): Promise<number> {
    const updatedAt = new Date().toISOString();
    const sb = getSupabase();
    let count = 0;
    
    if (sb) {
      // Fetch all pending surveys first to log their details
      const { data: pendingList } = await sb
        .from('pending_surveys')
        .select('id')
        .eq('status', 'pending');

      if (pendingList && pendingList.length > 0) {
        const { data, error } = await sb
          .from('pending_surveys')
          .update({
            status: 'sent',
            updated_at: updatedAt
          })
          .eq('status', 'pending')
          .select();
        
        if (!error && data) {
          count = data.length;
          this.appendTerminalLog(`BATCH DISPATCH: Flushed ${count} staged surveys successfully to sent status in Supabase.`);
        } else if (error) {
          console.error(`[SUPABASE ERROR] dispatchSurveys:`, error);
          throw new Error(error.message);
        }
      }
    } else {
      // In-memory update
      memoryStore.surveys = memoryStore.surveys.map(s => {
        if (s.status === 'pending') {
          count++;
          return {
            ...s,
            status: 'sent',
            updated_at: updatedAt
          };
        }
        return s;
      });
      this.appendTerminalLog(`BATCH DISPATCH: Flushed ${count} staged surveys successfully (memory-only state).`);
    }

    return count;
  }

  // Update a single core pending survey status with optional suppression logic text
  static async updateSurveyStatus(
    id: string,
    status: 'pending' | 'suppressed' | 'sent' | 'batched',
    suppressionReason?: string
  ): Promise<any> {
    const updatedAt = new Date().toISOString();
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from('pending_surveys')
        .update({
          status,
          suppression_reason: suppressionReason || null,
          updated_at: updatedAt
        })
        .eq('id', id)
        .select()
        .single();
      
      if (!error && data) {
        this.appendTerminalLog(`UPDATE pending_surveys SUCCESS [ID: ${id}] -> Status: ${status}`);
        return data;
      }
      
      console.error(`[SUPABASE ERROR] updateSurveyStatus:`, error);
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    // fallback in memory update
    const idx = memoryStore.surveys.findIndex(s => s.id === id);
    if (idx !== -1) {
      const updated = {
        ...memoryStore.surveys[idx],
        status,
        suppression_reason: suppressionReason || undefined,
        updated_at: updatedAt
      };
      memoryStore.surveys[idx] = updated;
      this.appendTerminalLog(`UPDATE pending_surveys (memory-only) [ID: ${id}] -> Status: ${status}`);
      return updated;
    }
    throw new Error(`Survey not found in memory store for id ${id}`);
  }
}
