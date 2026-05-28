// view-surveys.tsx
// High-density outbound survey and automated carrier logs workspace
'use client';

import React, { useState, useMemo } from 'react';
import { Play, Download, RefreshCw } from 'lucide-react';
import { Tooltip, Toast, SortArrow } from './component-feedback';
import { ExtensionMapping, generateSimulationRecords, CallEvent } from './types-matrix';

interface ViewSurveysProps {
  mappings: ExtensionMapping[];
  sortBy: string;
  order: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function ViewSurveys({
  mappings,
  sortBy,
  order,
  onSort,
}: ViewSurveysProps) {
  const [calls, setCalls] = useState<CallEvent[]>(() => generateSimulationRecords());
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'skipped' | 'duplicate'>('all');

  const handleSimulation = async () => {
    setIsSimulating(true);
    // Total Cache Flush: set to empty array immediately before generating fresh batch
    setCalls([]); 
    await new Promise(r => setTimeout(r, 400));
    setCalls(generateSimulationRecords());
    setToastMsg("Simulation Complete: 300 Records Analyzed.");
    setIsSimulating(false);
  };

  const handleCSVExport = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm("Confirm download of twilio_outbound_delivery_log.csv? (Contains exactly 300 logs)");
      if (!confirmed) return;

      const header = "Timestamp,Extension,Representative Name,Customer Number,Duration,Status\n";
      const rows = calls.map(c => {
        const rep = mappings.find(m => m.extension === c.agent_extension)?.mappedName || `Ext ${c.agent_extension}`;
        const s = c.delivery_status === 'Sent' ? 'Sent' : (c.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped: Short' : 'Duplicate');
        return `"${c.processed_at}","Ext ${c.agent_extension}","${rep}","${c.customer_phone}",${c.call_duration_seconds},"${s}"`;
      }).join("\n");

      const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "twilio_outbound_delivery_log.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToastMsg("Export Complete: Download file initiated successfully.");
    }
  };

  const sortedCalls = useMemo(() => {
    if (!sortBy) return calls;
    const f = sortBy === 'customer_phone' ? 'customer_phone' : (sortBy === 'agent_extension' ? 'agent_extension' : 'processed_at');
    return [...calls].sort((a, b) => {
      const valA = a[f] || '';
      const valB = b[f] || '';
      const comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return order === 'asc' ? comp : -comp;
    });
  }, [calls, sortBy, order]);

  const filteredCalls = useMemo(() => {
    return sortedCalls.filter(c => {
      if (activeFilter === 'sent') return c.delivery_status === 'Sent';
      if (activeFilter === 'skipped') return c.delivery_status === 'Skipped: Under 2 Minutes';
      if (activeFilter === 'duplicate') return c.delivery_status === 'Skipped: Daily Cap Hit';
      return true;
    });
  }, [sortedCalls, activeFilter]);

  const countAll = calls.length;
  const countSent = calls.filter(c => c.delivery_status === 'Sent').length;
  const countSkipped = calls.filter(c => c.delivery_status === 'Skipped: Under 2 Minutes').length;
  const countDuplicate = calls.filter(c => c.delivery_status === 'Skipped: Daily Cap Hit').length;

  return (
    <div className="flex flex-col gap-5 animate-fadeIn text-left">
      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}

      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 flex flex-col md:flex-row md:items-center md:justify-between justify-between gap-4">
        <div>
          <Tooltip content="Outbound text dispatches check call durations and caps before launching.">
            <h2 className="text-[14px] font-bold text-[#172b4d] border-b border-dashed border-[#dfe1e6]/80 pb-0.5 inline-block select-none">
              Automated Outbound Text System & Delivery Logs
            </h2>
          </Tooltip>
          <p className="text-[12.5px] text-[#5e6c84] mt-1">
            Auditing 3CX call events and automatic outbound message rules. Click columns to sort registry spreadsheet records.
          </p>
        </div>

