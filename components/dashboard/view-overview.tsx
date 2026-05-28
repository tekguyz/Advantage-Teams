// components/dashboard/view-overview.tsx
// High-density enterprise dashboard divided into twin white data blocks conforming to Jira Cloud
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AgentPerformance } from '@/types/data-matrix';
import { MetricCard } from '@/components/ui/metric-cards';

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
      <div className="p-4 border border-border-soft bg-sidebar-bg/50 rounded-[3px]">
        <h2 className="text-[14px] font-bold text-text-charcoal">Operations Overview Dashboard</h2>
        <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
          Supervisor hub monitoring enterprise system metrics in real time. Use the navigation links to inspect details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card Block - Team Focus Summary */}
        <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-text-charcoal uppercase tracking-wider">Team Focus Summary</h3>
              <span className="text-[10px] text-accent-blue font-semibold bg-accent-blue/10 px-2 py-0.5 rounded-[3px]">Live Sync</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MetricCard 
                label="Tracked Time"
                value={totalHours}
                unit="hrs"
              />
              <MetricCard 
                label="Review Flags"
                value={reviewCount}
                unit="reps"
                colorClass="text-status-attention-text"
              />
              <MetricCard 
                label="Focus Avg"
                value={`${averageFocus}%`}
                colorClass="text-status-verified-text"
              />
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-border-soft/60 flex justify-end">
            <a 
              href="?view=performance" 
              className="text-accent-blue hover:opacity-85 font-bold text-[11.5px] flex items-center gap-1 transition-all"
            >
              <span>Drilldown Performance Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Card Block - Survey Pipeline Summary */}
        <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-text-charcoal uppercase tracking-wider">Survey Pipeline Summary</h3>
              <span className="text-[10px] text-status-verified-text font-semibold bg-status-verified-bg px-2 py-0.5 rounded-[3px]">Active Carrier</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MetricCard 
                label="Processed Calls"
                value={totalProcessedCalls}
                unit="calls"
              />
              <MetricCard 
                label="Dispatched Texts"
                value={totalSentTexts}
                unit="sms"
                colorClass="text-accent-blue"
              />
              <MetricCard 
                label="Screened Calls"
                value={totalScreenedCalls}
                unit="skipped"
                colorClass="text-status-attention-text"
              />
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-border-soft/60 flex justify-end">
            <a 
              href="?view=surveys" 
              className="text-accent-blue hover:opacity-85 font-bold text-[11.5px] flex items-center gap-1 transition-all"
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
