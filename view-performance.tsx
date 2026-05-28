// view-performance.tsx
// High-density Agent telemetry matrix featuring interactive sorting and an AI Compliance Audit simulation
'use client';

import React, { useState, useMemo } from 'react';
import { Cpu, Users, Eye, EyeOff } from 'lucide-react';
import { AgentPerformance } from './types-matrix';
import { SortArrow, Toast, Tooltip } from './component-feedback';

interface ViewPerformanceProps {
  initialAgents: AgentPerformance[];
  sortBy: string;
  order: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function ViewPerformance({
  initialAgents,
  sortBy,
  order,
  onSort,
}: ViewPerformanceProps) {
  const [agents, setAgents] = useState<AgentPerformance[]>(initialAgents);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditToast, setAuditToast] = useState<string | null>(null);

  // Dynamic mathematical metric formula execution
  const processedAgents = useMemo(() => {
    return agents.map(agent => {
      const minutes = agent.durationMins || 1;
      // Formula: min(100, (updates / minutes) * 10)
      const calculatedFocus = Math.min(100, Math.round((agent.systemUpdates / minutes) * 10));
      return {
        ...agent,
        calculatedFocus,
        derivedStatusTag: calculatedFocus >= 40 ? 'Verified' : 'Action Required',
      };
    });
  }, [agents]);

  // Multicolumn alphanumeric tracking sorting
  const sortedAgents = useMemo(() => {
    if (!sortBy) return processedAgents;
    const key = sortBy.toLowerCase();
    return [...processedAgents].sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (key === 'representative') {
        valA = a.name;
        valB = b.name;
      } else if (key === 'duration') {
        valA = a.durationMins;
        valB = b.durationMins;
      } else if (key === 'updates') {
        valA = a.systemUpdates;
        valB = b.systemUpdates;
      } else if (key === 'focus') {
        valA = a.calculatedFocus;
        valB = b.calculatedFocus;
      }

      if (typeof valA === 'string') {
        return order === 'asc' 
          ? valA.localeCompare(valB, undefined, { numeric: true }) 
          : valB.localeCompare(valA, undefined, { numeric: true });
      }
      return order === 'asc' ? valA - valB : valB - valA;
    });
  }, [processedAgents, sortBy, order]);

  // Standard AI Performance audit sequence
  const handleAIAudit = async () => {
    setIsAuditing(true);
    // Short realistic artificial timeout to load models
    await new Promise(r => setTimeout(r, 750));
    
    // Programmatically simulate fluctuating interactions
    setAgents(prev => 
      prev.map(agent => ({
        ...agent,
        systemUpdates: agent.systemUpdates + (Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0),
        durationMins: Math.max(5, agent.durationMins + (Math.random() > 0.5 ? 5 : -5)),
      }))
    );

    setIsAuditing(false);
    setAuditToast("AI Compliance Audit Complete: Exactly 12 active representative profiles evaluated.");
  };

  return (
    <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 shadow-xs animate-fadeIn relative">
      {auditToast && (
        <Toast 
          message={auditToast} 
          type="success" 
          onClose={() => setAuditToast(null)} 
        />
      )}

      {/* Header operations bar with localized action triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#dfe1e6] pb-4 mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#172b4d] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0052cc]" />
            Agent Workspace & Productivity Registry
          </h2>
          <p className="text-[12px] text-[#5e6c84] mt-0.5">
            Cross-referencing active Zoho profile identifiers against 3CX telephony channels.
          </p>
        </div>

        {/* Localized AI compliance trigger (Replaces global header CTA) */}
        <button
          onClick={handleAIAudit}
          disabled={isAuditing}
          className="h-8 px-3.5 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-[#0052cc]/60 text-white text-[12px] font-bold rounded-[3px] flex items-center gap-1.5 transition-all select-none cursor-pointer duration-150 shadow-sm"
        >
          {isAuditing ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Audit Run Processing...</span>
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5" />
              <span>Trigger AI Performance Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Standard data grid table */}
      <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold text-[10px] uppercase select-none">
            <tr>
              <th 
                onClick={() => onSort('representative')} 
                className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] pl-4 min-w-[170px]"
              >
                Representative Name <SortArrow active={sortBy === 'representative'} order={order} />
              </th>
              <th 
                onClick={() => onSort('duration')} 
                className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] text-center min-w-[120px]"
              >
                Offline Duration <SortArrow active={sortBy === 'duration'} order={order} />
              </th>
              <th 
                onClick={() => onSort('updates')} 
                className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] text-center min-w-[130px]"
              >
                System Updates <SortArrow active={sortBy === 'updates'} order={order} />
              </th>
              <th 
                onClick={() => onSort('focus')} 
                className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors text-left pl-4 min-w-[140px]"
              >
                <Tooltip content="The corporate Focus Rating represents operations density, representing the Ratio of Tracked System Updates verified per Minute of Offline Duration scaled out of 100.">
                  <span className="cursor-help border-b border-dashed border-[#dfe1e6] pb-0.5 select-all inline-block">Calculated Focus</span>
                </Tooltip>
                {" "}<SortArrow active={sortBy === 'focus'} order={order} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfe1e6] font-normal text-[#172b4d]">
            {sortedAgents.map(a => (
              <tr key={a.id} className="hover:bg-[#f4f5f7]/30 transition-colors">
                <td className="p-2.5 font-bold border-r border-[#dfe1e6] pl-4">
                  <div className="flex flex-col">
                    <span>{a.name}</span>
                    <span className="text-[10px] text-[#5e6c84] font-mono leading-none mt-0.5">Ext {a.extension} • ID: {a.zohoId || 'Unmapped'}</span>
                  </div>
                </td>
                <td className="p-2.5 font-mono text-[#5e6c84] border-r border-[#dfe1e6] text-center">
                  {a.durationMins} minutes
                </td>
                <td className="p-2.5 font-mono text-center border-r border-[#dfe1e6]">
                  {a.systemUpdates} operations
                </td>
                <td className="p-2.5 pl-4 flex items-center justify-between min-h-[46px]">
                  <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${
                    a.derivedStatusTag === 'Verified' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]'
                  }`}>
                    {a.derivedStatusTag === 'Verified' ? 'Verified' : 'Action Required'} ({a.calculatedFocus}%)
                  </span>
                  
                  <span className="text-[#5e6c84] text-[10px] font-mono hidden sm:inline mr-2">
                    {a.calculatedFocus > 75 ? (
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#006644]" /> Compliant</span>
                    ) : (
                      <span className="flex items-center gap-1"><EyeOff className="w-3 h-3 text-[#bf2600]" /> Check Required</span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
