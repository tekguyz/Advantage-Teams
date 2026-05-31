// components/dashboard/queue-mobile-cards.tsx
'use client';

import React from 'react';
import { Phone, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PendingSurvey, AgentProfile } from '@/types/types-ingestion';
import { formatDuration, formatTime, getAgentName } from './queue-helpers';

interface QueueMobileCardsProps {
  surveys: PendingSurvey[];
  agents: AgentProfile[];
}

export function QueueMobileCards({ surveys, agents }: QueueMobileCardsProps) {
  return (
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
                  <span className="truncate max-w-[150px]">{getAgentName(survey.agent_extension, agents)}</span>
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
  );
}
