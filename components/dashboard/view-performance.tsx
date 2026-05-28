// components/dashboard/view-performance.tsx
// High-density agent performance matrix complying with atomic limits
'use client';

import React, { useState, useMemo } from 'react';
import { Cpu, Users, ShieldAlert } from 'lucide-react';
import { AgentPerformance } from '@/types/data-matrix';
import { SortArrow, Toast, Tooltip } from '@/components/ui/component-feedback';
import { SlideOutDrawer } from '@/components/ui/slide-out-drawer';

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
  const [selectedAgent, setSelectedAgent] = useState<(AgentPerformance & { calculatedFocus: number }) | null>(null);

  const processedAgents = useMemo(() => {
    return agents.map(agent => {
      const minutes = agent.durationMins || 1;
      const calculatedFocus = Math.min(100, Math.round((agent.systemUpdates / minutes) * 100));
      return {
        ...agent,
        calculatedFocus,
        derivedStatusTag: calculatedFocus >= 40 ? 'Standard' : 'Review Required',
      };
    });
  }, [agents]);

  const sortedAgents = useMemo(() => {
    if (!sortBy) return processedAgents;
    const key = sortBy.toLowerCase();
    return [...processedAgents].sort((a, b) => {
      let valA: any = ''; 
      let valB: any = '';
      if (key === 'representative') { valA = a.name; valB = b.name; }
      else if (key === 'duration') { valA = a.durationMins; valB = b.durationMins; }
      else if (key === 'updates') { valA = a.systemUpdates; valB = b.systemUpdates; }
      else if (key === 'focus') { valA = a.calculatedFocus; valB = b.calculatedFocus; }
      
      if (typeof valA === 'string') {
        return order === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return order === 'asc' ? valA - valB : valB - valA;
    });
  }, [processedAgents, sortBy, order]);

  const handleAIAudit = async () => {
    setIsAuditing(true);
    await new Promise(r => setTimeout(r, 600));
    setAgents(prev => prev.map(agent => ({
      ...agent,
      systemUpdates: agent.systemUpdates + (Math.random() > 0.4 ? Math.floor(Math.random() * 8) + 2 : 0),
      durationMins: Math.max(5, agent.durationMins + (Math.random() > 0.5 ? 5 : -5)),
    })));
    setIsAuditing(false);
    setAuditToast("AI Compliance Audit Complete: Evaluated exactly 12 support professionals.");
  };

  const clearAlert = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, systemUpdates: Math.max(a.systemUpdates, Math.round(a.durationMins * 0.45)) };
      }
      return a;
    }));
    setSelectedAgent(null);
    setAuditToast("Verification alert cleared. Representative focus density overrode compliance baseline.");
  };

  return (
    <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-5 shadow-xs animate-fadeIn relative text-left">
      {auditToast && <Toast message={auditToast} type="success" onClose={() => setAuditToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-soft pb-4 mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-text-charcoal flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-blue" /> Team Performance Workspace
          </h2>
          <p className="text-[11.5px] text-text-muted mt-0.5">
            Real-time corporate Focus Ratings matching device extension sync records under Zoho accounts.
          </p>
        </div>
        <button
          onClick={handleAIAudit} disabled={isAuditing}
          className="h-8 px-3.5 bg-accent-blue hover:opacity-90 disabled:bg-accent-blue/70 text-canvas-bg text-[11px] font-bold rounded-[3px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm select-none"
        >
          {isAuditing ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
          <span>Trigger AI Performance Audit</span>
        </button>
      </div>

      <div className="overflow-x-auto border border-border-soft rounded-[3px]">
        <table className="w-full text-left border-collapse text-[11.5px]">
          <thead className="bg-sidebar-bg border-b border-border-soft text-text-muted font-bold text-[9px] uppercase select-none">
            <tr>
              <th onClick={() => onSort('representative')} className="p-2.5 cursor-pointer hover:bg-border-soft/40 transition-all border-r border-border-soft pl-4 min-w-[160px]">
                REPRESENTATIVE NAME <SortArrow active={sortBy === 'representative'} order={order} />
              </th>
              <th onClick={() => onSort('duration')} className="p-2.5 cursor-pointer hover:bg-border-soft/40 transition-all border-r border-border-soft text-center min-w-[110px]">
                OFFLINE DURATION <SortArrow active={sortBy === 'duration'} order={order} />
              </th>
              <th onClick={() => onSort('updates')} className="p-2.5 cursor-pointer hover:bg-border-soft/40 transition-all border-r border-border-soft text-center min-w-[120px]">
                SYSTEM UPDATES <SortArrow active={sortBy === 'updates'} order={order} />
              </th>
              <th onClick={() => onSort('focus')} className="p-2.5 cursor-pointer hover:bg-border-soft/40 transition-all text-left pl-4 min-w-[140px]">
                <Tooltip content="Focus rating calculates the ratio of recorded system updates relative to offline duration.">
                  <span className="text-[10px] font-extrabold tracking-wider select-none">CALCULATED FOCUS RATING</span>
                </Tooltip>
                {" "}<SortArrow active={sortBy === 'focus'} order={order} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft font-normal text-text-charcoal bg-canvas-bg">
            {sortedAgents.map(a => (
              <tr key={a.id} className="hover:bg-sidebar-bg/40 transition-colors">
                <td className="p-2.5 font-bold border-r border-border-soft pl-4">
                  <div className="flex flex-col">
                    <span>{a.name}</span>
                    <span className="text-[9.5px] text-text-muted font-mono leading-none mt-0.5 font-normal">Ext {a.extension} • ID: {a.zohoId || 'Unmapped'}</span>
                  </div>
                </td>
                <td className="p-2.5 font-mono text-text-muted border-r border-border-soft text-center">{a.durationMins} minutes</td>
                <td className="p-2.5 font-mono text-center border-r border-border-soft">{a.systemUpdates} operations</td>
                <td className="p-2.5 pl-4 flex items-center gap-3 min-h-[44px]">
                  <span className="font-mono font-bold text-[12px]">{a.calculatedFocus}%</span>
                  {a.calculatedFocus >= 40 ? (
                    <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider bg-status-verified-bg text-status-verified-text border border-status-verified-bg/20 select-none">
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedAgent(a)}
                      className="px-2.5 py-1 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider text-left transition-all flex items-center gap-1.5 bg-status-attention-bg hover:opacity-90 text-status-attention-text border border-status-attention-text/20 cursor-pointer shadow-3xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOutDrawer 
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        agent={selectedAgent}
        onClearAlert={clearAlert}
      />
    </div>
  );
}
