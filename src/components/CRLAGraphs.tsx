import React, { useState } from 'react';
import { 
  CRLASubjectData, 
  SchoolRecord,
  AssessmentPeriod
} from '../types';
import { DISTRICT_CRLA_BOSY_TOTALS } from '../data/crlaBosyData';
import { DISTRICT_CRLA_EOSY_TOTALS } from '../data/crlaEosyData';
import { 
  PieChart as PieIcon, 
  BarChart2, 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface CRLAGraphsProps {
  schools: SchoolRecord[];
  selectedView: 'g1_mtb' | 'g2_mtb' | 'g2_fil' | 'g3_mtb' | 'g3_fil' | 'g3_eng';
  period: AssessmentPeriod;
  onSelectSchool?: (school: SchoolRecord) => void;
}

interface SliceData {
  id: string;
  label: string;
  value: number;
  male: number;
  female: number;
  color: string;
  glowColor: string;
  textColor: string;
  bgBadge: string;
  borderColor: string;
  percentage?: string;
  startAngle?: number;
  endAngle?: number;
  fraction?: number;
}

// Geometric Arc Path generation for precision SVG Donut / Pie
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeDonutArc(
  x: number,
  y: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const end = endAngle - startAngle >= 359.99 ? startAngle + 359.99 : endAngle;
  const startOuter = polarToCartesian(x, y, outerR, end);
  const endOuter = polarToCartesian(x, y, outerR, startAngle);
  const startInner = polarToCartesian(x, y, innerR, startAngle);
  const endInner = polarToCartesian(x, y, innerR, end);

  const arcSweep = end - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerR, outerR, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', innerR, innerR, 0, arcSweep, 1, endInner.x, endInner.y,
    'Z',
  ].join(' ');
}

