'use client';

import React from 'react';
import { PendingSurvey, AgentProfile } from '@/types/types-ingestion';
import { 
  Clock, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Filter, 
  User, 
  Phone, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

export interface QueueMonitorTableProps {
  surveys: PendingSurvey[];
  agents: AgentProfile[];
}

export function QueueMonitorTable({ surveys, agents }: QueueMonitorTableProps) {
  // Map agent name from extension
  const getAgentName = (ext: string) => {
    const ag = agents.find(a => a.extension === ext);
    return ag ? ag.agent_name : `Ext. ${ext}`;
  };

  // Helper to format duration
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Helper to format ISO time in readable form
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div 
      id="queue-monitor-container" 
      className="border border-[#dfe1e6] bg-white rounded-[4px] relative overflow-hidden flex flex-col h-full text-left"
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0052cc]" />

      {/* Header and Controller Subheader */}
      <div className="pt-4 pb-3 px-4 border-b border-[#dfe1e6] bg-[#fafbfc] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-bold text-[#172b4d] uppercase tracking-wide flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Outbound Survey Queue Ledger (8:00 PM Run)
          </h3>
          <p className="text-[11.5px] text-[#5e6c84] leading-relaxed mt-0.5 font-sans">
            Continuous staging buffer collecting customer calls matching 3CX desk status timelines.
          </p>
        </div>

        {/* Counter ribbons */}
        <div className="flex items-center gap-2 text-[10.5px]">
          <span className="px-2 py-0.5 rounded-[3px] bg-[#e3fcef] text-[#36b37e] border border-[#abf5d1] font-semibold font-mono">
            Staged: {surveys.filter(s => s.status === 'pending').length}
          </span>
          <span className="px-2 py-0.5 rounded-[3px] bg-[#ebecf0] text-[#5e6c84] border border-[#dfe1e6] font-semibold font-mono">
            Suppressed: {surveys.filter(s => s.status === 'suppressed').length}
          </span>
        </div>
      </div>

      {surveys.length === 0 ? (
        <div id="survey-fallback-empty" className="py-16 px-8 text-center flex flex-col items-center justify-center gap-3 bg-white min-h-[300px]">
          <div className="w-[48px] h-[48px] rounded-full bg-[#f4f5f7] flex items-center justify-center text-[#97a0af]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[12.5px] font-bold text-[#172b4d] uppercase font-sans">No Outbound Survey Records</h4>
            <p className="text-[11.5px] text-[#5e6c84] max-w-[380px] leading-relaxed mt-1 font-sans">
              No workstation logs fit the ingestion parameters. Triggers require live 3CX call simulations to populate.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Flex Card Grid Stack: visible only below md viewport */}
          <div className="block md:hidden p-4 space-y-3.5 bg-[#f4f5f7]/30 border-t border-[#dfe1e6]">
            {surveys.map((survey) => {
              const isPending = survey.status === 'pending';
              const isSuppressed = survey.status === 'suppressed';
              const isSent = survey.status === 'sent';

              return (
                <div 
                  key={survey.id}
                  className={`p-4 border rounded-[4px] shadow-xs text-left leading-normal flex flex-col ${
                    isSuppressed 
                      ? 'bg-[#f4f5f7]/30 border-[#dfe1e6]' 
                      : 'bg-white border-[#dfe1e6]'
                  } transition-colors duration-150`}
                >
                  <div className="flex flex-col gap-2 border-b border-[#dfe1e6]/45 pb-3 mb-3">
                    <div className="flex items-center justify-between text-[11.5px] font-sans">
                      <span className="font-bold text-[#5e6c84] uppercase tracking-wider text-[9px] block">Customer Phone</span>
                      <div className="flex items-center gap-1.5 font-mono text-[#172b4d] font-semibold">
                        <Phone className="w-3.5 h-3.5 text-[#5e6c84] shrink-0" />
                        <span>{survey.customer_phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11.5px] font-sans">
                      <span className="font-bold text-[#5e6c84] uppercase tracking-wider text-[9px] block">Representative Agent</span>
                      <div className="flex items-center gap-1.5 font-semibold text-[#172b4d]">
                        <User className="w-3.5 h-3.5 text-[#5e6c84]/80 shrink-0" />
                        <span className="truncate max-w-[150px]">{getAgentName(survey.agent_extension)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11.5px] font-sans">
                      <span className="font-bold text-[#5e6c84] uppercase tracking-wider text-[9px] block">Call Duration</span>
                      <div className="flex items-center gap-1.5 font-mono text-[#42526e] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#5e6c84] shrink-0" />
                        <span>{formatDuration(survey.call_duration_seconds)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 text-left">
                    <span className="font-bold text-[#5e6c84] uppercase tracking-wider text-[9px] block mb-1">Suppression Logic / Dispatch Summary</span>
                    {isPending && (
                      <span className="text-[#36b37e] font-medium flex items-center gap-1.5 text-xs bg-[#e3fcef]/40 p-2 border border-[#abf5d1]/40 rounded-sm">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        Meets all criteria. Scheduled for release.
                      </span>
                    )}
                    {isSent && (
                      <span className="text-[#0747a6] font-medium flex items-center gap-1.5 text-xs bg-[#deebff]/40 p-2 border border-[#b2d4ff]/40 rounded-sm w-full">
                        <CheckCircle className="w-3.5 h-3.5 text-[#0747a6] shrink-0 animate-pulse" />
                        Handed off natively to downstream outbound SMS/Email gateway.
                      </span>
                    )}
                    {isSuppressed && (
                      <div className="text-[#bf2600] font-sans flex items-start gap-1.5 font-medium bg-[#ffebe6]/60 p-2 rounded-sm border border-[#ffbdad]/40 text-xs text-left">
                        <XCircle className="w-3.5 h-3.5 text-[#ff5630] shrink-0 mt-0.5" />
                        <span>{survey.suppression_reason || 'Filtered out by automated gating logic.'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#dfe1e6]/45 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#5e6c84] uppercase tracking-wider text-[9px]">Status:</span>
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#e3fcef] text-[#36b37e] border border-[#abf5d1] uppercase whitespace-nowrap">
                          Active Staged
                        </span>
                      )}
                      {isSuppressed && (
                        <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#ebecf0] text-[#5e6c84] border border-[#dfe1e6] uppercase whitespace-nowrap">
                          Suppressed
                        </span>
                      )}
                      {isSent && (
                        <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#deebff] text-[#0747a6] border border-[#b2d4ff] uppercase whitespace-nowrap">
                          Dispatched
                        </span>
                      )}
                    </div>

                    <div className="text-right font-mono text-[#5e6c84] text-[10.5px]">
                      {formatTime(survey.queue_timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Tabular Grid: hidden on mobile below md viewport */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-[11px]">
              <thead>
                <tr className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[9.5px] text-[#5e6c84] uppercase font-mono tracking-wider">
                  <th className="py-2.5 px-4 font-bold border-r border-[#dfe1e6]/40">Customer Phone</th>
                  <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40">Representative Agent</th>
                  <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40">Call Duration</th>
                  <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40 text-center">Batch Status</th>
                  <th className="py-2.5 px-4 font-bold">Suppression Logic / Dispatch Summary</th>
                  <th className="py-2.5 px-3 text-right">Inflow Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe1e6]">
                {surveys.map((survey) => {
                  const isPending = survey.status === 'pending';
                  const isSuppressed = survey.status === 'suppressed';
                  const isSent = survey.status === 'sent';

                  return (
                    <tr 
                      key={survey.id} 
                      className={`transition-colors h-[42px] hover:bg-[#fafbfc] ${
                        isSuppressed ? 'bg-[#f4f5f7]/30 text-text-muted' : 'bg-white'
                      }`}
                    >
                      {/* Customer Phone */}
                      <td className="py-2 px-4 border-r border-[#dfe1e6]/40 font-mono font-medium text-text-primary">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-[#5e6c84] shrink-0" />
                          <span>{survey.customer_phone}</span>
                        </div>
                      </td>

                      {/* Agent name */}
                      <td className="py-2 px-3 border-r border-[#dfe1e6]/40 font-sans">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-[#5e6c84]/80 shrink-0" />
                          <span className="font-semibold text-[#172b4d] truncate max-w-[130px]" title={getAgentName(survey.agent_extension)}>
                            {getAgentName(survey.agent_extension)}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-2 px-3 border-r border-[#dfe1e6]/40 font-mono text-left">
                        {formatDuration(survey.call_duration_seconds)}
                      </td>

                      {/* Batch Status */}
                      <td className="py-2 px-3 border-r border-[#dfe1e6]/40 text-center">
                        <div className="flex justify-center">
                          {isPending && (
                            <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#e3fcef] text-[#36b37e] border border-[#abf5d1] uppercase whitespace-nowrap">
                              Active Staged
                            </span>
                          )}
                          {isSuppressed && (
                            <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#ebecf0] text-[#5e6c84] border border-[#dfe1e6] uppercase whitespace-nowrap">
                              Suppressed
                            </span>
                          )}
                          {isSent && (
                            <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold bg-[#deebff] text-[#0747a6] border border-[#b2d4ff] uppercase whitespace-nowrap">
                              Dispatched
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Suppression Logic description */}
                      <td className="py-2 px-4 font-sans text-xs">
                        {isPending && (
                          <span className="text-[#36b37e] font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            Meets all criteria. Scheduled for release.
                          </span>
                        )}
                        {isSent && (
                          <span className="text-[#0747a6] font-medium flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-[#0747a6] shrink-0" />
                            Handed off natively to downstream outbound SMS/Email gateway.
                          </span>
                        )}
                        {isSuppressed && (
                          <div className="text-[#bf2600] font-sans flex items-start gap-1 font-medium bg-[#ffebe6]/60 p-1.5 rounded-sm border border-[#ffbdad]/40">
                            <XCircle className="w-3.5 h-3.5 text-[#ff5630] shrink-0 mt-0.5" />
                            <span>{survey.suppression_reason || 'Filtered out by automated gating logic.'}</span>
                          </div>
                        )}
                      </td>

                      {/* Queue Time */}
                      <td className="py-2 px-3 text-right font-mono text-[#5e6c84] whitespace-nowrap">
                        {formatTime(survey.queue_timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
