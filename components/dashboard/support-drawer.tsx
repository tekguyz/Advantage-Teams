// components/dashboard/support-drawer.tsx
'use client';

import React, { useState } from 'react';
import { HelpCircle, X, Database, ShieldCheck, FileText } from 'lucide-react';
import { faqs } from './support-questions';

interface SupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportDrawer({ isOpen, onClose }: SupportDrawerProps) {
  const [activeTab, setActiveTab] = useState<'credit' | 'surveys' | 'faq'>('credit');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      {/* Drawer - uses top-to-bottom inset-y-0 to handle dynamic screen heights on mobile correctly */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-canvas-bg border-l border-border-soft z-50 shadow-xl flex flex-col justify-between animate-slideIn text-left transition-colors duration-150">
        
        {/* Header - Pinned at the top for neatness and a compact height */}
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3 md:px-6 shrink-0 h-[54px] bg-canvas-bg select-none">
          <div className="flex items-center gap-2.5">
            <div className="bg-accent-blue/10 p-1.5 rounded-[3px] text-accent-blue font-bold">
              <HelpCircle className="w-4 h-4 text-accent-blue" />
            </div>
            <h3 className="font-bold text-[13px] text-text-charcoal tracking-tight">Help Center</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 px-1.5 text-text-muted hover:text-text-charcoal rounded-[3px] hover:bg-border-soft/45 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto pr-1 text-[11.5px] text-text-charcoal flex flex-col px-4 py-4 md:px-6 scrollbar-thin">
          
          {/* Dialog Tabs Navigation */}
          <div className="flex border-b border-border-soft mb-4 select-none shrink-0">
            {[
              { id: 'credit', label: 'Rep Credit', icon: Database },
              { id: 'surveys', label: 'SMS Surveys', icon: ShieldCheck },
              { id: 'faq', label: 'Support FAQ', icon: FileText }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setExpandedFaq(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-b-2 text-[11px] font-bold cursor-pointer transition-all ${
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
            {activeTab === 'credit' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div className="text-left">
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <Database className="w-3.5 h-3.5 text-accent-blue" />
                    Representational Credit
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-left">
                    How team members get credit for all their work—whether on physical phone lines or on offline focus tasks, project assignments, or timeout codes:
                  </p>
                </div>

                <div className="bg-sidebar-bg/60 border border-border-soft rounded-[3px] p-3 flex flex-col gap-2.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#0052cc] text-white font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Invoices &amp; Calls</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">We connect phone systems directly to customer files, so reps automatically get credited with call completions without writing manual shift logs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#b35b00] dark:bg-[#f1b44c] text-white dark:text-[#3a2e12] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Offline Projects</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">When you switch to offline tasks (like paperwork, file cleanups, or case reviews), the platform verifies active assignments so this valuable focus time is tracked and credited.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#006644] dark:bg-[#57d9a3] text-white dark:text-[#1f3a2b] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">3</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Timeout Protections</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">Breaks and timeout margins are protected under verified ranges so employees never lose progress or fall below benchmarks during scheduled pauses.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/20 text-[11px] leading-relaxed text-text-muted text-left">
                  <strong className="font-bold text-text-charcoal block mb-0.5">Dual-Purpose Credit Assurance</strong>
                  Whether on direct inbound streams or offline tasks, every minute of focus is safely verified and credited to reflect your dynamic contribution accurately.
                </div>
              </div>
            )}

            {activeTab === 'surveys' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div className="text-left">
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
                    Outbound SMS Surveys
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-left">
                    Clear explanation of how customer feedback loops work, ensuring high-quality responses and zero communication fatigue:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30 text-left">
                    <strong className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5 font-sans animate-fade">
                      <span className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                      Automatic Surveys
                    </strong>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      When a helpful chat wraps up, the system automatically texts the customer a simple satisfaction question.
                    </p>
                  </div>

                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30 text-left">
                    <strong className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5 font-sans animate-fade">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      The 2-Minute Buffer
                    </strong>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      We only send surveys to customers after a conversation lasting longer than two minutes, keeping quick misdials or busy signals from sending blank requests.
                    </p>
                  </div>

                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30 text-left">
                    <strong className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5 font-sans animate-fade">
                      <span className="w-1.5 h-1.5 bg-[#006644] rounded-full" />
                      Once-a-Day Boundary
                    </strong>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      Customers are limited to a maximum of one request every 24 hours to protect their time and prevent duplicate notifications.
                    </p>
                  </div>
                </div>

                <div className="p-3 border border-status-attention-text/20 bg-status-attention-bg rounded-[3px] text-status-attention-text text-[11px] leading-relaxed text-left">
                  <strong className="font-bold block mb-0.5">High-Quality, Respectful Loop</strong>
                  Our safeguards filter out invalid leads and respect user rest cycles to keep survey indicators accurate without fatigue.
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <div className="text-left">
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <FileText className="w-3.5 h-3.5 text-accent-blue" />
                    Help &amp; Answers
                  </h4>
                </div>
                
                <div className="flex flex-col border border-border-soft rounded-[3px] divide-y divide-border-soft">
                  {faqs.map((faq, idx) => {
                    const isExpanded = expandedFaq === idx;
                    return (
                      <div key={idx} className="flex flex-col bg-canvas-bg font-medium">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                          className="w-full text-left p-2.5 flex items-center justify-between font-bold text-[11.5px] text-text-charcoal hover:bg-sidebar-bg/25 transition-all outline-none cursor-pointer select-none"
                        >
                          <span className="text-left leading-normal">{faq.q}</span>
                          <span className="text-[12px] text-text-muted font-mono shrink-0 ml-2">{isExpanded ? '−' : '+'}</span>
                        </button>
                        {isExpanded && (
                          <div className="p-2.5 pt-0 text-[11px] text-text-muted leading-relaxed font-normal bg-sidebar-bg/10 animate-fadeIn font-sans text-left">
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

        {/* Footer actions pinned at the bottom - optimized top/bottom padding to sit neat on notch screens */}
        <div className="border-t border-border-soft bg-canvas-bg px-4 py-3.5 md:px-6 shrink-0 select-none">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 bg-accent-blue hover:brightness-105 active:scale-[0.99] text-white text-[12px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            Acknowledge &amp; Close Help Desk
          </button>
        </div>
      </div>
    </div>
  );
}