        <button
          onClick={handleSimulation}
          disabled={isSimulating}
          className="h-8 px-4 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-[#0052cc]/70 text-white text-[12px] font-bold rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white text-white" />}
          <span>Run Live 3CX Simulation</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
        {[
          { label: "All Rows", count: `${countAll} Registers`, filter: 'all', style: 'border-[#dfe1e6]' },
          { label: "Sent Logs", count: `${countSent} Dispatched`, filter: 'sent', style: 'text-[#006644] border-[#006644]' },
          { label: "Skipped: Short", count: `${countSkipped} Suppressed`, filter: 'skipped', style: 'text-[#172b4d]' },
          { label: "Duplicate", count: `${countDuplicate} Filtered`, filter: 'duplicate', style: 'text-[#bf2600]' },
        ].map(b => (
          <button 
            key={b.filter}
            onClick={() => setActiveFilter(b.filter as any)}
            className={`p-3 bg-white border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left ${activeFilter === b.filter ? 'border-[#0052cc] bg-[#ebecf0]/30' : 'border-[#dfe1e6] hover:bg-[#f4f5f7]/30'}`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5e6c84]">{b.label}</span>
            <span className={`text-[16px] font-bold mt-1 ${b.style}`}>{b.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 shadow-xs">
        <h3 className="text-[12.5px] font-bold text-[#172b4d] pb-2 border-b border-[#dfe1e6] mb-3">
          Live Inbound Processing Feed (Latest 5 Events)
        </h3>
        
        <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11.5px]">
            <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9px] select-none">
              <tr>
                <th className="p-2.5 pl-4 border-r border-[#dfe1e6]">Representative Name</th>
                <th className="p-2.5 border-r border-[#dfe1e6]">Customer Number</th>
                <th className="p-2.5 border-r border-[#dfe1e6] text-center">Duration</th>
                <th className="p-2.5 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe1e6] text-[#172b4d] bg-white">
              {calls.slice(0, 5).map((log, i) => {
                const rep = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                const labelColor = log.delivery_status === 'Sent' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]';
                const labelText = log.delivery_status === 'Sent' ? 'Sent' : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped: Short' : 'Duplicate');
                return (
                  <tr key={i} className="hover:bg-[#f4f5f7]/20 transition-all font-medium">
                    <td className="p-2.5 pl-4 border-r border-[#dfe1e6] font-bold">{rep} <span className="font-mono text-[#5e6c84] font-normal text-[9.5px] ml-1.5">(Ext {log.agent_extension})</span></td>
                    <td className="p-2.5 border-r border-[#dfe1e6] font-mono text-[#5e6c84]">{log.customer_phone}</td>
                    <td className="p-2.5 border-r border-[#dfe1e6] text-center font-mono text-[#5e6c84]">{log.call_duration_seconds}s</td>
                    <td className="p-2.5 pl-4">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase ${labelColor}`}>
                        {labelText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#dfe1e6] mb-3 gap-3">
          <h3 className="text-[12.5px] font-bold text-[#172b4d] flex items-center gap-1.5 select-none">
            Raw Call Registry Spreadsheet
            <span className="text-[10px] font-semibold text-[#5e6c84] bg-[#ebecf0] px-1.5 py-0.5 rounded">
              {filteredCalls.length} visible
            </span>
          </h3>
          <button 
            onClick={handleCSVExport}
            className="h-7 px-3 border border-[#dfe1e6] hover:border-[#5e6c84] text-[#172b4d] text-[11px] font-bold bg-white hover:bg-[#f4f5f7]/20 rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          >
            <Download className="w-3.5 h-3.5" /> Export Table to CSV
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto border border-[#dfe1e6] rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-[#f4f5f7] sticky top-0 z-10 border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9px] select-none shadow-[0_1px_0_0_rgba(223,225,230,1)]">
              <tr>
                <th onClick={() => onSort('processed_at')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] pl-3">Timestamp <SortArrow active={sortBy === 'processed_at'} order={order} /></th>
                <th onClick={() => onSort('customer_phone')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6]">Customer Number <SortArrow active={sortBy === 'customer_phone'} order={order} /></th>
                <th onClick={() => onSort('agent_extension')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] text-center">Extension <SortArrow active={sortBy === 'agent_extension'} order={order} /></th>
                <th className="p-2 border-r border-[#dfe1e6]">Representative Name</th>
                <th className="p-2 pl-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe1e6] bg-white text-[#172b4d]">
              {filteredCalls.map((log, i) => {
                const rep = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                const finalStatus = log.delivery_status === 'Sent' ? 'Sent' : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped: Short' : 'Duplicate');
                return (
                  <tr key={i} className="hover:bg-[#f4f5f7]/20 transition-all font-medium">
                    <td className="p-2 pl-3 border-r border-[#dfe1e6] font-mono text-[#5e6c84]">{new Date(log.processed_at).toLocaleTimeString()}</td>
                    <td className="p-2 border-r border-[#dfe1e6] font-mono font-bold">{log.customer_phone}</td>
                    <td className="p-2 border-r border-[#dfe1e6] text-center font-mono">Ext {log.agent_extension}</td>
                    <td className="p-2 border-r border-[#dfe1e6]">{rep}</td>
                    <td className="p-2 pl-3">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase ${log.delivery_status === 'Sent' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]'}`}>
                        {finalStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
