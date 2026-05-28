// use-team-insights.ts
// Pure custom React state hook handling calculation formulas, search filtering, and state transitions.
'use client';

import { useState, useMemo } from 'react';
import { 
  AgentPerformance, 
  SurveyLog, 
  ExtensionMap, 
  MASTER_AGENTS, 
  MASTER_SURVEYS, 
  DEFAULT_MAPPINGS 
} from './types-matrix';
import { ExtensionMapSchema } from './validation-schemas';

export function useTeamInsights() {
  // Hardcoded states based on absolute local master datasets
  const [agents, setAgents] = useState<AgentPerformance[]>(MASTER_AGENTS);
  const [surveys] = useState<SurveyLog[]>(MASTER_SURVEYS);
  const [mappings, setMappings] = useState<ExtensionMap[]>(DEFAULT_MAPPINGS);

  // Search state and filter tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'attention' | 'verified'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Draft configurations for edit states
  const [draftName, setDraftName] = useState<Record<string, string>>({});
  const [draftZoho, setDraftZoho] = useState<Record<string, string>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [savingExt, setSavingExt] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Formula Calculations: Total Hour Monitor, Flags count, Compliance rate
  const calculatedMetrics = useMemo(() => {
    const totalMinutes = agents.reduce((sum, a) => sum + a.durationMins, 0);
    const hoursFormatted = (totalMinutes / 60).toFixed(1);
    
    const activeFlags = agents.filter(a => a.statusTag === 'Attention Needed').length;
    
    const verifiedCount = agents.filter(a => a.statusTag === 'Verified').length;
    const complianceRate = agents.length > 0 ? ((verifiedCount / agents.length) * 100).toFixed(1) : '0';

    return {
      hoursMonitored: `${hoursFormatted} Hours`,
      activeFlags,
      compliancePercentage: `${complianceRate}%`,
    };
  }, [agents]);

  // Client Side Filter & Search Operations
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchText = (
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        agent.extension.includes(searchQuery) ||
        agent.zohoId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchText) return false;

      if (filterMode === 'attention') return agent.statusTag === 'Attention Needed';
      if (filterMode === 'verified') return agent.statusTag === 'Verified';
      return true;
    });
  }, [agents, searchQuery, filterMode]);

  // Action: Supervisor run compliance audit simulation
  const triggerComplianceAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Randomize or reset status values to simulate real audits
      setAgents(prev => prev.map(a => ({
        ...a,
        focusRating: Math.min(100, Math.max(0, a.focusRating + (Math.random() > 0.5 ? 2 : -2)))
      })));
    }, 700);
  };

  // Draft form state mutations
  const handleModifyDraft = (ext: string, field: 'name' | 'zoho', val: string) => {
    if (field === 'name') {
      setDraftName(prev => ({ ...prev, [ext]: val }));
    } else {
      setDraftZoho(prev => ({ ...prev, [ext]: val }));
    }
    // Wipe error upon keyboard input
    if (saveErrors[ext]) {
      setSaveErrors(prev => {
        const copy = { ...prev };
        delete copy[ext];
        return copy;
      });
    }
  };

  // Action: Submit updated mappings to configuration arrays
  const commitExtensionMapping = (ext: string) => {
    const currentMap = mappings.find(m => m.extension === ext);
    if (!currentMap) return;

    const testName = draftName[ext] !== undefined ? draftName[ext] : currentMap.mappedName;
    const testZoho = draftZoho[ext] !== undefined ? draftZoho[ext] : currentMap.zohoUserId;

    // Validate using runtime Zod validation schemas
    const validation = ExtensionMapSchema.safeParse({
      extension: ext,
      mappedName: testName,
      zohoUserId: testZoho,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input values';
      setSaveErrors(prev => ({ ...prev, [ext]: firstError }));
      return;
    }

    setSavingExt(ext);
    setSaveErrors(prev => {
      const copy = { ...prev };
      delete copy[ext];
      return copy;
    });

    setTimeout(() => {
      // Apply updates to the state
      setMappings(prev => prev.map(m => {
        if (m.extension === ext) {
          return { ...m, mappedName: testName, zohoUserId: testZoho };
        }
        return m;
      }));
      
      // Mirror changes to the dynamic Agent representation as well for consistency
      setAgents(prev => prev.map(a => {
        if (a.extension === ext) {
          return { ...a, name: testName, zohoId: testZoho };
        }
        return a;
      }));

      setSavingExt(null);
      setSuccessBanner(`Successfully configured extension ${ext} mapping settings.`);
      
      // Auto dismiss success banners
      setTimeout(() => setSuccessBanner(null), 3500);
    }, 500);
  };

  return {
    agents,
    surveys,
    mappings,
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    isRefreshing,
    calculatedMetrics,
    filteredAgents,
    triggerComplianceAudit,
    draftName,
    draftZoho,
    saveErrors,
    savingExt,
    successBanner,
    handleModifyDraft,
    commitExtensionMapping
  };
}
