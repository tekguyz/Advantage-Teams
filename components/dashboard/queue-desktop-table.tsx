// components/dashboard/queue-desktop-table.tsx
'use client';

import React from 'react';
import { Phone, User, CheckCircle, XCircle } from 'lucide-react';
import { PendingSurvey, AgentProfile } from '@/types/types-ingestion';
import { formatDuration, formatTime, getAgentName } from './queue-helpers';

interface QueueDesktopTableProps {
  surveys: PendingSurvey[];
  agents: AgentProfile[];
}

export function QueueDesktopTable({ surveys, agents }: QueueDesktopTableProps) {
  return (
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
                    <span className="font-semibold text-[#172b4d] truncate max-w-[130px]" title={getAgentName(survey.agent_extension, agents)}>
                      {getAgentName(survey.agent_extension, agents)}
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
  );
}
