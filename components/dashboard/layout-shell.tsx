// components/dashboard/layout-shell.tsx
// Frozen sidebar layout conforming to Jira Cloud workspace standard with collapsible capabilities
'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  Settings, 
  Sun, 
  Moon, 
  HelpCircle, 
  X, 
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SupportDrawer } from './support-drawer';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function BrandDiamondLogo({ className = "w-[24px] h-[24px]" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} text-text-charcoal transition-colors`}
    >
      <path 
        d="M50 5 L95 50 L50 95 L5 50 Z" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4"
        className="stroke-current"
      />
      <path 
        d="M50 5 Q50 50 95 50 Q50 50 50 95 Q50 50 5 50 Q50 50 50 5" 
        fill="currentColor" 
        className="fill-current"
        opacity="0.15"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="18" 
        fill="#0052cc" 
      />
    </svg>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const updateThemeColorMeta = (dark: boolean) => {
    if (typeof window === 'undefined') return;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', dark ? '#0d1117' : '#ffffff');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const darkActive = document.documentElement.classList.contains('dark');
      setIsDark(darkActive);
      updateThemeColorMeta(darkActive);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
      updateThemeColorMeta(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
      updateThemeColorMeta(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-1.5 rounded-[3px] border border-border-soft hover:bg-border-soft/40 text-text-muted hover:text-text-charcoal transition-all cursor-pointer select-none shrink-0"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-500 animate-fadeIn" />
      ) : (
        <Moon className="w-4 h-4 text-text-muted animate-fadeIn" />
      )}
    </button>
  );
}

interface SidebarNavProps {
  onOpenHelp: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarNav({ onOpenHelp, isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }: SidebarNavProps) {
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
              <span className="text-[9.5px] text-text-muted leading-none font-bold tracking-wider uppercase">Workspace</span>
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

        {/* Interactive Collapse Selector Row at Bottom of Scrollable Section */}
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

      {/* Corporate profile footer badge securely pinned at extreme bottom of container view */}
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
            <span className="font-bold text-text-charcoal text-[13.5px] tracking-tight truncate">Advantage Software</span>
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
            <span className="font-semibold text-text-charcoal text-left">Advantage Software</span>
            <span>•</span>
            <span className="text-left">Enterprise Telephony Sync System v1.4</span>
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
