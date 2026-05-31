// hooks/use-survey-simulation.ts
'use client';

import { useState, useMemo } from 'react';
import { ExtensionMapping, generateSimulationRecords, CallEvent } from '@/types/data-matrix';

interface UseSurveySimulationOpts {
  mappings: ExtensionMapping[];
  sortBy: string;
  order: 'asc' | 'desc';
}

export function useSurveySimulation({
  mappings,
  sortBy,
  order,
}: UseSurveySimulationOpts) {
  const [calls, setCalls] = useState<CallEvent[]>(() => generateSimulationRecords());
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'skipped' | 'duplicate'>('all');

  const handleSimulation = async () => {
    setIsSimulating(true);
    setCalls([]); 
    await new Promise(r => setTimeout(r, 400));
    setCalls(generateSimulationRecords());
    setToastMsg("Simulation Complete: 300 Events Analyzed.");
    setIsSimulating(false);
  };

  const handleCSVExport = () => {
    if (typeof window !== 'undefined') {
      const header = "Timestamp,Extension,Representative Name,Customer Number,Duration,Status\n";
      const rows = calls.map(c => {
        const rep = mappings.find(m => m.extension === c.agent_extension)?.mappedName || `Ext ${c.agent_extension}`;
        const s = c.delivery_status === 'Sent' ? 'Sent' : (c.delivery_status === 'Skipped: Under 2 Minutes' ? 'Skipped' : 'Duplicate');
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

  const countAll = useMemo(() => calls.length, [calls]);
  const countSent = useMemo(() => calls.filter(c => c.delivery_status === 'Sent').length, [calls]);
  const countSkipped = useMemo(() => calls.filter(c => c.delivery_status === 'Skipped: Under 2 Minutes').length, [calls]);
  const countDuplicate = useMemo(() => calls.filter(c => c.delivery_status === 'Skipped: Daily Cap Hit').length, [calls]);

  return {
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
  };
}
