'use client';

import React from 'react';
import { PendingSurvey, AgentProfile } from '@/types/types-ingestion';
import { Clock } from 'lucide-react';
import { QueueDesktopTable } from './queue-desktop-table';
import { QueueMobileCards } from './queue-mobile-cards';

export interface QueueMonitorTableProps {
  surveys: PendingSurvey[];
  agents: AgentProfile[];
}

export function QueueMonitorTable({ surveys, agents }: QueueMonitorTableProps) {
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
          <QueueMobileCards surveys={surveys} agents={agents} />

          {/* Desktop Tabular Grid: hidden on mobile below md viewport */}
          <QueueDesktopTable surveys={surveys} agents={agents} />
        </>
      )}
    </div>
  );
}
