'use client';

import React, { useState, useEffect } from 'react';
import { ProductivityMetricGrid, ProductivitySummaryStats } from './productivity-metric-grid';
import { ExceptionTable, AuditRecord } from './exception-table';
import { Sparkles, Terminal, AlertTriangle, ShieldCheck, RefreshCw, Send, CheckSquare } from 'lucide-react';

interface DashboardProductivityProps {
  agents: any[];
  telemetry: any[];
  activities: any[];
  onLogMessage: (msg: string) => void;
  refreshState: () => Promise<void>;
}

export function DashboardProductivity({
  agents,
  telemetry,
  activities,
  onLogMessage,
  refreshState
}: DashboardProductivityProps) {
  
  const [overrideRecords, setOverrideRecords] = useState<Record<string, Partial<AuditRecord>>>({});
  const [isFilteringAnomalies, setIsFilteringAnomalies] = useState<boolean>(false);
  const [isAuditingAgentId, setIsAuditingAgentId] = useState<string | null>(null);
  const [batchAuditing, setBatchAuditing] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [correlationMode, setCorrelationMode] = useState<'hybrid' | 'pure-deterministic'>('hybrid');

  // Compute records locally first (deterministic calculations) or preserve existing Gemini results
  const records = React.useMemo(() => {
    return agents.map(agent => {
      // Check if there is an existing override record to preserve parsed Gemini API values
      const aiOverride = overrideRecords[agent.id];

      // 1. Gather logs matching this specific agent
      const agentTelemetry = telemetry.filter(t => t.agent_id === agent.id);
      const agentActivities = activities.filter(act => act.agent_id === agent.id);

      // 2. Compute Ticket Work duration (in minutes) from telemetry
      const ticketWorkSeconds = agentTelemetry
        .filter(t => t.status === 'Ticket Work')
        .reduce((sum, t) => {
          if (typeof t.duration_seconds === 'number') {
            return sum + t.duration_seconds;
          }
          // Fallback if transaction is ongoing: estimate from start log up to model cut-off context ISO
          const startMs = new Date(t.start_timestamp).getTime();
          const nowMs = new Date('2026-05-27T03:26:32Z').getTime();
          const diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
          return sum + diff;
        }, 0);

      const durationMinutes = Math.max(1, Math.round(ticketWorkSeconds / 60));

      // 3. System Action Count
      const actionCount = agentActivities.length;

      // 4. Deterministic score calculation
      const uniqueActionTypes = new Set(agentActivities.map(a => a.platform_action_type.trim())).size;
      const computedScore = Math.min(100, Math.max(1, Math.round((uniqueActionTypes / durationMinutes) * 10)));

      // If we have an override, prioritize those values
      if (aiOverride) {
        return {
          agentId: agent.id,
          agentName: agent.agent_name,
          agentExtension: agent.extension,
          ticketWorkDurationMinutes: durationMinutes,
          systemActionCount: actionCount,
          lastVerifiedActionSummary: aiOverride.lastVerifiedActionSummary || "No actions extracted.",
          productivityScore: aiOverride.productivityScore !== undefined ? aiOverride.productivityScore : (actionCount === 0 ? 0 : computedScore),
          managerInsight: aiOverride.managerInsight || `Calculated mathematically: ${actionCount} events in ${durationMinutes} mins.`,
          warningFlag: aiOverride.warningFlag !== undefined ? aiOverride.warningFlag : (actionCount === 0)
        };
      }

      // Default deterministic baseline values
      let defaultVerifiedSummary = "Local math compilation baseline";
      let defaultInsight = `Calculated mathematical density parameter: ${actionCount} actions / ${durationMinutes} mins. Run Gemini audit to parse text context.`;

      if (actionCount === 0) {
        defaultVerifiedSummary = "No active trace recorded.";
        defaultInsight = "WARNING: No internal activity logs found in the selected timeframe. Urgent operational review required.";
      }

      return {
        agentId: agent.id,
        agentName: agent.agent_name,
        agentExtension: agent.extension,
        ticketWorkDurationMinutes: durationMinutes,
        systemActionCount: actionCount,
        lastVerifiedActionSummary: defaultVerifiedSummary,
        productivityScore: actionCount === 0 ? 0 : computedScore,
        managerInsight: defaultInsight,
        warningFlag: actionCount === 0
      };
    });
  }, [agents, telemetry, activities, overrideRecords]);

  // Run a single agent audit through the official @google/genai API
  const handleSingleAgentAudit = async (agentId: string) => {
    setIsAuditingAgentId(agentId);
    setGlobalError(null);
    onLogMessage(`Triggering single Gemini Flash administrative audit for agent: ${agentId}`);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          durationMinutes: 0, // Auto detect duration
          modelName: 'gemini-3.5-flash'
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onLogMessage(`[GEMINI AUDIT SUCCESS] Agent ${data.agentName} scored: ${data.analysis.productivityScore}%`);
        
        // Update overrideRecords state with incoming validated result
        setOverrideRecords(prev => ({
          ...prev,
          [agentId]: {
            productivityScore: data.analysis.productivityScore,
            lastVerifiedActionSummary: data.analysis.lastVerifiedAction || "No actions extracted.",
            managerInsight: data.analysis.managerInsight,
            warningFlag: data.analysis.warningFlag
          }
        }));

        await refreshState();
      } else {
        const errorMsg = data.message || "Auditing process was interrupted.";
        setGlobalError(errorMsg);
        onLogMessage(`[AUDIT REFUSAL] Server returned error: ${errorMsg}`);
      }
    } catch (e: any) {
      const errorMsg = e.message || "Network request failed.";
      setGlobalError(errorMsg);
      onLogMessage(`[CRITICAL AUDIT ERROR] Connection failed: ${errorMsg}`);
    } finally {
      setIsAuditingAgentId(null);
    }
  };

  // Run all active agents audit in parallel
  const handleBatchAuditAll = async () => {
    setBatchAuditing(true);
    setGlobalError(null);
    onLogMessage(`Triggering high-throughput parallel productivity audit for ALL active technicians...`);

    try {
      const activeAgents = agents.filter(a => a.active);
      const promises = activeAgents.map(async (agent) => {
        try {
          const res = await fetch('/api/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentId: agent.id,
              durationMinutes: 0,
              modelName: 'gemini-3.5-flash'
            })
          });
          const data = await res.json();
          if (res.ok && data.status === 'success') {
            return {
              agentId: agent.id,
              success: true,
              data: data.analysis
            };
          }
          return { agentId: agent.id, success: false, error: data.message };
        } catch (err: any) {
          return { agentId: agent.id, success: false, error: err.message };
        }
      });

      const results = await Promise.all(promises);
      let successCount = 0;

      setOverrideRecords(prev => {
        const next = { ...prev };
        results.forEach(res => {
          if (res.success && res.data) {
            successCount++;
            next[res.agentId] = {
              productivityScore: res.data.productivityScore,
              lastVerifiedActionSummary: res.data.lastVerifiedAction || "No actions extracted.",
              managerInsight: res.data.managerInsight,
              warningFlag: res.data.warningFlag
            };
          }
        });
        return next;
      });

      onLogMessage(`[BATCH SUCCESS] Parallel Gemini analysis complete. Successfully correlated ${successCount}/${activeAgents.length} active agent portfolios.`);
      await refreshState();
    } catch (e: any) {
      setGlobalError(e.message || "Failed during parallel batch processing.");
    } finally {
      setBatchAuditing(false);
    }
  };

  // Calculate stats dynamically for the Metric Grid
  const computedStats: ProductivitySummaryStats = React.useMemo(() => {
    const totalAuditedShifts = records.length;
    const totalSystemActions = records.reduce((sum, r) => sum + r.systemActionCount, 0);
    const totalDurationMinutes = records.reduce((sum, r) => sum + r.ticketWorkDurationMinutes, 0);
    const criticalLeakCount = records.filter(r => r.productivityScore < 40).length;
    
    const validScores = records.map(r => r.productivityScore);
    const averageScore = validScores.length > 0 
      ? Math.round(validScores.reduce((sum, sc) => sum + sc, 0) / validScores.length) 
      : 0;

    return {
      totalAuditedShifts,
      averageScore,
      criticalLeakCount,
      totalSystemActions,
      totalDurationMinutes
    };
  }, [records]);

  return (
    <div id="dashboard-productivity-wrapper" className="flex flex-col gap-5 text-left">
      
      {/* GLOBAL ALERTS BANNER FOR DECENTRALIZED FAILURE PATHS */}
      {globalError && (
        <div id="audit-global-error-banner" className="p-3 bg-[#ffebe6] border border-[#ffbdad] text-[#bf2600] rounded-[4px] text-[11px] font-sans flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#ff5630] shrink-0" />
          <div className="flex-1">
            <strong>System correlation mismatch detected during Gemini parsing:</strong> {globalError}
          </div>
          <button 
            onClick={() => setGlobalError(null)} 
            className="text-[10px] text-[#bf2600] uppercase font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* METRIC RIBBON */}
      <ProductivityMetricGrid stats={computedStats} />

      {/* SYSTEM OPERATIONS PANEL */}
      <div className="border border-[#dfe1e6] bg-white rounded-[4px] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-[36px] h-[36px] rounded bg-[#efffd6] border border-[#abf5d1] flex items-center justify-center text-[#36b37e] shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[12.5px] font-bold text-[#172b4d] font-sans uppercase">
              Module 1: AI Administrative Control Kernel
            </h4>
            <p className="text-[11.5px] text-[#5e6c84] max-w-[690px] leading-relaxed mt-0.5 font-sans">
              Analyzes raw non-call 3CX timelines and event trackers using <strong>responseMimeType: &quot;application/json&quot;</strong> to derive exact density scores. Bypasses active desktop spy software to honor agent workspace integrity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBatchAuditAll}
            disabled={batchAuditing || isAuditingAgentId !== null || records.length === 0}
            className="h-[34px] px-3.5 bg-[#0052cc] hover:bg-[#0747a6] disabled:bg-slate-100 disabled:text-[#a5adba] text-white font-bold rounded-[3px] text-[11px] font-sans flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            {batchAuditing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Processing Portfolios...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Interrogate All Active Portfolios
              </>
            )}
          </button>
        </div>
      </div>

      {/* HIGH DENSITY EXCEPTION GRID */}
      <ExceptionTable 
        records={records}
        isFilteringAnomalies={isFilteringAnomalies}
        onFilterToggle={setIsFilteringAnomalies}
        onReRunAudit={handleSingleAgentAudit}
        isAuditingAgentId={isAuditingAgentId}
      />

    </div>
  );
}
