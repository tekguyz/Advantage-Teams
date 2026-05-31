'use client';

import React from 'react';
import { CheckCircle2, User, Play, RefreshCw, AlertTriangle, HelpCircle } from 'lucide-react';

export interface AuditRecord {
  agentId: string;
  agentName: string;
  agentExtension: string;
  ticketWorkDurationMinutes: number;
  systemActionCount: number;
  lastVerifiedActionSummary: string;
  productivityScore: number;
  managerInsight: string;
  warningFlag: boolean;
}

export interface ExceptionTableProps {
  records: AuditRecord[];
  isFilteringAnomalies: boolean;
  onFilterToggle: (onlyAnomalies: boolean) => void;
  onReRunAudit: (agentId: string) => void;
  isAuditingAgentId: string | null;
}

export function ExceptionTable({
  records,
  isFilteringAnomalies,
  onFilterToggle,
  onReRunAudit,
  isAuditingAgentId
}: ExceptionTableProps) {
  
  // Filter records based on active filters
  const displayedRecords = isFilteringAnomalies 
    ? records.filter(r => r.productivityScore < 40)
    : records;

  const totalAnomaliesCount = records.filter(r => r.productivityScore < 40).length;

  return (
    <div id="exception-board-container" className="border border-[#dfe1e6] bg-white rounded-[4px] relative overflow-hidden flex flex-col text-left">
      {/* Top Border Accent Bar (Jira Blue: 3px SOLID) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0052cc]" />

      {/* Header section with flat 1px border styled cleanly */}
      <div className="pt-3.5 pb-3 px-4 border-b border-[#dfe1e6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#fafbfc]">
        <div>
          <h3 className="text-[13px] font-bold text-[#172b4d] uppercase tracking-normal flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#0052cc]" />
            Exception Board: AI Time Logging Correlation
          </h3>
          <p className="text-[11.5px] text-[#5e6c84] leading-relaxed mt-0.5">
            Real-time correlation audit ledger matching activity logs against active non-call timers.
          </p>
        </div>

        {/* Dense Toggle Controller */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-[11px] font-sans">
          <button
            onClick={() => onFilterToggle(false)}
            className={`h-[28px] px-2.5 rounded-[3px] font-semibold transition-all border cursor-pointer ${
              !isFilteringAnomalies 
                ? 'bg-[#deebff] border-[#b2d4ff] text-[#0747a6]' 
                : 'bg-white border-[#dfe1e6] text-[#42526e] hover:bg-[#fafbfc]'
            }`}
          >
            All Runs ({records.length})
          </button>
          <button
            onClick={() => onFilterToggle(true)}
            className={`h-[28px] px-2.5 rounded-[3px] font-semibold transition-all border cursor-pointer flex items-center gap-1 ${
              isFilteringAnomalies 
                ? 'bg-[#ffebe6] border-[#ffbdad] text-[#ff5630]' 
                : 'bg-white border-[#dfe1e6] text-[#42526e] hover:bg-[#fafbfc]'
            }`}
          >
            <span>Under-40 Alerts</span>
            <span className="px-1.5 py-0.2 bg-[#ff5630] text-white text-[9.5px] rounded-full font-bold font-mono">
              {totalAnomaliesCount}
            </span>
          </button>
        </div>
      </div>

      {/* RENDER FALLBACK EXPERIENCE NATIVELY IF DISK DATA SET TO EMPTY / CRITICAL PARITY MATCHES */}
      {displayedRecords.length === 0 ? (
        <div id="fallback-anomaly-container" className="py-14 px-8 text-center flex flex-col items-center justify-center gap-4.5 bg-white min-h-[280px]">
          <div className="w-[52px] h-[52px] rounded-full bg-[#e3fcef] border border-[#abf5d1] flex items-center justify-center text-[#36b37e] shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1 max-w-[480px]">
            <h4 className="text-[13.5px] font-bold text-[#172b4d] uppercase tracking-tight">Active Baseline Correlated Successfully</h4>
            <p className="text-[11.5px] text-[#5e6c84] leading-relaxed font-sans">
              All agent activities correlate correctly with current status metrics. {isFilteringAnomalies ? "There are no productivity anomalies detected under the 40% efficiency score limit." : "No live diagnostic records are currently logged in the workspace."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Flex Card Grid Stack: visible only below md viewport */}
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

          {/* Desktop Tabular Grid: hidden on mobile below md viewport */}
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
        </>
      )}
    </div>
  );
}
