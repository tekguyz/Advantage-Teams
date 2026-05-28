// use-team-insights.ts
// Custom React state hook handling sorting, filtering, and query state transitions.
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  AgentPerformance, 
  ExtensionMapping, 
  MASTER_AGENTS, 
  DEFAULT_MAPPINGS 
} from './types-matrix';
import { ExtensionMapSchema } from './validation-schemas';

function sortedCollection<T>(list: T[], key: keyof T | string, order: string): T[] {
  if (!key) return list;
  return [...list].sort((a: any, b: any) => {
    const valA = a[key] ?? '';
    const valB = b[key] ?? '';
    const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });
}

export function useTeamInsights() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeView = searchParams.get('view') || 'overview';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  const [agents, setAgents] = useState<AgentPerformance[]>(MASTER_AGENTS);
  const [mappings, setMappings] = useState<ExtensionMapping[]>(DEFAULT_MAPPINGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [draftName, setDraftName] = useState<Record<string, string>>({});
  const [draftExt, setDraftExt] = useState<Record<string, string>>({});
  const [draftZoho, setDraftZoho] = useState<Record<string, string>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});

  const sortedAgents = useMemo(() => {
    let sortKey: keyof AgentPerformance | '' = '';
    const cleanSortBy = sortBy.toLowerCase();
    if (cleanSortBy === 'representative' || cleanSortBy === 'name') sortKey = 'name';
    else if (cleanSortBy === 'duration') sortKey = 'durationMins';
    else if (cleanSortBy === 'updates') sortKey = 'systemUpdates';
    else if (cleanSortBy === 'focus') sortKey = 'focusRating';
    return sortedCollection(agents, sortKey, order);
  }, [agents, sortBy, order]);

  const sortedMappings = useMemo(() => {
    let sortKey: keyof ExtensionMapping | '' = '';
    const cleanSortBy = sortBy.toLowerCase();
    if (cleanSortBy === 'representative' || cleanSortBy === 'name') sortKey = 'mappedName';
    else if (cleanSortBy === 'extension') sortKey = 'extension';
    else if (cleanSortBy === 'zoho') sortKey = 'zohoUserId';
    return sortedCollection(mappings, sortKey, order);
  }, [mappings, sortBy, order]);

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
    params.delete('sortBy');
    params.delete('order');
    router.push(`${pathname}?${params.toString()}`);
  };

  const triggerComplianceAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setAgents(prev => 
        prev.map(agent => {
          const shift = Math.random() > 0.5 ? 4 : -4;
          const rating = Math.min(100, Math.max(5, agent.focusRating + shift));
          const updatesNum = agent.systemUpdates + (Math.random() > 0.7 ? 1 : 0);
          return {
            ...agent,
            focusRating: rating,
            systemUpdates: updatesNum,
            statusTag: rating < 40 ? 'Attention Needed' : 'Verified'
          };
        })
      );
    }, 450);
  };

  const handleModifyDraft = (ext: string, field: 'name' | 'zoho' | 'extension', val: string) => {
    if (field === 'name') setDraftName(prev => ({ ...prev, [ext]: val }));
    else if (field === 'extension') setDraftExt(prev => ({ ...prev, [ext]: val }));
    else setDraftZoho(prev => ({ ...prev, [ext]: val }));

    if (saveErrors[ext]) {
      setSaveErrors(prev => {
        const copy = { ...prev };
        delete copy[ext];
        return copy;
      });
    }
  };

  const commitExtensionMapping = (ext: string) => {
    const currentMap = mappings.find(m => m.extension === ext);
    if (!currentMap) return false;

    const inputName = draftName[ext] !== undefined ? draftName[ext] : currentMap.mappedName;
    const inputExt = draftExt[ext] !== undefined ? draftExt[ext] : currentMap.extension;
    const inputZoho = draftZoho[ext] !== undefined ? draftZoho[ext] : currentMap.zohoUserId;

    const parseResult = ExtensionMapSchema.safeParse({
      extension: inputExt,
      mappedName: inputName,
      zohoUserId: inputZoho
    });

    if (!parseResult.success) {
      setSaveErrors(prev => ({ ...prev, [ext]: parseResult.error.issues[0]?.message }));
      return false;
    }

    setMappings(prev => 
      prev.map(m => m.extension === ext ? { extension: inputExt, mappedName: inputName, zohoUserId: inputZoho } : m)
    );
    setAgents(prev => 
      prev.map(a => a.extension === ext ? { ...a, name: inputName, extension: inputExt, zohoId: inputZoho } : a)
    );
    return true;
  };

  return {
    agents: sortedAgents,
    mappings: sortedMappings,
    activeView,
    sortBy,
    order,
    isRefreshing,
    draftName,
    draftExt,
    draftZoho,
    saveErrors,
    handleNavigate,
    handleSort,
    triggerComplianceAudit,
    handleModifyDraft,
    commitExtensionMapping
  };
}
