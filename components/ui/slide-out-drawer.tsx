// components/ui/slide-out-drawer.tsx
'use client';

import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { AgentPerformance } from '@/types/data-matrix';

interface SlideOutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agent: (AgentPerformance & { calculatedFocus: number }) | null;
  onClearAlert: (agentId: string) => void;
}

/**
 * Clean review slide-out drawer conforming with Jira Design Systems
 */
export function SlideOutDrawer({
  isOpen,
  onClose,
  agent,
  onClearAlert,
}: SlideOutDrawerProps) {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Drawer content box */}
      <div className="relative w-full max-w-[390px] h-full bg-canvas-bg shadow-2xl flex flex-col justify-between border-l border-border-soft z-50 p-6 animate-slideIn text-left transition-colors duration-150">
        <div className="flex-1 overflow-y-auto pr-1 text-[12px]">
          
          {/* Header block */}
          <div className="flex items-center justify-between border-b border-border-soft pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-status-attention-bg p-1.5 rounded-[3px] text-status-attention-text">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-text-charcoal tracking-tight">Review Representative</h3>
                <p className="text-[10px] text-text-muted font-semibold uppercase mt-0.5 animate-pulse">Focus Exception Alert</p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-1.5 text-text-muted hover:text-text-charcoal rounded-[3px] hover:bg-border-soft/40 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-4">
            
            {/* Representative Card */}
            <div className="bg-sidebar-bg border border-border-soft/60 p-4 rounded-[3px]">
              <span className="text-[9.5px] text-text-muted font-bold uppercase tracking-wider block mb-1">Support Representative</span>
              <span className="text-[15px] font-bold text-text-charcoal block">{agent.name}</span>
              <div className="flex gap-2.5 mt-2.5 pt-2.5 border-t border-border-soft/50 text-[11px] text-text-muted font-medium">
                <span>Ext: <strong className="font-mono text-text-charcoal">{agent.extension}</strong></span>
                <span className="text-border-soft">|</span>
                <span>Zoho ID: <strong className="font-mono text-text-charcoal">{agent.zohoId || 'N/A'}</strong></span>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border-soft p-3 rounded-[3px] bg-canvas-bg text-center shadow-3xs">
                <span className="text-[9px] text-text-muted font-bold uppercase block mb-0.5">Offline duration</span>
                <span className="text-[15px] font-mono font-bold text-text-charcoal">{agent.durationMins}m</span>
              </div>
              <div className="border border-border-soft p-3 rounded-[3px] bg-canvas-bg text-center shadow-3xs">
                <span className="text-[9px] text-text-muted font-bold uppercase block mb-0.5">Recorded Updates</span>
                <span className="text-[15px] font-mono font-bold text-text-charcoal">{agent.systemUpdates} ops</span>
              </div>
            </div>

            {/* Exception Warning box */}
            <div className="bg-status-attention-bg border border-status-attention-text/20 p-4 rounded-[3px] text-status-attention-text leading-relaxed">
              <strong className="font-semibold block mb-1.5 text-[12px] flex items-center gap-1">
                Performance Exception Details
              </strong>
              The recorded output of <strong className="font-bold">{agent.systemUpdates} updates</strong> across <strong className="font-bold">{agent.durationMins} minutes</strong> yields a Focus Rating of <strong className="font-bold text-[13px] font-mono">{agent.calculatedFocus}%</strong>.
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border-soft bg-canvas-bg">
          <button
            type="button"
            onClick={() => onClearAlert(agent.id)}
            className="w-full h-10 bg-accent-blue hover:opacity-90 active:scale-[0.98] text-canvas-bg text-[12.5px] font-bold rounded-[3px] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all text-center select-none"
          >
            Clear Alert & Override Compliance
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 border border-border-soft hover:bg-sidebar-bg text-text-charcoal text-[12.5px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-all text-center select-none"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
