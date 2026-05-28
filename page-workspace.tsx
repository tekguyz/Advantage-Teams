// page-workspace.tsx
// Core light-mode Jira-themed workspace dashboard loader with native mutations
'use client';

import React, { Suspense } from 'react';
import { useTeamInsights } from './use-team-insights';
import { LayoutShell } from './layout-shell';

import ViewOverview from './view-overview';
import ViewPerformance from './view-performance';
import ViewSurveys from './view-surveys';
import ViewSettings from './view-settings';

function WorkspaceContent() {
  const {
    agents,
    mappings,
    activeView,
    sortBy,
    order,
    draftName,
    draftExt,
    draftZoho,
    saveErrors,
    handleSort,
    handleModifyDraft,
    commitExtensionMapping,
  } = useTeamInsights();

  switch (activeView) {
    case 'overview':
      return (
        <ViewOverview 
          agents={agents} 
          totalProcessedCalls={300} 
          totalSentTexts={123} 
        />
      );

    case 'performance':
      return (
        <ViewPerformance
          initialAgents={agents}
          sortBy={sortBy}
          order={order === 'desc' ? 'desc' : 'asc'}
          onSort={handleSort}
        />
      );

    case 'surveys':
      return (
        <ViewSurveys
          mappings={mappings}
          sortBy={sortBy}
          order={order === 'desc' ? 'desc' : 'asc'}
          onSort={handleSort}
        />
      );

    case 'settings':
      return (
        <ViewSettings
          mappings={mappings}
          draftName={draftName}
          draftExt={draftExt}
          draftZoho={draftZoho}
          saveErrors={saveErrors}
          onModifyDraft={handleModifyDraft}
          onCommitExtension={commitExtensionMapping}
        />
      );

    default:
      return (
        <ViewOverview 
          agents={agents} 
          totalProcessedCalls={300} 
          totalSentTexts={123} 
        />
      );
  }
}

export default function PageWorkspace() {
  return (
    <LayoutShell>
      <Suspense 
        fallback={
          <div className="flex justify-center items-center py-12 text-[12.5px] text-[#5e6c84] font-sans">
            <span className="w-4 h-4 border-2 border-[#0052cc] border-t-transparent rounded-full animate-spin mr-2" />
            <span>Loading workspace module...</span>
          </div>
        }
      >
        <WorkspaceContent />
      </Suspense>
    </LayoutShell>
  );
}
