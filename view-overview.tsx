// view-overview.tsx
// High-density enterprise dashboard divided into twin white data blocks conforming to Jira Cloud
'use client';

import React from 'react';
import { Clock, AlertTriangle, ShieldCheck, Mail, Phone, EyeOff } from 'lucide-react';
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
  
  // Calculate dynamic metrics on the fly using standard formulas
  const totalHours = Math.round(agents.reduce((acc, a) => acc + a.durationMins, 0) / 60);
  
  const focusScores = agents.map(a => {
    const duration = a.durationMins || 1;
    return Math.min(100, Math.round((a.systemUpdates / duration) * 10));
  });
  
  const attentionCount = focusScores.filter(score => score < 40).length;
  const averageFocus = Math.round(focusScores.reduce((acc, s) => acc + s, 0) / (agents.length || 1));

  const totalScreenedCalls = totalProcessedCalls - totalSentTexts;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Welcome & Metadata Intro Block */}
      <div className="p-4 border border-[#dfe1e6] bg-[#f4f5f7]/40 rounded-[3px]">
        <h2 className="text-[15px] font-bold text-[#172b4d] tracking-tight">Client Operations & Team Insight Hub</h2>
        <p className="text-[12px] text-[#5e6c84] mt-1 leading-relaxed">
          Operational performance matrices and automated dispatch feeds. Use the locked sidebar to navigation through live workspace nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card Block - Team Focus Summary */}
        <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-3 mb-4">
            <h3 className="text-[13px] font-bold text-[#172b4d] uppercase tracking-wider">Team Focus Summary</h3>
            <span className="text-[10px] text-[#5e6c84] font-semibold bg-[#ebecf0] px-2 py-0.5 rounded-[3px]">Live Live-Feed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Monitored Hours */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Tracked Time</span>
                <Clock className="w-3.5 h-3.5 text-[#0052cc]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#172b4d] font-mono leading-none">{totalHours} Hr</div>
                <span className="text-[9.5px] text-[#5e6c84]">Aggregated duration</span>
              </div>
            </div>

            {/* Active Attention Flags */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Attention Required</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#bf2600]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#bf2600] font-mono leading-none">{attentionCount} Reps</div>
                <span className="text-[9.5px] text-[#5e6c84]">Focus Index &lt; 40%</span>
              </div>
            </div>

            {/* Team Focus Average */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Focus Average</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#006644]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#006644] font-mono leading-none">{averageFocus}%</div>
                <span className="text-[9.5px] text-[#5e6c84]">Verification baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card Block - Survey Pipeline Summary */}
        <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-3 mb-4">
            <h3 className="text-[13px] font-bold text-[#172b4d] uppercase tracking-wider">Survey Pipeline Summary</h3>
            <span className="text-[10px] text-[#5e6c84] font-semibold bg-[#ebecf0] px-2 py-0.5 rounded-[3px]">Twilio Gateway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Processed Calls */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Processed Calls</span>
                <Phone className="w-3.5 h-3.5 text-[#172b4d]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#172b4d] font-mono leading-none">{totalProcessedCalls} Logs</div>
                <span className="text-[9.5px] text-[#5e6c84]">Total 3CX simulation logs</span>
              </div>
            </div>

            {/* Dispatched Texts */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Dispatched Texts</span>
                <Mail className="w-3.5 h-3.5 text-[#0052cc]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#0052cc] font-mono leading-none">{totalSentTexts} SMS</div>
                <span className="text-[9.5px] text-[#5e6c84]">Exceeded 2 min filter</span>
              </div>
            </div>

            {/* Screened Calls */}
            <div className="bg-[#f4f5f7]/60 border border-[#dfe1e6] p-3.5 rounded-[3px] flex flex-col justify-between min-h-[90px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5e6c84] uppercase">Screened Calls</span>
                <EyeOff className="w-3.5 h-3.5 text-[#bf2600]" />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#bf2600] font-mono leading-none">{totalScreenedCalls} Skipped</div>
                <span className="text-[9.5px] text-[#5e6c84]">Short or Duplicates hit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
