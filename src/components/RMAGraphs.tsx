import React, { useState } from 'react';
import { RMASchoolRecord, DISTRICT_RMA_TOTALS } from '../data/rmaData';
import { 
  PieChart as PieIcon, 
  BarChart2, 
  TrendingDown, 
  Award, 
  Sparkles, 
  ArrowUpDown, 
  CheckCircle2, 
  Layers, 
  ShieldAlert,
  ArrowRight,
  Filter,
  Eye,
  FileText,
  AlertTriangle,
  School,
  BarChart3
} from 'lucide-react';

interface RMAGraphsProps {
  schools: RMASchoolRecord[];
  period?: 'comparative' | 'bosy' | 'eosy';
  onPeriodChange?: (period: 'comparative' | 'bosy' | 'eosy') => void;
  onSelectSchool?: (school: RMASchoolRecord) => void;
}

interface RMASliceData {
  id: string;
  label: string;
  sublabel: string;
  value: number;
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
  const diff = endAngle - startAngle;
  const end = diff >= 359.99 ? startAngle + 359.99 : endAngle;
  const startOuter = polarToCartesian(x, y, outerR, end);
  const endOuter = polarToCartesian(x, y, outerR, startAngle);
  const startInner = polarToCartesian(x, y, innerR, startAngle);
  const endInner = polarToCartesian(x, y, innerR, end);

  const arcSweep = diff <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', outerR, outerR, 0, arcSweep, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', innerR, innerR, 0, arcSweep, 1, endInner.x, endInner.y,
    'Z',
  ].join(' ');
}

