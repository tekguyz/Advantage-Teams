'use client';

import React from 'react';
import { ProductivityMetricGrid } from './productivity-metric-grid';
import { ExceptionTable } from './exception-table';
import { Sparkles, AlertTriangle, Send } from 'lucide-react';
import { useGeminiAudit } from '@/hooks/use-gemini-audit';

interface DashboardProductivityProps {
  agents: any[];
  telemetry: any[];
  activities: any[];
  onLogMessage: (msg: string) => void;
  refreshState: () => Promise<void>;
}

export function DashboardProductivity({
  agents,
  telemetry,
  activities,
  onLogMessage,
  refreshState
}: DashboardProductivityProps) {
  const {
    records,
    isFilteringAnomalies,
    setIsFilteringAnomalies,
    isAuditingAgentId,
    batchAuditing,
    globalError,
    setGlobalError,
    handleSingleAgentAudit,
    handleBatchAuditAll,
    computedStats
  } = useGeminiAudit({
    agents,
    telemetry,
    activities,
    onLogMessage,
    refreshState
  });

  return (
    <div id="dashboard-productivity-wrapper" className="flex flex-col gap-5 text-left">
      
      {/* GLOBAL ALERTS BANNER FOR DECENTRALIZED FAILURE PATHS */}
      {globalError && (
        <div id="audit-global-error-banner" className="p-3 bg-[#ffebe6] border border-[#ffbdad] text-[#bf2600] rounded-[4px] text-[11px] font-sans flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#ff5630] shrink-0" />
          <div className="flex-1">
            <strong>System correlation mismatch detected during Gemini parsing:</strong> {globalError}
          </div>
          <button 
            onClick={() => setGlobalError(null)} 
            className="text-[10px] text-[#bf2600] uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* METRIC RIBBON */}
      <ProductivityMetricGrid stats={computedStats} />

      {/* SYSTEM OPERATIONS PANEL */}
      <div className="border border-[#dfe1e6] bg-white rounded-[4px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-[36px] h-[36px] rounded bg-[#efffd6] border border-[#abf5d1] flex items-center justify-center text-[#36b37e] shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[12.5px] font-bold text-[#172b4d] font-sans uppercase">
              Module 1: AI Administrative Control Kernel
            </h4>
            <p className="text-[11.5px] text-[#5e6c84] max-w-[690px] leading-relaxed mt-0.5 font-sans">
              Analyzes raw non-call 3CX timelines and event trackers using <strong>responseMimeType: &quot;application/json&quot;</strong> to derive exact density scores. Bypasses active desktop spy software to honor agent workspace integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBatchAuditAll}
            disabled={batchAuditing || isAuditingAgentId !== null || records.length === 0}
            className="h-[34px] px-3.5 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-slate-100 disabled:text-[#a5adba] text-white font-bold rounded-[3px] text-[11px] font-sans flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            {batchAuditing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Portfolios...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Interrogate All Active Portfolios
              </>
            )}
          </button>
        </div>
      </div>

      {/* HIGH DENSITY EXCEPTION GRID */}
      <ExceptionTable 
        records={records}
        isFilteringAnomalies={isFilteringAnomalies}
        onFilterToggle={setIsFilteringAnomalies}
        onReRunAudit={handleSingleAgentAudit}
        isAuditingAgentId={isAuditingAgentId}
      />

    </div>
  );
}
