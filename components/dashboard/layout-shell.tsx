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
  Database, 
  ShieldCheck, 
  Cpu, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  useEffect(() => {
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
      ? `fixed top-0 bottom-0 left-0 z-50 h-screen w-[240px] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}` 
      : `relative h-screen flex-shrink-0 ${isCollapsed ? 'w-[68px]' : 'w-[240px]'}`
  } border-r border-border-soft bg-sidebar-bg flex flex-col justify-between select-none transition-all duration-300 ease-in-out`;

  const showFullContext = !isCollapsed || isMobile;

  return (
    <aside 
      id="workspace-sidebar"
      className={sidebarClasses}
    >
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col">
          {/* Brand Header block */}
          <div id="sidebar-header" className={`h-[54px] px-4 flex items-center border-b border-border-soft bg-canvas-bg overflow-hidden ${
            (isCollapsed && !isMobile) ? 'justify-center' : 'justify-between'
          }`}>
            <div className="flex items-center gap-3 shrink-0">
              <BrandDiamondLogo className="w-5 h-5 shrink-0" />
              {showFullContext && (
                <div className="flex flex-col min-w-0 animate-fadeIn text-left">
                  <span className="font-bold text-text-charcoal text-[13.5px] tracking-tight leading-tight truncate">Advantage Software</span>
                  <span className="text-[9.5px] text-text-muted leading-none font-bold tracking-wider uppercase">Staff Portal</span>
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

          {/* Navigation block */}
          <div className="flex flex-col gap-1.5 py-4">
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
        </div>

        {/* Interactive Collapse Selector Row at Bottom of Upper Section */}
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

      {/* Corporate profile footer badge */}
      {(isCollapsed && !isMobile) ? (
        <div className="p-3 bg-canvas-bg border-t border-border-soft flex flex-col items-center gap-3 select-none">
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
        <div id="sidebar-footer-profile" className="p-3 bg-canvas-bg border-t border-border-soft flex items-center justify-between gap-2 transition-all">
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
    </aside>
  );
}

// Interactive Help & Confluence-style Docs slideout drawer
interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpDrawer({ isOpen, onClose }: HelpDrawerProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'policies' | 'faq'>('architecture');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does this system help office representatives receive proper credit?",
      a: "By linking physical handset extensions directly to active CRM profiles, any client interaction is auto-routed to the correct representative. Shift leads get dynamic live charts proving authentic project engagement, giving staff proof and credit for their external work."
    },
    {
      q: "Why are some customer satisfaction surveys skipped?",
      a: "Our quality standards limit surveys to meaningful call interactions. Calls under 2 minutes are skipped to filter out answering machines, quick drops, or misdials, and client handsets are capped at 1 survey per day to block duplication."
    },
    {
      q: "What is the Focus Level metric and how is it used?",
      a: "Focus level analyzes representative activity. It is calculated by dividing logged system updates by duration. If updates per hour are lower than 40%, the system flags a 'Review' tag so supervisors can easily clear or verify them manually."
    },
    {
      q: "How does the CRM database mapping synchronizer run?",
      a: "Once a call meets compliance requirements, our SMS system dispatches the survey. When the client responds, results map directly back to their CRM profile timeline so no documentation is lost."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[560px] h-full bg-canvas-bg shadow-2xl flex flex-col justify-between border-l border-border-soft z-50 p-6 animate-slideIn text-left transition-colors duration-150">
        <div className="flex-1 overflow-y-auto pr-1 text-[11.5px] text-text-charcoal flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-soft pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-blue/10 p-2 rounded-[3px] text-accent-blue font-bold">
                <HelpCircle className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-text-charcoal tracking-tight">Support & Knowledge Base</h3>
                <p className="text-[10px] text-text-muted font-bold uppercase mt-0.5">Console Manual & Verification Guide</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-charcoal rounded-[3px] hover:bg-border-soft/45 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
 
          {/* Welcome Guidance Card */}
          <div className="bg-accent-blue/5 border border-accent-blue/15 rounded-[3px] p-3 mb-3">
            <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 leading-tight">
              💡 Operations Help Center
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Advantage Software links office calls with CRM customer records to automate feedback surveys. Walk through these sections to learn about employee verification rules and survey filters.
            </p>
          </div>

          {/* Dialog Tabs Navigation */}
          <div className="flex border-b border-border-soft mb-4 select-none">
            {[
              { id: 'architecture', label: 'Workflows', icon: Database },
              { id: 'policies', label: 'Quality Filters', icon: ShieldCheck },
              { id: 'faq', label: 'Operations FAQ', icon: FileText }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 border-b-2 text-[11.5px] font-bold cursor-pointer transition-all ${
                    activeTab === tab.id
                      ? 'border-accent-blue text-accent-blue font-extrabold bg-border-soft/20'
                      : 'border-transparent text-text-muted hover:text-text-charcoal hover:bg-sidebar-bg/30'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1">
            {activeTab === 'architecture' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div>
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <Database className="w-3.5 h-3.5 text-accent-blue" />
                    Office-to-CRM Synergy
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-justify">
                    This portal supports office representatives working on customer accounts. By matching phone extensions with active member profiles, interactions are automatically verified so representatives receive proper evaluation credit:
                  </p>
                </div>

                <div className="bg-sidebar-bg/60 border border-border-soft rounded-[3px] p-3 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#0052cc] text-white font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight">Inbound Phone Call Sync</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal">Pulls call connection logs automatically when representative discussions conclude.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#b35b00] dark:bg-[#f1b44c] text-white dark:text-[#3a2e12] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight">Representative Verified Matches</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal">Pairs specific office phone extensions with customer profiles for accurate performance tracking.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#006644] dark:bg-[#57d9a3] text-white dark:text-[#1f3a2b] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">3</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight">Automated Survey Sendouts</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal">Dispatches brief satisfaction questions to customer numbers and records responses in CRM histories.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/20 text-[11px] leading-relaxed text-text-muted">
                  <strong className="font-bold text-text-charcoal block mb-0.5">Ensuring Proper Evaluation Credit</strong>
                  This automatic verification chain makes it easy for coordinators to track active phone engagements without requiring staff to submit manual shift reports.
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div>
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
                    Quality Guidelines & Compliance
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-justify">
                    To maintain professional standards and prevent customer fatigue, the system applies automated filters before queueing any outbound messages:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30">
                    <span className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                      Two-Minute Conversation Minimum
                    </span>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      Calls shorter than two minutes are excluded to filter out misdials or automated voicemail answers, ensuring only meaningful calls trigger survey sends.
                    </p>
                  </div>

                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30">
                    <span className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Daily Spam Prevention Cap
                    </span>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      Customer phone numbers are limited to one feedback request per twenty-four-hour cycle. Frequent contacts are automatically filtered.
                    </p>
                  </div>
                </div>

                <div className="p-3 border border-status-attention-text/20 bg-status-attention-bg rounded-[3px] text-status-attention-text text-[11px] leading-relaxed">
                  <strong className="font-bold block mb-0.5">Manager Action Overrides</strong>
                  Operations leads can review pending alerts under the <em className="font-semibold">Team Performance</em> tab, verifying representational states or clearing employee alerts manually.
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-3.5 h-3.5 text-accent-blue" />
                  Operations FAQ
                </h4>
                
                <div className="flex flex-col border border-border-soft rounded-[3px] divide-y divide-border-soft">
                  {faqs.map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div key={idx} className="flex flex-col bg-canvas-bg font-medium">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full text-left p-3 flex items-center justify-between font-bold text-[11.5px] text-text-charcoal hover:bg-sidebar-bg/25 transition-all outline-none cursor-pointer select-none"
                        >
                          <span>{faq.q}</span>
                          <span className="text-[12px] text-text-muted font-mono shrink-0 ml-2">{isExpanded ? '−' : '+'}</span>
                        </button>
                        {isExpanded && (
                          <div className="p-3 pt-0 text-[11px] text-text-muted leading-relaxed font-normal bg-sidebar-bg/10 animate-fadeIn font-sans">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer actions inside the drawer */}
        <div className="border-t border-border-soft pt-4 bg-canvas-bg flex flex-col gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-accent-blue hover:opacity-95 active:scale-[0.99] text-canvas-bg hover:brightness-110 text-[12px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none transition-all"
          >
            Acknowledge & Close Help Desk
          </button>
        </div>
      </div>
    </div>
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
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
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
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

