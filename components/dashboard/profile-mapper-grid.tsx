'use client';

import React, { useState, useEffect } from 'react';
import { AgentProfile } from '@/types/types-ingestion';
import { 
  Save, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  X, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';

export interface ProfileMapperGridProps {
  agents: AgentProfile[];
  onLogMessage: (msg: string) => void;
  onRefresh: () => Promise<void>;
}

export function ProfileMapperGrid({ agents, onLogMessage, onRefresh }: ProfileMapperGridProps) {
  // Store editing states per agent ID
  const [drafts, setDrafts] = useState<Record<string, { extension: string; zoho_user_id: string }>>(() => {
    const initialDrafts: Record<string, { extension: string; zoho_user_id: string }> = {};
    agents.forEach(agent => {
      initialDrafts[agent.id] = {
        extension: agent.extension,
        zoho_user_id: agent.zoho_user_id
      };
    });
    return initialDrafts;
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (agentId: string, field: 'extension' | 'zoho_user_id', value: string) => {
    setDrafts(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async (agentId: string, agentName: string) => {
    const draft = drafts[agentId];
    if (!draft) return;

    if (!draft.extension.trim()) {
      setErrorMessage("Extension cannot be empty.");
      onLogMessage(`[MAPPING FAILURE] Attempted to save empty extension for ${agentName}`);
      return;
    }
    if (!draft.zoho_user_id.trim()) {
      setErrorMessage("Zoho User Reference cannot be empty.");
      onLogMessage(`[MAPPING FAILURE] Attempted to save empty Zoho ID for ${agentName}`);
      return;
    }

    setSavingId(agentId);
    setErrorMessage(null);
    onLogMessage(`Persisting profile binding for ${agentName} (Ext: ${draft.extension} => Zoho: ${draft.zoho_user_id})...`);

    try {
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateProfile',
          id: agentId,
          extension: draft.extension.trim(),
          zoho_user_id: draft.zoho_user_id.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onLogMessage(`[MAPPING Persisted] ${data.message}`);
        
        // Success animation loop
        setFeedbackId(agentId);
        setFeedbackStatus('success');
        setTimeout(() => {
          setFeedbackId(null);
          setFeedbackStatus(null);
        }, 2000);

        await onRefresh();
      } else {
        const errorMsg = data.message || "Failed to commit configuration to datastore.";
        setErrorMessage(errorMsg);
        onLogMessage(`[DB FAIL] Profile update refused: ${errorMsg}`);
        
        setFeedbackId(agentId);
        setFeedbackStatus('error');
        setTimeout(() => {
          setFeedbackId(null);
          setFeedbackStatus(null);
        }, 3000);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Network request failed.";
      setErrorMessage(errorMsg);
      onLogMessage(`[MAPPING CONNECTION EXCEPTION] Fail: ${errorMsg}`);
      
      setFeedbackId(agentId);
      setFeedbackStatus('error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div 
      id="profile-mapper-container" 
      className="border border-[#dfe1e6] bg-white rounded-[4px] relative overflow-hidden flex flex-col h-full text-left"
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0052cc]" />

      {/* Header and Controller Subheader */}
      <div className="pt-4 pb-3 px-4 border-b border-[#dfe1e6] bg-[#fafbfc]">
        <h3 className="text-[13px] font-bold text-[#172b4d] uppercase tracking-wide flex items-center gap-1.5 font-sans">
          <span className="w-2 h-2 rounded-full bg-[#0052cc]" />
          3CX Device &lt;=&gt; Zoho Profile Binding Matrix
        </h3>
        <p className="text-[11.5px] text-[#5e6c84] leading-relaxed mt-0.5 font-sans">
          Inline configuration grid map linking 3CX workstation device identities directly to Zoho User Profile Reference inputs.
        </p>
      </div>

      {/* Global inline warning message inside context box */}
      {errorMessage && (
        <div className="m-3 p-2.5 bg-[#ffebe6] border border-[#ffbdad] text-[#bf2600] rounded-[3px] text-[10.5px] font-sans flex items-start gap-1.5 leading-normal">
          <AlertCircle className="w-3.5 h-3.5 text-[#ff5630] shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Parameters Error:</strong> {errorMessage}
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-[9.5px] text-[#bf2600] uppercase font-bold hover:underline shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Grid List */}
      <div className="divide-y divide-[#dfe1e6] font-sans text-[11px]">
        {agents.map((agent) => {
          const draft = drafts[agent.id] || { extension: agent.extension, zoho_user_id: agent.zoho_user_id };
          const isSaving = savingId === agent.id;
          const isFeedback = feedbackId === agent.id;
          const isHasChanged = draft.extension !== agent.extension || draft.zoho_user_id !== agent.zoho_user_id;

          return (
            <div 
              key={agent.id} 
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                agent.active ? 'bg-white' : 'bg-[#f4f5f7]/30 opacity-75'
              }`}
            >
              {/* Agent info */}
              <div className="flex flex-col min-w-0 max-w-[150px]">
                <span className="font-bold text-[#172b4d] truncate block" title={agent.agent_name}>
                  {agent.agent_name}
                </span>
                <span className="text-[9.5px] text-[#5e6c84] font-mono mt-0.5 uppercase tracking-wide">
                  {agent.active ? (
                    <span className="text-[#36b37e] font-semibold">● ACTIVE STATUS</span>
                  ) : (
                    <span className="text-[#5e6c84] font-semibold">○ INACTIVE PROFILE</span>
                  )}
                </span>
              </div>

              {/* Input Forms */}
              <div className="flex-1 grid grid-cols-2 gap-2 max-w-[280px]">
                {/* 3CX ID Form field */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] uppercase font-mono font-bold text-[#5e6c84]">3CX Extension</label>
                  <input
                    type="text"
                    value={draft.extension}
                    onChange={(e) => handleInputChange(agent.id, 'extension', e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g. 101"
                    className="h-[28px] px-2 border border-[#dfe1e6] rounded-[3px] bg-white outline-hidden focus:border-[#4c9aff] hover:border-[#a5adba] text-[11px] font-mono text-center text-[#172b4d] disabled:bg-slate-50 transition-colors"
                  />
                </div>

                {/* Zoho reference user binding field */}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] uppercase font-mono font-bold text-[#5e6c84]">Zoho ID Ref</label>
                  <input
                    type="text"
                    value={draft.zoho_user_id}
                    onChange={(e) => handleInputChange(agent.id, 'zoho_user_id', e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g. ZOHO_US_001"
                    className="h-[28px] px-2 border border-[#dfe1e6] rounded-[3px] bg-white outline-hidden focus:border-[#4c9aff] hover:border-[#a5adba] text-[11px] font-mono text-left text-[#172b4d] disabled:bg-slate-50 transition-colors"
                  />
                </div>
              </div>

              {/* Row Operation Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                {isFeedback ? (
                  feedbackStatus === 'success' ? (
                    <div className="w-[28px] h-[28px] rounded-full bg-[#e3fcef] flex items-center justify-center text-[#36b37e] border border-[#abf5d1]" title="Changes Saved Successfully">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-[28px] h-[28px] rounded-full bg-[#ffebe6] flex items-center justify-center text-[#ff5630] border border-[#ffbdad]" title="Operational Save Disallowed">
                      <X className="w-3.5 h-3.5" />
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleSaveProfile(agent.id, agent.agent_name)}
                    disabled={isSaving || !isHasChanged}
                    className={`h-[28px] px-3 font-semibold rounded-[3px] text-[11px] font-sans flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isHasChanged 
                        ? 'bg-[#0052cc] hover:bg-[#0747a6] border-[#0052cc] text-white font-bold shadow-xs' 
                        : 'bg-[#f4f5f7] border-[#dfe1e6] text-[#a5adba] cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    <span>Save</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
