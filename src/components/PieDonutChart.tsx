import React, { useState, useMemo } from 'react';
import { PieChart as PieIcon, Disc3 } from 'lucide-react';

export interface ChartSegment {
  id?: string;
  label: string;
  value: number;
  color: string;
  subLabel?: string;
}

export interface PieDonutChartProps {
  data: ChartSegment[];
  title?: string;
  subtitle?: string;
  size?: number;
  donutThickness?: number;
  allowTypeToggle?: boolean;
  initialType?: 'donut' | 'pie';
  centerLabel?: string;
  centerValue?: string | number;
  centerSubtext?: string;
  legendPosition?: 'right' | 'bottom';
  className?: string;
}

export const PieDonutChart: React.FC<PieDonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 230,
  donutThickness = 38,
  allowTypeToggle = true,
  initialType = 'donut',
  centerLabel = 'Total',
  centerValue,
  centerSubtext,
  legendPosition = 'right',
  className = ''
}) => {
  const [chartType, setChartType] = useState<'donut' | 'pie'>(initialType);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.value > 0 ? item.value : 0), 0);
  }, [data]);

  const activeSegment = hoveredIdx !== null && data[hoveredIdx] ? data[hoveredIdx] : null;

  // Geometry calculations
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = (size / 2) - 14;
  const innerRadius = chartType === 'donut' ? Math.max(10, outerRadius - donutThickness) : 0;

  // Generate paths for each segment
  const slices = useMemo(() => {
    if (total === 0) return [];

    let currentAngle = -Math.PI / 2; // start from top (-90 deg)

    return data.map((seg, idx) => {
      const value = Math.max(0, seg.value);
      const fraction = value / total;
      const angle = fraction * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      const midAngle = startAngle + angle / 2;
      currentAngle = endAngle;

      const pct = (fraction * 100);

      if (fraction <= 0) {
        return {
          ...seg,
          idx,
          fraction: 0,
          pct: 0,
          path: '',
          ox: 0,
          oy: 0,
          midAngle,
          isFullCircle: false,
          isEmpty: true
        };
      }

      // If nearly full circle
      if (fraction >= 0.9999) {
        return {
          ...seg,
          idx,
          fraction: 1,
          pct: 100,
          path: '',
          ox: 0,
          oy: 0,
          midAngle,
          isFullCircle: true,
          isEmpty: false
        };
      }

      // Normal arc path
      const largeArc = angle > Math.PI ? 1 : 0;

      const x1 = cx + outerRadius * Math.cos(startAngle);
      const y1 = cy + outerRadius * Math.sin(startAngle);
      const x2 = cx + outerRadius * Math.cos(endAngle);
      const y2 = cy + outerRadius * Math.sin(endAngle);

      let path = '';
      if (innerRadius > 0) {
        const x3 = cx + innerRadius * Math.cos(endAngle);
        const y3 = cy + innerRadius * Math.sin(endAngle);
        const x4 = cx + innerRadius * Math.cos(startAngle);
        const y4 = cy + innerRadius * Math.sin(startAngle);

        path = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
      } else {
        path = `M ${cx} ${cy} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }

      // Slightly expanded path or offset for hover
      const offset = 4;
      const ox = Math.cos(midAngle) * offset;
      const oy = Math.sin(midAngle) * offset;

      return {
        ...seg,
        idx,
        fraction,
        pct,
        path,
        ox,
        oy,
        midAngle,
        isFullCircle: false,
        isEmpty: false
      };
    });
  }, [data, total, cx, cy, outerRadius, innerRadius]);

  const displayCenterValue = activeSegment 
    ? activeSegment.value.toLocaleString() 
    : (centerValue !== undefined ? centerValue.toLocaleString() : total.toLocaleString());

  const displayCenterLabel = activeSegment 
    ? activeSegment.label 
    : centerLabel;

  const displayCenterPct = activeSegment 
    ? `${total > 0 ? ((activeSegment.value / total) * 100).toFixed(1) : 0}%` 
    : centerSubtext;

  return (
    <div className={`p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm ${className}`}>
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-4">
        <div>
          {title && (
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{title}</span>
            </h4>
          )}
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {allowTypeToggle && (
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              type="button"
              onClick={() => setChartType('donut')}
              title="Donut Chart View"
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                chartType === 'donut' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Disc3 className="w-3 h-3" />
              <span>Donut</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('pie')}
              title="Solid Pie Chart View"
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                chartType === 'pie' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3 h-3" />
              <span>Pie</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chart + Legend Layout */}
      <div className={`flex flex-col ${legendPosition === 'right' ? 'lg:flex-row' : ''} items-center justify-between gap-5`}>
        {/* SVG Graphic */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible select-none"
          >
            {/* Background subtle ring */}
            {chartType === 'donut' && (
              <circle
                cx={cx}
                cy={cy}
                r={(outerRadius + innerRadius) / 2}
                fill="none"
                stroke="#1e293b"
                strokeWidth={donutThickness}
                opacity={0.35}
              />
            )}

            {/* Slices */}
            {total === 0 ? (
              <circle
                cx={cx}
                cy={cy}
                r={outerRadius}
                fill="#1e293b"
                opacity={0.3}
              />
            ) : (
              slices.map((slice) => {
                if (slice.isEmpty) return null;
                const isHovered = hoveredIdx === slice.idx;

                if (slice.isFullCircle) {
                  return (
                    <circle
                      key={slice.idx}
                      cx={cx}
                      cy={cy}
                      r={chartType === 'donut' ? (outerRadius + innerRadius) / 2 : outerRadius}
                      fill={chartType === 'donut' ? 'none' : slice.color}
                      stroke={chartType === 'donut' ? slice.color : undefined}
                      strokeWidth={chartType === 'donut' ? donutThickness : undefined}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(slice.idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  );
                }

                return (
                  <path
                    key={slice.idx}
                    d={slice.path}
                    fill={slice.color}
                    className="transition-transform duration-200 cursor-pointer"
                    style={{
                      transform: isHovered ? `translate(${slice.ox}px, ${slice.oy}px) scale(1.02)` : 'translate(0, 0)',
                      transformOrigin: `${cx}px ${cy}px`,
                      filter: isHovered ? 'brightness(1.15) drop-shadow(0 0 6px rgba(0,0,0,0.5))' : 'none',
                      opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1
                    }}
                    onMouseEnter={() => setHoveredIdx(slice.idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}

            {/* Center Hole Content for Donut Mode */}
            {chartType === 'donut' && (
              <foreignObject
                x={cx - innerRadius + 4}
                y={cy - innerRadius + 4}
                width={(innerRadius - 4) * 2}
                height={(innerRadius - 4) * 2}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate max-w-full">
                    {displayCenterLabel}
                  </span>
                  <span className="text-xl font-black font-mono text-white tracking-tight leading-tight">
                    {displayCenterValue}
                  </span>
                  {displayCenterPct && (
                    <span className="text-[10px] font-mono font-bold text-sky-400 mt-0.5">
                      {displayCenterPct}
                    </span>
                  )}
                </div>
              </foreignObject>
            )}
          </svg>

          {/* Fallback Tooltip for Pie Mode */}
          {chartType === 'pie' && activeSegment && (
            <div className="absolute -bottom-2 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded shadow-lg pointer-events-none text-center">
              <span className="text-[10px] font-bold text-white block">{activeSegment.label}</span>
              <span className="text-xs font-mono text-sky-400 font-black">
                {activeSegment.value.toLocaleString()} ({((activeSegment.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
        </div>

        {/* Legend / Segment Metrics */}
        <div className="w-full space-y-2 font-mono">
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const pct = total > 0 ? ((Math.max(0, item.value) / total) * 100).toFixed(1) : '0.0';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded border transition-all cursor-pointer flex items-center justify-between text-xs ${
                  isHovered 
                    ? 'bg-slate-800/80 border-slate-600 shadow-sm' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <div className="truncate">
                    <span className="text-slate-200 font-bold block truncate text-[11px]">
                      {item.label}
                    </span>
                    {item.subLabel && (
                      <span className="text-[9px] text-slate-400 block truncate">
                        {item.subLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-white font-bold block">
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
