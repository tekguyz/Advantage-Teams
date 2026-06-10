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
  const [activeTab, setActiveTab] = useState<'architecture' | 'policies' | 'faq'>('architecture');
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
              { id: 'architecture', label: 'Workflows', icon: Database },
              { id: 'policies', label: 'Guidelines', icon: ShieldCheck },
              { id: 'faq', label: 'FAQ', icon: FileText }
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
            {activeTab === 'architecture' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div className="text-left">
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <Database className="w-3.5 h-3.5 text-accent-blue" />
                    How It Works
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-left">
                    Our platform automatically connects phone interactions from representatives with customer profiles. This ensures reps receive instant, accurate credit for helping customers, completely removing manual record keeping:
                  </p>
                </div>

                <div className="bg-sidebar-bg/60 border border-border-soft rounded-[3px] p-3 flex flex-col gap-2.5 text-left">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#0052cc] text-white font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">1</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Logged Calls</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">Calculates call lengths automatically and saves them as soon as discussions conclude.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#b35b00] dark:bg-[#f1b44c] text-white dark:text-[#3a2e12] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">2</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Account Matching</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">Pairs phone activity with the right client profile so you get complete, automated performance credit.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-[#006644] dark:bg-[#57d9a3] text-white dark:text-[#1f3a2b] font-extrabold w-4.5 h-4.5 text-[10px] rounded-full flex items-center justify-center shrink-0">3</span>
                    <div className="flex-1 min-w-0">
                      <strong className="text-text-charcoal text-[11.5px] block font-bold leading-tight text-left">Customer Feedback</strong>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-normal text-left">Triggers safe, automated surveys to gather positive customer insights directly inside their histories.</p>
                    </div>
                  </div>
                </div>

                <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/20 text-[11px] leading-relaxed text-text-muted text-left">
                  <strong className="font-bold text-text-charcoal block mb-0.5">Simple Performance Credit</strong>
                  No manual logs or paperwork. Representatives can focus strictly on customer care while the dashboard validates efforts in the background.
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="flex flex-col gap-3.5 animate-fadeIn">
                <div className="text-left">
                  <h4 className="font-bold text-[12px] text-text-charcoal mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
                    Customer Quality Rules
                  </h4>
                  <p className="text-[11.5px] leading-relaxed text-text-muted text-left">
                    We want feedback to be genuine and respectful of customer time. To ensure survey quality, we utilize smart customer guidelines automatically:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30 text-left">
                    <strong className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                      Two-Minute Conversation Rule
                    </strong>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      Only calls lasting longer than two minutes trigger evaluation requests. This filters out quick busy signals, wrong numbers, or voice mailboxes automatically.
                    </p>
                  </div>

                  <div className="border border-border-soft p-3 rounded-[3px] bg-sidebar-bg/30 text-left">
                    <strong className="font-bold text-[11.5px] text-text-charcoal flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      One Survey per Day Cap
                    </strong>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                      A single customer never receives more than one feedback survey within a 24-hour cycle, preventing communication fatigue.
                    </p>
                  </div>
                </div>

                <div className="p-3 border border-status-attention-text/20 bg-status-attention-bg rounded-[3px] text-status-attention-text text-[11px] leading-relaxed text-left">
                  <strong className="font-bold block mb-0.5">Supervisor Control</strong>
                  Operations coordinators can easily verify performance data or clear team alert tags inside the <em className="font-semibold">Team Performance</em> board with a single click.
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

        {/* Footer actions pinned at the bottom - utilizing safe-area-inset for perfect layout on Pixel 9A / notch screens */}
        <div className="border-t border-border-soft bg-canvas-bg px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:px-6 shrink-0 select-none">
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
