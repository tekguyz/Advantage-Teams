import { z } from 'zod';

// =============================================================================
// TYPES MATCHING POSTGRES RELATIONAL SCHEMA EXACTLY
// =============================================================================

export interface AgentProfile {
  id: string;
  extension: string;
  zoho_user_id: string;
  agent_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TelemetryLog {
  id: string;
  agent_id: string;
  status: string;
  start_timestamp: string;
  end_timestamp: string | null;
  duration_seconds: number | null; // STORED Generated Column behavior
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  agent_id: string;
  platform_action_type: string;
  precise_action_timestamp: string;
  metadata: string;
  created_at: string;
  updated_at: string;
}

export interface PendingSurvey {
  id: string;
  customer_phone: string;
  call_duration_seconds: number;
  agent_extension: string;
  status: 'pending' | 'sent' | 'suppressed' | 'batched';
  queue_timestamp: string;
  suppression_reason?: string; 
  created_at: string;
  updated_at: string;
}

// =============================================================================
// ZOD RUNTIME INGESTION VALIDATION SCHEMAS (Anti-mutation & safety check)
// =============================================================================

export const TelemetryIngestSchema = z.object({
  agent_extension: z.string().trim().min(1, "agent_extension is required"),
  status_state: z.string().trim().min(2, "status_state must be at least 2 characters long"),
  timestamp: z.string().trim().optional(),
});

export const CallIngestSchema = z.object({
  customer_phone: z.string().trim().min(5, "customer_phone must be at least 5 characters long"),
  duration_seconds: z.coerce.number().nonnegative("duration_seconds cannot be negative"),
  agent_extension: z.string().trim().min(1, "agent_extension is required"),
});

export type TelemetryIngestInput = z.infer<typeof TelemetryIngestSchema>;
export type CallIngestInput = z.infer<typeof CallIngestSchema>;
