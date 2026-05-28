// components/ui/metric-cards.tsx
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  colorClass?: string;
  bgColorClass?: string;
}

/**
 * Clean corporate scorecard widget for high-density dashboard layouts
 */
export function MetricCard({ 
  label, 
  value, 
  unit, 
  colorClass = "text-text-charcoal", 
  bgColorClass = "bg-sidebar-bg" 
}: MetricCardProps) {
  return (
    <div className={`${bgColorClass} border border-border-soft/60 p-3.5 rounded-[3px] flex flex-col justify-between min-h-[85px] text-left transition-all hover:border-border-soft hover:shadow-3xs select-none`}>
      <span className="text-[9.5px] font-bold text-text-muted uppercase tracking-wider block truncate">{label}</span>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className={`text-[18px] font-bold font-mono tracking-tight ${colorClass}`}>{value}</span>
        {unit && <span className="text-[9.5px] font-medium text-text-muted uppercase">{unit}</span>}
      </div>
    </div>
  );
}
