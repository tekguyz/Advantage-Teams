// app/dashboard/page.tsx
// Lightweight routing page serving views conditionally based on clean URL search query parameters
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutShell } from '../layout-shell';
import { useTeamInsights } from '../use-team-insights';
import { ViewPerformance } from '../view-performance';
import { ViewSurveys } from '../view-surveys';
import { Calendar, Settings, ShieldCheck } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'productivity';

  // Instantiate the unified custom state hook
  const {
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
    commitExtensionMapping,
  } = useTeamInsights();

  return (
    <LayoutShell>
      {/* View routing based on clean query parameters */}
      {currentView === 'productivity' && (
        <ViewPerformance
          agents={agents}
          filteredAgents={filteredAgents}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          isRefreshing={isRefreshing}
          calculatedMetrics={calculatedMetrics}
          triggerComplianceAudit={triggerComplianceAudit}
        />
      )}

      {currentView === 'surveys' && (
        <ViewSurveys
          surveys={surveys}
          mappings={mappings}
          draftName={draftName}
          draftZoho={draftZoho}
          saveErrors={saveErrors}
          savingExt={savingExt}
          successBanner={successBanner}
          handleModifyDraft={handleModifyDraft}
          commitExtensionMapping={commitExtensionMapping}
        />
      )}

      {currentView === 'schedules' && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-[#5e6c84]" id="schedules-placeholder">
          <Calendar className="w-12 h-12 text-[#dfe1e6] mb-3" />
          <h3 className="text-sm font-bold text-[#172b4d] m-0">Team Schedules</h3>
          <p className="text-[12px] max-w-[320px] mt-1 leading-relaxed">
            No active schedules loaded under the selected sync interval. Check back shortly.
          </p>
        </div>
      )}

      {currentView === 'members' && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-[#5e6c84]" id="members-placeholder">
          <Settings className="w-12 h-12 text-[#dfe1e6] mb-3" />
          <h3 className="text-sm font-bold text-[#172b4d] m-0">Member Settings</h3>
          <p className="text-[12px] max-w-[320px] mt-1 leading-relaxed">
            Member settings configuration rules require elevated administrator security clearance.
          </p>
        </div>
      )}
    </LayoutShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full min-h-screen items-center justify-center font-sans text-xs text-[#5e6c84]">
        <span>Loading Advantage Teams Workspace...</span>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
