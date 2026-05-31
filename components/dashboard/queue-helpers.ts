// components/dashboard/queue-helpers.ts
import { AgentProfile } from '@/types/types-ingestion';

// Helper to format duration
export const formatDuration = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
};

// Helper to format ISO time in readable form
export const formatTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
};

// Map agent name from extension
export const getAgentName = (ext: string, agents: AgentProfile[]): string => {
  const ag = agents.find(a => a.extension === ext);
  return ag ? ag.agent_name : `Ext. ${ext}`;
};
