// components/dashboard/support-drawer.tsx
'use client';

import React, { useState } from 'react';
import { HelpCircle, X, Database, ShieldCheck, FileText } from 'lucide-react';

interface SupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportDrawer({ isOpen, onClose }: SupportDrawerProps) {
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
    <div className="fixed inset-0 z-50 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 right-0 w-full md:w-[400px] h-screen bg-canvas-bg border-l border-border-soft z-50 shadow-xl flex flex-col justify-between animate-slideIn text-left transition-colors duration-150 pb-safe">
        <div className="flex-1 overflow-y-auto pr-1 text-[11.5px] text-text-charcoal flex flex-col px-4 py-5 md:px-6">
          
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
        <div className="border-t border-border-soft bg-canvas-bg flex flex-col gap-2 px-4 py-5 md:px-6">
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
