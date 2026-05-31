'use client';

import React from 'react';
import { QueueMonitorTable } from './queue-monitor-table';
import { ProfileMapperGrid } from './profile-mapper-grid';
import { PendingSurvey, AgentProfile } from '@/types/types-ingestion';
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw, 
  Info 
} from 'lucide-react';
import { useSurveyDispatch } from '@/hooks/use-survey-dispatch';

interface DashboardSurveysProps {
  agents: AgentProfile[];
  surveys: PendingSurvey[];
  onLogMessage: (msg: string) => void;
  refreshState: () => Promise<void>;
}

export function DashboardSurveys({
  agents,
  surveys,
  onLogMessage,
  refreshState
}: DashboardSurveysProps) {
  const {
    isDispatching,
    successBannerMsg,
    setSuccessBannerMsg,
    errorBannerMsg,
    setErrorBannerMsg,
    handleForceBatchDispatch,
  } = useSurveyDispatch({ onLogMessage, refreshState });

  return (
    <div id="survey-module-wrapper" className="flex flex-col gap-5 text-left text-text-primary">
      
      {/* 1. TOP HEADER & OPERATIONAL MATRIC ACTION BAR */}
      <div className="bg-white border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-[36px] h-[36px] rounded bg-[#deebff] border border-[#b2d4ff] flex items-center justify-center text-[#0052cc] shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[12.5px] font-bold text-[#172b4d] font-sans uppercase">
              Module 2: Outbound Survey Bridge Workspace
            </h4>
            <p className="text-[11.5px] text-[#5e6c84] max-w-[700px] leading-relaxed mt-0.5 font-sans">
              Connects real-time 3CX call status lines with Zoho profile parameters. Resolves deduplication checks and gating limits natively to guarantee high data hygiene.
            </p>
          </div>
        </div>

        {/* Master override action button */}
        <div className="shrink-0 self-end md:self-auto">
          <button
            onClick={handleForceBatchDispatch}
            disabled={isDispatching}
            className="h-[34px] px-3.5 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-slate-100 disabled:text-[#a5adba] text-white font-bold rounded-[3px] text-[11px] font-sans flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            title="Fire server execution loop and revalidate survey buffer immediately"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Flushing Survey Buffer...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Force Batch Dispatch Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. TRANSACTION SUCCESS & WARNING NOTIFICATION FIELDS */}
      {successBannerMsg && (
        <div id="survey-success-banner" className="p-3 bg-[#e3fcef] border border-[#abf5d1] text-[#006644] rounded-[4px] text-[11px] font-sans flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#36b37e] shrink-0" />
          <div className="flex-1">
            <strong>Batch processing flushed successfully:</strong> {successBannerMsg}
          </div>
          <button 
            onClick={() => setSuccessBannerMsg(null)} 
            className="text-[10px] text-[#006644] uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorBannerMsg && (
        <div id="survey-error-banner" className="p-3 bg-[#ffebe6] border border-[#ffbdad] text-[#bf2600] rounded-[4px] text-[11px] font-sans flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#ff5630] shrink-0" />
          <div className="flex-1">
            <strong>Dispatch loop aborted during command Execution:</strong> {errorBannerMsg}
          </div>
          <button 
            onClick={() => setErrorBannerMsg(null)} 
            className="text-[10px] text-[#bf2600] uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. DENSE INFORMATIONAL METADATA */}
      <div className="bg-[#deebff]/20 border border-[#deebff] p-3 rounded-[4px] text-[11px] text-[#0747a6] font-sans flex items-start gap-2">
        <Info className="w-4 h-4 text-[#0052cc] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Gating Rule Enforcement Active:</strong> All outgoing calls must satisfy a 120-second active workstation duration and adhere to the 24-hour phone deduplication sequence. Filtered records remain logged as <strong>Suppressed</strong> with precise reasons to ensure maximum auditing visibility.
        </p>
      </div>

      {/* 4. HIGH DENSITY SPLIT PANEL VIEW (60% / 40%) */}
      <div id="survey-split-panels" className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Monitor Table: 60% Width (7 / 12 columns) */}
        <div className="xl:col-span-7 h-full flex flex-col">
          <QueueMonitorTable 
            surveys={surveys} 
            agents={agents} 
          />
        </div>

        {/* Right Configuration Grid: 40% Width (5 / 12 columns) */}
        <div className="xl:col-span-5 h-full flex flex-col">
          <ProfileMapperGrid 
            agents={agents} 
            onLogMessage={onLogMessage} 
            onRefresh={refreshState}
          />
        </div>

      </div>

    </div>
  );
}
