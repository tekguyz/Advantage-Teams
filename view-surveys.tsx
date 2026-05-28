// view-surveys.tsx
// High-density Survey Delivery center with Twilio tooltip configurations and live 3CX simulation streams
'use client';

import React, { useState, useMemo } from 'react';
import { HelpCircle, Play, Download, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Tooltip, Toast, SortArrow } from './component-feedback';
import { ExtensionMapping } from './types-matrix';

interface CallEvent {
  processed_at: string;
  agent_extension: string;
  customer_phone: string;
  call_duration_seconds: number;
  delivery_status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
}

function generateSimulationRecords(): CallEvent[] {
  const list: CallEvent[] = [];
  const baseTime = new Date("2026-05-28T16:00:00Z");
  
  // Predictably allocate exactly 300 records to align with the counters:
  // All Rows: 300
  // Sent: 123
  // Skipped: Short: 105
  // Duplicate: 72
  for (let i = 0; i < 300; i++) {
    let status: 'Sent' | 'Skipped: Under 2 Minutes' | 'Skipped: Daily Cap Hit';
    if (i < 123) {
      status = 'Sent';
    } else if (i < 123 + 105) {
      status = 'Skipped: Under 2 Minutes';
    } else {
      status = 'Skipped: Daily Cap Hit'; // Map to "Duplicate" label
    }

    // Distribute across typical active representative numeric extension mappings
    const extensionList = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112'];
    const assignedExtension = extensionList[i % extensionList.length];

    list.push({
      processed_at: new Date(baseTime.getTime() - i * 36 * 1000).toISOString(),
      agent_extension: assignedExtension,
      customer_phone: `+1 (555) 019-${2200 + (i * 13) % 7700}`,
      call_duration_seconds: status === 'Skipped: Under 2 Minutes' 
        ? Math.floor(10 + (i % 109)) 
        : Math.floor(121 + (i % 400)),
    });
  }
  return list;
}

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'skipped' | 'duplicate'>('all');

  // Trigger outbound live ticker feed simulation
  const handleSimulation = async () => {
    setIsSimulating(true);
    setToastMessage("Initiating outbound Twilio carrier check. Syncing 3CX stream...");
    setToastType("info");
    
    await new Promise(r => setTimeout(r, 650));
    setCalls(generateSimulationRecords());
    
    setToastMessage("Simulation Complete: 300 Records Analyzed.");
    setToastType("success");
    setIsSimulating(false);
  };

  const handleCSVExport = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm("Commence download of twilio_outbound_delivery_log.csv? (Exactly 300 items will be exported)");
      if (!confirmed) return;

      const csvHeader = "Timestamp,Extension ID,Representative Name,Phone Number,Duration(Sec),Status\n";
      const csvContent = calls.map(c => {
        const repName = mappings.find(m => m.extension === c.agent_extension)?.mappedName || `Ext ${c.agent_extension}`;
        const finalStatus = c.delivery_status === 'Sent' ? 'Sent' : (c.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped' : 'Duplicate');
        return `"${c.processed_at}","Ext ${c.agent_extension}","${repName}","${c.customer_phone}",${c.call_duration_seconds},"${finalStatus}"`;
      }).join("\n");

      const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "twilio_outbound_delivery_log.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage("Export succeeded. Completed download file of Raw Telemetry.");
      setToastType("success");
    }
  };

  // Perform multi-column sorting on selected states
  const sortedCalls = useMemo(() => {
    if (!sortBy) return calls;
    const field = sortBy.toLowerCase();
    return [...calls].sort((a, b) => {
      let valA: any = a[field as keyof CallEvent] || '';
      let valB: any = b[field as keyof CallEvent] || '';
      
      if (typeof valA === 'string') {
        return order === 'asc' 
          ? valA.localeCompare(valB, undefined, { numeric: true }) 
          : valB.localeCompare(valA, undefined, { numeric: true });
      }
      return order === 'asc' ? valA - valB : valB - valA;
    });
  }, [calls, sortBy, order]);

  // Filter logs safely helper
  const filteredCalls = useMemo(() => {
    return sortedCalls.filter(c => {
      if (activeFilter === 'sent') return c.delivery_status === 'Sent';
      if (activeFilter === 'skipped') return c.delivery_status === 'Skipped: Under 2 Minutes';
      if (activeFilter === 'duplicate') return c.delivery_status === 'Skipped: Daily Cap Hit';
      return true;
    });
  }, [sortedCalls, activeFilter]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}

      {/* Corporate Outbound Survey Panel */}
      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-5 flex flex-col md:flex-row md:items-center md:justify-between justify-between gap-4">
        <div>
          <Tooltip content="The platform screens real-time call records through a 2-minute connection filter and a 24-hour daily message cap before securely dispatching customer surveys via Twilio SMS.">
            <h2 className="text-[15px] font-bold text-[#172b4d] flex items-center gap-1.5 cursor-help border-b border-dashed border-[#dfe1e6] pb-0.5 inline-block select-all">
              Automated Outbound Text System & Delivery Logs — Powered by Twilio
              <HelpCircle className="w-3.5 h-3.5 text-[#0052cc]" />
            </h2>
          </Tooltip>
          <p className="text-[12px] text-[#5e6c84] mt-1.5 leading-relaxed">
            Real-time screening pipelines and outbound simulation controls. Use tooltips to review filter criteria.  
          </p>
        </div>

        <button
          onClick={handleSimulation}
          disabled={isSimulating}
          className="h-8 px-4 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-[#0052cc]/60 text-white text-[12px] font-bold rounded-[3px] flex items-center gap-1.5 select-none transition-all cursor-pointer duration-150 shrink-0 shadow-sm"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" />
          )}
          <span>{isSimulating ? "Running Stream..." : "Run Live 3CX Simulation"}</span>
        </button>
      </div>

      {/* Summary Row containing 4 high-contrast badge counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`p-3 bg-white border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left ${activeFilter === 'all' ? 'border-[#0052cc] bg-[#ebecf0]/20' : 'border-[#dfe1e6] hover:bg-[#f4f5f7]/30'}`}
        >
          <span className="text-[10px] text-[#5e6c84] font-bold uppercase tracking-wider">All Rows</span>
          <span className="text-[18px] font-bold text-[#172b4d] mt-1">300 Registers</span>
        </button>
        <button 
          onClick={() => setActiveFilter('sent')}
          className={`p-3 bg-white border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left ${activeFilter === 'sent' ? 'border-[#0052cc] bg-[#ebecf0]/20' : 'border-[#dfe1e6] hover:bg-[#f4f5f7]/30'}`}
        >
          <span className="text-[10px] text-[#006644] font-bold uppercase tracking-wider">Sent Logs</span>
          <span className="text-[18px] font-bold text-[#006644] mt-1">123 Dispatched</span>
        </button>
        <button 
          onClick={() => setActiveFilter('skipped')}
          className={`p-3 bg-white border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left ${activeFilter === 'skipped' ? 'border-[#0052cc] bg-[#ebecf0]/20' : 'border-[#dfe1e6] hover:bg-[#f4f5f7]/30'}`}
        >
          <span className="text-[10px] text-[#5e6c84] font-bold uppercase tracking-wider">Skipped: Short</span>
          <span className="text-[18px] font-bold text-[#172b4d] mt-1">105 Suppressed</span>
        </button>
        <button 
          onClick={() => setActiveFilter('duplicate')}
          className={`p-3 bg-white border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left ${activeFilter === 'duplicate' ? 'border-[#0052cc] bg-[#ebecf0]/20' : 'border-[#dfe1e6] hover:bg-[#f4f5f7]/30'}`}
        >
          <span className="text-[10px] text-[#bf2600] font-bold uppercase tracking-wider">Duplicate</span>
          <span className="text-[18px] font-bold text-[#bf2600] mt-1">72 Filtered</span>
        </button>
      </div>

      {/* Top Section: Live Inbound Processing Feed (Latest 5 Events) */}
      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 shadow-xs">
        <h3 className="text-[12.5px] font-bold text-[#172b4d] pb-2 border-b border-[#dfe1e6] mb-3">
          Live Processing Ticker (Latest 5 Events)
        </h3>
        
        <div className="overflow-x-auto border border-[#dfe1e6] rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11.5px]">
            <thead className="bg-[#f4f5f7] border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9px] select-none">
              <tr>
                <th className="p-2 pl-3 border-r border-[#dfe1e6] min-w-[70px]">Extension</th>
                <th className="p-2 border-r border-[#dfe1e6] min-w-[130px]">Support Representative</th>
                <th className="p-2 border-r border-[#dfe1e6] min-w-[110px]">Customer Phone</th>
                <th className="p-2 border-r border-[#dfe1e6] text-center min-w-[80px]">Duration</th>
                <th className="p-2 pl-3">Decision Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe1e6] text-[#172b4d]">
              {calls.slice(0, 5).map((log, i) => {
                const repName = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                
                // Set explanatory labels
                const labelColor = log.delivery_status === 'Sent' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]';
                const labelText = log.delivery_status === 'Sent' 
                  ? 'Sent' 
                  : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped (Short)' : 'Duplicate');
                  
                const tooltipMessage = log.delivery_status === 'Sent' 
                  ? 'Call duration exceeded the 2-minute limit threshold and passed standard daily cap limits.' 
                  : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Rejected automatically on carrier lookup due to short connection duration.' : 'Dispatched suppressed to prevent consumer text overload.');

                return (
                  <tr key={i} className="hover:bg-[#f4f5f7]/20 transition-all font-medium">
                    <td className="p-2 pl-3 border-r border-[#dfe1e6] font-semibold">Ext {log.agent_extension}</td>
                    <td className="p-2 border-r border-[#dfe1e6] font-bold text-[#172b4d]">{repName}</td>
                    <td className="p-2 border-r border-[#dfe1e6] font-mono text-[#5e6c84]">{log.customer_phone}</td>
                    <td className="p-2 border-r border-[#dfe1e6] text-center font-mono text-[#5e6c84]">{log.call_duration_seconds}s</td>
                    <td className="p-2 pl-3">
                      <Tooltip content={tooltipMessage}>
                        <span className={`px-2 py-0.5 rounded-[3px] text-[9.5px] font-bold uppercase cursor-help select-all border border-transparent hover:border-[#dfe1e6] ${labelColor}`}>
                          {labelText}
                        </span>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Raw Call Registry Spreadsheet */}
      <div className="bg-white border border-[#dfe1e6] rounded-[3px] p-4 shadow-xs">
        <div className="flex justify-between items-center pb-2.5 border-b border-[#dfe1e6] mb-3 gap-3">
          <h3 className="text-[12.5px] font-bold text-[#172b4d] flex items-center gap-1">
            Raw Call Registry Spreadsheet
            <span className="text-[10px] font-semibold text-[#5e6c84] bg-[#ebecf0] px-1.5 py-0.5 rounded">
              {filteredCalls.length} visible
            </span>
          </h3>
          
          <button 
            onClick={handleCSVExport}
            className="h-7 px-3 border border-[#dfe1e6] hover:border-[#5e6c84] text-[#172b4d] text-[11.5px] font-bold bg-white hover:bg-[#f4f5f7]/20 rounded-[3px] flex items-center gap-1.5 select-none transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Table to CSV
          </button>
        </div>

        {/* Scrollable table grid container limited strictly to data tracking specifications */}
        <div className="max-h-[400px] overflow-y-auto border border-[#dfe1e6] rounded-[3px]">
          <table className="w-full text-left border-collapse text-[11.5px]">
            <thead className="bg-[#f4f5f7] sticky top-0 z-10 border-b border-[#dfe1e6] text-[#5e6c84] font-bold uppercase text-[9px] select-none shadow-[0_1px_0_0_rgba(223,225,230,1)]">
              <tr>
                <th onClick={() => onSort('processed_at')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] pl-3 min-w-[140px]">Timestamp <SortArrow active={sortBy === 'processed_at'} order={order} /></th>
                <th onClick={() => onSort('customer_phone')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] min-w-[100px]">Phone Number <SortArrow active={sortBy === 'customer_phone'} order={order} /></th>
                <th onClick={() => onSort('agent_extension')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors border-r border-[#dfe1e6] text-center min-w-[90px]">Extension ID <SortArrow active={sortBy === 'agent_extension'} order={order} /></th>
                <th className="p-2 border-r border-[#dfe1e6] min-w-[150px]">Representative Name</th>
                <th onClick={() => onSort('delivery_status')} className="p-2 cursor-pointer hover:bg-[#ebecf0] transition-colors pl-3">Status <SortArrow active={sortBy === 'delivery_status'} order={order} /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfe1e6] bg-white text-[#172b4d]">
              {filteredCalls.map((log, i) => {
                const repName = mappings.find(m => m.extension === log.agent_extension)?.mappedName || `Ext ${log.agent_extension}`;
                const finalStatus = log.delivery_status === 'Sent' 
                  ? 'Sent' 
                  : (log.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped: Short' : 'Duplicate');
                  
                return (
                  <tr key={i} className="hover:bg-[#f4f5f7]/20 transition-all">
                    <td className="p-2 pl-3 border-r border-[#dfe1e6] font-mono text-[#5e6c84]">{new Date(log.processed_at).toLocaleString()}</td>
                    <td className="p-2 border-r border-[#dfe1e6] font-mono font-bold">{log.customer_phone}</td>
                    <td className="p-2 border-r border-[#dfe1e6] text-center font-mono">Ext {log.agent_extension}</td>
                    <td className="p-2 border-r border-[#dfe1e6] font-medium">{repName}</td>
                    <td className="p-2 pl-3">
                      <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-bold uppercase ${
                        log.delivery_status === 'Sent' ? 'bg-[#e3fcef] text-[#006644]' : 'bg-[#ffebe6] text-[#bf2600]'
                      }`}>
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
