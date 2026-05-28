// components/dashboard/layout-shell.tsx
// Frozen sidebar layout conforming to Jira Cloud workspace standard
'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PhoneCall, Settings, Sun, Moon } from 'lucide-react';

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
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
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
      className="h-screen w-[240px] flex-shrink-0 border-r border-border-soft bg-sidebar-bg flex flex-col justify-between select-none transition-colors duration-150"
    >
      <div className="flex flex-col animate-fadeIn">
        {/* Brand Header block */}
        <div id="sidebar-header" className="h-[54px] px-4 flex items-center gap-3 border-b border-border-soft bg-canvas-bg">
          <BrandDiamondLogo />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-text-charcoal text-[13.5px] tracking-tight leading-tight truncate">Advantage Teams</span>
            <span className="text-[9.5px] text-text-muted leading-none font-bold tracking-wider uppercase">Made by TEKGUYZ</span>
          </div>
        </div>

        {/* Navigation block */}
        <div className="flex flex-col gap-1.5 py-4">
          <span className="px-4 text-[10px] font-bold text-text-muted tracking-wider uppercase opacity-80">
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
                  className={`flex items-center gap-3 h-[36px] px-4 text-[12.5px] transition-all border-l-[3px] text-left cursor-pointer ${
                    isActive
                      ? 'bg-border-soft/60 text-accent-blue border-accent-blue font-bold'
                      : 'text-text-charcoal hover:bg-border-soft/30 border-transparent hover:text-accent-blue'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent-blue' : 'text-text-muted'}`} />
                  <span className="truncate font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Corporate profile footer badge (Fully stationary with ThemeToggle) */}
      <div id="sidebar-footer-profile" className="p-3 bg-canvas-bg border-t border-border-soft flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 max-w-[155px]">
          <div className="w-[30px] h-[30px] rounded-full bg-accent-blue text-canvas-bg flex items-center justify-center font-bold text-[11px] shrink-0 border border-border-soft/30">
            OP
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11.5px] font-bold text-text-charcoal truncate leading-none mb-0.5">Ops Manager</span>
            <span className="text-[9.5px] text-text-muted truncate">ID: ADV-3CX0</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div 
      id="advantage-teams-root" 
      className="h-screen w-screen overflow-hidden flex bg-canvas-bg text-text-charcoal font-sans selection:bg-accent-blue/10 transition-colors duration-150"
    >
      <Suspense fallback={<div className="h-screen w-[240px] flex-shrink-0 bg-sidebar-bg border-r border-border-soft" />}>
        <SidebarNav />
      </Suspense>

      {/* Main workspace scrolling viewport */}
      <main 
        id="view-scrollbox-viewport" 
        className="flex-1 h-screen overflow-y-auto pb-12 bg-canvas-bg"
      >
        <div className="max-w-[1250px] mx-auto p-6 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
