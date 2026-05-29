// components/ui/component-feedback.tsx
// Corporate visual feedback managers (Jira-inspired with explicit z-indices z-40 and z-50)
'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Info, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

/**
 * Minimalist inline tooltip.
 * Appends a small, minimal grey question mark inline with header text.
 * Tooltip popup has explicit z-index z-50 to hover on top.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span 
      className="relative inline-flex items-center gap-1 cursor-help select-none"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span>{children}</span>
      <HelpCircle className="w-3.5 h-3.5 text-text-muted hover:text-text-charcoal shrink-0 inline-block transition-colors" />
      {visible && (
        <span 
          style={{ transform: 'translateX(-50%)' }}
          className="absolute z-50 top-full mt-2 left-1/2 w-64 p-2 bg-[#172b4d] dark:bg-[#161b22] text-white dark:text-[#f0f6fc] border border-transparent dark:border-border-soft text-[11px] font-medium leading-relaxed rounded-[3px] shadow-md pointer-events-none transition-all duration-150 text-left normal-case tracking-normal"
        >
          <span className="block">{content}</span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#172b4d] dark:border-b-[#161b22]" />
        </span>
      )}
    </span>
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

/**
 * Slide-in toast notification adhering with Jira Cloud's flag design component systems.
 */
export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-status-verified-text shrink-0" />,
    info: <Info className="w-4 h-4 text-accent-blue shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-status-attention-text shrink-0" />
  };

  const borderStyles = {
    success: 'border-l-4 border-l-status-verified-text',
    info: 'border-l-4 border-l-accent-blue',
    error: 'border-l-4 border-l-status-attention-text'
  };

  return (
    <div 
      className={`fixed bottom-5 right-5 z-50 max-w-sm bg-canvas-bg border border-border-soft rounded-[3px] shadow-lg p-3.5 flex items-start gap-3 transition-all duration-300 ease-out animate-fadeIn ${borderStyles[type]}`}
      role="alert"
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-[12px] text-text-charcoal font-normal leading-relaxed min-w-[200px]">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="text-text-muted hover:text-text-charcoal transition-colors p-0.5 rounded-[3px] hover:bg-border-soft/45"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface SortArrowProps {
  active: boolean;
  order: 'asc' | 'desc';
}

/**
 * Clean interactive micro-sorting icon for tables.
 */
export function SortArrow({ active, order }: SortArrowProps) {
  if (!active) {
    return <ArrowUpDown className="w-3 h-3 text-text-muted/60 ml-1.5 shrink-0 inline-block" />;
  }
  return order === 'asc' 
    ? <ArrowUp className="w-3 h-3 text-accent-blue ml-1.5 shrink-0 inline-block font-extrabold" />
    : <ArrowDown className="w-3 h-3 text-accent-blue ml-1.5 shrink-0 inline-block font-extrabold" />;
}

/**
 * Reusable Jira-style Status Tag component with responsive design tokens.
 */
export function StatusTag({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`status-tag-base ${className}`}>
      {children}
    </span>
  );
}

/**
 * Reusable Jira-style Metric Badge helper.
 */
export function MetricBadge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`metric-badge-base ${className}`}>
      {children}
    </span>
  );
}

/**
 * 4 Distinct Survey Center data counters (All Rows, Sent, Skipped, Duplicate)
 */
interface CounterProps {
  count: number;
  active: boolean;
  onClick: () => void;
}

export function AllRowsCounter({ count, active, onClick }: CounterProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-3 bg-canvas-bg border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left w-full ${
        active 
          ? 'border-accent-blue bg-border-soft/30 font-bold' 
          : 'border-border-soft hover:bg-sidebar-bg/30'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">All Rows</span>
      <div className="badge-container-grid mt-1.5 flex items-center justify-between w-full">
        <span className="text-[16px] font-bold text-text-charcoal">{count}</span>
        <MetricBadge className="bg-status-neutral-bg text-status-neutral-text border border-status-neutral-text/10 uppercase tracking-widest text-[8.5px]">ALL LOGS</MetricBadge>
      </div>
    </button>
  );
}

export function SentCounter({ count, active, onClick }: CounterProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-3 bg-canvas-bg border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left w-full ${
        active 
          ? 'border-accent-blue bg-border-soft/30 font-bold' 
          : 'border-border-soft hover:bg-sidebar-bg/30'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Sent Logs</span>
      <div className="badge-container-grid mt-1.5 flex items-center justify-between w-full">
        <span className="text-[16px] font-bold text-status-verified-text">{count}</span>
        <MetricBadge className="bg-status-verified-bg text-status-verified-text border border-status-verified-text/10 uppercase tracking-widest text-[8.5px]">SENT</MetricBadge>
      </div>
    </button>
  );
}

export function SkippedCounter({ count, active, onClick }: CounterProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-3 bg-canvas-bg border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left w-full ${
        active 
          ? 'border-accent-blue bg-border-soft/30 font-bold' 
          : 'border-border-soft hover:bg-sidebar-bg/30'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Skipped</span>
      <div className="badge-container-grid mt-1.5 flex items-center justify-between w-full">
        <span className="text-[16px] font-bold text-status-skipped-text">{count}</span>
        <MetricBadge className="bg-status-skipped-bg text-status-skipped-text border border-status-skipped-text/10 uppercase tracking-widest text-[8.5px]">SKIPPED</MetricBadge>
      </div>
    </button>
  );
}

export function DuplicateCounter({ count, active, onClick }: CounterProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`p-3 bg-canvas-bg border rounded-[3px] flex flex-col items-start transition-all cursor-pointer text-left w-full ${
        active 
          ? 'border-accent-blue bg-border-soft/30 font-bold' 
          : 'border-border-soft hover:bg-sidebar-bg/30'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Duplicate</span>
      <div className="badge-container-grid mt-1.5 flex items-center justify-between w-full">
        <span className="text-[16px] font-bold text-status-attention-text">{count}</span>
        <MetricBadge className="bg-status-attention-bg text-status-attention-text border border-status-attention-text/15 uppercase tracking-widest text-[8.5px]">DUPLICATE</MetricBadge>
      </div>
    </button>
  );
}
