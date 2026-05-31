// components/dashboard/exception-mobile-cards.tsx
'use client';

import React from 'react';
import { AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { AuditRecord } from './exception-table';

interface ExceptionMobileCardsProps {
  displayedRecords: AuditRecord[];
  isAuditingAgentId: string | null;
  onReRunAudit: (agentId: string) => void;
}

export function ExceptionMobileCards({
  displayedRecords,
  isAuditingAgentId,
  onReRunAudit,
}: ExceptionMobileCardsProps) {
  return (
    <div className="block md:hidden p-4 space-y-3.5 bg-[#f4f5f7]/30 border-t border-[#dfe1e6]">
      {displayedRecords.map((rec) => {
        const isUnder40 = rec.productivityScore < 40;
        return (
          <div 
            key={rec.agentId}
            className={`p-4 border rounded-[4px] shadow-xs text-left leading-normal flex flex-col ${
              isUnder40 
                ? 'bg-[#ffebe6]/15 hover:bg-[#ffebe6]/30 border-[#ff5630]/35' 
                : 'bg-white hover:bg-[#f4f5f7]/40 border-[#dfe1e6]'
            } transition-colors duration-150`}
          >
            <div className="flex items-center justify-between border-b border-[#dfe1e6]/40 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                {isUnder40 && (
                  <div className="w-[4px] h-[22px] bg-[#ff5630] rounded-sm shrink-0" title="Low Productivity Leak Alert" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#172b4d] text-sm truncate">{rec.agentName}</span>
                  <span className="text-[10px] text-[#5e6c84] font-mono leading-none mt-0.5">Ext. {rec.agentExtension}</span>
                </div>
              </div>
              {isUnder40 && (
                <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-extrabold uppercase tracking-wider bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad] flex items-center gap-1 select-none animate-pulse">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  ALERT
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-3">
              <div className="bg-[#f4f5f7]/30 border border-[#dfe1e6]/40 rounded-[3px] p-2 text-left">
                <span className="text-[9px] font-bold text-[#5e6c84] uppercase tracking-wider block font-sans mb-0.5">Ticket Duration</span>
                <span className="text-[12px] font-extrabold font-mono text-[#42526e]">{rec.ticketWorkDurationMinutes} min</span>
              </div>
              <div className="bg-[#f4f5f7]/30 border border-[#dfe1e6]/40 rounded-[3px] p-2 text-left">
                <span className="text-[9px] font-bold text-[#5e6c84] uppercase tracking-wider block font-sans mb-0.5">System Action</span>
                <span className="text-[12px] font-extrabold font-mono text-brand-primary">{rec.systemActionCount} events</span>
              </div>
            </div>

            <div className="space-y-2 mb-3 text-left">
              <div>
                <span className="text-[9px] font-bold text-[#5e6c84] uppercase tracking-wider block">Last Activity Trace</span>
                <div className="text-[11.5px] text-[#172b4d] font-sans leading-snug font-medium mt-0.5 max-w-full break-words">
                  {rec.systemActionCount > 0 ? (
                    <span>{rec.lastVerifiedActionSummary}</span>
                  ) : (
                    <span className="text-[#bf2600] font-mono font-bold">NO_ACTIVITY_TRACE</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[#5e6c84] uppercase tracking-wider block">Manager Insight</span>
                <p className="text-[11.5px] text-[#42526e] italic mt-0.5 leading-relaxed bg-[#f4f5f7]/20 p-2 border border-[#dfe1e6]/30 rounded-[3px] break-words">
                  &ldquo;{rec.managerInsight}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#dfe1e6]/40">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-bold text-[#5e6c84] uppercase font-sans">AI Score:</span>
                <span className={`px-2 h-[24px] inline-flex items-center rounded-[3px] text-[10px] font-extrabold font-mono tracking-wide ${
                  rec.productivityScore >= 75 
                    ? 'bg-[#e3fcef] text-[#36b37e] border border-[#abf5d1]' 
                    : rec.productivityScore >= 40 
                    ? 'bg-[#fff0b3] text-[#bf8e00] border border-[#ffe380]' 
                    : 'bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad] font-extrabold'
                }`}>
                  {rec.productivityScore}%
                </span>
              </div>

              <button
                onClick={() => onReRunAudit(rec.agentId)}
                disabled={isAuditingAgentId !== null}
                className="h-[28px] px-3.5 rounded-[3px] bg-[#f4f5f7] hover:bg-[#ebecf0] border border-[#dfe1e6] text-[#42526e] hover:text-[#0052cc] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[10.5px] font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-3xs"
                title="Re-run Gemini Productivity Audit"
              >
                {isAuditingAgentId === rec.agentId ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-[#0052cc]" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-[#42526e] stroke-none" />
                    <span>Run Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
