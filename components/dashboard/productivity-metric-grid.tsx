'use client';

import React from 'react';
import { ShieldAlert, TrendingUp, Cpu, Clock } from 'lucide-react';

export interface ProductivitySummaryStats {
  totalAuditedShifts: number;
  averageScore: number;
  criticalLeakCount: number;
  totalSystemActions: number;
  totalDurationMinutes: number;
}

export interface ProductivityMetricGridProps {
  stats: ProductivitySummaryStats;
}

export function ProductivityMetricGrid({ stats }: ProductivityMetricGridProps) {
  return (
    <div id="productivity-metric-grid-container" className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
      
      {/* CARD 1: TOTAL AUDITED WINDOWS */}
      <div 
        id="metric-card-total-audited"
        className="bg-white border border-[#dfe1e6] border-t-3 border-t-[#0052cc] rounded-[4px] p-3.5 shadow-2xs flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#5e6c84] uppercase font-bold tracking-wider">
            Total Audited
          </span>
          <span className="text-[22px] font-bold text-[#172b4d] font-sans mt-1 leading-none">
            {stats.totalAuditedShifts} Shifts
          </span>
          <span className="text-[10.5px] text-[#5e6c84] font-medium font-sans mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#42526e]" />
            {stats.totalDurationMinutes} minutes tracked
          </span>
        </div>
        <div className="w-[38px] h-[38px] rounded bg-[#deebff] flex items-center justify-center text-[#0052cc] shrink-0">
          <Cpu className="w-4.5 h-4.5" />
        </div>
      </div>

      {/* CARD 2: SYSTEM ACTION COUNT */}
      <div 
        id="metric-card-system-actions"
        className="bg-white border border-[#dfe1e6] border-t-3 border-t-[#0052cc] rounded-[4px] p-3.5 shadow-2xs flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#5e6c84] uppercase font-bold tracking-wider">
            Verified Activities
          </span>
          <span className="text-[22px] font-bold text-[#172b4d] font-sans mt-1 leading-none">
            {stats.totalSystemActions} Events
          </span>
          <span className="text-[10.5px] text-[#5e6c84] font-sans mt-1.5">
            Internal activity logs correlated
          </span>
        </div>
        <div className="w-[38px] h-[38px] rounded bg-[#e6fcff] flex items-center justify-center text-[#008da6] shrink-0">
          <TrendingUp className="w-4.5 h-4.5" />
        </div>
      </div>

      {/* CARD 3: AVERAGE PRODUCTIVITY SCORE */}
      <div 
        id="metric-card-average-score"
        className="bg-white border border-[#dfe1e6] border-t-3 border-t-[#0052cc] rounded-[4px] p-3.5 shadow-2xs flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#5e6c84] uppercase font-bold tracking-wider">
            Average Score
          </span>
          <span className={`text-[22px] font-bold mt-1 leading-none font-mono ${
            stats.averageScore >= 70 ? 'text-[#36b37e]' : stats.averageScore >= 40 ? 'text-[#ffab00]' : 'text-[#ff5630]'
          }`}>
            {stats.averageScore}%
          </span>
          <span className="text-[10.5px] text-[#5e6c84] font-sans mt-1.5">
            Collective density parameter
          </span>
        </div>
        <div className="w-[38px] h-[38px] rounded bg-[#efffd6] flex items-center justify-center text-[#36b37e] shrink-0">
          <span className="text-[13px] font-bold font-mono">%</span>
        </div>
      </div>

      {/* CARD 4: CRITICAL ANOMALIES (LEAKS) */}
      <div 
        id="metric-card-critical-leaks"
        className={`bg-white border border-[#dfe1e6] rounded-[4px] p-3.5 shadow-2xs flex items-center justify-between border-t-3 ${
          stats.criticalLeakCount > 0 ? 'border-t-[#ff5630]' : 'border-t-[#0052cc]'
        }`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#5e6c84] uppercase font-bold tracking-wider">
            Critical Anomalies
          </span>
          <span className={`text-[22px] font-bold mt-1 leading-none font-sans ${
            stats.criticalLeakCount > 0 ? 'text-[#ff5630]' : 'text-[#172b4d]'
          }`}>
            {stats.criticalLeakCount} Leaks
          </span>
          <span className="text-[10.5px] text-[#5e6c84] font-medium font-sans mt-1.5 flex items-center gap-1">
            {stats.criticalLeakCount > 0 ? (
              <span className="text-[#ff5630] font-bold">Requires urgent investigation</span>
            ) : (
              <span className="text-[#36b37e]">Nominal baseline correlated</span>
            )}
          </span>
        </div>
        <div className={`w-[38px] h-[38px] rounded flex items-center justify-center shrink-0 ${
          stats.criticalLeakCount > 0 ? 'bg-[#ffebe6] text-[#ff5630]' : 'bg-[#e3fcef] text-[#36b37e]'
        }`}>
          <ShieldAlert className="w-4.5 h-4.5" />
        </div>
      </div>

    </div>
  );
}
