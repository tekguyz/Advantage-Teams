// layout-shell.tsx
// Frozen sidebar layout conforming to Jira Cloud workspace standard
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PhoneCall, Settings } from 'lucide-react';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function BrandDiamondLogo({ className = "w-[24px] h-[24px]" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect x="25" y="25" width="50" height="50" rx="8" transform="rotate(45 50 50)" fill="#0052cc" />
      <circle cx="50" cy="50" r="12" fill="#ffffff" />
      <circle cx="50" cy="50" r="6" fill="#0052cc" />
    </svg>
  );
}

function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view') || 'overview';

  const handleNavigate = (view: string) => {
    // Navigate with stable transition, retaining view parameter only
    router.push(`${pathname}?view=${view}`);
  };

  const navItems = [
    { label: "Overview Dashboard", value: "overview", icon: LayoutDashboard },
    { label: "Team Performance", value: "performance", icon: Users },
    { label: "Survey Center", value: "surveys", icon: PhoneCall },
    { label: "Member Settings", value: "settings", icon: Settings },
  ];

  return (
    <aside 
      id="workspace-sidebar"
      className="h-screen w-[240px] flex-shrink-0 border-r border-[#dfe1e6] bg-[#f4f5f7] flex flex-col justify-between select-none"
    >
      <div className="flex flex-col">
        {/* Brand Header block */}
        <div id="sidebar-header" className="h-[54px] px-4 flex items-center gap-3 border-b border-[#dfe1e6] bg-white">
          <BrandDiamondLogo />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[#172b4d] text-[13.5px] tracking-tight leading-tight truncate">Advantage Teams</span>
            <span className="text-[9.5px] text-[#5e6c84] leading-none font-bold tracking-wider uppercase">Workspace</span>
          </div>
        </div>

        {/* Navigation block */}
        <div className="flex flex-col gap-1.5 py-4">
          <span className="px-4 text-[10px] font-bold text-[#5e6c84] tracking-wider uppercase opacity-80">
            Workspace Views
          </span>
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const isActive = activeView === item.value;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => handleNavigate(item.value)}
                  className={`flex items-center gap-3 h-[36px] px-4 text-[12.5px] transition-all border-l-[3px] text-left ${
                    isActive
                      ? 'bg-[#ebecf0] text-[#0052cc] border-[#0052cc] font-bold'
                      : 'text-[#172b4d] hover:bg-[#ebecf0]/60 border-transparent hover:text-[#0052cc]'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0052cc]' : 'text-[#5e6c84]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Corporate profile footer badge (Fully stationary) */}
      <div id="sidebar-footer-profile" className="p-3.5 border-t border-[#dfe1e6] bg-white flex items-center gap-3">
        <div className="w-[30px] h-[30px] rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-[11px] shrink-0 border border-[#dfe1e6]/40">
          OP
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11.5px] font-bold text-[#172b4d] truncate leading-none mb-0.5">Operations Manager</span>
          <span className="text-[9.5px] text-[#5e6c84] truncate">ID: ADV-3CX0 • Verified</span>
        </div>
      </div>
    </aside>
  );
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div 
      id="advantage-teams-root" 
      className="h-screen w-screen overflow-hidden flex bg-white text-[#172b4d] font-sans selection:bg-[#0052cc]/10"
    >
      {/* Sidebar locked permanently */}
      <Suspense fallback={<div className="h-screen w-[240px] flex-shrink-0 bg-[#f4f5f7] border-r border-[#dfe1e6]" />}>
        <SidebarNav />
      </Suspense>

      {/* Main workspace scrolling viewport */}
      <main 
        id="view-scrollbox-viewport" 
        className="flex-1 h-screen overflow-y-auto pb-12 bg-white"
      >
        <div className="max-w-[1250px] mx-auto p-6 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
