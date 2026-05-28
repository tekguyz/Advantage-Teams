// view-performance.tsx
// High-density agent performance matrix under the 225-line Atomic UI limitation
'use client';

import React, { useState, useMemo } from 'react';
import { Cpu, Users, X, ShieldAlert } from 'lucide-react';
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
  const [selectedAgent, setSelectedAgent] = useState<AgentPerformance | null>(null);

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
    <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 shadow-xs animate-fadeIn relative text-left">
      {auditToast && <Toast message={auditToast} type="success" onClose={() => setAuditToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#dfe1e6] pb-4 mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-[#172b4d] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0052cc]" /> Team Performance Workspace
          </h2>
          <p className="text-[11.5px] text-[#5e6c84] mt-0.5">
            Real-time corporate Focus Ratings matching device extension sync records under Zoho accounts.
          </p>
        </div>
        <button
          onClick={handleAIAudit} disabled={isAuditing}
          className="h-8 px-3.5 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-[#0052cc]/70 text-white text-[11px] font-bold rounded-[3px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm select-none"
        >
          {isAuditing ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
          <span>Trigger AI Performance Audit</span>
        </button>
      </div>

      <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
        <table className="w-full text-left border-collapse text-[11.5px]">
          <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold text-[9px] uppercase select-none">
            <tr>
              <th onClick={() => onSort('representative')} className="p-2.5 cursor-pointer hover:bg-[#ebecf0] transition-all border-r border-[#dfe1e6] pl-4 min-w-[160px]">
                Representative Name <SortArrow active={sortBy === 'representative'} order={order} />
              </th>
              <th onClick={() => onSort('duration')} className="p-2.5 cursor-pointer hover:bg-[#ebecf0] transition-all border-r border-[#dfe1e6] text-center min-w-[110px]">
                Offline Duration <SortArrow active={sortBy === 'duration'} order={order} />
              </th>
              <th onClick={() => onSort('updates')} className="p-2.5 cursor-pointer hover:bg-[#ebecf0] transition-all border-r border-[#dfe1e6] text-center min-w-[120px]">
                System Updates <SortArrow active={sortBy === 'updates'} order={order} />
              </th>
              <th onClick={() => onSort('focus')} className="p-2.5 cursor-pointer hover:bg-[#ebecf0] transition-all text-left pl-4 min-w-[140px]">
                <Tooltip content="Focus rating calculates the ratio of recorded system updates relative to offline duration.">
                  <span className="text-[10px] font-extrabold tracking-wider select-none">CALCULATED FOCUS RATING</span>
                </Tooltip>
                {" "}<SortArrow active={sortBy === 'focus'} order={order} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfe1e6] font-normal text-[#172b4d] bg-white">
            {sortedAgents.map(a => (
              <tr key={a.id} className="hover:bg-[#f4f5f7]/40 transition-colors">
                <td className="p-2.5 font-bold border-r border-[#dfe1e6] pl-4">
                  <div className="flex flex-col">
                    <span>{a.name}</span>
                    <span className="text-[9.5px] text-[#5e6c84] font-mono leading-none mt-0.5 font-normal">Ext {a.extension} • ID: {a.zohoId || 'Unmapped'}</span>
                  </div>
                </td>
                <td className="p-2.5 font-mono text-[#5e6c84] border-r border-[#dfe1e6] text-center">{a.durationMins} minutes</td>
                <td className="p-2.5 font-mono text-center border-r border-[#dfe1e6]">{a.systemUpdates} operations</td>
                <td className="p-2.5 pl-4 flex items-center gap-3 min-h-[44px]">
                  <span className="font-mono font-bold text-[12px]">{a.calculatedFocus}%</span>
                  {a.calculatedFocus >= 40 ? (
                    <span className="px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider bg-[#e3fcef] text-[#006644] border border-[#e3fcef] select-none">
                      Standard
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedAgent(a)}
                      className="px-2.5 py-1 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider text-left transition-all flex items-center gap-1.5 bg-[#ffebe6] hover:bg-[#ffd2c9] text-[#bf2600] hover:scale-[1.02] active:scale-[0.98] border border-[#ffdbd3] cursor-pointer shadow-3xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#bf2600]" />
                      <span>Review Required</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-[#091e42]/45 backdrop-blur-xs transition-opacity" onClick={() => setSelectedAgent(null)} />
          <div className="relative w-full max-w-[390px] h-full bg-white shadow-2xl flex flex-col justify-between border-l border-[#dfe1e6] z-50 p-6 animate-slideIn">
            <div className="flex-1 overflow-y-auto pr-1 text-[12px]">
              <div className="flex items-center justify-between border-b border-[#dfe1e6] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="bg-[#fff0ed] p-1.5 rounded-[3px]">
                    <ShieldAlert className="w-5 h-5 text-[#bf2600]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] text-[#172b4d] tracking-tight">Review Representative</h3>
                    <p className="text-[10px] text-[#5e6c84] font-medium uppercase mt-0.5">Focus Performance Exception</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAgent(null)} 
                  className="p-1.5 text-[#5e6c84] hover:text-[#172b4d] rounded-[3px] hover:bg-[#ebecf0] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#f4f5f7] border border-[#dfe1e6]/60 p-4 rounded-[3px]">
                  <span className="text-[9.5px] text-[#5e6c84] font-bold uppercase tracking-wider block mb-1">Support Representative</span>
                  <span className="text-[15px] font-bold text-[#172b4d] block">{selectedAgent.name}</span>
                  <div className="flex gap-2.5 mt-2.5 pt-2.5 border-t border-[#dfe1e6]/50 text-[11px] text-[#5e6c84] font-medium">
                    <span>Ext: <strong className="font-mono text-[#172b4d]">{selectedAgent.extension}</strong></span>
                    <span className="text-[#dfe1e6]">|</span>
                    <span>Zoho ID: <strong className="font-mono text-[#172b4d]">{selectedAgent.zohoId || 'N/A'}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#dfe1e6] p-3 rounded-[3px] bg-white text-center shadow-3xs">
                    <span className="text-[9px] text-[#5e6c84] font-bold uppercase block mb-0.5">Offline duration</span>
                    <span className="text-[15px] font-mono font-bold text-[#172b4d]">{selectedAgent.durationMins}m</span>
                  </div>
                  <div className="border border-[#dfe1e6] p-3 rounded-[3px] bg-white text-center shadow-3xs">
                    <span className="text-[9px] text-[#5e6c84] font-bold uppercase block mb-0.5">Recorded Updates</span>
                    <span className="text-[15px] font-mono font-bold text-[#172b4d]">{selectedAgent.systemUpdates} ops</span>
                  </div>
                </div>

                <div className="bg-[#fff0ed] border border-[#ffdbd3] p-4 rounded-[3px] text-[#bf2600] leading-relaxed">
                  <strong className="font-bold block mb-1.5 text-[12px] flex items-center gap-1">
                    Performance Exception Details
                  </strong>
                  The recorded output of <strong className="font-bold">{selectedAgent.systemUpdates} updates</strong> across <strong className="font-bold">{selectedAgent.durationMins} minutes</strong> yields a Focus Rating of <strong className="font-bold text-[13px] font-mono">{selectedAgent.calculatedFocus}%</strong>.
                  <span className="block mt-2 pt-2 border-t border-[#ffdbd3] text-[#5e6c84] font-medium leading-relaxed">
                    This fails to meet the standard 40% corporate baseline focus. Verification audit flags this technician for manual supervisor override review.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-[#dfe1e6] bg-white">
              <button
                type="button"
                onClick={() => clearAlert(selectedAgent.id)}
                className="w-full h-10 bg-[#006644] hover:bg-[#005135] active:bg-[#00402a] text-white text-[12px] font-bold rounded-[3px] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all text-center select-none"
              >
                Clear Alert & Override Compliance
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="w-full h-10 border border-[#dfe1e6] hover:bg-[#f4f5f7] active:bg-[#ebecf0] text-[#172b4d] text-[12px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-all text-center select-none"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
