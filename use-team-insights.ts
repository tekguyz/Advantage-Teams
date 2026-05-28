// use-team-insights.ts
// Custom React state hook handling sorting, filtering, and query state transitions.
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  AgentPerformance, 
  SurveyLog, 
  ExtensionMapping, 
  MASTER_AGENTS, 
  MASTER_SURVEYS, 
  DEFAULT_MAPPINGS 
} from './types-matrix';
import { ExtensionMapSchema } from './validation-schemas';

// Universal Alphanumeric Sorting Logic
function sortedCollection<T>(list: T[], key: keyof T | string, order: string): T[] {
  if (!key) return list;
  
  return [...list].sort((a: any, b: any) => {
    let valA = a[key];
    let valB = b[key];

    // Fallback or sub-property mapping if needed
    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    const strA = String(valA);
    const strB = String(valB);

    const comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
}

export function useTeamInsights() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active view extracted from URL query parameters (default 'overview')
  const activeView = searchParams.get('view') || 'overview';
  
  // Sorting variables from URL query parameters
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  // Base persistent states initialized with master dataset constants
  const [agents, setAgents] = useState<AgentPerformance[]>(MASTER_AGENTS);
  const [surveys, setSurveys] = useState<SurveyLog[]>(MASTER_SURVEYS);
  const [mappings, setMappings] = useState<ExtensionMapping[]>(DEFAULT_MAPPINGS);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Draft changes in Settings view
  const [draftName, setDraftName] = useState<Record<string, string>>({});
  const [draftZoho, setDraftZoho] = useState<Record<string, string>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});

  // 1. Process sort on Agents
  const sortedAgents = useMemo(() => {
    // Map of logical table header key to AgentPerformance object key
    let sortKey: keyof AgentPerformance | '' = '';
    const cleanSortBy = sortBy.toLowerCase();

    if (cleanSortBy === 'representative' || cleanSortBy === 'name') sortKey = 'name';
    else if (cleanSortBy === 'status' || cleanSortBy === 'workstatus') sortKey = 'workStatus';
    else if (cleanSortBy === 'duration' || cleanSortBy === 'durationmins') sortKey = 'durationMins';
    else if (cleanSortBy === 'updates' || cleanSortBy === 'systemupdates') sortKey = 'systemUpdates';
    else if (cleanSortBy === 'focus' || cleanSortBy === 'focusrating') sortKey = 'focusRating';

    return sortedCollection(agents, sortKey, order);
  }, [agents, sortBy, order]);

  // 2. Process sort on Mappings
  const sortedMappings = useMemo(() => {
    let sortKey: keyof ExtensionMapping | '' = '';
    const cleanSortBy = sortBy.toLowerCase();

    if (cleanSortBy === 'representative' || cleanSortBy === 'name') sortKey = 'mappedName';
    else if (cleanSortBy === 'extension') sortKey = 'extension';
    else if (cleanSortBy === 'zoho') sortKey = 'zohoUserId';

    return sortedCollection(mappings, sortKey, order);
  }, [mappings, sortBy, order]);

  // Navigation and Sort URL helper
  const handleSort = (field: string) => {
    const nextOrder = (sortBy === field && order === 'asc') ? 'desc' : 'asc';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field);
    params.set('order', nextOrder);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNavigate = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    // Remove sort state when pivoting main views to prevent view clashes
    params.delete('sortBy');
    params.delete('order');
    router.push(`${pathname}?${params.toString()}`);
  };

  // Action: Live compliance telemetry simulation audit
  const triggerComplianceAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setAgents(prev => 
        prev.map(agent => {
          const ratingShift = Math.random() > 0.5 ? 4 : -4;
          const freshRating = Math.min(100, Math.max(5, agent.focusRating + ratingShift));
          return {
            ...agent,
            focusRating: freshRating,
            systemUpdates: agent.systemUpdates + (Math.random() > 0.7 ? 1 : 0),
            statusTag: freshRating < 40 ? 'Attention Needed' : 'Verified'
          };
        })
      );
    }, 450);
  };

  // Forms Draft Handler
  const handleModifyDraft = (ext: string, field: 'name' | 'zoho', val: string) => {
    if (field === 'name') {
      setDraftName(prev => ({ ...prev, [ext]: val }));
    } else {
      setDraftZoho(prev => ({ ...prev, [ext]: val }));
    }

    if (saveErrors[ext]) {
      setSaveErrors(prev => {
        const copy = { ...prev };
        delete copy[ext];
        return copy;
      });
    }
  };

  // Committing and Validating extension changes
  const commitExtensionMapping = (ext: string) => {
    const currentMap = mappings.find(m => m.extension === ext);
    if (!currentMap) return;

    const inputName = draftName[ext] !== undefined ? draftName[ext] : currentMap.mappedName;
    const inputZoho = draftZoho[ext] !== undefined ? draftZoho[ext] : currentMap.zohoUserId;

    // Strict Zod safety compile checks
    const parseResult = ExtensionMapSchema.safeParse({
      extension: ext,
      mappedName: inputName,
      zohoUserId: inputZoho
    });

    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || 'Verification failed';
      setSaveErrors(prev => ({ ...prev, [ext]: errorMsg }));
      return false;
    }

    // Persist into memory lists
    setMappings(prev => 
      prev.map(m => m.extension === ext ? { extension: ext, mappedName: inputName, zohoUserId: inputZoho } : m)
    );

    setAgents(prev => 
      prev.map(a => a.extension === ext ? { ...a, name: inputName, zohoId: inputZoho } : a)
    );

    return true;
  };

  return {
    agents: sortedAgents,
    surveys,
    mappings: sortedMappings,
    activeView,
    sortBy,
    order,
    isRefreshing,
    draftName,
    draftZoho,
    saveErrors,
    handleNavigate,
    handleSort,
    triggerComplianceAudit,
    handleModifyDraft,
    commitExtensionMapping
  };
}
