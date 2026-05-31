// components/dashboard/view-surveys.tsx
// High-density outbound survey and automated carrier logs workspace
'use client';

import React from 'react';
import { Play, Download, RefreshCw } from 'lucide-react';
import { 
  AllRowsCounter, 
  SentCounter, 
  SkippedCounter, 
  DuplicateCounter,
  StatusTag,
  Tooltip,
  Toast,
  SortArrow 
} from '@/components/ui/component-feedback';
import { ExtensionMapping } from '@/types/data-matrix';
import { useSurveySimulation } from '@/hooks/use-survey-simulation';

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
  const {
    calls,
    isSimulating,
    toastMsg,
    setToastMsg,
    activeFilter,
    setActiveFilter,
    handleSimulation,
    handleCSVExport,
    filteredCalls,
    countAll,
    countSent,
    countSkipped,
    countDuplicate,
  } = useSurveySimulation({ mappings, sortBy, order });

  return (
    <div className="flex flex-col gap-5 animate-fadeIn text-left">
      {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />}

      <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Tooltip content="Outbound text dispatches check call durations and caps before launching.">
            <h2 className="text-[14px] font-bold text-text-charcoal border-b border-dashed border-border-soft/80 pb-0.5 inline-block select-none">
              Automated Outbound Text System & Delivery Logs
            </h2>
          </Tooltip>
          <p className="text-[12.5px] text-text-muted mt-1">
            Auditing 3CX call events and automatic outbound message rules. Click columns to sort registry spreadsheet records.
          </p>
        </div>

        <button
          onClick={handleSimulation}
          disabled={isSimulating}
          type="button"
          className="h-8 px-4 bg-accent-blue hover:opacity-90 disabled:bg-accent-blue/70 text-canvas-bg text-[12px] font-bold rounded-[3px] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
        >
          {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white text-canvas-bg" />}
          <span>Run Live 3CX Simulation</span>
        </button>
      </div>

      <div className="badge-container-grid select-none flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2 w-full md:grid md:grid-cols-4">
        <AllRowsCounter count={countAll} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
        <SentCounter count={countSent} active={activeFilter === 'sent'} onClick={() => setActiveFilter('sent')} />
        <SkippedCounter count={countSkipped} active={activeFilter === 'skipped'} onClick={() => setActiveFilter('skipped')} />
        <DuplicateCounter count={countDuplicate} active={activeFilter === 'duplicate'} onClick={() => setActiveFilter('duplicate')} />
      </div>

      <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-4 shadow-xs">
        <h3 className="text-[12.5px] font-bold text-text-charcoal pb-2 border-b border-border-soft mb-3">
          Live Inbound Processing Feed (Latest 5 Events)
        </h3>
        
        <div className="overflow-x-auto border border-border-soft rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11.5px]">
            <thead className="bg-sidebar-bg border-b border-border-soft text-text-muted font-bold uppercase text-[9px] select-none">
              <tr>
                <th className="p-2.5 pl-4 border-r border-border-soft">Representative Name</th>
                <th className="p-2.5 border-r border-border-soft">Customer Number</th>
                <th className="p-2.5 border-r border-border-soft text-center">Duration</th>
                <th className="p-2.5 pl-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft text-text-charcoal bg-canvas-bg">
              {calls.slice(0, 5).map((log, i) => {
                const rep = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                const labelClass = log.delivery_status === 'Sent' 
                  ? 'bg-status-verified-bg text-status-verified-text border border-status-verified-text/10' 
                  : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'bg-status-skipped-bg text-status-skipped-text border border-status-skipped-text/10' : 'bg-status-attention-bg text-status-attention-text border border-status-attention-text/10');
                const labelText = log.delivery_status === 'Sent' ? 'SENT' : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'SKIPPED' : 'DUPLICATE');
                return (
                  <tr key={i} className="hover:bg-sidebar-bg/20 transition-all font-medium">
                    <td className="p-2.5 pl-4 border-r border-border-soft font-bold">{rep} <span className="font-mono text-text-muted font-normal text-[9.5px] ml-1.5">(Ext {log.agent_extension})</span></td>
                    <td className="p-2.5 border-r border-border-soft font-mono text-text-muted">{log.customer_phone}</td>
                    <td className="p-2.5 border-r border-border-soft text-center font-mono text-text-muted">{log.call_duration_seconds}s</td>
                    <td className="p-2.5 pl-4">
                      <StatusTag className={labelClass}>{labelText}</StatusTag>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-border-soft mb-3 gap-3">
          <h3 className="text-[12.5px] font-bold text-text-charcoal flex items-center gap-1.5 select-none">
            Raw Call Registry Spreadsheet
            <span className="text-[10px] font-semibold text-text-muted bg-border-soft/60 px-1.5 py-0.5 rounded">
              {filteredCalls.length} visible
            </span>
          </h3>
          <button 
            onClick={handleCSVExport}
            type="button"
            className="h-7 px-3 border border-border-soft hover:border-text-muted text-text-charcoal text-[11px] font-bold bg-canvas-bg hover:bg-sidebar-bg rounded-[3px] flex items-center gap-1.5 transition-all cursor-pointer select-none"
          >
            <Download className="w-3.5 h-3.5" /> Export Table to CSV
          </button>
        </div>

        <div className="max-h-[350px] overflow-y-auto border border-border-soft rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-sidebar-bg sticky top-0 z-10 border-b border-border-soft text-text-muted font-bold uppercase text-[9px] select-none">
              <tr>
                <th onClick={() => onSort('processed_at')} className="p-2 cursor-pointer hover:bg-border-soft/40 transition-colors border-r border-border-soft pl-3">Timestamp <SortArrow active={sortBy === 'processed_at'} order={order} /></th>
                <th onClick={() => onSort('customer_phone')} className="p-2 cursor-pointer hover:bg-border-soft/40 transition-colors border-r border-border-soft">Customer Number <SortArrow active={sortBy === 'customer_phone'} order={order} /></th>
                <th onClick={() => onSort('agent_extension')} className="p-2 cursor-pointer hover:bg-border-soft/40 transition-colors border-r border-border-soft text-center">Extension <SortArrow active={sortBy === 'agent_extension'} order={order} /></th>
                <th className="p-2 border-r border-border-soft">Representative Name</th>
                <th className="p-2 pl-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft bg-canvas-bg text-text-charcoal">
              {filteredCalls.map((log, i) => {
                const rep = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                const finalStatus = log.delivery_status === 'Sent' ? 'SENT' : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'SKIPPED' : 'DUPLICATE');
                const finalColor = log.delivery_status === 'Sent' 
                  ? 'bg-status-verified-bg text-status-verified-text border border-status-verified-text/10' 
                  : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'bg-status-skipped-bg text-status-skipped-text border border-status-skipped-text/10' : 'bg-status-attention-bg text-status-attention-text border border-status-attention-text/10');
                return (
                  <tr key={i} className="hover:bg-sidebar-bg/20 transition-all font-medium">
                    <td className="p-2 pl-3 border-r border-border-soft font-mono text-text-muted">{new Date(log.processed_at).toLocaleTimeString()}</td>
                    <td className="p-2 border-r border-border-soft font-mono font-bold">{log.customer_phone}</td>
                    <td className="p-2 border-r border-border-soft text-center font-mono">Ext {log.agent_extension}</td>
                    <td className="p-2 border-r border-border-soft">{rep}</td>
                    <td className="p-2 pl-3">
                      <StatusTag className={finalColor}>{finalStatus}</StatusTag>
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
