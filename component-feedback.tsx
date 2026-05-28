// component-feedback.tsx
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
      <HelpCircle className="w-3.5 h-3.5 text-[#97a0af] hover:text-[#5e6c84] shrink-0 inline-block transition-colors" />
      {visible && (
        <span 
          style={{ transform: 'translateX(-50%)' }}
          className="absolute z-50 top-full mt-2 left-1/2 w-64 p-2 bg-[#172b4d] text-white text-[11px] font-medium leading-relaxed rounded-[3px] shadow-md pointer-events-none transition-all duration-150 text-left normal-case tracking-normal"
        >
          <span className="block">{content}</span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#172b4d]" />
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
    success: <CheckCircle className="w-4 h-4 text-[#006644] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#0052cc] shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-[#bf2600] shrink-0" />
  };

  const borderStyles = {
    success: 'border-l-4 border-l-[#006644]',
    info: 'border-l-4 border-l-[#0052cc]',
    error: 'border-l-4 border-l-[#bf2600]'
  };

  return (
    <div 
      className={`fixed bottom-5 right-5 z-50 max-w-sm bg-white border border-[#dfe1e6] rounded-[3px] shadow-lg p-3.5 flex items-start gap-3 transition-all duration-300 ease-out animate-fadeIn ${borderStyles[type]}`}
      role="alert"
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-[12px] text-[#172b4d] font-normal leading-relaxed min-w-[200px]">
        {message}
      </div>
      <button 
        onClick={onClose}
        className="text-[#5e6c84] hover:text-[#172b4d] transition-colors p-0.5 rounded-[3px] hover:bg-[#ebecf0]"
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
    return <ArrowUpDown className="w-3 h-3 text-[#a5adba] ml-1.5 shrink-0 inline-block" />;
  }
  return order === 'asc' 
    ? <ArrowUp className="w-3 h-3 text-[#0052cc] ml-1.5 shrink-0 inline-block font-extrabold" />
    : <ArrowDown className="w-3 h-3 text-[#0052cc] ml-1.5 shrink-0 inline-block font-extrabold" />;
}
