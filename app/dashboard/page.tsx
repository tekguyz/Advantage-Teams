// app/dashboard/page.tsx
// Corporate workspace dashboard landing page rendering the unified light-mode Jira Cloud performance console
'use client';

import React, { Suspense } from 'react';
import PageWorkspace from '@/components/dashboard/page-workspace';

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex w-full h-full min-h-screen items-center justify-center font-sans text-[12px] text-[#5e6c84] bg-white">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0052cc] border-t-transparent rounded-full animate-spin" />
            <span>Loading Advantage Teams Demo Workspace...</span>
          </div>
        </div>
      }
    >
      <PageWorkspace />
    </Suspense>
  );
}
