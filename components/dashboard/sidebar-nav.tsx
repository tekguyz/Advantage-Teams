// components/dashboard/sidebar-nav.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  Settings, 
  HelpCircle, 
  X, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BrandDiamondLogo, ThemeToggle } from './brand-logo';

interface SidebarNavProps {
  onOpenHelp: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function SidebarNav({ onOpenHelp, isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get('view') || 'overview';
  const isMobile = useIsMobile();

  const handleNavigate = (view: string) => {
    router.push(`${pathname}?view=${view}`);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const navItems = [
    { label: "Overview Dashboard", value: "overview", icon: LayoutDashboard },
    { label: "Team Performance", value: "performance", icon: Users },
    { label: "Survey Center", value: "surveys", icon: PhoneCall },
    { label: "Member Settings", value: "settings", icon: Settings },
  ];

  const sidebarClasses = `${
    isMobile 
      ? `fixed top-0 bottom-0 left-0 z-50 h-[100dvh] w-[240px] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}` 
      : `relative h-screen flex-shrink-0 ${isCollapsed ? 'w-[68px]' : 'w-[240px]'}`
  } border-r border-border-soft bg-sidebar-bg flex flex-col justify-between overflow-hidden select-none transition-all duration-300 ease-in-out`;

  const showFullContext = !isCollapsed || isMobile;

  return (
    <aside 
      id="workspace-sidebar"
      className={sidebarClasses}
    >
      {/* Brand Header block - securely pinned at the top */}
      <div id="sidebar-header" className={`h-[54px] px-4 flex items-center border-b border-border-soft bg-canvas-bg shrink-0 overflow-hidden ${
        (isCollapsed && !isMobile) ? 'justify-center' : 'justify-between'
      }`}>
        <div className="flex items-center gap-3 shrink-0">
          <BrandDiamondLogo className="w-5 h-5 shrink-0" />
          {showFullContext && (
            <div className="flex flex-col min-w-0 animate-fadeIn text-left">
              <span className="font-bold text-text-charcoal text-[13.5px] tracking-tight leading-tight truncate">Advantage Software</span>
              <span className="text-[9.5px] text-accent-blue leading-none font-bold tracking-wider uppercase mt-0.5">Teams</span>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1 text-[#5e6c84] hover:text-[#172b4d] rounded-sm hover:bg-border-soft/40 transition-colors cursor-pointer"
            aria-label="Close Navigation Menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Middle navigable scrollable container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 flex flex-col justify-between scrollbar-thin">
        <div className="flex flex-col gap-1.5 py-4 shrink-0">
          {showFullContext ? (
            <span className="px-4 text-[10px] font-bold text-text-muted tracking-wider uppercase opacity-80 block animate-fadeIn">
              Workspace Views
            </span>
          ) : (
            <div className="h-[1px] bg-border-soft mx-3 my-1" />
          )}
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const isActive = activeView === item.value;
              const IconComponent = item.icon;
              const showLabel = showFullContext;
              return (
                <button
                  key={item.value}
                  onClick={() => handleNavigate(item.value)}
                  className={`flex items-center transition-all border-l-[3px] text-left cursor-pointer h-[38px] ${
                    !showLabel ? 'justify-center px-0' : 'gap-3 px-4'
                  } ${
                    isActive
                      ? 'bg-border-soft/60 text-accent-blue border-accent-blue font-bold'
                      : 'text-text-charcoal hover:bg-border-soft/30 border-transparent hover:text-accent-blue'
                  }`}
                  title={!showLabel ? item.label : undefined}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-blue' : 'text-text-muted'}`} />
                  {showLabel && <span className="truncate font-medium text-[12.5px] animate-fadeIn">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Interactive Collapse Selector Row */}
        {!isMobile && (
          <div className="flex flex-col pb-2 shrink-0">
            <div className="h-[1px] bg-border-soft/60 mx-3 my-1.5" />
            <button
              onClick={onToggleCollapse}
              type="button"
              className={`flex items-center text-left transition-all border-l-[3px] border-transparent text-text-muted hover:text-accent-blue hover:bg-border-soft/30 h-[38px] cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'
              }`}
              title={isCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
              aria-label="Toggle Sidebar Menu"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span className="truncate font-normal text-[11.5px] animate-fadeIn">Collapse Menu</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Corporate profile footer badge securely pinned at extreme bottom */}
      <div className="sticky bottom-0 bg-canvas-bg border-t border-border-soft shrink-0 z-10">
        {(isCollapsed && !isMobile) ? (
          <div className="p-3 flex flex-col items-center gap-3 select-none">
            <button
              onClick={onOpenHelp}
              type="button"
              className="p-1.5 rounded-[3px] border border-border-soft hover:bg-border-soft/40 text-text-muted hover:text-text-charcoal transition-all cursor-pointer"
              title="Open Workspace Help & Docs"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <div 
              className="w-[30px] h-[30px] rounded-full bg-accent-blue text-canvas-bg flex items-center justify-center font-bold text-[11px] shrink-0 border border-border-soft/30 cursor-pointer"
              title="Ops Manager (ID: ADV-3CX0)"
            >
              OP
            </div>
          </div>
        ) : (
          <div id="sidebar-footer-profile" className="p-3 flex items-center justify-between gap-2 transition-all">
            <div className="flex items-center gap-2 min-w-0 max-w-[125px]">
              <div className="w-[30px] h-[30px] rounded-full bg-accent-blue text-canvas-bg flex items-center justify-center font-bold text-[11px] shrink-0 border border-border-soft/30">
                OP
              </div>
              <div className="flex flex-col min-w-0 font-sans">
                <span className="text-[11.5px] font-bold text-text-charcoal truncate leading-none mb-0.5">Ops Manager</span>
                <span className="text-[9.5px] text-text-muted truncate">ID: ADV-3CX0</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenHelp}
                type="button"
                className="p-1.5 rounded-[3px] border border-border-soft hover:bg-border-soft/40 text-text-muted hover:text-text-charcoal transition-all cursor-pointer select-none shrink-0"
                aria-label="Open Workspace Help"
                title="Open Workspace Help & Docs"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
