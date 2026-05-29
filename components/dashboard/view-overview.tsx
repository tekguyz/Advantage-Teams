// components/dashboard/view-overview.tsx
// High-density enterprise dashboard featuring beautiful, hand-crafted responsive analytics graphics
'use client';

import React, { useState } from 'react';
import { ArrowRight, TrendingUp, BarChart2 } from 'lucide-react';
import { AgentPerformance } from '@/types/data-matrix';
import { MetricCard } from '@/components/ui/metric-cards';

interface ViewOverviewProps {
  agents: AgentPerformance[];
  totalProcessedCalls?: number;
  totalSentTexts?: number;
}

export default function ViewOverview({ 
  agents, 
  totalProcessedCalls = 300, 
  totalSentTexts = 123 
}: ViewOverviewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const totalHours = Math.round(agents.reduce((acc, a) => acc + a.durationMins, 0) / 60);
  
  const focusScores = agents.map(a => {
    const duration = a.durationMins || 1;
    return Math.min(100, Math.round((a.systemUpdates / duration) * 100));
  });
  
  const reviewCount = focusScores.filter(score => score < 40).length; 
  const averageFocus = Math.round(focusScores.reduce((acc, s) => acc + s, 0) / (agents.length || 1));
  const totalScreenedCalls = totalProcessedCalls - totalSentTexts;

  // Mock telemetry flow trend (hourly activity load)
  // X: 0 = 09:00, 1 = 10:00, ..., 7 = 16:00
  const trendPoints = [
    { label: '09:00', calls: 35 },
    { label: '10:00', calls: 52 },
    { label: '11:00', calls: 41 },
    { label: '12:00', calls: 68 },
    { label: '13:00', calls: 47 },
    { label: '14:00', calls: 74 },
    { label: '15:00', calls: 58 },
    { label: '16:00', calls: 95 },
  ];

  // SVG Chart Dimensions & Computations
  const width = 440;
  const height = 110;
  const paddingLeft = 30;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...trendPoints.map(p => p.calls));
  
  // Transform data points to coordinate string for svg path
  const pointsStr = trendPoints.map((p, idx) => {
    const x = paddingLeft + (idx / (trendPoints.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (p.calls / maxVal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // Create area path details
  const areaPointsStr = `${paddingLeft},${paddingTop + chartHeight} ${pointsStr} ${paddingLeft + chartWidth},${paddingTop + chartHeight}`;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Welcome metadata */}
      <div className="p-4 border border-border-soft bg-sidebar-bg/50 rounded-[3px]">
        <h2 className="text-[14px] font-bold text-text-charcoal">Operations Overview Dashboard</h2>
        <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
          Supervisor hub monitoring enterprise system metrics in real time. Use the navigation links to inspect details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card Block - Team Focus Summary */}
        <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-accent-blue" />
                Team Focus Summary
              </h3>
              <span className="text-[10px] text-accent-blue font-semibold bg-accent-blue/10 px-2 py-0.5 rounded-[3px]">Live Sync</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <MetricCard label="Tracked Time" value={totalHours} unit="hrs" />
              <MetricCard label="Review Flags" value={reviewCount} unit="reps" colorClass="text-status-attention-text" />
              <MetricCard label="Focus Avg" value={`${averageFocus}%`} colorClass="text-status-verified-text" />
            </div>

            {/* Custom interactive agent list & focus distribution progress gauges */}
            <div className="space-y-3 mt-4">
              <span className="text-[10.5px] font-bold text-text-muted uppercase tracking-wider block">Representative Rank Ratios</span>
              <div className="flex flex-col gap-2 max-h-[110px] overflow-y-auto pr-1">
                {agents.slice(0, 3).map((a, i) => {
                  const score = focusScores[i] || 50;
                  const isAttention = score < 40;
                  return (
                    <div key={i} className="flex items-center justify-between text-[11px] font-medium leading-none">
                      <div className="flex items-center gap-2 min-w-0 max-w-[130px]">
                        <span className="font-mono text-[9px] text-text-muted bg-border-soft px-1 rounded">Ext {a.extension}</span>
                        <span className="truncate text-text-charcoal font-bold">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-1 ml-4 justify-end">
                        <div className="w-[100px] h-1.5 bg-border-soft rounded-full overflow-hidden shrink-0">
                          <div 
                            style={{ width: `${score}%` }} 
                            className={`h-full rounded-full transition-all duration-300 ${
                              isAttention ? 'bg-status-attention-text' : 'bg-status-verified-text'
                            }`}
                          />
                        </div>
                        <span className={`w-8 text-right font-mono text-[10.5px] font-bold ${
                          isAttention ? 'text-status-attention-text' : 'text-text-charcoal'
                        }`}>{score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-border-soft/60 flex justify-end shrink-0">
            <a 
              href="?view=performance" 
              className="text-accent-blue hover:opacity-85 font-bold text-[11.5px] flex items-center gap-1 transition-all"
            >
              <span>Go to Team Performance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Card Block - Survey Pipeline Summary */}
        <div className="bg-canvas-bg border border-border-soft rounded-[3px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
              <h3 className="text-[12px] font-bold text-text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-status-verified-text" />
                Survey Pipeline Summary
              </h3>
              <span className="text-[10px] text-status-verified-text font-semibold bg-status-verified-bg px-2 py-0.5 rounded-[3px]">Active Carrier</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <MetricCard label="Processed" value={totalProcessedCalls} unit="calls" />
              <MetricCard label="Texts Sent" value={totalSentTexts} unit="sms" colorClass="text-accent-blue" />
              <MetricCard label="Screened" value={totalScreenedCalls} unit="skipped" colorClass="text-status-attention-text" />
            </div>

            {/* Custom High-Fidelity SVG Area Trend Chart */}
            <div className="h-[110px] w-full flex flex-col justify-end mt-4">
              <div className="relative w-full h-[110px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052cc" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0052cc" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="currentColor" className="text-border-soft/60" strokeDasharray="3,3" />
                  <line x1={paddingLeft} y1={paddingTop + chartHeight / 2} x2={width - paddingRight} y2={paddingTop + chartHeight / 2} stroke="currentColor" className="text-border-soft/40" strokeDasharray="3,3" />
                  <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke="currentColor" className="text-border-soft" />

                  {/* Gradient Area Fill */}
                  <polygon points={areaPointsStr} fill="url(#chartGradient)" />

                  {/* Linear Trend Line */}
                  <polyline points={pointsStr} fill="none" stroke="#0052cc" strokeWidth="2.5" className="stroke-accent-blue" />

                  {/* Dynamic interactive / highlighted points */}
                  {trendPoints.map((p, idx) => {
                    const x = paddingLeft + (idx / (trendPoints.length - 1)) * chartWidth;
                    const y = paddingTop + chartHeight - (p.calls / maxVal) * chartHeight;
                    const isHovered = hoveredPoint === idx;

                    return (
                      <g key={idx}>
                        {/* Invisible interactive trigger circle */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r="12" 
                          fill="transparent" 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(idx)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {/* Visible circle marker */}
                        <circle 
                          cx={x} 
                          cy={y} 
                          r={isHovered ? "5" : "3.5"} 
                          fill={isHovered ? "#0052cc" : "#ffffff"} 
                          stroke="#0052cc" 
                          strokeWidth="2"
                          className="transition-all duration-150 pointer-events-none"
                        />
                        {/* Hover coordinates label popup */}
                        {isHovered && (
                          <g>
                            <rect 
                              x={x - 28} 
                              y={y - 24} 
                              width="56" 
                              height="18" 
                              rx="2" 
                              fill="#172b4d" 
                              className="text-canvas-bg"
                            />
                            <text 
                              x={x} 
                              y={y - 12} 
                              fill="#ffffff" 
                              fontSize="9px" 
                              fontWeight="bold" 
                              textAnchor="middle" 
                              className="font-sans font-extrabold uppercase"
                            >
                              {p.calls} calls
                            </text>
                          </g>
                        )}
                        {/* X-Axis Lables representing time slots */}
                        {idx % 2 === 0 && (
                          <text 
                            x={x} 
                            y={height - 4} 
                            fontSize="8px" 
                            fill="currentColor" 
                            className="text-text-muted font-mono" 
                            textAnchor="middle"
                          >
                            {p.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-border-soft/60 flex justify-end shrink-0">
            <a 
              href="?view=surveys" 
              className="text-accent-blue hover:opacity-85 font-bold text-[11.5px] flex items-center gap-1 transition-all"
            >
              <span>Go to Survey Center Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
