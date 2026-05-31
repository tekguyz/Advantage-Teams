// components/dashboard/exception-desktop-table.tsx
'use client';

import React from 'react';
import { AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { AuditRecord } from './exception-table';

interface ExceptionDesktopTableProps {
  displayedRecords: AuditRecord[];
  isAuditingAgentId: string | null;
  onReRunAudit: (agentId: string) => void;
}

export function ExceptionDesktopTable({
  displayedRecords,
  isAuditingAgentId,
  onReRunAudit,
}: ExceptionDesktopTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      {/* High-density Tabular Grid with hover background highlights */}
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[9.5px] text-[#5e6c84] uppercase font-mono tracking-wider">
            <th className="py-2.5 px-4 font-bold border-r border-[#dfe1e6]/40">Technician Identity</th>
            <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40">&quot;Ticket Work&quot; Duration</th>
            <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40">System Action Count</th>
            <th className="py-2.5 px-3 font-bold border-r border-[#dfe1e6]/40">Last Verified Action Summary</th>
            <th className="py-2.5 text-center px-3 font-bold border-r border-[#dfe1e6]/40 w-[120px]">AI Productivity Score</th>
            <th className="py-2.5 px-4 font-bold">Automated Manager Insight</th>
            <th className="py-2.5 px-3 text-center font-bold font-mono">Run</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dfe1e6] text-[11px] font-sans">
          {displayedRecords.map((rec) => {
            const isUnder40 = rec.productivityScore < 40;
            return (
              <tr 
                key={rec.agentId} 
                className={`group transition-colors h-[42px] cursor-default ${
                  isUnder40 
                    ? 'bg-[#ffebe6]/15 hover:bg-[#ffebe6]/40' 
                    : 'hover:bg-[#f4f5f7]/50'
                }`}
              >
                
                {/* Technician Identity */}
                <td className="py-2 px-4 border-r border-[#dfe1e6]/40 font-medium">
                  <div className="flex items-center gap-2">
                    {/* Red warning border indicator tag for absolute leak flagging (Under 40) */}
                    {isUnder40 && (
                      <div className="w-[4px] h-[22px] bg-[#ff5630] rounded-sm shrink-0" title="Low Productivity Leak Alert" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-[#172b4d] truncate max-w-[140px] block">
                        {rec.agentName}
                      </span>
                      <span className="text-[9.5px] text-[#5e6c84] font-mono leading-none">
                        Ext. {rec.agentExtension}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Ticket Work Duration */}
                <td className="py-2 px-3 border-r border-[#dfe1e6]/40 font-mono text-left font-bold text-[#42526e]">
                  {rec.ticketWorkDurationMinutes} min
                </td>

                {/* System Action Count */}
                <td className="py-2 px-3 border-r border-[#dfe1e6]/40 font-mono text-left text-brand-primary">
                  {rec.systemActionCount} events
                </td>

                {/* Last Verified Action Summary */}
                <td className="py-2 px-3 border-r border-[#dfe1e6]/40 text-[#172b4d] font-sans leading-tight">
                  {rec.systemActionCount > 0 ? (
                    <span className="line-clamp-2 max-w-[200px]" title={rec.lastVerifiedActionSummary}>
                      {rec.lastVerifiedActionSummary}
                    </span>
                  ) : (
                    <span className="text-[#bf2600] font-mono font-semibold" title="No matching events found during sliding active interval">
                      NO_ACTIVITY_TRACE
                    </span>
                  )}
                </td>

                {/* AI Productivity Score */}
                <td className="py-2 px-3 border-r border-[#dfe1e6]/40 text-center">
                  <div className="flex items-center justify-center">
                    <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold font-mono tracking-wide flex items-center gap-1 ${
                      rec.productivityScore >= 75 
                        ? 'bg-[#e3fcef] text-[#36b37e] border border-[#abf5d1]' 
                        : rec.productivityScore >= 40 
                        ? 'bg-[#fff0b3] text-[#bf8e00] border border-[#ffe380]' 
                        : 'bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad] font-extrabold'
                    }`}>
                      {isUnder40 && <AlertTriangle className="w-3 h-3 animate-bounce shrink-0" />}
                      {rec.productivityScore}%
                    </span>
                  </div>
                </td>

                {/* Automated Manager Insight */}
                <td className="py-2 px-4 text-[#42526e] font-sans leading-normal italic text-xs max-w-[320px] truncate-none">
                  <div className="line-clamp-2 text-left" title={rec.managerInsight}>
                    &ldquo;{rec.managerInsight}&rdquo;
                  </div>
                </td>

                {/* Execute Action */}
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => onReRunAudit(rec.agentId)}
                    disabled={isAuditingAgentId !== null}
                    className="p-1.5 rounded-[3px] bg-[#f4f5f7] hover:bg-[#ebecf0] border border-[#dfe1e6] hover:border-[#b2d4ff] text-[#42526e] hover:text-[#0052cc] transition-all cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed mx-auto"
                    title="Re-run Gemini Productivity Audit"
                  >
                    {isAuditingAgentId === rec.agentId ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0052cc]" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-[#42526e] stroke-none group-hover:fill-[#0052cc]" />
                    )}
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
