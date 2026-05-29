// components/dashboard/layout-shell.tsx
// Frozen sidebar layout conforming to Jira Cloud workspace standard
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
  FileText 
} from 'lucide-react';

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
}

function SidebarNav({ onOpenHelp }: SidebarNavProps) {
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

      {/* Corporate profile footer badge (Fully stationary with ThemeToggle and Help) */}
      <div id="sidebar-footer-profile" className="p-3 bg-canvas-bg border-t border-border-soft flex items-center justify-between gap-2">
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
      q: "Where do call registers originate from?",
      a: "They flow in from our linked physical 3CX IP-PBX via server-to-server call journaling APIs. When an agent hangs up, a call event is instantly dispatched to this workspace's ingestion endpoint."
    },
    {
      q: "Why are some surveys skipped/suppressed?",
      a: "Our compliance policy blocks surveys for calls under 120 seconds (under 2 minutes) to filter out automated IVRs/silent lines, and limits outbound texts to 1 dispatch per customer telephone number per 24 hours to prevent spam."
    },
    {
      q: "How does the Zoho synchronization work?",
      a: "Once a survey is successfully verified, the user's extension mapping matches the Zoho Profile ID. The system triggers an API sync to Zoho Desk to append the call timeline telemetry directly onto the stakeholder's master client case profile."
    },
    {
      q: "What is calculated 'Focus rating'?",
      a: "Focus level analyzes representative activity. It is calculated by dividing total system operations (updates) by duration. If updates per hour are unusually low, the system throws a 'Review Required' compliance status."
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
      <div className="relative w-full max-w-[500px] h-full bg-canvas-bg shadow-2xl flex flex-col justify-between border-l border-border-soft z-50 p-6 animate-slideIn text-left transition-colors duration-150">
        <div className="flex-1 overflow-y-auto pr-1 text-[12.5px] text-text-charcoal flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-soft pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-blue/10 p-2 rounded-[3px] text-accent-blue font-bold">
                <HelpCircle className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-bold text-[14.5px] text-text-charcoal tracking-tight">Advantage Teams Support Center</h3>
                <p className="text-[10px] text-text-muted font-mono font-semibold uppercase mt-0.5">Stakeholder Manual & Verification Blueprint</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-charcoal rounded-[3px] hover:bg-border-soft/45 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-[3px] p-3.5 mb-4 flex items-center gap-3">
            <BrandDiamondLogo className="w-7 h-7" />
            <div>
              <span className="font-bold text-[12px] block text-text-charcoal">System Version v3.1.0 (LTS)</span>
              <span className="text-[10.5px] text-text-muted">High-density 3CX-to-Zoho data synchronization and carrier gateway pipeline and compliance controller.</span>
            </div>
          </div>

          {/* Dialog Tabs Navigation */}
          <div className="flex border-b border-border-soft mb-4 select-none">
            {[
              { id: 'architecture', label: 'Architecture', icon: Database },
              { id: 'policies', label: 'Guardrails', icon: ShieldCheck },
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
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div>
                  <h4 className="font-bold text-[12.5px] text-text-charcoal mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <Database className="w-4 h-4 text-accent-blue" />
                    Data Integration Pipeline Topology
                  </h4>
                  <p className="text-[12px] leading-relaxed text-text-muted text-justify">
                    Advantage Teams sits persistently at the center of the telecommunication stack. It bridges hardware device extensions to CRM case profiles through a three-stage relational verification tree:
                  </p>
                </div>

                <div className="bg-sidebar-bg border border-border-soft rounded-[3px] p-3 font-mono text-[10.5px] text-text-charcoal flex flex-col gap-2.5">
                  <div className="flex items-start gap-2">
                    <span className="bg-accent-blue/15 text-accent-blue font-extrabold px-1.5 py-0.5 rounded leading-none">1</span>
                    <div>
                      <strong className="text-text-charcoal">3CX WebHook Event Ingestion</strong>
                      <p className="text-[10px] text-text-muted mt-0.5">Captures raw JSON call logging payloads from PBX with representative Extension metrics.</p>
                    </div>
                  </div>
                  <div className="h-4 border-l border-dashed border-border-soft/80 ml-3" />
                  <div className="flex items-start gap-2">
                    <span className="bg-amber-500/15 text-amber-600 font-extrabold px-1.5 py-0.5 rounded leading-none">2</span>
                    <div>
                      <strong className="text-text-charcoal">Relational Validation Engine</strong>
                      <p className="text-[10px] text-text-muted mt-0.5">Cross-checks database mapping configuration registers, resolving Hardware Extension to Zoho CRM ID.</p>
                    </div>
                  </div>
                  <div className="h-4 border-l border-dashed border-border-soft/80 ml-3" />
                  <div className="flex items-start gap-2">
                    <span className="bg-status-verified-bg text-status-verified-text font-extrabold px-1.5 py-0.5 rounded leading-none">3</span>
                    <div>
                      <strong className="text-text-charcoal">Twilio Outbound SMS Gateway</strong>
                      <p className="text-[10px] text-text-muted mt-0.5">Launches the dynamic callback surveys and registers timeline telemetry logs to user accounts.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-border-soft p-3.5 rounded-[3px] bg-canvas-bg leading-relaxed text-text-muted">
                  <strong className="font-bold text-text-charcoal block mb-1">State Consistency</strong>
                  The system relies on local session caches mapping back gracefully to a robust Vercel serverless layer. When standard databases are configured, the API endpoints route securely to write records without mock telemetry variables.
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div>
                  <h4 className="font-bold text-[12.5px] text-text-charcoal mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <Cpu className="w-4 h-4 text-accent-blue" />
                    Compliance & Relational Guardrails
                  </h4>
                  <p className="text-[12px] leading-relaxed text-text-muted text-justify">
                    Unfiltered telecom pipelines result in carrier spam flags and data collisions. The platform automatically enforces two critical pipeline throttles:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/40">
                    <span className="font-bold text-[12px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                      120-Second Active Hang-Up Rule
                    </span>
                    <p className="text-[11.5px] text-text-muted mt-1 leading-relaxed">
                      Calls hanging up prior to reaching 2 minutes total duration are labeled <span className="font-mono text-[10.5px] bg-border-soft text-text-charcoal px-1 py-0.5 rounded font-semibold">Skipped: Under 2 Minutes</span>. This guarantees that calls that fail to establish a direct dialogue with support agents (such as answering machines, quick drops, or misdials) never trigger an outbound satisfaction message feedback request.
                    </p>
                  </div>

                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/40">
                    <span className="font-bold text-[12px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Anti-Spam Daily Frequency Ceiling
                    </span>
                    <p className="text-[11.5px] text-text-muted mt-1 leading-relaxed">
                      A single customer telephone number is allowed a maximum of <span className="font-bold">1 text dispatch within a 24-hour cycle</span>. Duplicate inbound calls hitting identical numbers within the same working shift are auto-filtered to maintain exceptional regulatory telecom compliance.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-semibold border border-status-attention-text/20 bg-status-attention-bg rounded-[3px] text-status-attention-text text-[11.5px] leading-relaxed">
                  <strong className="font-bold block mb-1">Supervisor Override Action</strong>
                  Supervisors can review pending logs under the <em className="font-semibold">Team Performance</em> or <em className="font-semibold">Survey Center</em> panels, easily inspecting timeline activity diagrams and dismissing compliance exceptions if a specific agent requires manual clearance.
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <h4 className="font-bold text-[12.5px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-accent-blue" />
                  Operations Frequently Asked Questions
                </h4>
                
                <div className="flex flex-col border border-border-soft rounded-[3px] divide-y divide-border-soft">
                  {faqs.map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div key={idx} className="flex flex-col bg-canvas-bg font-medium">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full text-left p-3 flex items-center justify-between font-bold text-[12px] text-text-charcoal hover:bg-sidebar-bg/25 transition-all outline-none cursor-pointer select-none"
                        >
                          <span>{faq.q}</span>
                          <span className="text-[14px] text-text-muted font-mono shrink-0 ml-2">{isExpanded ? '−' : '+'}</span>
                        </button>
                        {isExpanded && (
                          <div className="p-3 pt-0 text-[11.5px] text-text-muted leading-relaxed font-normal bg-sidebar-bg/10 animate-fadeIn font-sans">
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
            className="w-full h-10 bg-accent-blue hover:opacity-95 active:scale-[0.99] text-canvas-bg hover:brightness-110 text-[12.5px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none transition-all"
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

  return (
    <div 
      id="advantage-teams-root" 
      className="h-screen w-screen overflow-hidden flex bg-canvas-bg text-text-charcoal font-sans selection:bg-accent-blue/10 transition-colors duration-150"
    >
      <Suspense fallback={<div className="h-screen w-[240px] flex-shrink-0 bg-sidebar-bg border-r border-border-soft" />}>
        <SidebarNav onOpenHelp={() => setIsHelpOpen(true)} />
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

      {/* Corporate Help Center Panel Slideout */}
      <HelpDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
