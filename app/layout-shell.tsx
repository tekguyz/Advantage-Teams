// layout-shell.tsx
// High-density sidebar frame layout, humanized navigation controls, and user profile badges of Advantage Teams.
'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'productivity';

  // Navigation mapping using precise enterprise headings
  const navigationGroups = [
    {
      title: "Team Performance",
      items: [
        { label: "Review Flags", value: "productivity", icon: "📊" },
        { label: "Team Schedules", value: "schedules", icon: "🗓️" }
      ]
    },
    {
      title: "Communication Controls",
      items: [
        { label: "Delivery Logs", value: "surveys", icon: "📞" },
        { label: "Member Settings", value: "members", icon: "⚙️" }
      ]
    }
  ];

  return (
    <div id="advantage-teams-root" className="flex h-full min-h-screen overflow-hidden bg-[#ffffff] text-[#172b4d] font-sans">
      
      {/* LEFT STATIC SIDEBAR FRAME IN #f4f5f7 (Jira Soft Canvas Color) */}
      <aside 
        id="workspace-sidebar"
        className="w-[240px] shrink-0 border-r border-[#dfe1e6] bg-[#f4f5f7] h-full flex flex-col justify-between selection:bg-[#0052cc]/20"
      >
        <div className="flex flex-col">
          {/* Main Title Badge Banner */}
          <div id="sidebar-header" className="h-[52px] px-4 flex items-center gap-2.5 border-b border-[#dfe1e6] bg-white">
            <div className="w-6 h-6 rounded-[3px] bg-[#0052cc] flex items-center justify-center text-white font-mono font-bold text-xs">
              AT
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#172b4d] text-[13.5px] tracking-tight leading-tight">Advantage Teams</span>
              <span className="text-[9.5px] text-[#5e6c84] leading-tight font-semibold tracking-wider uppercase">Enterprise Desk</span>
            </div>
          </div>

          {/* Navigation Controls Sections */}
          <div className="flex flex-col gap-5 py-4">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-1">
                <span className="px-4 text-[10px] font-bold text-[#5e6c84] tracking-wider uppercase">
                  {group.title}
                </span>
                
                <nav className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.value;
                    return (
                      <Link
                        key={item.value}
                        href={`/dashboard?view=${item.value}`}
                        className={`flex items-center gap-2.5 h-[34px] px-4 text-[12px] transition-colors border-l-[3px] ${
                          isActive
                            ? 'bg-[#ebecf0] text-[#0052cc] border-[#0052cc] font-semibold'
                            : 'text-[#172b4d] hover:bg-[#ebecf0]/70 border-transparent hover:text-[#0052cc]'
                        }`}
                      >
                        <span className="text-[13px]">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Profile footer badge */}
        <div id="sidebar-footer-profile" className="p-3.5 border-t border-[#dfe1e6] bg-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-[12px] select-none shadow-xs">
            OP
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11.5px] font-bold text-[#172b4d] truncate">Operations Manager</span>
            <span className="text-[9.5px] text-[#5e6c84] truncate">ID: AD-7192</span>
          </div>
        </div>
      </aside>

      {/* RIGHT FLEXIBLE SCROLL CONTAINER */}
      <main id="view-scrollbox-viewport" className="flex-1 h-full overflow-y-auto bg-white p-6">
        <div className="max-w-[1250px] mx-auto flex flex-col h-full">
          {children}
        </div>
      </main>

    </div>
  );
}