export const CRLAGraphs: React.FC<CRLAGraphsProps> = ({
  schools,
  selectedView,
  period,
  onSelectSchool,
}) => {
  const [activeGraphSubtab, setActiveGraphSubtab] = useState<'overview' | 'comparative' | 'gender' | 'ranking'>('overview');
  const [hoveredSlice, setHoveredSlice] = useState<SliceData | null>(null);
  const [rankingMetric, setRankingMetric] = useState<'atGrade' | 'growth' | 'intervention' | 'volume'>('atGrade');

  const isEosy = period === 'eosy';
  const isComparative = period === 'comparative';

  // Helper to extract subject data from district totals
  const getDistrictSubjectData = (view: typeof selectedView, per: 'bosy' | 'eosy'): CRLASubjectData => {
    const src = per === 'eosy' ? DISTRICT_CRLA_EOSY_TOTALS : DISTRICT_CRLA_BOSY_TOTALS;
    switch (view) {
      case 'g1_mtb': return src.grade1.mtb;
      case 'g2_mtb': return src.grade2.mtb;
      case 'g2_fil': return src.grade2.filipino;
      case 'g3_mtb': return src.grade3.mtb;
      case 'g3_fil': return src.grade3.filipino;
      case 'g3_eng': return src.grade3.english;
    }
  };

  const getSchoolSubjectData = (school: SchoolRecord, view: typeof selectedView, per: 'bosy' | 'eosy'): CRLASubjectData => {
    const src = per === 'eosy' && school.eosy ? school.eosy : school.bosy;
    switch (view) {
      case 'g1_mtb': return src.grade1.mtb;
      case 'g2_mtb': return src.grade2.mtb;
      case 'g2_fil': return src.grade2.filipino;
      case 'g3_mtb': return src.grade3.mtb;
      case 'g3_fil': return src.grade3.filipino;
      case 'g3_eng': return src.grade3.english;
    }
  };

  const activePeriodTarget: 'bosy' | 'eosy' = period === 'bosy' ? 'bosy' : 'eosy';
  const currentData = getDistrictSubjectData(selectedView, activePeriodTarget);
  const bosyData = getDistrictSubjectData(selectedView, 'bosy');
  const eosyData = getDistrictSubjectData(selectedView, 'eosy');

  const totalAssessed = currentData.assessed.total || 1;

  const viewLabels: Record<typeof selectedView, { grade: string; subject: string }> = {
    g1_mtb: { grade: 'Grade 1', subject: 'Mother Tongue (MTB)' },
    g2_mtb: { grade: 'Grade 2', subject: 'Mother Tongue (MTB)' },
    g2_fil: { grade: 'Grade 2', subject: 'Filipino' },
    g3_mtb: { grade: 'Grade 3', subject: 'Mother Tongue (MTB)' },
    g3_fil: { grade: 'Grade 3', subject: 'Filipino' },
    g3_eng: { grade: 'Grade 3', subject: 'English' },
  };

  // Build Pie / Donut slices dynamically based on period
  let slices: SliceData[] = [];
  if (activePeriodTarget === 'eosy' && currentData.lowEmerging && currentData.highEmerging) {
    slices = [
      {
        id: 'lowEmerging',
        label: 'FR / Low Emerging',
        value: currentData.lowEmerging.total,
        male: currentData.lowEmerging.m,
        female: currentData.lowEmerging.f,
        color: '#dc2626', // red-600
        glowColor: 'rgba(220, 38, 38, 0.4)',
        textColor: 'text-red-400',
        bgBadge: 'bg-red-950/50',
        borderColor: 'border-red-500/50',
      },
      {
        id: 'highEmerging',
        label: 'FR / High Emerging',
        value: currentData.highEmerging.total,
        male: currentData.highEmerging.m,
        female: currentData.highEmerging.f,
        color: '#f43f5e', // rose-500
        glowColor: 'rgba(244, 63, 94, 0.4)',
        textColor: 'text-rose-400',
        bgBadge: 'bg-rose-950/50',
        borderColor: 'border-rose-500/50',
      },
      {
        id: 'developing',
        label: 'MR / Developing',
        value: currentData.developing.total,
        male: currentData.developing.m,
        female: currentData.developing.f,
        color: '#f59e0b', // amber-500
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        bgBadge: 'bg-amber-950/40',
        borderColor: 'border-amber-500/40',
      },
      {
        id: 'transitioning',
        label: 'LR / Transitioning',
        value: currentData.transitioning.total,
        male: currentData.transitioning.m,
        female: currentData.transitioning.f,
        color: '#0284c7', // sky-600
        glowColor: 'rgba(2, 132, 199, 0.4)',
        textColor: 'text-sky-400',
        bgBadge: 'bg-blue-950/40',
        borderColor: 'border-blue-500/40',
      },
      {
        id: 'atGradeLevel',
        label: 'SR / At Grade Level',
        value: currentData.atGradeLevel.total,
        male: currentData.atGradeLevel.m,
        female: currentData.atGradeLevel.f,
        color: '#10b981', // emerald-500
        glowColor: 'rgba(16, 185, 129, 0.4)',
        textColor: 'text-emerald-400',
        bgBadge: 'bg-emerald-950/40',
        borderColor: 'border-emerald-500/40',
      },
    ];
  } else {
    slices = [
      {
        id: 'emerging',
        label: 'Emerging',
        value: currentData.emerging.total,
        male: currentData.emerging.m,
        female: currentData.emerging.f,
        color: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        textColor: 'text-red-400',
        bgBadge: 'bg-red-950/40',
        borderColor: 'border-red-500/40',
      },
      {
        id: 'developing',
        label: 'Developing',
        value: currentData.developing.total,
        male: currentData.developing.m,
        female: currentData.developing.f,
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        bgBadge: 'bg-amber-950/40',
        borderColor: 'border-amber-500/40',
      },
      {
        id: 'transitioning',
        label: 'Transitioning',
        value: currentData.transitioning.total,
        male: currentData.transitioning.m,
        female: currentData.transitioning.f,
        color: '#0ea5e9',
        glowColor: 'rgba(14, 165, 233, 0.4)',
        textColor: 'text-sky-400',
        bgBadge: 'bg-blue-950/40',
        borderColor: 'border-blue-500/40',
      },
      {
        id: 'atGradeLevel',
        label: 'At Grade Level',
        value: currentData.atGradeLevel.total,
        male: currentData.atGradeLevel.m,
        female: currentData.atGradeLevel.f,
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        textColor: 'text-emerald-400',
        bgBadge: 'bg-emerald-950/40',
        borderColor: 'border-emerald-500/40',
      },
    ];
  }

  // Calculate arc angles
  let currentAngle = 0;
  const arcSlices = slices.map(s => {
    const fraction = totalAssessed > 0 ? s.value / totalAssessed : 0;
    const angleSpan = fraction * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    currentAngle += angleSpan;
    return {
      ...s,
      fraction,
      percentage: (fraction * 100).toFixed(1),
      startAngle,
      endAngle,
    };
  });

  // Cross Grade Comparisons Data (BOSY vs EOSY side by side)
  const crossGradeSeries = [
    { key: 'g1_mtb', label: 'G1 MTB', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade1.mtb, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade1.mtb },
    { key: 'g2_mtb', label: 'G2 MTB', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade2.mtb, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade2.mtb },
    { key: 'g2_fil', label: 'G2 Filipino', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade2.filipino, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade2.filipino },
    { key: 'g3_mtb', label: 'G3 MTB', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade3.mtb, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade3.mtb },
    { key: 'g3_fil', label: 'G3 Filipino', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade3.filipino, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade3.filipino },
    { key: 'g3_eng', label: 'G3 English', bosy: DISTRICT_CRLA_BOSY_TOTALS.grade3.english, eosy: DISTRICT_CRLA_EOSY_TOTALS.grade3.english },
  ];

  // School Ranking Computation
  const rankedSchools = [...schools].map(school => {
    const bSub = getSchoolSubjectData(school, selectedView, 'bosy');
    const eSub = getSchoolSubjectData(school, selectedView, 'eosy');
    
    const bAssessed = bSub.assessed.total || 0;
    const eAssessed = eSub.assessed.total || 0;
    const bAtGradePct = bAssessed > 0 ? (bSub.atGradeLevel.total / bAssessed) * 100 : 0;
    const eAtGradePct = eAssessed > 0 ? (eSub.atGradeLevel.total / eAssessed) * 100 : 0;
    const growthPts = eAtGradePct - bAtGradePct;
    const emergingReduct = bSub.emerging.total - eSub.emerging.total;

    return {
      school,
      bAssessed,
      eAssessed,
      bAtGradePct,
      eAtGradePct,
      growthPts,
      emergingReduct,
      currentData: activePeriodTarget === 'eosy' ? eSub : bSub,
      currentPct: activePeriodTarget === 'eosy' ? eAtGradePct : bAtGradePct,
    };
  }).sort((a, b) => {
    if (rankingMetric === 'growth') return b.growthPts - a.growthPts;
    if (rankingMetric === 'intervention') return b.emergingReduct - a.emergingReduct;
    if (rankingMetric === 'volume') return b.eAssessed - a.eAssessed;
    return b.currentPct - a.currentPct;
  });

  return (
    <div className="space-y-6">
      
      {/* Visual Subtabs & Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
              Visual Data Analytics & Graph Engine
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            {viewLabels[selectedView].grade} · {viewLabels[selectedView].subject} CRLA Graphs
            <span className="text-xs font-mono font-normal text-slate-400 ml-2">
              ({activePeriodTarget === 'eosy' ? 'E.O.S.Y. Post-Test' : 'B.O.S.Y. Baseline'})
            </span>
          </h3>
        </div>

        {/* Graph Subtabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveGraphSubtab('overview')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGraphSubtab === 'overview'
                ? 'bg-blue-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Pie & Proficiency</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGraphSubtab('comparative')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGraphSubtab === 'comparative'
                ? 'bg-emerald-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>BOSY vs EOSY Growth Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGraphSubtab('gender')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGraphSubtab === 'gender'
                ? 'bg-blue-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Gender Parity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGraphSubtab('ranking')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeGraphSubtab === 'ranking'
                ? 'bg-blue-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
            <span>21 Schools Ranking</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. OVERVIEW: PIE / DONUT GRAPH + PROFICIENCY BREAKDOWN */}
      {/* ============================================================ */}
      {activeGraphSubtab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Interactive SVG Donut / Pie Chart */}
          <div className="lg:col-span-5 bg-[#08101e] border border-slate-800 p-6 flex flex-col justify-between relative shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  District Distribution
                </span>
                <h4 className="text-sm font-bold text-white font-mono">
                  Proficiency Pie & Donut Chart
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-sky-300 border border-slate-700">
                Total: {totalAssessed}
              </span>
            </div>

            {/* SVG Donut Graphic */}
            <div className="my-6 relative flex items-center justify-center">
              <svg 
                viewBox="0 0 240 240" 
                className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-[0_0_25px_rgba(0,0,0,0.6)]"
              >
                {/* Background Ring */}
                <circle cx="120" cy="120" r="85" fill="none" stroke="#0f172a" strokeWidth="32" />
                
                {/* Slices */}
                {arcSlices.map((slice) => {
                  const isHovered = hoveredSlice?.id === slice.id;
                  const innerR = isHovered ? 52 : 55;
                  const outerR = isHovered ? 98 : 94;
                  const pathD = describeDonutArc(120, 120, innerR, outerR, slice.startAngle, slice.endAngle);

                  return (
                    <path
                      key={slice.id}
                      d={pathD}
                      fill={slice.color}
                      opacity={hoveredSlice && !isHovered ? 0.45 : 1}
                      stroke="#060b14"
                      strokeWidth="2.5"
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 10px ${slice.color})` : undefined,
                      }}
                      onMouseEnter={() => setHoveredSlice(slice)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}

                {/* Center Badge in Donut Hole */}
                <circle cx="120" cy="120" r="48" fill="#08101e" stroke="#1e293b" strokeWidth="2" />
                <text x="120" y="112" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  {hoveredSlice ? hoveredSlice.label.substring(0, 14) : 'AT GRADE LEVEL'}
                </text>
                <text x="120" y="132" textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="bold">
                  {hoveredSlice 
                    ? `${hoveredSlice.percentage}%`
                    : `${((currentData.atGradeLevel.total / totalAssessed) * 100).toFixed(1)}%`
                  }
                </text>
              </svg>
            </div>

            {/* Hint footer */}
            <div className="text-[11px] font-mono text-slate-400 text-center border-t border-slate-800 pt-3">
              Hover over pie slices to inspect learner counts and gender share
            </div>
          </div>

          {/* Right: Legend Breakdown Cards */}
          <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
            <div className="p-4 bg-[#08101e] border border-slate-800">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
                Proficiency Level Breakdown ({viewLabels[selectedView].grade} · {viewLabels[selectedView].subject})
              </span>

              <div className="space-y-2.5">
                {slices.map((slice) => {
                  const pct = totalAssessed > 0 ? ((slice.value / totalAssessed) * 100).toFixed(1) : '0.0';
                  const isHovered = hoveredSlice?.id === slice.id;

                  return (
                    <div 
                      key={slice.id}
                      onMouseEnter={() => setHoveredSlice(arcSlices.find(s => s.id === slice.id) || null)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className={`p-3 border transition-all cursor-pointer ${
                        isHovered 
                          ? `${slice.bgBadge} ${slice.borderColor} ring-1 ring-white/20` 
                          : 'bg-[#060b14] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-none" style={{ backgroundColor: slice.color }} />
                          <span className="font-bold text-white">{slice.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-white">{slice.value}</span>
                          <span className={`${slice.textColor} font-bold`}>({pct}%)</span>
                        </div>
                      </div>

                      {/* Mini Distribution Bar */}
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden mb-1.5">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: slice.color }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Male: <strong className="text-slate-300">{slice.male}</strong> ({slice.value > 0 ? ((slice.male / slice.value) * 100).toFixed(0) : 0}%)</span>
                        <span>Female: <strong className="text-slate-300">{slice.female}</strong> ({slice.value > 0 ? ((slice.female / slice.value) * 100).toFixed(0) : 0}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* District At-a-glance Summary */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-emerald-400 font-bold block uppercase tracking-wider">
                  District Mastery Milestone
                </span>
                <span className="text-slate-300 text-[11px]">
                  {currentData.atGradeLevel.total} out of {totalAssessed} learners reached Grade Ready Status
                </span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-300">
                {((currentData.atGradeLevel.total / totalAssessed) * 100).toFixed(2)}%
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 2. COMPARATIVE: BOSY VS EOSY GROWTH BAR GRAPH */}
      {/* ============================================================ */}
      {activeGraphSubtab === 'comparative' && (
        <div className="space-y-6">
          
          {/* Top: 6 Subject Comparative Overview */}
          <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-6">
              <div>
                <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">
                  District-Wide Progression Matrix
                </span>
                <h4 className="text-base font-bold text-white">
                  BOSY Baseline vs. EOSY Post-Test (% At Grade Level)
                </h4>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 bg-slate-600 inline-block" />
                  <span>BOSY Baseline</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-3 h-3 bg-emerald-500 inline-block" />
                  <span>EOSY Post-Test</span>
                </span>
              </div>
            </div>

            {/* Side-by-side Comparative Bars */}
            <div className="space-y-5 font-mono">
              {crossGradeSeries.map(item => {
                const bPct = item.bosy.assessed.total > 0 ? (item.bosy.atGradeLevel.total / item.bosy.assessed.total) * 100 : 0;
                const ePct = item.eosy.assessed.total > 0 ? (item.eosy.atGradeLevel.total / item.eosy.assessed.total) * 100 : 0;
                const gain = ePct - bPct;

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">BOSY: {bPct.toFixed(1)}%</span>
                        <span className="text-emerald-400 font-bold">EOSY: {ePct.toFixed(1)}%</span>
                        <span className={`px-2 py-0.5 text-[11px] font-bold ${gain >= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'}`}>
                          {gain >= 0 ? '+' : ''}{gain.toFixed(2)}% pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* BOSY Bar */}
                      <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                        <div 
                          className="h-full bg-slate-600 transition-all duration-500 flex items-center justify-end pr-1 text-[9px] text-white"
                          style={{ width: `${Math.max(bPct, 4)}%` }}
                        >
                          {bPct.toFixed(0)}%
                        </div>
                      </div>
                      {/* EOSY Bar */}
                      <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-end pr-1 text-[9px] text-slate-950 font-bold"
                          style={{ width: `${Math.max(ePct, 4)}%` }}
                        >
                          {ePct.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* School-by-School Progress Ranking */}
          <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg">
            <div className="border-b border-slate-800 pb-3 mb-4">
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                School Literacy Growth ({viewLabels[selectedView].grade} · {viewLabels[selectedView].subject})
              </span>
              <h4 className="text-base font-bold text-white">
                Top Gaining Elementary Schools in the District
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              {rankedSchools.slice(0, 6).map((item, idx) => (
                <div 
                  key={item.school.id}
                  onClick={() => onSelectSchool && onSelectSchool(item.school)}
                  className="p-3 bg-[#060b14] border border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>Rank #{idx + 1}</span>
                    <span className="text-emerald-400 font-bold">+{item.growthPts.toFixed(1)}% Gain</span>
                  </div>
                  <div className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {item.school.name}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">BOSY: {item.bAtGradePct.toFixed(1)}%</span>
                    <span className="text-emerald-400 font-bold">EOSY: {item.eAtGradePct.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 3. GENDER PARITY GRAPH */}
      {/* ============================================================ */}
      {activeGraphSubtab === 'gender' && (
        <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                Gender Parity & Disaggregated Analysis
              </span>
              <h4 className="text-base font-bold text-white">
                Male vs. Female Literacy Proficiency Distribution
              </h4>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-3 h-3 bg-blue-500 inline-block" />
                <span>Male ({currentData.assessed.m})</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-3 h-3 bg-rose-500 inline-block" />
                <span>Female ({currentData.assessed.f})</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Male Breakdown */}
            <div className="p-4 bg-[#060b14] border border-blue-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="font-bold text-blue-400 uppercase">Male Learners ({currentData.assessed.m} Assessed)</span>
                <span className="text-white font-bold">
                  {currentData.assessed.m > 0 ? ((currentData.atGradeLevel.m / currentData.assessed.m) * 100).toFixed(1) : 0}% At Grade
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {slices.map(s => {
                  const mPct = currentData.assessed.m > 0 ? ((s.male / currentData.assessed.m) * 100).toFixed(1) : '0';
                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{s.label}</span>
                        <span className="text-white font-bold">{s.male} ({mPct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${mPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Female Breakdown */}
            <div className="p-4 bg-[#060b14] border border-rose-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="font-bold text-rose-400 uppercase">Female Learners ({currentData.assessed.f} Assessed)</span>
                <span className="text-white font-bold">
                  {currentData.assessed.f > 0 ? ((currentData.atGradeLevel.f / currentData.assessed.f) * 100).toFixed(1) : 0}% At Grade
                </span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {slices.map(s => {
                  const fPct = currentData.assessed.f > 0 ? ((s.female / currentData.assessed.f) * 100).toFixed(1) : '0';
                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{s.label}</span>
                        <span className="text-white font-bold">{s.female} ({fPct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${fPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. 21 SCHOOLS RANKING LADDER */}
      {/* ============================================================ */}
      {activeGraphSubtab === 'ranking' && (
        <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                21 Toboso Elementary Schools Performance Ladder
              </span>
              <h4 className="text-base font-bold text-white">
                Comprehensive School Rankings ({viewLabels[selectedView].grade} · {viewLabels[selectedView].subject})
              </h4>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Sort by:</span>
              <button
                type="button"
                onClick={() => setRankingMetric('atGrade')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  rankingMetric === 'atGrade'
                    ? 'bg-blue-900/60 text-white border-white/40 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                % At Grade
              </button>
              <button
                type="button"
                onClick={() => setRankingMetric('growth')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  rankingMetric === 'growth'
                    ? 'bg-emerald-900/60 text-white border-white/40 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                Growth Gain
              </button>
              <button
                type="button"
                onClick={() => setRankingMetric('volume')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  rankingMetric === 'volume'
                    ? 'bg-blue-900/60 text-white border-white/40 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                Volume
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {rankedSchools.map((item, idx) => {
              return (
                <div 
                  key={item.school.id}
                  onClick={() => onSelectSchool && onSelectSchool(item.school)}
                  className="p-3 bg-[#060b14] border border-slate-800 hover:border-sky-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-slate-500 font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                        {item.school.officialName}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Assessed: {item.eAssessed} · BOSY: {item.bAtGradePct.toFixed(1)}% → EOSY: <strong className="text-emerald-400">{item.eAtGradePct.toFixed(1)}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="w-32 hidden sm:block">
                      <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${Math.min(item.eAtGradePct, 100)}%` }} 
                        />
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-base font-extrabold text-white">
                        {item.eAtGradePct.toFixed(1)}%
                      </span>
                      <span className={`block text-[10px] font-bold ${item.growthPts >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.growthPts >= 0 ? '+' : ''}{item.growthPts.toFixed(1)}% pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
