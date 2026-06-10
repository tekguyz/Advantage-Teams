// components/dashboard/layout-shell.tsx
// Frozen sidebar layout conforming to Jira Cloud workspace standard with collapsible capabilities
'use client';

import React, { Suspense, useState } from 'react';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarNav } from './sidebar-nav';
import { BrandDiamondLogo } from './brand-logo';
import { SupportDrawer } from './support-drawer';

interface LayoutShellProps {
  children: React.ReactNode;
}

export { BrandDiamondLogo };

export function LayoutShell({ children }: LayoutShellProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div 
      id="advantage-software-root" 
      className="h-screen w-screen overflow-hidden flex bg-canvas-bg text-text-charcoal font-sans selection:bg-accent-blue/10 transition-colors duration-150 relative"
    >
      {/* Backdrop for mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Suspense fallback={<div className="h-screen w-[240px] flex-shrink-0 bg-sidebar-bg border-r border-border-soft" />}>
        <SidebarNav 
          onOpenHelp={() => setIsHelpOpen(true)} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
        />
      </Suspense>

      {/* Main workspace scrolling viewport */}
      <main 
        id="view-scrollbox-viewport" 
        className="flex-1 h-screen overflow-y-auto bg-canvas-bg transition-all duration-300 flex flex-col justify-between"
      >
        {/* Mobile top bar header row */}
        <div className="flex md:hidden h-[54px] w-full border-b border-border-soft items-center justify-between px-4 bg-canvas-bg shrink-0 sticky top-0 z-35">
          <div className="flex items-center gap-2.5">
            <BrandDiamondLogo className="w-5 h-5 shrink-0" />
            <span className="font-bold text-text-charcoal text-[13.5px] tracking-tight truncate">Advantage Software — Teams</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-[3px] border border-border-soft text-text-charcoal hover:bg-border-soft/30 transition-all cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-text-charcoal" />
          </button>
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col font-sans">
          {children}
        </div>

        {/* Clean Corporate Footer featuring TEKGUYZ */}
        <footer className="border-t border-border-soft/60 py-3.5 px-4 sm:px-6 lg:px-8 bg-sidebar-bg/15 text-text-muted text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3 select-none shrink-0 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-charcoal text-left">Advantage Software — Teams</span>
            <span>•</span>
            <span className="text-left">Performance Analytics & Telemetry Workspace v1.4</span>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto flex-row">
            <span>Engineering by</span>
            <a 
              href="https://tekguyz.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-2 py-0.5 rounded-[3px] bg-[#0052cc] dark:bg-[#1f6feb] text-white font-bold tracking-tight text-[10px] hover:brightness-110 active:scale-95 transition-all outline-none shadow-xs"
            >
              TEKGUYZ
            </a>
          </div>
        </footer>
      </main>

      {/* Corporate Help Center Panel Slideout */}
      <SupportDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
