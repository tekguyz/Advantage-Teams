// components/dashboard/performance-drawer.tsx
'use client';

import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { AgentPerformance } from '@/types/data-matrix';

interface PerformanceDrawerProps {
  selectedAgent: (AgentPerformance & { calculatedFocus: number }) | null;
  onClose: () => void;
  onClearAlert: (agentId: string) => void;
}

export function PerformanceDrawer({
  selectedAgent,
  onClose,
  onClearAlert,
}: PerformanceDrawerProps) {
  if (!selectedAgent) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" 
        onClick={onClose} 
      />
      {/* Slideout Container */}
      <div className="relative w-full max-w-[390px] h-full bg-canvas-bg shadow-2xl flex flex-col justify-between border-l border-border-soft z-50 p-6 text-left animate-slideIn transition-colors duration-150 font-sans">
        <div className="flex-1 overflow-y-auto pr-1 text-[12px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-soft pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-status-attention-bg p-1.5 rounded-[3px] text-status-attention-text">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-text-charcoal tracking-tight">Review Representative</h3>
                <p className="text-[10px] text-text-muted font-semibold uppercase mt-0.5 animate-pulse">REVIEW REQUIRED</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              type="button"
              className="p-1.5 text-text-muted hover:text-text-charcoal rounded-[3px] hover:bg-border-soft/40 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Representative profile box */}
            <div className="bg-sidebar-bg border border-border-soft/60 p-4 rounded-[3px]">
              <span className="text-[9.5px] text-text-muted font-bold uppercase tracking-wider block mb-1">Representative Profile</span>
              <span className="text-[14.5px] font-bold text-text-charcoal block">{selectedAgent.name}</span>
              <div className="flex gap-2.5 mt-2.5 pt-2.5 border-t border-border-soft/50 text-[11px] text-text-muted font-medium">
                <span>Extension: <strong className="font-mono text-text-charcoal">{selectedAgent.extension}</strong></span>
                <span className="text-border-soft">|</span>
                <span>CRM ID: <strong className="font-mono text-text-charcoal">{selectedAgent.zohoId || 'N/A'}</strong></span>
              </div>
            </div>

            {/* Offline and system actions stats comparisons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border-soft p-3 rounded-[3px] bg-canvas-bg text-center shadow-3xs">
                <span className="text-[9px] text-text-muted font-bold uppercase block mb-0.5">Offline Duration</span>
                <span className="text-[14px] font-mono font-bold text-text-charcoal">{selectedAgent.durationMins}m</span>
              </div>
              <div className="border border-border-soft p-3 rounded-[3px] bg-canvas-bg text-center shadow-3xs">
                <span className="text-[9px] text-text-muted font-bold uppercase block mb-0.5">System Updates</span>
                <span className="text-[14px] font-mono font-bold text-text-charcoal">{selectedAgent.systemUpdates} ops</span>
              </div>
            </div>

            {/* Warning log details */}
            <div className="bg-status-attention-bg border border-status-attention-text/20 p-4 rounded-[3px] text-status-attention-text leading-relaxed">
              <strong className="font-semibold block mb-1.5 text-[11.5px]">Performance Warning Logs</strong>
              <p className="text-[11.5px] mb-2 leading-relaxed">
                This representative logged only <strong className="font-bold">{selectedAgent.systemUpdates} workspace operations</strong> across <strong className="font-bold">{selectedAgent.durationMins} minutes</strong> of communication activity.
              </p>
              <p className="text-[11.5px] leading-relaxed">
                This evaluates to a <strong className="font-bold">Calculated Focus Rating of {selectedAgent.calculatedFocus}%</strong>. Supervisors can override compliance alert flags to register proper credits.
              </p>
            </div>
          </div>
        </div>

        {/* Override actions inside dialog footer */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border-soft bg-canvas-bg">
          <button
            type="button"
            onClick={() => onClearAlert(selectedAgent.id)}
            className="w-full h-10 bg-accent-blue hover:opacity-90 active:scale-[0.98] text-canvas-bg text-[12.5px] font-bold rounded-[3px] flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all text-center select-none"
          >
            Clear Alert & Verify Activity
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
