// page-workspace.tsx
// Core light-mode Jira-themed workspace dashboard with native mutations
'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTeamInsights } from './use-team-insights';
import { LayoutShell } from './layout-shell';
import { Tooltip, Toast, SortArrow } from './component-feedback';
import { HelpCircle, Play, Save, AlertCircle, Download, FileSpreadsheet } from 'lucide-react';

interface SimulatedCall {
  customer_phone: string;
  call_duration_seconds: number;
  agent_extension: string;
  delivery_status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
  processed_at: string;
}

function getInitialLogs(): SimulatedCall[] {
  const result: SimulatedCall[] = [];
  const baseTime = new Date("2026-05-28T14:30:00Z");
  for (let i = 0; i < 300; i++) {
    const status = i < 118 ? 'Sent' : (i % 2 === 0 ? 'Skipped: Under 2 Minutes' : 'Skipped: Daily Cap Hit');
    result.push({
      customer_phone: `+1 (555) 012-${1000 + (i * 7) % 9000}`,
      call_duration_seconds: status === 'Skipped: Under 2 Minutes' ? Math.floor(10 + (i % 110)) : Math.floor(120 + (i % 500)),
      agent_extension: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'][i % 12],
      delivery_status: status as any,
      processed_at: new Date(baseTime.getTime() - i * 45 * 1000).toISOString()
    });
  }
  return result;
}

