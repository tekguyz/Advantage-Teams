// hooks/use-profile-mapper.ts
'use client';

import { useState } from 'react';
import { AgentProfile } from '@/types/types-ingestion';

interface UseProfileMapperProps {
  agents: AgentProfile[];
  onLogMessage: (msg: string) => void;
  onRefresh: () => Promise<void>;
}

export function useProfileMapper({ agents, onLogMessage, onRefresh }: UseProfileMapperProps) {
  const [drafts, setDrafts] = useState<Record<string, { extension: string; zoho_user_id: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (agentId: string, field: 'extension' | 'zoho_user_id', value: string) => {
    setDrafts(prev => {
      const current = prev[agentId] || {
        extension: agents.find(a => a.id === agentId)?.extension || '',
        zoho_user_id: agents.find(a => a.id === agentId)?.zoho_user_id || ''
      };
      return {
        ...prev,
        [agentId]: {
          ...current,
          [field]: value
        }
      };
    });
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

  return {
    drafts,
    savingId,
    feedbackId,
    feedbackStatus,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSaveProfile
  };
}