export const RMAGraphs: React.FC<RMAGraphsProps> = ({ 
  schools, 
  period = 'comparative', 
  onPeriodChange,
  onSelectSchool 
}) => {
  const [activeTab, setActiveTab] = useState<'pie' | 'comparative' | 'ladder' | 'tiers'>('pie');
  const [hoveredSlice, setHoveredSlice] = useState<RMASliceData | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [barGraphStyle, setBarGraphStyle] = useState<'horizontal' | 'vertical'>('horizontal');
  
  // Period helpers
  const isBosy = period === 'bosy';
  const isEosy = period === 'eosy';
  const isComparative = period === 'comparative';

  // Bar Chart controls
  const [barMetric, setBarMetric] = useState<'total' | 'notProficient' | 'lowProficient'>('total');
  const [ladderSort, setLadderSort] = useState<'reductionPct' | 'reductionVol' | 'baseline' | 'alphabetical'>('reductionPct');

  // Currently selected school scope (null means All District)
  const selectedSchool = selectedSchoolId === 'all' 
    ? null 
    : schools.find(s => s.schoolId === selectedSchoolId) || null;
  const isUnchangedSchool = selectedSchool && selectedSchool.bosy.total === selectedSchool.eosy.total;

  const currentScopeName = selectedSchool ? selectedSchool.officialName : 'District of Toboso (Consolidated)';
  const activeBosyTotal = selectedSchool ? selectedSchool.bosy.total : DISTRICT_RMA_TOTALS.bosy.total;
  const activeEosyTotal = selectedSchool ? selectedSchool.eosy.total : DISTRICT_RMA_TOTALS.eosy.total;
  const activeBosyNP = selectedSchool ? selectedSchool.bosy.notProficient : DISTRICT_RMA_TOTALS.bosy.notProficient;
  const activeBosyLP = selectedSchool ? selectedSchool.bosy.lowProficient : DISTRICT_RMA_TOTALS.bosy.lowProficient;
  const activeEosyNP = selectedSchool ? selectedSchool.eosy.notProficient : DISTRICT_RMA_TOTALS.eosy.notProficient;
  const activeEosyLP = selectedSchool ? selectedSchool.eosy.lowProficient : DISTRICT_RMA_TOTALS.eosy.lowProficient;

  const activeRecoveredTotal = Math.max(0, activeBosyTotal - activeEosyTotal);
  const activeRecoveredPct = activeBosyTotal > 0 ? (activeRecoveredTotal / activeBosyTotal) * 100 : 0;

  // Schools with zero Not Proficient at EOSY
  const zeroNPSchools = schools.filter(s => s.eosy.notProficient === 0);

  // Compute Pie Slices dynamically based on period!
  let slices: RMASliceData[] = [];
  let pieTotal = 1;
  let pieTitle = '';
  let pieSubtitle = '';

  if (isBosy) {
    pieTotal = activeBosyTotal > 0 ? activeBosyTotal : 1;
    pieTitle = `${currentScopeName} — B.O.S.Y. Baseline Numeracy Need`;
    pieSubtitle = `Total Assessed Priority Learners: ${activeBosyTotal.toLocaleString()}`;
    slices = [
      {
        id: 'bosy_lp',
        label: 'Low Proficient',
        sublabel: 'Needs Targeted Remediation & Practice',
        value: activeBosyLP,
        color: '#f59e0b', // amber-500
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        bgBadge: 'bg-amber-950/50',
        borderColor: 'border-amber-500/50',
      },
      {
        id: 'bosy_np',
        label: 'Not Proficient',
        sublabel: 'Needs Intensive Foundational Intervention',
        value: activeBosyNP,
        color: '#f43f5e', // rose-500
        glowColor: 'rgba(244, 63, 94, 0.4)',
        textColor: 'text-rose-400',
        bgBadge: 'bg-rose-950/50',
        borderColor: 'border-rose-500/50',
      },
    ];
  } else if (isEosy) {
    pieTotal = activeEosyTotal > 0 ? activeEosyTotal : 1;
    pieTitle = `${currentScopeName} — E.O.S.Y. Post-Assessment Remaining Need`;
    pieSubtitle = `Total Remaining Priority Learners: ${activeEosyTotal.toLocaleString()} (down from ${activeBosyTotal.toLocaleString()})`;
    slices = [
      {
        id: 'eosy_lp',
        label: 'Low Proficient',
        sublabel: 'Retained in Targeted Consolidation',
        value: activeEosyLP,
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        bgBadge: 'bg-amber-950/50',
        borderColor: 'border-amber-500/50',
      },
      {
        id: 'eosy_np',
        label: 'Not Proficient',
        sublabel: 'Retained in Intensive Remediation',
        value: activeEosyNP,
        color: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.4)',
        textColor: 'text-rose-400',
        bgBadge: 'bg-rose-950/50',
        borderColor: 'border-rose-500/50',
      },
    ];
  } else {
    // Comparative mode
    pieTotal = activeBosyTotal > 0 ? activeBosyTotal : 1;
    pieTitle = `${currentScopeName} — Numeracy Learning Recovery Share`;
    pieSubtitle = `Out of ${activeBosyTotal.toLocaleString()} initial at-risk baseline learners`;
    slices = [
      {
        id: 'recovered',
        label: 'Recovered / Transitioned',
        sublabel: 'Exited At-Risk Status into Grade-Level Numeracy',
        value: activeRecoveredTotal,
        color: '#10b981', // emerald-500
        glowColor: 'rgba(16, 185, 129, 0.4)',
        textColor: 'text-emerald-400',
        bgBadge: 'bg-emerald-950/50',
        borderColor: 'border-emerald-500/50',
      },
      {
        id: 'retained_lp',
        label: 'Retained Low Proficient',
        sublabel: 'Continuing Targeted Consolidation',
        value: activeEosyLP,
        color: '#f59e0b', // amber-500
        glowColor: 'rgba(245, 158, 11, 0.4)',
        textColor: 'text-amber-400',
        bgBadge: 'bg-amber-950/50',
        borderColor: 'border-amber-500/50',
      },
      {
        id: 'retained_np',
        label: 'Retained Not Proficient',
        sublabel: 'Continuing Intensive Foundational Math Drills',
        value: activeEosyNP,
        color: '#f43f5e', // rose-500
        glowColor: 'rgba(244, 63, 94, 0.4)',
        textColor: 'text-rose-400',
        bgBadge: 'bg-rose-950/50',
        borderColor: 'border-rose-500/50',
      },
    ];
  }

  // Calculate arc angles
  let currentAngle = 0;
  const arcSlices = slices.map(s => {
    const fraction = pieTotal > 0 ? s.value / pieTotal : 0;
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

  // Calculate sorted ladder data
  const ladderSchools = [...schools].map(s => {
    const bTot = s.bosy.total;
    const eTot = s.eosy.total;
    const reductionVol = bTot - eTot;
    const reductionPct = bTot > 0 ? (reductionVol / bTot) * 100 : 0;
    const npReduction = s.bosy.notProficient - s.eosy.notProficient;
    const lpReduction = s.bosy.lowProficient - s.eosy.lowProficient;

    return {
      school: s,
      bTot,
      eTot,
      reductionVol,
      reductionPct,
      npReduction,
      lpReduction,
      bNP: s.bosy.notProficient,
      eNP: s.eosy.notProficient,
      bLP: s.bosy.lowProficient,
      eLP: s.eosy.lowProficient,
    };
  }).sort((a, b) => {
    if (ladderSort === 'reductionPct') return b.reductionPct - a.reductionPct;
    if (ladderSort === 'reductionVol') return b.reductionVol - a.reductionVol;
    if (ladderSort === 'baseline') return b.bTot - a.bTot;
    return a.school.officialName.localeCompare(b.school.officialName);
  });

  const maxSchoolVal = Math.max(...schools.map(s => Math.max(s.bosy.total, s.eosy.total)), 260);

  return (
    <div className="space-y-6">
      
      {/* Assessment Period Master Switcher Toolbar */}
      <div className={`p-4 border-2 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isBosy
          ? 'bg-gradient-to-r from-[#0d1e3a] via-[#09152b] to-[#08101e] border-blue-500/60'
          : isEosy
          ? 'bg-gradient-to-r from-[#0a271c] via-[#081a14] to-[#08101e] border-emerald-500/60'
          : 'bg-gradient-to-r from-[#211a0a] via-[#161208] to-[#08101e] border-amber-500/60'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`w-3.5 h-3.5 rounded-full animate-pulse shrink-0 ${
            isBosy ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : isEosy ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
          }`} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
                ACTIVE ASSESSMENT DATA:
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-black uppercase tracking-wider border ${
                isBosy 
                  ? 'bg-blue-950 text-blue-300 border-blue-400' 
                  : isEosy 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400' 
                  : 'bg-amber-950 text-amber-300 border-amber-400'
              }`}>
                {isBosy ? 'B.O.S.Y. Baseline (1,722 Learners)' : isEosy ? 'E.O.S.Y. Post-Assessment (555 Learners)' : 'BOSY vs. EOSY Comparative Growth (1,167 Recovered)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              {isBosy 
                ? 'Displaying 1,722 baseline priority learners (578 Not Proficient, 1,144 Low Proficient across 21 schools)'
                : isEosy 
                ? 'Displaying 555 remaining priority learners (154 Not Proficient, 401 Low Proficient · 5 Zero NP Stations)'
                : 'Comparing baseline vs post-test across all 21 elementary stations · 1,167 recovered (67.8% recovery)'}
            </p>
          </div>
        </div>

        {/* 3 Clickable Primary Period Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          <button
            type="button"
            onClick={() => onPeriodChange?.('bosy')}
            className={`px-3.5 py-2 border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              isBosy
                ? 'bg-blue-600 text-white border-blue-300 shadow-[0_0_14px_rgba(37,99,235,0.5)] ring-1 ring-white/50 scale-102'
                : 'bg-[#060b14] text-slate-300 border-slate-700 hover:text-white hover:border-blue-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-300 inline-block" />
            <span>B.O.S.Y. Baseline (1,722)</span>
          </button>

          <button
            type="button"
            onClick={() => onPeriodChange?.('eosy')}
            className={`px-3.5 py-2 border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              isEosy
                ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.5)] ring-1 ring-white/50 scale-102'
                : 'bg-[#060b14] text-slate-300 border-slate-700 hover:text-white hover:border-emerald-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
            <span>E.O.S.Y. Post-Test (555)</span>
          </button>

          <button
            type="button"
            onClick={() => onPeriodChange?.('comparative')}
            className={`px-3.5 py-2 border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              isComparative
                ? 'bg-amber-600 text-white border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.5)] ring-1 ring-white/50 scale-102'
                : 'bg-[#060b14] text-slate-300 border-slate-700 hover:text-white hover:border-amber-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BOSY vs EOSY Growth Matrix</span>
          </button>
        </div>
      </div>

      {/* Visual Subtabs & Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              Rapid Mathematics Assessment (RMA) Visual Analytics
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            District of Toboso Numeracy Performance &amp; Progress Charts
            <span className="text-xs font-mono font-normal text-slate-400 ml-2">
              (S.Y. 2025–2026 · 21 Elementary Stations)
            </span>
          </h3>
        </div>

        {/* Subtab Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pie')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pie'
                ? 'bg-amber-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Pie &amp; Proportion</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparative')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comparative'
                ? 'bg-emerald-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isBosy ? 'BOSY Bar Graph' : isEosy ? 'EOSY Bar Graph' : 'BOSY vs EOSY Bar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ladder')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ladder'
                ? 'bg-blue-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
            <span>21 Schools Ranking</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tiers')}
            className={`px-3 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tiers'
                ? 'bg-purple-900/60 text-white border-white/50 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Tiers &amp; Shift Flow</span>
          </button>
        </div>
      </div>

      {/* School Scope Selection Bar */}
      <div className="bg-[#08101e] border border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <School className="w-4 h-4 text-amber-400" />
          <span className="text-white font-bold uppercase tracking-wider">
            Graph Focus Scope:
          </span>
          <span className="text-slate-400 hidden md:inline">
            (Select any school to see its specific Pie &amp; Bar graphs)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter visual graphs by specific school"
            value={selectedSchoolId}
            onChange={(e) => {
              setSelectedSchoolId(e.target.value);
              setHoveredSlice(null);
            }}
            className="bg-[#060b14] border border-slate-700 text-slate-200 text-xs font-mono px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer max-w-[280px] sm:max-w-none"
          >
            <option value="all">District of Toboso (Consolidated 21 Schools)</option>
            {schools.map(s => (
              <option key={s.schoolId} value={s.schoolId}>
                #{s.order}. {s.officialName} (BOSY: {s.bosy.total} → EOSY: {s.eosy.total})
              </option>
            ))}
          </select>

          {selectedSchoolId !== 'all' && (
            <button
              type="button"
              onClick={() => {
                setSelectedSchoolId('all');
                setHoveredSlice(null);
              }}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              Reset to District
            </button>
          )}
        </div>
      </div>

      {/* Identical Data Notification Banner for Canubgan ES & Vergara ES */}
      {isUnchangedSchool && selectedSchool && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-500/50 text-amber-200 font-mono text-xs flex items-start gap-2.5 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-bold block mb-0.5">
              Official District SDO Document Notice — {selectedSchool.officialName}:
            </strong>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
              In the official district Excel spreadsheets for S.Y. 2025–2026, <strong>{selectedSchool.officialName}</strong> has identical figures recorded at both BOSY and EOSY (Not Proficient: <strong>{selectedSchool.bosy.notProficient}</strong>, Low Proficient: <strong>{selectedSchool.bosy.lowProficient}</strong>, Total: <strong>{selectedSchool.bosy.total}</strong>). The charts reflect these exact official records.
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Scope KPI Summary Badges - STRICTLY PERIOD-REACTIVE! */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Primary Total */}
        <div className={`p-4 relative overflow-hidden border ${
          isBosy 
            ? 'bg-gradient-to-br from-[#0c1a2e] to-[#08101e] border-blue-500/40' 
            : isEosy
            ? 'bg-gradient-to-br from-[#0a2318] to-[#08101e] border-emerald-500/40'
            : 'bg-gradient-to-br from-[#0c1a2e] to-[#08101e] border-blue-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>{isBosy ? 'TOTAL ASSESSED BOSY' : isEosy ? 'TOTAL REMAINING EOSY' : 'BOSY BASELINE (2025)'}</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${
              isBosy ? 'bg-blue-950 text-blue-300 border-blue-800' : isEosy ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-blue-950 text-blue-300 border-blue-800'
            }`}>
              {isBosy ? 'BASELINE' : isEosy ? 'REMAINING' : '100% BASE'}
            </span>
          </div>
          <div className={`text-2xl font-bold font-mono ${isEosy ? 'text-emerald-400' : 'text-white'}`}>
            {(isBosy ? activeBosyTotal : isEosy ? activeEosyTotal : activeBosyTotal).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            {isBosy 
              ? '100% Baseline Priority Numeracy Need' 
              : isEosy 
              ? `Down from ${activeBosyTotal.toLocaleString()} (-${activeRecoveredTotal.toLocaleString()} recovered)`
              : `Total initial at-risk learners across ${selectedSchool ? 'station' : '21 stations'}`}
          </div>
        </div>

        {/* Card 2: Not Proficient */}
        <div className="bg-gradient-to-br from-[#260f15] to-[#08101e] border border-rose-500/40 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>{isBosy ? 'NOT PROFICIENT (BOSY)' : isEosy ? 'NOT PROFICIENT (EOSY)' : 'EOSY POST-TEST (2026)'}</span>
            <span className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
              {isComparative ? 'TOTAL EOSY' : 'HIGH RISK'}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            {(isBosy ? activeBosyNP : isEosy ? activeEosyNP : activeEosyTotal).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            {isBosy && (
              <span>Share: <strong>{activeBosyTotal > 0 ? ((activeBosyNP / activeBosyTotal) * 100).toFixed(1) : 0}%</strong> of assessed</span>
            )}
            {isEosy && (
              <span>Down by: <strong className="text-emerald-400">-{activeBosyNP - activeEosyNP} learners</strong></span>
            )}
            {isComparative && (
              <span>NP: <strong className="text-rose-300">{activeEosyNP}</strong> | LP: <strong className="text-amber-300">{activeEosyLP}</strong></span>
            )}
          </div>
        </div>

        {/* Card 3: Low Proficient or Recovered */}
        <div className={`p-4 relative overflow-hidden border ${
          isComparative
            ? 'bg-gradient-to-br from-[#1c1328] to-[#08101e] border-purple-500/40'
            : 'bg-gradient-to-br from-[#241a0b] to-[#08101e] border-amber-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>{isBosy ? 'LOW PROFICIENT (BOSY)' : isEosy ? 'LOW PROFICIENT (EOSY)' : 'LEARNERS RECOVERED'}</span>
            {isComparative ? (
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                CONSOLIDATION
              </span>
            )}
          </div>
          <div className={`text-2xl font-bold font-mono ${isComparative ? 'text-purple-300' : 'text-amber-400'}`}>
            {(isBosy ? activeBosyLP : isEosy ? activeEosyLP : activeRecoveredTotal).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            {isBosy && (
              <span>Share: <strong>{activeBosyTotal > 0 ? ((activeBosyLP / activeBosyTotal) * 100).toFixed(1) : 0}%</strong> of assessed</span>
            )}
            {isEosy && (
              <span>Down by: <strong className="text-emerald-400">-{activeBosyLP - activeEosyLP} learners</strong></span>
            )}
            {isComparative && (
              <span className="text-emerald-400 font-semibold">{activeRecoveredPct.toFixed(1)}% Learning Recovery Rate</span>
            )}
          </div>
        </div>

        {/* Card 4: Stations Status / Zero NP */}
        <div className="bg-gradient-to-br from-[#1e1e0f] to-[#08101e] border border-amber-500/40 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>{isBosy ? 'STATIONS WITH NP' : isEosy ? 'ZERO NOT PROFICIENT' : 'ZERO NOT PROFICIENT'}</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {isBosy
              ? (selectedSchool ? (activeBosyNP > 0 ? `${activeBosyNP} Not Prof` : 'Zero NP') : '20 / 21 Stations')
              : (selectedSchool ? (activeEosyNP === 0 ? 'ZERO NOT PROF' : `${activeEosyNP} Not Prof`) : `${zeroNPSchools.length} / 21 Schools`)}
          </div>
          <div className="mt-2 text-[11px] font-mono text-amber-400/90 truncate">
            {isBosy
              ? 'Required Intensive Remediation'
              : selectedSchool
              ? `${selectedSchool.displayName}`
              : zeroNPSchools.map(s => s.officialName.replace(' ES', '')).join(', ')}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 1. PIE & PROPORTION ANALYTICS */}
      {/* ============================================================ */}
      {activeTab === 'pie' && (
        <div className="space-y-6">
          
          {/* Sub-selector for Pie Chart perspective */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#08101e] border border-slate-800 p-3">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Select Pie Graph Focus:
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => { onPeriodChange?.('comparative'); setHoveredSlice(null); }}
                className={`px-3 py-1 border transition-all cursor-pointer ${
                  isComparative
                    ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Learning Recovery (67.8%)
              </button>

              <button
                type="button"
                onClick={() => { onPeriodChange?.('bosy'); setHoveredSlice(null); }}
                className={`px-3 py-1 border transition-all cursor-pointer ${
                  isBosy
                    ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-[0_0_8px_rgba(37,99,235,0.3)]'
                    : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                BOSY Baseline (1,722)
              </button>

              <button
                type="button"
                onClick={() => { onPeriodChange?.('eosy'); setHoveredSlice(null); }}
                className={`px-3 py-1 border transition-all cursor-pointer ${
                  isEosy
                    ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                EOSY Post-Test (555)
              </button>
            </div>
          </div>

          {/* Pie Chart Display Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Interactive SVG Donut / Pie Chart */}
            <div className="lg:col-span-5 bg-[#08101e] border border-slate-800 p-6 flex flex-col justify-between relative shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                    DepEd RMA Distribution
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">
                    {pieTitle}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-amber-300 border border-slate-700">
                  Total: {pieTotal.toLocaleString()}
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
                    const innerR = isHovered ? 52 : 56;
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
                    {hoveredSlice 
                      ? hoveredSlice.label.substring(0, 15).toUpperCase()
                      : isComparative 
                      ? 'RECOVERED' 
                      : 'LOW PROFICIENT'
                    }
                  </text>
                  <text x="120" y="132" textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="bold">
                    {hoveredSlice 
                      ? `${hoveredSlice.percentage}%`
                      : isComparative
                      ? `${activeRecoveredPct.toFixed(1)}%`
                      : `${(((isBosy ? activeBosyLP : activeEosyLP) / pieTotal) * 100).toFixed(1)}%`
                    }
                  </text>
                  <text x="120" y="146" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                    {hoveredSlice ? `${hoveredSlice.value.toLocaleString()} learners` : `${pieTotal.toLocaleString()} total`}
                  </text>
                </svg>
              </div>

              {/* Hint footer */}
              <div className="text-[11px] font-mono text-slate-400 text-center border-t border-slate-800 pt-3">
                Hover over pie segments to inspect learner counts and percentage share
              </div>
            </div>

            {/* Right: Legend Breakdown Cards */}
            <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
              <div className="p-4 bg-[#08101e] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold block">
                    Category Breakdown ({pieSubtitle})
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    DepEd RMA S.Y. 2025–2026
                  </span>
                </div>

                <div className="space-y-3">
                  {slices.map((slice) => {
                    const pct = pieTotal > 0 ? ((slice.value / pieTotal) * 100).toFixed(1) : '0.0';
                    const isHovered = hoveredSlice?.id === slice.id;

                    return (
                      <div 
                        key={slice.id}
                        onMouseEnter={() => setHoveredSlice(arcSlices.find(s => s.id === slice.id) || null)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className={`p-3.5 border transition-all cursor-pointer ${
                          isHovered 
                            ? `${slice.bgBadge} ${slice.borderColor} ring-1 ring-white/20` 
                            : 'bg-[#060b14] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-none" style={{ backgroundColor: slice.color }} />
                            <div>
                              <span className="font-bold text-white text-sm">{slice.label}</span>
                              <p className="text-[10px] text-slate-400 font-sans">{slice.sublabel}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-white block">
                              {slice.value.toLocaleString()}
                            </span>
                            <span className={`${slice.textColor} font-bold text-xs`}>
                              ({pct}%)
                            </span>
                          </div>
                        </div>

                        {/* Mini Distribution Bar */}
                        <div className="h-2.5 w-full bg-slate-900 border border-slate-800 overflow-hidden mt-2">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: slice.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scope Numeracy Milestone Card */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <span className="text-emerald-400 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedSchool ? `${selectedSchool.displayName} Numeracy Impact` : 'District-Wide Remediation Impact'}
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    {activeRecoveredTotal.toLocaleString()} out of {activeBosyTotal.toLocaleString()} priority learners recovered ({activeRecoveredPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-emerald-300">
                    -{activeRecoveredPct.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Priority Reduction</span>
                </div>
              </div>
            </div>

          </div>

          {/* Side-by-Side Dual Donut comparison (BOSY vs EOSY) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* BOSY Baseline Mini Card */}
            <div className="bg-[#08101e] border border-slate-800 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500" />
                  BOSY Baseline Breakdown
                </span>
                <span className="text-xs font-mono text-white font-bold">{activeBosyTotal} Total</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-rose-950/30 border border-rose-500/30">
                  <span className="text-[10px] text-rose-300 uppercase block">Not Proficient</span>
                  <div className="text-xl font-bold text-white mt-0.5">{activeBosyNP}</div>
                  <div className="text-[10px] text-rose-400 mt-0.5">
                    {activeBosyTotal > 0 ? ((activeBosyNP / activeBosyTotal) * 100).toFixed(1) : 0}% of assessed
                  </div>
                  <div className="h-1.5 bg-slate-900 mt-2">
                    <div 
                      className="h-full bg-rose-500" 
                      style={{ width: `${activeBosyTotal > 0 ? (activeBosyNP / activeBosyTotal) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30">
                  <span className="text-[10px] text-amber-300 uppercase block">Low Proficient</span>
                  <div className="text-xl font-bold text-white mt-0.5">{activeBosyLP}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {activeBosyTotal > 0 ? ((activeBosyLP / activeBosyTotal) * 100).toFixed(1) : 0}% of assessed
                  </div>
                  <div className="h-1.5 bg-slate-900 mt-2">
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${activeBosyTotal > 0 ? (activeBosyLP / activeBosyTotal) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* EOSY Post-Assessment Mini Card */}
            <div className="bg-[#08101e] border border-slate-800 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500" />
                  EOSY Post-Assessment Breakdown
                </span>
                <span className="text-xs font-mono text-white font-bold">{activeEosyTotal} Remaining</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-rose-950/30 border border-rose-500/30">
                  <span className="text-[10px] text-rose-300 uppercase block">Not Proficient</span>
                  <div className="text-xl font-bold text-white mt-0.5">{activeEosyNP}</div>
                  <div className="text-[10px] text-rose-400 mt-0.5">
                    {activeEosyTotal > 0 ? ((activeEosyNP / activeEosyTotal) * 100).toFixed(1) : 0}% of remaining
                  </div>
                  <div className="h-1.5 bg-slate-900 mt-2">
                    <div 
                      className="h-full bg-rose-500" 
                      style={{ width: `${activeEosyTotal > 0 ? (activeEosyNP / activeEosyTotal) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30">
                  <span className="text-[10px] text-amber-300 uppercase block">Low Proficient</span>
                  <div className="text-xl font-bold text-white mt-0.5">{activeEosyLP}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {activeEosyTotal > 0 ? ((activeEosyLP / activeEosyTotal) * 100).toFixed(1) : 0}% of remaining
                  </div>
                  <div className="h-1.5 bg-slate-900 mt-2">
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${activeEosyTotal > 0 ? (activeEosyLP / activeEosyTotal) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 2. BAR GRAPH VIEW (PERIOD-AWARE: BOSY / EOSY / COMPARATIVE) */}
      {/* ============================================================ */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">

          {/* DEDICATED BOSY BASELINE BAR GRAPH */}
          {isBosy && (
            <div className="bg-[#08101e] border-2 border-blue-500/40 p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-mono text-xs text-blue-400 uppercase tracking-widest font-bold">
                      B.O.S.Y. Baseline Assessment Result (S.Y. 2025–2026)
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-1">
                    21 Elementary Schools Baseline Numeracy Distribution
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Total District Need: <strong className="text-white">1,722 Learners</strong> · 578 Not Proficient (33.6%) + 1,144 Low Proficient (66.4%)
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono bg-[#060b14] p-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <span className="w-3 h-3 bg-rose-600 inline-block" />
                    <span>Not Proficient (578)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <span className="w-3 h-3 bg-amber-500 inline-block" />
                    <span>Low Proficient (1,144)</span>
                  </span>
                </div>
              </div>

              {/* District Macro Baseline Proportion Bar */}
              <div className="space-y-2 p-4 bg-[#060b14] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white uppercase">DISTRICT CONSOLIDATED BASELINE: 1,722 LEARNERS</span>
                  <span className="text-slate-400">100% of Assessed Priority</span>
                </div>
                <div className="h-7 w-full bg-slate-900 border border-slate-700 flex overflow-hidden font-mono text-[11px] font-bold">
                  <div 
                    className="h-full bg-rose-600 text-white flex items-center justify-center px-2 transition-all"
                    style={{ width: `${(578 / 1722) * 100}%` }}
                    title="Not Proficient: 578 (33.6%)"
                  >
                    578 Not Proficient (33.6%)
                  </div>
                  <div 
                    className="h-full bg-amber-500 text-slate-950 font-black flex items-center justify-center px-2 transition-all"
                    style={{ width: `${(1144 / 1722) * 100}%` }}
                    title="Low Proficient: 1,144 (66.4%)"
                  >
                    1,144 Low Proficient (66.4%)
                  </div>
                </div>
              </div>

              {/* 21 Schools BOSY Baseline Stacked Bar Chart */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
                  <span>SCHOOL NAME &amp; SDO RANK</span>
                  <span>NOT PROFICIENT (ROSE) + LOW PROFICIENT (AMBER) = TOTAL BASELINE</span>
                </div>

                {schools.map((s) => {
                  const maxB = 260; // scale max
                  const npPct = (s.bosy.notProficient / maxB) * 100;
                  const lpPct = (s.bosy.lowProficient / maxB) * 100;

                  return (
                    <div 
                      key={s.schoolId}
                      onClick={() => onSelectSchool && onSelectSchool(s)}
                      className="p-3 bg-[#060b14] border border-slate-800 hover:border-blue-500/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-500 font-bold text-right">{s.order}.</span>
                          <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                            {s.officialName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-rose-400">NP: <strong>{s.bosy.notProficient}</strong></span>
                          <span className="text-amber-400">LP: <strong>{s.bosy.lowProficient}</strong></span>
                          <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                            {s.bosy.total} Total
                          </span>
                        </div>
                      </div>

                      {/* Stacked Bar for School */}
                      <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                        <div 
                          className="h-full bg-rose-600 transition-all duration-300"
                          style={{ width: `${npPct}%` }}
                          title={`Not Proficient: ${s.bosy.notProficient}`}
                        />
                        <div 
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${lpPct}%` }}
                          title={`Low Proficient: ${s.bosy.lowProficient}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEDICATED EOSY POST-TEST BAR GRAPH */}
          {isEosy && (
            <div className="bg-[#08101e] border-2 border-emerald-500/40 p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">
                      E.O.S.Y. Post-Assessment Result (S.Y. 2025–2026)
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-1">
                    21 Elementary Schools Post-Test Remaining Need
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Total Remaining: <strong className="text-emerald-400">555 Learners</strong> (down from 1,722 baseline) · 154 Not Proficient + 401 Low Proficient · <strong className="text-amber-300">5 Zero NP Stations</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono bg-[#060b14] p-2 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <span className="w-3 h-3 bg-rose-600 inline-block" />
                    <span>Remaining NP (154)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <span className="w-3 h-3 bg-amber-500 inline-block" />
                    <span>Remaining LP (401)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>5 Zero NP Stations</span>
                  </span>
                </div>
              </div>

              {/* District Macro EOSY Proportion Bar */}
              <div className="space-y-2 p-4 bg-[#060b14] border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-400 uppercase">DISTRICT CONSOLIDATED EOSY: 555 REMAINING LEARNERS</span>
                  <span className="text-emerald-300 font-semibold">-1,167 Learners Exited At-Risk (67.8% Recovery)</span>
                </div>
                <div className="h-7 w-full bg-slate-900 border border-slate-700 flex overflow-hidden font-mono text-[11px] font-bold">
                  <div 
                    className="h-full bg-rose-600 text-white flex items-center justify-center px-2 transition-all"
                    style={{ width: `${(154 / 555) * 100}%` }}
                    title="Remaining Not Proficient: 154 (27.7%)"
                  >
                    154 Not Prof (27.7%)
                  </div>
                  <div 
                    className="h-full bg-amber-500 text-slate-950 font-black flex items-center justify-center px-2 transition-all"
                    style={{ width: `${(401 / 555) * 100}%` }}
                    title="Remaining Low Proficient: 401 (72.3%)"
                  >
                    401 Low Prof (72.3%)
                  </div>
                </div>
              </div>

              {/* 21 Schools EOSY Stacked Bar Chart */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800 text-[11px]">
                  <span>SCHOOL NAME &amp; SDO RANK</span>
                  <span>NOT PROFICIENT (ROSE) + LOW PROFICIENT (AMBER) = TOTAL EOSY REMAINING</span>
                </div>

                {schools.map((s) => {
                  const maxB = 260; // keep same scale as BOSY so user immediately sees the visual drop!
                  const npPct = (s.eosy.notProficient / maxB) * 100;
                  const lpPct = (s.eosy.lowProficient / maxB) * 100;
                  const isZeroNP = s.eosy.notProficient === 0;

                  return (
                    <div 
                      key={s.schoolId}
                      onClick={() => onSelectSchool && onSelectSchool(s)}
                      className={`p-3 bg-[#060b14] border transition-colors cursor-pointer group ${
                        isZeroNP ? 'border-emerald-500/40 hover:border-emerald-400' : 'border-slate-800 hover:border-emerald-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-slate-500 font-bold text-right">{s.order}.</span>
                          <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {s.officialName}
                          </span>
                          {isZeroNP && (
                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>0 NOT PROFICIENT</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={isZeroNP ? 'text-emerald-400 font-bold' : 'text-rose-300'}>
                            NP: <strong>{s.eosy.notProficient}</strong>
                          </span>
                          <span className="text-amber-300">LP: <strong>{s.eosy.lowProficient}</strong></span>
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                            {s.eosy.total} Remaining
                          </span>
                        </div>
                      </div>

                      {/* Stacked Bar for School (Notice how short the bars are!) */}
                      <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                        {s.eosy.notProficient > 0 && (
                          <div 
                            className="h-full bg-rose-600 transition-all duration-300"
                            style={{ width: `${npPct}%` }}
                            title={`Not Proficient: ${s.eosy.notProficient}`}
                          />
                        )}
                        <div 
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${lpPct}%` }}
                          title={`Low Proficient: ${s.eosy.lowProficient}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEDICATED COMPARATIVE BOSY VS EOSY GROWTH BAR GRAPH */}
          {isComparative && (
            <div className="space-y-6">
              <div className="bg-[#08101e] border-2 border-amber-500/40 p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-6">
                  <div>
                    <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold">
                      {currentScopeName} Progression Matrix
                    </span>
                    <h4 className="text-base font-bold text-white">
                      BOSY Baseline vs. EOSY Post-Test Bar Analytics
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    {/* Horizontal vs Vertical Style Switcher */}
                    <div className="flex items-center gap-1 bg-[#060b14] p-1 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setBarGraphStyle('horizontal')}
                        className={`px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          barGraphStyle === 'horizontal'
                            ? 'bg-slate-700 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => setBarGraphStyle('vertical')}
                        className={`px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          barGraphStyle === 'vertical'
                            ? 'bg-slate-700 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Vertical Columns
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <span className="w-3 h-3 bg-blue-600 inline-block" />
                        <span>BOSY Baseline</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-3 h-3 bg-emerald-500 inline-block" />
                        <span>EOSY Post-Test</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* HORIZONTAL GROUPED BARS VIEW */}
                {barGraphStyle === 'horizontal' ? (
                  <div className="space-y-5 font-mono">
                    
                    {/* Total At-Risk Priority Learners */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white text-sm">TOTAL PRIORITY NUMERACY LEARNERS</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">BOSY: {activeBosyTotal}</span>
                          <span className="text-emerald-400 font-bold">EOSY: {activeEosyTotal}</span>
                          <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            {isUnchangedSchool ? '0 change (0.0%)' : `-${activeRecoveredTotal} (-${activeRecoveredPct.toFixed(1)}%)`}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-5 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-bold"
                            style={{ width: '100%' }}
                          >
                            {activeBosyTotal} Learners (100% Baseline)
                          </div>
                        </div>
                        <div className="h-5 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-slate-950 font-black"
                            style={{ width: `${activeBosyTotal > 0 ? (activeEosyTotal / activeBosyTotal) * 100 : 0}%` }}
                          >
                            {activeEosyTotal} Learners ({activeBosyTotal > 0 ? ((activeEosyTotal / activeBosyTotal) * 100).toFixed(1) : 0}% Retained)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Not Proficient (Intensive Intervention) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-400">NOT PROFICIENT (INTENSIVE REMEDIATION)</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">BOSY: {activeBosyNP}</span>
                          <span className="text-rose-300 font-bold">EOSY: {activeEosyNP}</span>
                          <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            {activeBosyNP - activeEosyNP >= 0 
                              ? `-${activeBosyNP - activeEosyNP} (${activeBosyNP > 0 ? (((activeBosyNP - activeEosyNP) / activeBosyNP) * 100).toFixed(1) : 0}%)`
                              : `+${activeEosyNP - activeBosyNP}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-rose-700 transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-white"
                            style={{ width: `${activeBosyTotal > 0 ? (activeBosyNP / activeBosyTotal) * 100 : 0}%` }}
                          >
                            {activeBosyNP}
                          </div>
                        </div>
                        <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-rose-400 transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-slate-950 font-bold"
                            style={{ width: `${activeBosyTotal > 0 ? (activeEosyNP / activeBosyTotal) * 100 : 0}%` }}
                          >
                            {activeEosyNP}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Low Proficient (Consolidation) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">LOW PROFICIENT (CONSOLIDATION)</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">BOSY: {activeBosyLP}</span>
                          <span className="text-amber-300 font-bold">EOSY: {activeEosyLP}</span>
                          <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            {activeBosyLP - activeEosyLP >= 0
                              ? `-${activeBosyLP - activeEosyLP} (${activeBosyLP > 0 ? (((activeBosyLP - activeEosyLP) / activeBosyLP) * 100).toFixed(1) : 0}%)`
                              : `+${activeEosyLP - activeBosyLP}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-white"
                            style={{ width: `${activeBosyTotal > 0 ? (activeBosyLP / activeBosyTotal) * 100 : 0}%` }}
                          >
                            {activeBosyLP}
                          </div>
                        </div>
                        <div className="h-4 w-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 transition-all duration-500 flex items-center justify-end pr-2 text-[9px] text-slate-950 font-bold"
                            style={{ width: `${activeBosyTotal > 0 ? (activeEosyLP / activeBosyTotal) * 100 : 0}%` }}
                          >
                            {activeEosyLP}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* VERTICAL COLUMN BARS VIEW */
                  <div className="space-y-4 font-mono">
                    <div className="text-xs text-slate-400 flex items-center justify-between mb-2">
                      <span>Comparative Numeracy Needs: Baseline (BOSY) vs. Post-Test (EOSY)</span>
                      <span className="text-[11px] text-slate-500">Scale normalized to baseline volume</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2">
                      
                      {/* Column Pair 1: Total Priority */}
                      <div className="bg-[#060b14] border border-slate-800 p-4 flex flex-col justify-between">
                        <div className="text-center mb-3">
                          <span className="text-xs font-bold text-white uppercase block">Total At-Risk</span>
                          <span className="text-[10px] text-slate-400">Baseline vs Remaining</span>
                        </div>

                        <div className="h-44 flex items-end justify-center gap-6 px-4 pb-2 border-b border-slate-800 relative">
                          {/* BOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-blue-400">{activeBosyTotal}</span>
                            <div 
                              className="w-full bg-blue-600 hover:bg-blue-500 transition-all rounded-t-xs"
                              style={{ height: '100%' }}
                              title={`BOSY Total: ${activeBosyTotal}`}
                            />
                            <span className="text-[10px] text-slate-400">BOSY</span>
                          </div>

                          {/* EOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-emerald-400">{activeEosyTotal}</span>
                            <div 
                              className="w-full bg-emerald-500 hover:bg-emerald-400 transition-all rounded-t-xs"
                              style={{ height: `${activeBosyTotal > 0 ? Math.max((activeEosyTotal / activeBosyTotal) * 100, 4) : 4}%` }}
                              title={`EOSY Total: ${activeEosyTotal}`}
                            />
                            <span className="text-[10px] text-slate-400">EOSY</span>
                          </div>
                        </div>

                        <div className="mt-3 text-center">
                          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            {isUnchangedSchool ? '0 change (0.0%)' : `-${activeRecoveredTotal} (-${activeRecoveredPct.toFixed(1)}%)`}
                          </span>
                        </div>
                      </div>

                      {/* Column Pair 2: Not Proficient */}
                      <div className="bg-[#060b14] border border-slate-800 p-4 flex flex-col justify-between">
                        <div className="text-center mb-3">
                          <span className="text-xs font-bold text-rose-400 uppercase block">Not Proficient</span>
                          <span className="text-[10px] text-slate-400">Intensive Numeracy Gap</span>
                        </div>

                        <div className="h-44 flex items-end justify-center gap-6 px-4 pb-2 border-b border-slate-800 relative">
                          {/* BOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-rose-400">{activeBosyNP}</span>
                            <div 
                              className="w-full bg-rose-700 hover:bg-rose-600 transition-all rounded-t-xs"
                              style={{ height: `${activeBosyTotal > 0 ? Math.max((activeBosyNP / activeBosyTotal) * 100, 4) : 4}%` }}
                              title={`BOSY NP: ${activeBosyNP}`}
                            />
                            <span className="text-[10px] text-slate-400">BOSY</span>
                          </div>

                          {/* EOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-rose-300">{activeEosyNP}</span>
                            <div 
                              className="w-full bg-rose-400 hover:bg-rose-300 transition-all rounded-t-xs"
                              style={{ height: `${activeBosyTotal > 0 ? Math.max((activeEosyNP / activeBosyTotal) * 100, 4) : 4}%` }}
                              title={`EOSY NP: ${activeEosyNP}`}
                            />
                            <span className="text-[10px] text-slate-400">EOSY</span>
                          </div>
                        </div>

                        <div className="mt-3 text-center">
                          <span className="px-2 py-0.5 text-xs font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                            {activeBosyNP - activeEosyNP >= 0 
                              ? `-${activeBosyNP - activeEosyNP} (${activeBosyNP > 0 ? (((activeBosyNP - activeEosyNP) / activeBosyNP) * 100).toFixed(1) : 0}%)`
                              : `+${activeEosyNP - activeBosyNP}`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Column Pair 3: Low Proficient */}
                      <div className="bg-[#060b14] border border-slate-800 p-4 flex flex-col justify-between">
                        <div className="text-center mb-3">
                          <span className="text-xs font-bold text-amber-400 uppercase block">Low Proficient</span>
                          <span className="text-[10px] text-slate-400">Consolidation Need</span>
                        </div>

                        <div className="h-44 flex items-end justify-center gap-6 px-4 pb-2 border-b border-slate-800 relative">
                          {/* BOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-amber-400">{activeBosyLP}</span>
                            <div 
                              className="w-full bg-amber-600 hover:bg-amber-500 transition-all rounded-t-xs"
                              style={{ height: `${activeBosyTotal > 0 ? Math.max((activeBosyLP / activeBosyTotal) * 100, 4) : 4}%` }}
                              title={`BOSY LP: ${activeBosyLP}`}
                            />
                            <span className="text-[10px] text-slate-400">BOSY</span>
                          </div>

                          {/* EOSY Bar */}
                          <div className="w-14 flex flex-col items-center gap-1.5 h-full justify-end">
                            <span className="text-[11px] font-bold text-amber-300">{activeEosyLP}</span>
                            <div 
                              className="w-full bg-amber-400 hover:bg-amber-300 transition-all rounded-t-xs"
                              style={{ height: `${activeBosyTotal > 0 ? Math.max((activeEosyLP / activeBosyTotal) * 100, 4) : 4}%` }}
                              title={`EOSY LP: ${activeEosyLP}`}
                            />
                            <span className="text-[10px] text-slate-400">EOSY</span>
                          </div>
                        </div>

                        <div className="mt-3 text-center">
                          <span className="px-2 py-0.5 text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                            {activeBosyLP - activeEosyLP >= 0
                              ? `-${activeBosyLP - activeEosyLP} (${activeBosyLP > 0 ? (((activeBosyLP - activeEosyLP) / activeBosyLP) * 100).toFixed(1) : 0}%)`
                              : `+${activeEosyLP - activeBosyLP}`
                            }
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Top 6 Gaining Schools Cards */}
              <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg">
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                      Top Performing Numeracy Stations
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Highest Learning Recovery &amp; Risk Reduction
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Click any school to inspect
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                  {ladderSchools.slice(0, 6).map((item, idx) => (
                    <div 
                      key={item.school.schoolId}
                      onClick={() => onSelectSchool && onSelectSchool(item.school)}
                      className="p-3 bg-[#060b14] border border-slate-800 hover:border-emerald-500/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                        <span className="font-bold">Rank #{idx + 1}</span>
                        <span className="text-emerald-400 font-bold">
                          -{item.reductionPct.toFixed(1)}% Reduction
                        </span>
                      </div>
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {item.school.officialName}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400">BOSY: {item.bTot}</span>
                        <span className="text-emerald-400 font-bold">EOSY: {item.eTot}</span>
                        <span className="text-slate-400">Δ -{item.reductionVol}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* 3. 21 SCHOOLS RANKING LADDER */}
      {/* ============================================================ */}
      {activeTab === 'ladder' && (
        <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                21 Toboso Elementary Schools Performance Ladder
              </span>
              <h4 className="text-base font-bold text-white">
                Comprehensive School RMA Numeracy Rankings
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Sort by:</span>
              <button
                type="button"
                onClick={() => setLadderSort('reductionPct')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  ladderSort === 'reductionPct'
                    ? 'bg-emerald-900/60 text-white border-emerald-400 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                % Reduction
              </button>
              <button
                type="button"
                onClick={() => setLadderSort('reductionVol')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  ladderSort === 'reductionVol'
                    ? 'bg-blue-900/60 text-white border-blue-400 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                Learners Recovered
              </button>
              <button
                type="button"
                onClick={() => setLadderSort('baseline')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  ladderSort === 'baseline'
                    ? 'bg-amber-900/60 text-white border-amber-400 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                Baseline Size
              </button>
              <button
                type="button"
                onClick={() => setLadderSort('alphabetical')}
                className={`px-2.5 py-1 border text-[11px] transition-colors cursor-pointer ${
                  ladderSort === 'alphabetical'
                    ? 'bg-slate-700 text-white border-slate-500 font-bold'
                    : 'bg-[#060b14] text-slate-400 border-slate-800'
                }`}
              >
                Alphabetical
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {ladderSchools.map((item, idx) => {
              const bosyWidth = Math.max((item.bTot / maxSchoolVal) * 100, 3);
              const eosyWidth = Math.max((item.eTot / maxSchoolVal) * 100, 3);

              return (
                <div 
                  key={item.school.schoolId}
                  onClick={() => onSelectSchool && onSelectSchool(item.school)}
                  className="p-3 bg-[#060b14] border border-slate-800 hover:border-sky-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs transition-colors cursor-pointer group"
                >
                  {/* Left School Identity */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <span className="w-6 text-center text-slate-500 font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                          {item.school.officialName}
                        </span>
                        {item.eNP === 0 && (
                          <span className="text-[9px] px-1 bg-amber-950 text-amber-300 border border-amber-800">
                            0 NP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        BOSY: {item.bTot} (NP: {item.bNP}, LP: {item.bLP}) → EOSY: <strong className="text-emerald-400">{item.eTot}</strong> (NP: {item.eNP}, LP: {item.eLP})
                      </div>
                    </div>
                  </div>

                  {/* Center Comparative Double Bar */}
                  <div className="flex-1 max-w-md hidden lg:block space-y-1">
                    <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300" 
                        style={{ width: `${bosyWidth}%` }} 
                        title={`BOSY: ${item.bTot}`}
                      />
                    </div>
                    <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300" 
                        style={{ width: `${eosyWidth}%` }} 
                        title={`EOSY: ${item.eTot}`}
                      />
                    </div>
                  </div>

                  {/* Right Metric Pill */}
                  <div className="flex items-center gap-4 text-right justify-between md:justify-end shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block">Recovered</span>
                      <span className="font-bold text-emerald-400 text-xs">
                        -{item.reductionVol} learners
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`px-2 py-1 text-xs font-bold border ${
                        item.reductionPct >= 75
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : item.reductionPct > 0
                          ? 'bg-sky-950 text-sky-300 border-sky-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        -{item.reductionPct.toFixed(1)}% Δ
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. TIERS & SHIFT FLOW */}
      {/* ============================================================ */}
      {activeTab === 'tiers' && (
        <div className="bg-[#08101e] border border-slate-800 p-6 shadow-lg space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="font-mono text-xs text-purple-400 uppercase tracking-widest font-bold">
              Pedagogical Intervention Shift Analysis
            </span>
            <h4 className="text-base font-bold text-white">
              Transition Across RMA Numeracy Assessment Tiers
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Tracking how intensive math interventions converted into standard mastery over S.Y. 2025–2026
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            
            {/* Tier 1: Intensive Intervention (NP) */}
            <div className="p-4 bg-[#060b14] border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-rose-400 font-bold mb-2">
                  <span className="uppercase">Not Proficient Tier</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800">High Risk</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mb-4">
                  Learners lacking prerequisite number sense and fundamental arithmetic operations.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">BOSY Baseline:</span>
                    <span className="font-bold text-white">578</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">EOSY Post-Test:</span>
                    <span className="font-bold text-rose-300">154</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1 text-emerald-400 font-bold">
                    <span>Net Transitioned:</span>
                    <span>-424 learners</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-bold text-center bg-emerald-950/20 py-1.5">
                73.4% Reduction in High-Risk Tier
              </div>
            </div>

            {/* Tier 2: Targeted Remediation (LP) */}
            <div className="p-4 bg-[#060b14] border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
                  <span className="uppercase">Low Proficient Tier</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800">Moderate</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mb-4">
                  Learners requiring targeted scaffolding, speed drills, and word problem decoding.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">BOSY Baseline:</span>
                    <span className="font-bold text-white">1,144</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">EOSY Post-Test:</span>
                    <span className="font-bold text-amber-300">401</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1 text-emerald-400 font-bold">
                    <span>Net Transitioned:</span>
                    <span>-743 learners</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-bold text-center bg-emerald-950/20 py-1.5">
                64.9% Reduction in Moderate Tier
              </div>
            </div>

            {/* Tier 3: Complete Recovery & Grade Ready */}
            <div className="p-4 bg-[#060b14] border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
                  <span className="uppercase">Grade Ready Mastery</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800">Mastered</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mb-4">
                  Learners who fully overcame numeracy gaps and demonstrated grade-level arithmetic competency.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Initial At-Risk:</span>
                    <span className="font-bold text-white">1,722</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Total Recovered:</span>
                    <span className="font-bold text-emerald-300">1,167</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1 text-slate-400">
                    <span>Active Priority:</span>
                    <span>555 remaining</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-bold text-center bg-emerald-950/40 py-1.5">
                67.8% Overall Recovery Rate
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
