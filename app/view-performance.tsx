// view-performance.tsx
// Pure UI presentation component for the "Review Flags" analytical workspace.
'use client';

import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Info, 
  ArrowUpRight 
} from 'lucide-react';
import { AgentPerformance } from './types-matrix';

interface ViewPerformanceProps {
  agents: AgentPerformance[];
  filteredAgents: AgentPerformance[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterMode: 'all' | 'attention' | 'verified';
  setFilterMode: (mode: 'all' | 'attention' | 'verified') => void;
  isRefreshing: boolean;
  calculatedMetrics: {
    hoursMonitored: string;
    activeFlags: number;
    focusComplianceRate?: string; // Wait, can pass or calculate
    compliancePercentage: string;
  };
  triggerComplianceAudit: () => void;
}

export function ViewPerformance({
  agents,
  filteredAgents,
  searchQuery,
  setSearchQuery,
  filterMode,
  setFilterMode,
  isRefreshing,
  calculatedMetrics,
  triggerComplianceAudit,
}: ViewPerformanceProps) {
  return (
    <div id="page-performance-container" className="flex flex-col gap-5 text-left font-sans">
      
      {/* HEADER SECTION */}
      <div id="performance-header-block" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dfe1e6]">
        <div>
          <h2 className="text-[18px] font-bold text-[#172b4d] tracking-tight m-0">
            Review Flags Workspace
          </h2>
          <p className="text-[12px] text-[#5e6c84] mt-0.5 leading-relaxed">
            Supervisor console mapping live Phone System Sync logs with Zoho CRM user compliance records.
          </p>
        </div>

        <button
          onClick={triggerComplianceAudit}
          disabled={isRefreshing}
          className="self-start md:self-auto h-[32px] px-3.5 bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold rounded-[3px] text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:bg-slate-100 disabled:text-[#a5adba] disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Run Compliance Audit
        </button>
      </div>

      {/* EXECUTIVE SUMMARY CARDS WITH #f4f5f7 BACKGROUND */}
      <div id="metrics-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Hours Tracked</span>
            <Users className="w-4 h-4 text-[#0052cc]" />
          </div>
          <div className="mt-2 text-baseline flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none">{calculatedMetrics.hoursMonitored}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 leading-none">
              <ArrowUpRight className="w-3 h-3" />
              92% Active
            </span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Shared phone device interval logs</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Flags Triaged</span>
            <AlertTriangle className="w-4 h-4 text-[#ff5630]" />
          </div>
          <div className="mt-2 text-baseline flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none">{calculatedMetrics.activeFlags} Flags</span>
            <span className="text-[10px] text-[#bf2600] font-bold leading-none">Attention Recommended</span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Reps idle of platform updates</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Active Completion Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#36b37e]" />
          </div>
          <div className="mt-2 text-baseline flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none">{calculatedMetrics.compliancePercentage}</span>
            <span className="text-[10px] text-emerald-600 font-bold leading-none">Stable</span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Verified representative ratio</p>
        </div>

      </div>

      {/* FILTER BUTTONS & QUICK SEARCH INTERACTIVE BAR */}
      <div id="filtering-workspace-bar" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#dfe1e6] rounded-[4px]">
        {/* Filtering Toggles */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setFilterMode('all')}
            className={`h-[28px] px-3.5 text-[11px] font-semibold rounded-[3px] transition-all cursor-pointer ${
              filterMode === 'all' 
                ? 'bg-[#0052cc] text-white font-bold' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            All Reps ({agents.length})
          </button>
          <button 
            onClick={() => setFilterMode('attention')}
            className={`h-[28px] px-3.5 text-[11px] font-semibold rounded-[3px] transition-all cursor-pointer ${
              filterMode === 'attention' 
                ? 'bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad] font-bold' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            Attention Needed ({agents.filter(a => a.statusTag === 'Attention Needed').length})
          </button>
          <button 
            onClick={() => setFilterMode('verified')}
            className={`h-[28px] px-3.5 text-[11px] font-semibold rounded-[3px] transition-all cursor-pointer ${
              filterMode === 'verified' 
                ? 'bg-[#e3fcef] text-[#006644] border border-[#abf5d1] font-bold' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            Verified ({agents.filter(a => a.statusTag === 'Verified').length})
          </button>
        </div>

        {/* Input Text Search Field */}
        <div className="relative w-full sm:w-[240px]">
          <Search className="w-3.5 h-3.5 absolute top-[8.5px] left-2.5 text-[#5e6c84]" />
          <input
            type="text"
            placeholder="Search representative..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[28px] pl-8 pr-3 text-[11px] font-sans border border-[#dfe1e6] hover:border-[#a5adba] focus:border-[#0052cc] focus:outline-hidden rounded-[3px] bg-white text-[#172b4d] select-text"
          />
        </div>
      </div>

      {/* MATRIX HIGH DENSITY FLAT DATA GRID */}
      <div id="matrix-table-card" className="border border-[#dfe1e6] rounded-[4px] overflow-hidden bg-white">
        <table className="w-full text-left border-collapse font-sans text-[11px]">
          <thead>
            <tr className="bg-[#fafbfc] border-b border-[#dfe1e6]">
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[185px]">Representative</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[135px]">Phone System Sync</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[95px]">Duration</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[125px] text-right">System Updates</th>
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px]">AI Status Summary</th>
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[125px] text-center">Focus Rating / Tag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfe1e6]">
            {filteredAgents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5e6c84]">
                  No representative matches the current filtering criteria.
                </td>
              </tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr 
                  key={agent.id} 
                  className="hover:bg-[#f4f5f7]/40 transition-colors"
                >
                  {/* Name and Device identifiers */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#172b4d]">{agent.name}</div>
                    <div className="text-[10px] text-[#5e6c84] mt-0.5 font-semibold">
                      Ext: {agent.extension} &bull; ID: {agent.zohoId}
                    </div>
                  </td>

                  {/* Operational Status (Away vs active) */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        agent.workStatus === 'Away from Phone' ? 'bg-[#ff5630]' : 'bg-[#36b37e]'
                      }`} />
                      <span className="font-medium text-[#172b4d]">{agent.workStatus}</span>
                    </div>
                  </td>

                  {/* Total tracked duration mins */}
                  <td className="px-3 py-3 font-semibold text-[#172b4d]">
                    {agent.durationMins} mins
                  </td>

                  {/* Logged platform change packets */}
                  <td className="px-3 py-3 text-right font-mono font-bold text-[#172b4d]">
                    {agent.systemUpdates}
                  </td>

                  {/* Summary audit phrase */}
                  <td className="px-4 py-3 text-[#5e6c84] leading-relaxed max-w-[340px]">
                    {agent.aiSummary}
                  </td>

                  {/* Highlight code ratings & tags */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`h-5 px-2.5 rounded-[4px] text-[10px] font-bold flex items-center justify-center tracking-wide uppercase ${
                        agent.statusTag === 'Attention Needed' 
                          ? 'bg-[#ffebe6] text-[#bf2600]' 
                          : 'bg-[#e3fcef] text-[#006644]'
                      }`}>
                        {agent.statusTag}
                      </span>
                      <div className="font-mono text-[9px] text-[#5e6c84]">
                        Focus Rating: <span className="font-bold text-[#172b4d]">{agent.focusRating}%</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Helpful context helper note */}
      <div className="p-3 bg-[#deebff]/20 border border-[#deebff] rounded-[4px] text-[11px] text-[#0747a6] flex items-start gap-2.5">
        <span className="text-[13px] mt-0.5 shrink-0">ℹ️</span>
        <p className="m-0 leading-relaxed">
          <strong>Review flags process sequence:</strong> Supervisor workspace evaluating inactive thresholds. Representatives in &quot;Attention Needed&quot; state tags are highlighted instantly to secure overall phone line utilization.
        </p>
      </div>

    </div>
  );
}
export default ViewPerformance;
