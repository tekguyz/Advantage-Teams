// layout-shell.tsx
// Locked Sidebar Navigation Shell optimized for Jira Cloud Workspace layout
'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PhoneCall, Settings } from 'lucide-react';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function BrandDiamondLogo({ className = "w-[26px] h-[26px]" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M50 4 L96 50 L50 96 L4 50 Z" 
        stroke="#0052cc" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="#ffffff" 
      />
      <circle cx="50" cy="50" r="15" fill="#0052cc" />
      <path 
        d="M50 4 C50 25 25 50 4 50" 
        stroke="#0052cc" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M50 4 C50 25 75 50 96 50" 
        stroke="#0052cc" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
}

function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view') || 'overview';

  const handleNavigate = (view: string) => {
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
        {/* Brand header section */}
        <div id="sidebar-header" className="h-[54px] px-4 flex items-center gap-3 border-b border-[#dfe1e6] bg-white">
          <BrandDiamondLogo />
          <div className="flex flex-col">
            <span className="font-bold text-[#172b4d] text-[13.5px] tracking-tight leading-tight">Advantage Software</span>
            <span className="text-[9.5px] text-[#5e6c84] leading-tight font-semibold tracking-wider uppercase">Workspace</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1.5 py-5">
          <span className="px-4 text-[10px] font-semibold text-[#5e6c84] tracking-wider uppercase">
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
                  className={`flex items-center gap-3 h-[36px] px-4 text-[12.5px] transition-all border-l-[3px] text-left rounded-r-md ${
                    isActive
                      ? 'bg-[#ebecf0] text-[#0052cc] border-[#0052cc] font-semibold'
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

      {/* Corporate Profile footer badge (Frozen) */}
      <div id="sidebar-footer-profile" className="p-3.5 border-t border-[#dfe1e6] bg-white flex items-center gap-3">
        <div className="w-[30px] h-[30px] rounded-full bg-[#0052cc] text-white flex items-center justify-center font-bold text-[11px] select-none shrink-0 border border-[#dfe1e6]/40">
          OP
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11.5px] font-semibold text-[#172b4d] truncate leading-none mb-0.5 animate-pulse">Operations Manager</span>
          <span className="text-[9.5px] text-[#5e6c84] truncate">ID: AD-7192 • Active</span>
        </div>
      </div>
    </aside>
  );
}

export function LayoutShell({ children }: LayoutShellProps) {
  useEffect(() => {
    try {
      const svgString = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 4 L96 50 L50 96 L4 50 Z" stroke="%230052cc" stroke-width="8" stroke-linejoin="round" fill="white" />
        <circle cx="50" cy="50" r="16" fill="%230052cc" />
      </svg>`;
      const base64 = btoa(svgString);
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = `data:image/svg+xml;base64,${base64}`;
    } catch (e) {
      console.warn('Programmatic favicon registration skipped:', e);
    }
  }, []);

  return (
    <div id="advantage-teams-root" className="h-screen w-screen overflow-hidden flex bg-white text-[#172b4d] font-sans selection:bg-[#0052cc]/10">
      
      {/* Side Navigation layout locked to frozen viewport */}
      <Suspense fallback={<div className="h-screen w-[240px] flex-shrink-0 bg-[#f4f5f7] border-r border-[#dfe1e6]" />}>
        <SidebarNav />
      </Suspense>

      {/* Corporate Content Viewport Panel - Scrolls completely independently */}
      <main id="view-scrollbox-viewport" className="flex-1 h-screen overflow-y-auto pb-12 bg-white p-6">
        <div className="max-w-[1250px] mx-auto flex flex-col">
          {children}
        </div>
      </main>

    </div>
  );
}
