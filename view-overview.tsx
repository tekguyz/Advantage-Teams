// view-overview.tsx
// High-density enterprise dashboard divided into twin white data blocks conforming to Jira Cloud
'use client';

import React from 'react';
import { Clock, AlertTriangle, ShieldCheck, Mail, Phone, EyeOff, ArrowRight } from 'lucide-react';
import { AgentPerformance } from './types-matrix';

interface ViewOverviewProps {
  agents: AgentPerformance[];
  totalProcessedCalls?: number;
  totalSentTexts?: number;
}

export default function ViewOverview({ 
  agents, 
  totalProcessedCalls = 300, 
  totalSentTexts = 123 
}: ViewOverviewProps) {
  
  const totalHours = Math.round(agents.reduce((acc, a) => acc + a.durationMins, 0) / 60);
  
  const focusScores = agents.map(a => {
    const duration = a.durationMins || 1;
    return Math.min(100, Math.round((a.systemUpdates / duration) * 100));
  });
  
  const reviewCount = focusScores.filter(score => score < 40).length; 
  const averageFocus = Math.round(focusScores.reduce((acc, s) => acc + s, 0) / (agents.length || 1));
  const totalScreenedCalls = totalProcessedCalls - totalSentTexts;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Welcome metadata */}
      <div className="p-4 border border-[#dfe1e6] bg-[#f4f5f7]/50 rounded-[3px]">
        <h2 className="text-[14px] font-bold text-[#172b4d]">Operations Overview Dashboard</h2>
        <p className="text-[12px] text-[#5e6c84] mt-1 leading-relaxed">
          Supervisor hub monitoring enterprise system metrics in real time. Use the navigation links to inspect details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card Block - Team Focus Summary */}
        <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-[#172b4d] uppercase tracking-wider">Team Focus Summary</h3>
              <span className="text-[10px] text-[#0055cc] font-semibold bg-[#deebff] px-2 py-0.5 rounded-[3px]">Live Sync</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#5e6c84] uppercase">Tracked Time</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#172b4d] font-mono">{totalHours}</span>
                  <span className="text-[10px] text-[#5e6c84]">hrs</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#bf2600] uppercase">Review Flags</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#bf2600] font-mono">{reviewCount}</span>
                  <span className="text-[10px] text-[#bf2600]">reps</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#006644] uppercase">Focus Avg</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#006644] font-mono">{averageFocus}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-[#dfe1e6]/60 flex justify-end">
            <a 
              href="?view=performance" 
              className="text-[#0052cc] hover:text-[#0747a6] font-bold text-[11.5px] flex items-center gap-1 transition-all"
            >
              <span>Drilldown Performance Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Card Block - Survey Pipeline Summary */}
        <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-[#172b4d] uppercase tracking-wider">Survey Pipeline Summary</h3>
              <span className="text-[10px] text-[#006644] font-semibold bg-[#e3fcef] px-2 py-0.5 rounded-[3px]">Active Carrier</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#172b4d] uppercase">Processed Calls</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#172b4d] font-mono">{totalProcessedCalls}</span>
                  <span className="text-[9px] text-[#5e6c84]">calls</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#0052cc] uppercase">Dispatched Texts</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#0052cc] font-mono">{totalSentTexts}</span>
                  <span className="text-[9px] text-[#0052cc]">SMS</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-3 rounded-[3px] flex flex-col justify-between min-h-[85px]">
                <span className="text-[10px] font-bold text-[#bf2600] uppercase">Screened Calls</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#bf2600] font-mono">{totalScreenedCalls}</span>
                  <span className="text-[9px] text-[#bf2600]">skipped</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-[#dfe1e6]/60 flex justify-end">
            <a 
              href="?view=surveys" 
              className="text-[#0052cc] hover:text-[#0747a6] font-bold text-[11.5px] flex items-center gap-1 transition-all"
            >
              <span>Open Survey Delivery Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
