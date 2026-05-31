'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ExceptionDesktopTable } from './exception-desktop-table';
import { ExceptionMobileCards } from './exception-mobile-cards';

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
          <ExceptionMobileCards 
            displayedRecords={displayedRecords} 
            isAuditingAgentId={isAuditingAgentId} 
            onReRunAudit={onReRunAudit} 
          />

          {/* Desktop Tabular Grid: hidden on mobile below md viewport */}
          <ExceptionDesktopTable 
            displayedRecords={displayedRecords} 
            isAuditingAgentId={isAuditingAgentId} 
            onReRunAudit={onReRunAudit} 
          />
        </>
      )}
    </div>
  );
}