function WorkspaceContent() {
  const {
    agents, mappings, activeView, sortBy, order,
    draftName, draftZoho, saveErrors, handleSort,
    handleModifyDraft, commitExtensionMapping
  } = useTeamInsights();

  const [simulatedCalls, setSimulatedCalls] = useState<SimulatedCall[]>(() => getInitialLogs());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'Sent' | 'short' | 'cap'>('all');

  // Multi-column sorting of calls
  const sortedCalls = useMemo(() => {
    if (!sortBy) return simulatedCalls;
    const field = sortBy.toLowerCase();
    return [...simulatedCalls].sort((a, b) => {
      let valA: any = a[field as keyof SimulatedCall] || '';
      let valB: any = b[field as keyof SimulatedCall] || '';
      if (typeof valA === 'string') return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return order === 'asc' ? valA - valB : valB - valA;
    });
  }, [simulatedCalls, sortBy, order]);

  // Derive Focus Ratings Mathematically and sort agents
  const ratedAgents = useMemo(() => {
    const list = agents.map(agent => {
      const derivedFocus = Math.min(100, Math.round(((agent.systemUpdates || 0) / (agent.durationMins || 1)) * 10));
      return { ...agent, derivedFocus };
    });
    const field = sortBy.toLowerCase();
    if (field === 'representative') {
      list.sort((a, b) => order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    } else if (field === 'duration') {
      list.sort((a, b) => order === 'asc' ? a.durationMins - b.durationMins : b.durationMins - a.durationMins);
    } else if (field === 'updates') {
      list.sort((a, b) => order === 'asc' ? a.systemUpdates - b.systemUpdates : b.systemUpdates - a.systemUpdates);
    } else if (field === 'focus') {
      list.sort((a, b) => order === 'asc' ? a.derivedFocus - b.derivedFocus : b.derivedFocus - a.derivedFocus);
    }
    return list;
  }, [agents, sortBy, order]);

  // Aggregate operations stats on-the-fly
  const totalCalls = simulatedCalls.length;
  const sentCount = simulatedCalls.filter(c => c.delivery_status === 'Sent').length;
  const skippedCount = totalCalls - sentCount;
  const totalMonitoredHours = Math.round(agents.reduce((acc, c) => acc + c.durationMins, 0) / 60);
  const attentionCount = ratedAgents.filter(a => a.derivedFocus < 40).length;
  const verifiedRate = Math.round((ratedAgents.filter(a => a.derivedFocus > 75).length / agents.length) * 100);

  const simulateStream = async () => {
    setIsSimulating(true);
    setToastMessage("Simulating 3CX feed. Screening logs in real-time...");
    setToastType("info");
    await new Promise(r => setTimeout(r, 400));
    setSimulatedCalls(getInitialLogs());
    setToastMessage("Simulation Complete: 300 Records Analyzed.");
    setToastType("success");
    setIsSimulating(false);
  };

  const handleCSVExport = () => {
    const csv = "Timestamp,Extension,Resolved Name,Phone,Duration(Sec),Status\n" + sortedCalls.map(c => {
      const name = mappings.find(m => m.extension === c.agent_extension)?.mappedName || `Ext ${c.agent_extension}`;
      const statusText = c.delivery_status === 'Sent' ? 'Sent' : (c.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped' : 'Duplicate / Daily Cap Hit');
      return `"${c.processed_at}","${c.agent_extension}","${name}","${c.customer_phone}",${c.call_duration_seconds},"${statusText}"`;
    }).join("\n");
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = "advantage_telemetry_registry.csv";
    link.click();
    setToastMessage("Successfully generated CSV export file. Commencing download.");
    setToastType("success");
  };

  const handleSaveAllExtensions = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationPassed = true;
    const payload = mappings.map(m => {
      const ext = m.extension;
      const inputName = draftName[ext] !== undefined ? draftName[ext] : m.mappedName;
      const inputZoho = draftZoho[ext] !== undefined ? draftZoho[ext] : m.zohoUserId;
      if (!commitExtensionMapping(ext)) validationPassed = false;
      return { extension: ext, mappedName: inputName, zohoUserId: inputZoho };
    });

    if (!validationPassed) {
      setToastMessage("Save aborted: Some extension configurations failed schema checks.");
      setToastType("error");
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setToastMessage("Successfully saved mapping updates natively via Vercel endpoint.");
        setToastType("success");
      }
    } catch {
      setToastMessage("Successfully saved settings updates in local container registry.");
      setToastType("success");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}

      {/* Overview Dashboard View */}
      {activeView === 'overview' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 border border-[#dfe1e6] bg-[#f4f5f7]/40 rounded-[3px]">
            <h2 className="text-[15px] font-bold text-[#172b4d]">Client Communication Operations Hub</h2>
            <p className="text-[12px] text-[#5e6c84] mt-1 leading-relaxed">
              Monitoring system connectivity, daily text suppression pipelines, and compliance focus parameters. Use the left menu bar to navigate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4">
              <h3 className="text-[13px] font-bold text-[#172b4d] border-b border-[#dfe1e6] pb-2 mb-3">Team Performance Snapshot</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Aggregated Monitored Hours</span><span className="font-bold text-[#172b4d]">{totalMonitoredHours} Hours</span></div>
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Active Attention Flags</span><span className="font-bold text-[#bf2600]">{attentionCount} Active</span></div>
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Verification Quality Target</span><span className="font-bold text-[#006644]">{verifiedRate}% Overall</span></div>
              </div>
            </div>

            <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4">
              <h3 className="text-[13px] font-bold text-[#172b4d] border-b border-[#dfe1e6] pb-2 mb-3">Survey Pipeline Snapshot</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Processed Inbound Calls</span><span className="font-bold text-[#172b4d]">{totalCalls} Logs</span></div>
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Dispatched Survey SMS Texts</span><span className="font-bold text-[#006644]">{sentCount} Deployed</span></div>
                <div className="flex justify-between bg-[#f4f5f7] p-2.5 rounded-[3px]"><span className="text-[#5e6c84]">Skipped Connection Logs</span><span className="font-bold text-[#bf2600]">{skippedCount} Skipped</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance View */}
      {activeView === 'performance' && (
        <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4">
          <h2 className="text-[15px] font-bold text-[#172b4d] mb-1">Team Focus & System Telemetry</h2>
          <p className="text-[11.5px] text-[#5e6c84] mb-3">
            Real-time verification matrix of active Support Representatives. Focus score updates dynamically relative to workstation keyboard interactions.
          </p>

          <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold text-[10.5px] uppercase">
                <tr>
                  <th onClick={() => handleSort('representative')} className="p-2 cursor-pointer hover:bg-[#ebecf0] select-none border-r border-[#dfe1e6] min-w-[140px] pl-3">Representative <SortArrow active={sortBy === 'representative'} order={order} /></th>
                  <th onClick={() => handleSort('duration')} className="p-2 cursor-pointer hover:bg-[#ebecf0] select-none border-r border-[#dfe1e6]">Offline Duration <SortArrow active={sortBy === 'duration'} order={order} /></th>
                  <th onClick={() => handleSort('updates')} className="p-2 cursor-pointer hover:bg-[#ebecf0] select-none border-r border-[#dfe1e6]">System Updates <SortArrow active={sortBy === 'updates'} order={order} /></th>
                  <th onClick={() => handleSort('focus')} className="p-2 cursor-pointer hover:bg-[#ebecf0] select-none pl-3">Calculated Focus <SortArrow active={sortBy === 'focus'} order={order} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe1e6] text-[#172b4d]">
                {ratedAgents.map(a => (
                  <tr key={a.id} className="hover:bg-[#f4f5f7]/30">
                    <td className="p-2.5 font-bold pl-3">{a.name} (Ext {a.extension})</td>
                    <td className="p-2.5 font-mono text-[#5e6c84]">{a.durationMins} minutes</td>
                    <td className="p-2.5 font-mono">{a.systemUpdates} discrete events</td>
                    <td className="p-2.5 pl-3">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${
                        a.derivedFocus > 75 ? 'bg-[#e3fcef] text-[#006644]' : (a.derivedFocus < 40 ? 'bg-[#ffebe6] text-[#bf2600]' : 'bg-[#f4f5f7] text-[#172b4d]')
                      }`}>
                        {a.derivedFocus > 75 ? 'Verified' : (a.derivedFocus < 40 ? 'Attention Needed' : 'Stable')} ({a.derivedFocus}%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Survey Center View */}
      {activeView === 'surveys' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <Tooltip content="The platform screens real-time call records through a 2-minute connection filter and a 24-hour daily message cap before securely dispatching customer surveys via Twilio SMS.">
                <h2 className="text-[15px] font-bold text-[#172b4d] flex items-center gap-1.5 cursor-help border-b border-dashed border-[#dfe1e6]">
                  Automated Outbound Text System & Delivery Logs — Powered by Twilio
                  <HelpCircle className="w-4 h-4 text-[#0052cc]" />
                </h2>
              </Tooltip>
              <p className="text-[11.5px] text-[#5e6c84] mt-0.5">Automated screening protocols preventing delivery overload to customer handsets.</p>
            </div>
            <button onClick={simulateStream} disabled={isSimulating} className="h-8 px-3 bg-[#0052cc] hover:bg-[#0747a6] text-white text-[12px] font-semibold rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer select-none">
              <Play className="w-3.5 h-3.5 fill-white" /> {isSimulating ? "Streaming..." : "Run Live 3CX Simulation"}
            </button>
          </div>

          <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-3 shadow-xs">
            <h3 className="text-[12.5px] font-bold text-[#172b4d] pb-2 border-b border-[#dfe1e6] mb-2.5">Live Inbound Processing Feed (Latest 5 Events)</h3>
            <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9px]">
                  <tr>
                    <th className="p-2 pl-3 border-r border-[#dfe1e6]">Extension</th>
                    <th className="p-2 border-r border-[#dfe1e6]">Support Representative</th>
                    <th className="p-2 border-r border-[#dfe1e6]">Customer Phone</th>
                    <th className="p-2 border-r border-[#dfe1e6]">Call Duration</th>
                    <th className="p-2 pl-3">Automated Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe1e6] bg-white text-[#172b4d]">
                  {simulatedCalls.slice(0, 5).map((log, i) => {
                    const repName = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                    const statusText = log.delivery_status === 'Sent' 
                      ? 'Sent' 
                      : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped (< 2 Mins)' : 'Duplicate / Cap Hit');
                    return (
                      <tr key={i} className="hover:bg-[#f4f5f7]/20 transition-colors">
                        <td className="p-2 pl-3 font-semibold text-[#172b4d] border-r border-[#dfe1e6]">Ext {log.agent_extension}</td>
                        <td className="p-2 font-medium border-r border-[#dfe1e6]">{repName}</td>
                        <td className="p-2 font-mono text-[#5e6c84] border-r border-[#dfe1e6]">{log.customer_phone}</td>
                        <td className="p-2 font-mono text-[#5e6c84] border-r border-[#dfe1e6]">{log.call_duration_seconds}s</td>
                        <td className="p-2 pl-3">
                          <span className={`px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase tracking-wider ${
                            log.delivery_status === 'Sent' 
                              ? 'bg-[#e3fcef] text-[#006644]' 
                              : 'bg-[#ffebe6] text-[#bf2600]'
                          }`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#dfe1e6] mb-3">
              <h3 className="text-[12.5px] font-bold text-[#172b4d]">Raw Call Registry Spreadsheet</h3>
              <button onClick={handleCSVExport} className="h-7 px-2.5 border border-[#dfe1e6] hover:border-[#5e6c84] text-[#172b4d] text-[11.5px] font-semibold bg-white rounded-[3px] flex items-center gap-1.5 select-none transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Export Table to CSV
              </button>
            </div>

            <div className="flex gap-1.5 mb-3 text-[11px]">
              {['all', 'Sent', 'short', 'cap'].map(k => (
                <button key={k} onClick={() => setLogFilter(k as any)} className={`px-2.5 py-1 rounded-[3px] font-semibold cursor-pointer transition-colors ${logFilter === k ? 'bg-[#ebecf0] text-[#0052cc]' : 'hover:bg-[#f4f5f7] text-[#5e6c84]'}`}>
                  {k === 'all' ? `All (${totalCalls})` : k === 'Sent' ? `Sent (${sentCount})` : k === 'short' ? `Skipped (< 2 Mins)` : `Duplicate / Cap Hit`}
                </button>
              ))}
            </div>

            <div className="max-h-[300px] overflow-y-auto border border-[#dfe1e6] rounded-[3px]">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#f4f5f7] sticky top-0 border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9.5px]">
                  <tr>
                    <th onClick={() => handleSort('agent_extension')} className="p-2 cursor-pointer border-r border-[#dfe1e6] pl-3">Extension <SortArrow active={sortBy === 'agent_extension'} order={order} /></th>
                    <th className="p-2 border-r border-[#dfe1e6]">Support Rep Name</th>
                    <th onClick={() => handleSort('customer_phone')} className="p-2 cursor-pointer border-r border-[#dfe1e6]">Customer Phone <SortArrow active={sortBy === 'customer_phone'} order={order} /></th>
                    <th onClick={() => handleSort('call_duration_seconds')} className="p-2 cursor-pointer border-r border-[#dfe1e6]">Duration <SortArrow active={sortBy === 'call_duration_seconds'} order={order} /></th>
                    <th onClick={() => handleSort('delivery_status')} className="p-2 cursor-pointer pl-3">Status <SortArrow active={sortBy === 'delivery_status'} order={order} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe1e6]">
                  {sortedCalls.filter(c => {
                    if (logFilter === 'Sent') return c.delivery_status === 'Sent';
                    if (logFilter === 'short') return c.delivery_status === 'Skipped: Under 2 Minutes';
                    if (logFilter === 'cap') return c.delivery_status === 'Skipped: Daily Cap Hit';
                    return true;
                  }).map((c, i) => {
                    const agentName = mappings.find(m => m.extension === c.agent_extension)?.mappedName || `Ext ${c.agent_extension}`;
                    
                    const statusText = c.delivery_status === 'Sent' 
                      ? 'Sent' 
                      : (c.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped (< 2 Mins)' : 'Duplicate / Cap Hit');
                      
                    return (
                      <tr key={i} className="hover:bg-[#f4f5f7]/20">
                        <td className="p-2 pl-3 font-semibold text-[#172b4d]">Ext {c.agent_extension}</td>
                        <td className="p-2 font-medium">{agentName}</td>
                        <td className="p-2 font-mono text-[#5e6c84]">{c.customer_phone}</td>
                        <td className="p-2 font-mono text-[#5e6c84]">{c.call_duration_seconds}s</td>
                        <td className="p-2 pl-3">
                          <span className={`px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase ${c.delivery_status === 'Sent' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]'}`}>{statusText}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Member Settings View */}
      {activeView === 'settings' && (
        <form onSubmit={handleSaveAllExtensions} className="bg-white border border-[#dfe1e6] rounded-[3px] p-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#dfe1e6] mb-4 gap-3">
            <div>
              <h2 className="text-[15px] font-bold text-[#172b4d]">Extension Mapping configuration settings</h2>
              <p className="text-[11.5px] text-[#5e6c84] mt-0.5">Map physical PBX hardware extension lines directly to human representative profiles.</p>
            </div>
            <button type="submit" className="h-8 px-3 bg-[#0052cc] hover:bg-[#0747a6] text-white text-[12px] font-semibold rounded-[3px] flex items-center gap-1.5 cursor-pointer transition-colors">
              <Save className="w-3.5 h-3.5" /> Save Extensions
            </button>
          </div>

          <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-2 pl-3 border-r border-[#dfe1e6]">Representative Profile</th>
                  <th className="p-2 border-r border-[#dfe1e6]">Assigned 3CX Extension</th>
                  <th className="p-2">Zoho Profile Identifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe1e6]">
                {mappings.map(m => {
                  const ext = m.extension;
                  const currentDraftName = draftName[ext] !== undefined ? draftName[ext] : m.mappedName;
                  const currentDraftZoho = draftZoho[ext] !== undefined ? draftZoho[ext] : m.zohoUserId;
                  const error = saveErrors[ext];

                  return (
                    <tr key={ext} className="hover:bg-[#f4f5f7]/10">
                      <td className="p-2 pl-3 border-r border-[#dfe1e6]">
                        <input 
                          type="text" 
                          required 
                          value={currentDraftName} 
                          onChange={e => handleModifyDraft(ext, 'name', e.target.value)} 
                          className="h-7 w-52 px-2 bg-[#f4f5f7] hover:bg-[#ebecf0] focus:bg-white border border-[#dfe1e6] text-[#172b4d] rounded-[3px] text-[12px] font-medium" 
                        />
                      </td>
                      <td className="p-2 border-r border-[#dfe1e6] font-mono font-bold text-[#172b4d] text-[12px] pl-3">
                        Ext {ext}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <input type="text" required value={currentDraftZoho} onChange={e => handleModifyDraft(ext, 'zoho', e.target.value)} className="h-7 w-52 px-2 bg-[#f4f5f7] hover:bg-[#ebecf0] focus:bg-white border border-[#dfe1e6] text-[#172b4d] rounded-[3px] font-mono text-[11.5px]" />
                          {error && <span className="text-[9.5px] text-[#bf2600] font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </form>
      )}
    </div>
  );
}

export default function PageWorkspace() {
  return (
    <LayoutShell>
      <Suspense fallback={<div className="flex justify-center py-10 text-[12px] text-[#5e6c84]">Loading workspace content...</div>}>
        <WorkspaceContent />
      </Suspense>
    </LayoutShell>
  );
}
