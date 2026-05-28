'use client';

import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Info, 
  ArrowUpRight 
} from 'lucide-react';

interface AgentDetail {
  id: string;
  name: string;
  extension: string;
  zohoId: string;
  workStatus: string;
  durationMins: number;
  systemActions: number;
  score: number;
  statusTag: 'Attention Needed' | 'Verified';
  aiSummary: string;
}

export function PageProductivity() {
  const [agents, setAgents] = useState<AgentDetail[]>([
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'Sarah Jenkins',
      extension: '101',
      zohoId: 'US-101',
      workStatus: 'Away from Phone',
      durationMins: 45,
      systemActions: 0,
      score: 12,
      statusTag: 'Attention Needed',
      aiSummary: 'Inactive duration exceeds critical thresholds; 0 discrete updates logged. Highly recommended for workstation re-verification.'
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      name: 'Marcus Vance',
      extension: '102',
      zohoId: 'US-102',
      workStatus: 'Ticket Work',
      durationMins: 15,
      systemActions: 14,
      score: 93,
      statusTag: 'Verified',
      aiSummary: 'Maintains tight compliance coverage. Logged 14 high-integrity workstation updates within the current interval.'
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      name: 'Elena Rostova',
      extension: '103',
      zohoId: 'US-103',
      workStatus: 'Away from Phone',
      durationMins: 32,
      systemActions: 1,
      score: 18,
      statusTag: 'Attention Needed',
      aiSummary: 'Idle duration check active with single database action. System flag is set for manager review sequence.'
    },
    {
      id: 'a4444444-4444-4444-4444-444444444444',
      name: 'David Kim',
      extension: '104',
      zohoId: 'US-104',
      workStatus: 'Ticket Work',
      durationMins: 20,
      systemActions: 9,
      score: 85,
      statusTag: 'Verified',
      aiSummary: 'High-density updates observed. Mapped 9 system changes with 3CX workstation status mapping active.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'attention' | 'verified'>('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.extension.includes(searchQuery) ||
                          agent.zohoId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMode === 'attention') return matchesSearch && agent.statusTag === 'Attention Needed';
    if (filterMode === 'verified') return matchesSearch && agent.statusTag === 'Verified';
    return matchesSearch;
  });

  const handleTriggerRevaluation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div id="page-productivity-container" className="flex flex-col gap-5 text-left font-sans">
      
      {/* HEADER SECTION */}
      <div id="productivity-header-block" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dfe1e6]">
        <div>
          <h2 className="text-[18px] font-bold text-[#172b4d] tracking-tight m-0 font-sans">
            Review Flags Workspace
          </h2>
          <p className="text-[12px] text-[#5e6c84] mt-0.5 leading-relaxed font-sans">
            Real-time supervisor matrix evaluating 3CX status lines with Zoho profile compliance metrics.
          </p>
        </div>

        <button
          onClick={handleTriggerRevaluation}
          disabled={isRefreshing}
          className="self-start md:self-auto h-[32px] px-3 bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold rounded-[3px] text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:bg-slate-100 disabled:text-[#a5adba] disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Run Compliance Audit
        </button>
      </div>

      {/* EXECUTIVE SUMMARY STATS ROW */}
      <div id="metrics-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Total Duration Monitored</span>
            <Users className="w-4 h-4 text-[#0052cc]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none">1.8 Hours</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 leading-none">
              <ArrowUpRight className="w-3 h-3" />
              92.3% Active
            </span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Shared workstation session state</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Active Review Flags</span>
            <AlertTriangle className="w-4 h-4 text-[#ff5630]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none font-sans">2 Flags</span>
            <span className="text-[10px] text-[#bf2600] font-bold leading-none">Attention Recommended</span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Zero updating streaks within Away state</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#f4f5f7] border border-[#dfe1e6] rounded-[4px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-[#5e6c84] uppercase tracking-wide">Compliance Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#36b37e]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-[20px] font-bold text-[#172b4d] leading-none">50.0%</span>
            <span className="text-[10px] text-emerald-600 font-bold leading-none">Stable</span>
          </div>
          <p className="text-[10px] text-[#5e6c84] mt-1.5">Satisfies operational standards</p>
        </div>

      </div>

      {/* SEARCH AND NAVIGATION FILTER TOGGLES */}
      <div id="filtering-workspace-bar" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#dfe1e6] rounded-[4px]">
        {/* Left Toggles */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setFilterMode('all')}
            className={`h-[28px] px-3 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
              filterMode === 'all' 
                ? 'bg-[#0052cc] text-white' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            All Reps ({agents.length})
          </button>
          <button 
            onClick={() => setFilterMode('attention')}
            className={`h-[28px] px-3 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
              filterMode === 'attention' 
                ? 'bg-[#ffebe6] text-[#bf2600] border border-[#ffbdad]' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            Attention Needed (2)
          </button>
          <button 
            onClick={() => setFilterMode('verified')}
            className={`h-[28px] px-3 text-[11px] font-semibold rounded-[3px] transition-colors cursor-pointer ${
              filterMode === 'verified' 
                ? 'bg-[#e3fcef] text-[#006644] border border-[#abf5d1]' 
                : 'bg-white hover:bg-[#fafbfc] text-[#42526e] border border-[#dfe1e6]'
            }`}
          >
            Verified (2)
          </button>
        </div>

        {/* Search input */}
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

      {/* HIGH-DENSITY TABLE */}
      <div id="matrix-table-card" className="border border-[#dfe1e6] rounded-[4px] overflow-hidden bg-white">
        <table className="w-full text-left border-collapse font-sans text-[11px]">
          <thead>
            <tr className="bg-[#fafbfc] border-b border-[#dfe1e6]">
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[185px]">Representative</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[135px]">Core Status</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[95px]">Duration</th>
              <th className="px-3 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[125px] text-right">Tracked Updates</th>
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px]">AI Status Summary</th>
              <th className="px-4 py-2.5 font-bold text-[#5e6c84] uppercase tracking-wide text-[10px] w-[125px] text-center">Score / Tag</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#5e6c84]">
                  No representative matches the current filtering query.
                </td>
              </tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr 
                  key={agent.id} 
                  className="border-b border-[#dfe1e6] hover:bg-[#f4f5f7]/40 transition-colors"
                >
                  {/* Rep and Zoho Mapping */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#172b4d]">{agent.name}</div>
                    <div className="text-[10px] text-[#5e6c84] mt-0.5 font-semibold">
                      Ext: {agent.extension} &bull; ID: {agent.zohoId}
                    </div>
                  </td>

                  {/* Core Status */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        agent.workStatus === 'Away from Phone' ? 'bg-[#ff5630]' : 'bg-[#36b37e]'
                      }`} />
                      <span className="font-medium text-[#172b4d]">{agent.workStatus}</span>
                    </div>
                  </td>

                  {/* Duration text */}
                  <td className="px-3 py-3 font-semibold text-[#172b4d]">
                    {agent.durationMins} mins
                  </td>

                  {/* Tracked updates */}
                  <td className="px-3 py-3 text-right font-mono font-bold text-[#172b4d]">
                    {agent.systemActions}
                  </td>

                  {/* AI Status summary description text */}
                  <td className="px-4 py-3 text-[#5e6c84] leading-relaxed max-w-[340px]">
                    {agent.aiSummary}
                  </td>

                  {/* Score Tag with low-saturation backgrounds */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`h-5 px-2.5 rounded-[4px] text-[10px] font-bold flex items-center justify-center tracking-wide ${
                        agent.statusTag === 'Attention Needed' 
                          ? 'bg-[#ffebe6] text-[#bf2600]' 
                          : 'bg-[#e3fcef] text-[#006644]'
                      }`}>
                        {agent.statusTag}
                      </span>
                      <div className="font-mono text-[9px] text-[#5e6c84]">
                        Productivity Score: <span className="font-bold text-[#172b4d]">{agent.score}/100</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Informative help note */}
      <div className="p-3 bg-[#deebff]/20 border border-[#deebff] rounded-[4px] text-[11px] text-[#0747a6] flex items-start gap-2.5">
        <span className="text-[13px] mt-0.5 shrink-0">ℹ️</span>
        <p className="m-0 leading-relaxed font-sans">
          <strong>Review flags process sequence:</strong> Supervisor desk evaluates inactive status loops automatically. Representatives in &quot;Attention Needed&quot; states are flagged instantly to avoid outbound dispatch blocks.
        </p>
      </div>

    </div>
  );
}
