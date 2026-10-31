import React, { useState, useMemo } from 'react';
import { 
  BookOpen, FileDown, Search, BarChart2, 
  TableProperties, Columns2, Award, Users, TrendingUp, CheckCircle2,
  AlertTriangle, Layers, ArrowUpRight, ArrowDownRight, Compass, Flame
} from 'lucide-react';
import { 
  PHIL_IRI_BOSY_DATA,
  PHIL_IRI_EOSY_DATA,
  PhilIriSchoolRow, 
  computePhilIriTotals, 
  PhilIriSummaryTotals,
  computePhilIriComparative
} from '../data/philIriData';
import { 
  exportSinglePhilIriWord, 
  exportAllGradesPhilIriWord, 
  exportPhilIriComparativeWord 
} from '../utils/philIriWordExport';
import { PhilIriSeal } from './PhilIriSeal';
import { PieDonutChart, ChartSegment } from './PieDonutChart';

export const PhilIriDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'bosy' | 'eosy' | 'comparative'>('eosy');
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'filipino'>('english');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'grade4' | 'grade5' | 'grade6'>('all');
  const [displayMode, setDisplayMode] = useState<'both' | 'graphs' | 'table'>('both');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to aggregate rows for Grades 4, 5, 6
  const aggregateGrades = (langData: { grade4: PhilIriSchoolRow[]; grade5: PhilIriSchoolRow[]; grade6: PhilIriSchoolRow[] }) => {
    const schoolMap = new Map<string, PhilIriSchoolRow>();
    const addRows = (rows: PhilIriSchoolRow[]) => {
      rows.forEach(r => {
        if (!schoolMap.has(r.schoolId)) {
          schoolMap.set(r.schoolId, {
            schoolId: r.schoolId,
            schoolName: r.schoolName,
            totalAssessed: 0,
            atGradeLevel: 0,
            twoLevelDown: {
              independent: { m: 0, f: 0, t: 0 },
              instructional: { m: 0, f: 0, t: 0 },
              frustration: { m: 0, f: 0, t: 0 },
              total: { m: 0, f: 0, t: 0 }
            },
            threeLevelDown: {
              independent: { m: 0, f: 0, t: 0 },
              instructional: { m: 0, f: 0, t: 0 },
              frustration: { m: 0, f: 0, t: 0 },
              total: { m: 0, f: 0, t: 0 }
            }
          });
        }
        const curr = schoolMap.get(r.schoolId)!;
        curr.totalAssessed += r.totalAssessed;
        curr.atGradeLevel += r.atGradeLevel;

        curr.twoLevelDown.independent.m += r.twoLevelDown.independent.m;
        curr.twoLevelDown.independent.f += r.twoLevelDown.independent.f;
        curr.twoLevelDown.independent.t += r.twoLevelDown.independent.t;

        curr.twoLevelDown.instructional.m += r.twoLevelDown.instructional.m;
        curr.twoLevelDown.instructional.f += r.twoLevelDown.instructional.f;
        curr.twoLevelDown.instructional.t += r.twoLevelDown.instructional.t;

        curr.twoLevelDown.frustration.m += r.twoLevelDown.frustration.m;
        curr.twoLevelDown.frustration.f += r.twoLevelDown.frustration.f;
        curr.twoLevelDown.frustration.t += r.twoLevelDown.frustration.t;

        curr.twoLevelDown.total.m += r.twoLevelDown.total.m;
        curr.twoLevelDown.total.f += r.twoLevelDown.total.f;
        curr.twoLevelDown.total.t += r.twoLevelDown.total.t;

        curr.threeLevelDown.independent.m += r.threeLevelDown.independent.m;
        curr.threeLevelDown.independent.f += r.threeLevelDown.independent.f;
        curr.threeLevelDown.independent.t += r.threeLevelDown.independent.t;

        curr.threeLevelDown.instructional.m += r.threeLevelDown.instructional.m;
        curr.threeLevelDown.instructional.f += r.threeLevelDown.instructional.f;
        curr.threeLevelDown.instructional.t += r.threeLevelDown.instructional.t;

        curr.threeLevelDown.frustration.m += r.threeLevelDown.frustration.m;
        curr.threeLevelDown.frustration.f += r.threeLevelDown.frustration.f;
        curr.threeLevelDown.frustration.t += r.threeLevelDown.frustration.t;

        curr.threeLevelDown.total.m += r.threeLevelDown.total.m;
        curr.threeLevelDown.total.f += r.threeLevelDown.total.f;
        curr.threeLevelDown.total.t += r.threeLevelDown.total.t;
      });
    };

    addRows(langData.grade4);
    addRows(langData.grade5);
    addRows(langData.grade6);
    return Array.from(schoolMap.values());
  };

  // Active dataset based on language, grade, and period
  const bosyRows = useMemo(() => {
    const langData = PHIL_IRI_BOSY_DATA[selectedLanguage];
    return selectedGrade === 'all' ? aggregateGrades(langData) : langData[selectedGrade];
  }, [selectedLanguage, selectedGrade]);

  const eosyRows = useMemo(() => {
    const langData = PHIL_IRI_EOSY_DATA[selectedLanguage];
    return selectedGrade === 'all' ? aggregateGrades(langData) : langData[selectedGrade];
  }, [selectedLanguage, selectedGrade]);

  const activeRows = useMemo(() => {
    if (selectedPeriod === 'bosy') return bosyRows;
    return eosyRows;
  }, [selectedPeriod, bosyRows, eosyRows]);

  // Comparative summary
  const comparativeSummary = useMemo(() => {
    return computePhilIriComparative(bosyRows, eosyRows);
  }, [bosyRows, eosyRows]);

  // Filtered rows for table search
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return activeRows;
    const term = searchTerm.toLowerCase();
    return activeRows.filter(r => r.schoolName.toLowerCase().includes(term));
  }, [activeRows, searchTerm]);

  const filteredComparativeRows = useMemo(() => {
    if (!searchTerm.trim()) return comparativeSummary.rows;
    const term = searchTerm.toLowerCase();
    return comparativeSummary.rows.filter(r => r.schoolName.toLowerCase().includes(term));
  }, [comparativeSummary, searchTerm]);

  // District Totals
  const totals: PhilIriSummaryTotals = useMemo(() => {
    return computePhilIriTotals(activeRows);
  }, [activeRows]);

  // Grade 4, 5, 6 breakdown totals for active period
  const g4Totals = useMemo(() => {
    const data = selectedPeriod === 'bosy' ? PHIL_IRI_BOSY_DATA : PHIL_IRI_EOSY_DATA;
    return computePhilIriTotals(data[selectedLanguage].grade4);
  }, [selectedPeriod, selectedLanguage]);

  const g5Totals = useMemo(() => {
    const data = selectedPeriod === 'bosy' ? PHIL_IRI_BOSY_DATA : PHIL_IRI_EOSY_DATA;
    return computePhilIriTotals(data[selectedLanguage].grade5);
  }, [selectedPeriod, selectedLanguage]);

  const g6Totals = useMemo(() => {
    const data = selectedPeriod === 'bosy' ? PHIL_IRI_BOSY_DATA : PHIL_IRI_EOSY_DATA;
    return computePhilIriTotals(data[selectedLanguage].grade6);
  }, [selectedPeriod, selectedLanguage]);

  // Top 5 Schools by At Grade Level %
  const topSchools = useMemo(() => {
    return [...activeRows]
      .filter(r => r.totalAssessed > 0)
      .map(r => ({
        name: r.schoolName,
        assessed: r.totalAssessed,
        atGradeLevel: r.atGradeLevel,
        pct: (r.atGradeLevel / r.totalAssessed) * 100
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);
  }, [activeRows]);

  // Top Improved Schools in Comparative Mode
  const topImprovedSchools = useMemo(() => {
    return [...comparativeSummary.rows]
      .filter(r => r.bosyAssessed > 0 && r.eosyAssessed > 0)
      .sort((a, b) => b.atGradeLevelDiff - a.atGradeLevelDiff)
      .slice(0, 5);
  }, [comparativeSummary]);

  // Donut/Pie Chart Segments: Reading Level Tiers
  const readingTierSegments: ChartSegment[] = useMemo(() => {
    return [
      {
        id: 'atGrade',
        label: 'At Grade Level',
        subLabel: 'GST Score 14–20',
        value: totals.atGradeLevel,
        color: '#10b981'
      },
      {
        id: 'twoLvl',
        label: '2-Level Down',
        subLabel: 'GST Score 8–13',
        value: totals.twoLevelDown.total.t,
        color: '#f59e0b'
      },
      {
        id: 'threeLvl',
        label: '3-Level Down',
        subLabel: 'GST Score 0–7',
        value: totals.threeLevelDown.total.t,
        color: '#f43f5e'
      }
    ];
  }, [totals]);

  // Donut/Pie Chart Segments: Reading Profile Distribution
  const readingProfileSegments: ChartSegment[] = useMemo(() => {
    return [
      {
        id: 'indep',
        label: 'Independent',
        subLabel: 'Fluent Readers',
        value: totals.overallIndependent.t,
        color: '#0284c7'
      },
      {
        id: 'inst',
        label: 'Instructional',
        subLabel: 'Guided Support',
        value: totals.overallInstructional.t,
        color: '#eab308'
      },
      {
        id: 'frust',
        label: 'Frustration',
        subLabel: 'Priority Remediation',
        value: totals.overallFrustration.t,
        color: '#ef4444'
      }
    ];
  }, [totals]);

  // Comparative BOSY vs EOSY Donut Segments
  const comparativeBosySegments: ChartSegment[] = useMemo(() => {
    const b = comparativeSummary.bosyTotals;
    return [
      { id: 'b-atGrade', label: 'At Grade Level', subLabel: 'GST 14–20', value: b.atGradeLevel, color: '#10b981' },
      { id: 'b-twoLvl', label: '2-Level Down', subLabel: 'GST 8–13', value: b.twoLevelDown.total.t, color: '#f59e0b' },
      { id: 'b-threeLvl', label: '3-Level Down', subLabel: 'GST 0–7', value: b.threeLevelDown.total.t, color: '#f43f5e' }
    ];
  }, [comparativeSummary]);

  const comparativeEosySegments: ChartSegment[] = useMemo(() => {
    const e = comparativeSummary.eosyTotals;
    return [
      { id: 'e-atGrade', label: 'At Grade Level', subLabel: 'GST 14–20', value: e.atGradeLevel, color: '#10b981' },
      { id: 'e-twoLvl', label: '2-Level Down', subLabel: 'GST 8–13', value: e.twoLevelDown.total.t, color: '#f59e0b' },
      { id: 'e-threeLvl', label: '3-Level Down', subLabel: 'GST 0–7', value: e.threeLevelDown.total.t, color: '#f43f5e' }
    ];
  }, [comparativeSummary]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Program Header */}
      <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-slate-800 rounded-lg shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          
          <div className="flex items-start sm:items-center gap-4">
            {/* Authentic Phil-IRI Reading Seal Badge */}
            <PhilIriSeal size={58} className="shrink-0" />

            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>DEPED TOBOSO · PROJECT RICHARD · GRADES 4–6</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide font-sans flex flex-wrap items-center gap-2.5">
                <span>Philippine Informal Reading Inventory (Phil-IRI)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-normal">
                  S.Y. 2025–2026
                </span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Official reading proficiency diagnostics, Group Screening Test (GST) results, and longitudinal growth matrices across English and Filipino for all 21 elementary schools.
              </p>
            </div>
          </div>

          {/* Quick Word (.doc) Export Button */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedPeriod === 'comparative' ? (
              <button
                type="button"
                onClick={() => exportPhilIriComparativeWord(selectedLanguage)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Comparative (.doc)</span>
              </button>
            ) : selectedGrade === 'all' ? (
              <button
                type="button"
                onClick={() => exportAllGradesPhilIriWord(selectedLanguage, selectedPeriod)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400"
              >
                <FileDown className="w-4 h-4" />
                <span>Export {selectedPeriod.toUpperCase()} Word (.doc)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => exportSinglePhilIriWord(selectedLanguage, selectedGrade, selectedPeriod)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400"
              >
                <FileDown className="w-4 h-4" />
                <span>Export {selectedGrade.toUpperCase()} (.doc)</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Control Bar: Period, Language, Grade, and Display Mode */}
      <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
        
        {/* Left: Period & Language & Grade Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Assessment Period Selector: BOSY, EOSY, Comparative */}
          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded">
            <button
              type="button"
              onClick={() => setSelectedPeriod('bosy')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPeriod === 'bosy'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Pre-Test (BOSY)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('eosy')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPeriod === 'eosy'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Post-Test (EOSY)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('comparative')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPeriod === 'comparative'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Comparative Growth</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded">
            <button
              type="button"
              onClick={() => setSelectedLanguage('english')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === 'english'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setSelectedLanguage('filipino')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                selectedLanguage === 'filipino'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Filipino
            </button>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded">
            <button
              type="button"
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                selectedGrade === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grades 4–6 Combined
            </button>
            <button
              type="button"
              onClick={() => setSelectedGrade('grade4')}
              className={`px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                selectedGrade === 'grade4'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grade 4
            </button>
            <button
              type="button"
              onClick={() => setSelectedGrade('grade5')}
              className={`px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                selectedGrade === 'grade5'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grade 5
            </button>
            <button
              type="button"
              onClick={() => setSelectedGrade('grade6')}
              className={`px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                selectedGrade === 'grade6'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grade 6
            </button>
          </div>

        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded self-start md:self-auto">
          <button
            type="button"
            onClick={() => setDisplayMode('both')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-all ${
              displayMode === 'both' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Both</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('graphs')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-all ${
              displayMode === 'graphs' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Charts</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('table')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-all ${
              displayMode === 'table' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>

      </div>

      {/* KPI Cards: Standard (BOSY/EOSY) or Comparative */}
      {selectedPeriod === 'comparative' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Net At Grade Level Gain */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">At-Grade-Level Gain</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-baseline gap-2">
              <span>{comparativeSummary.netAtGradeLevelGain > 0 ? `+${comparativeSummary.netAtGradeLevelGain.toLocaleString()}` : comparativeSummary.netAtGradeLevelGain}</span>
              <span className="text-xs font-normal text-emerald-300">
                ({comparativeSummary.netAtGradeLevelPctGain > 0 ? `+${comparativeSummary.netAtGradeLevelPctGain.toFixed(1)}%` : `${comparativeSummary.netAtGradeLevelPctGain.toFixed(1)}%`})
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
              <span>BOSY: {comparativeSummary.bosyTotals.atGradeLevel}</span>
              <span>EOSY: {comparativeSummary.eosyTotals.atGradeLevel}</span>
            </div>
          </div>

          {/* Frustration Readers Reduction */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Frustration Reduction</span>
              <ArrowDownRight className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400 font-mono flex items-baseline gap-2">
              <span>{comparativeSummary.netFrustrationReduction > 0 ? `-${comparativeSummary.netFrustrationReduction}` : `+${Math.abs(comparativeSummary.netFrustrationReduction)}`}</span>
              <span className="text-xs font-normal text-slate-400">readers helped</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
              <span>BOSY: {comparativeSummary.bosyTotals.overallFrustration.t}</span>
              <span>EOSY: {comparativeSummary.eosyTotals.overallFrustration.t}</span>
            </div>
          </div>

          {/* 3-Level Down Reduction */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">3-Level Down Reduction</span>
              <Flame className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-teal-300 font-mono">
              <span>{comparativeSummary.netThreeLevelDownReduction > 0 ? `-${comparativeSummary.netThreeLevelDownReduction}` : `+${Math.abs(comparativeSummary.netThreeLevelDownReduction)}`}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
              <span>BOSY: {comparativeSummary.bosyTotals.threeLevelDown.total.t}</span>
              <span>EOSY: {comparativeSummary.eosyTotals.threeLevelDown.total.t}</span>
            </div>
          </div>

          {/* Independent Readers Net Gain */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Independent Readers</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono flex items-baseline gap-2">
              <span>{comparativeSummary.netIndependentGain > 0 ? `+${comparativeSummary.netIndependentGain}` : comparativeSummary.netIndependentGain}</span>
              <span className="text-xs font-normal text-slate-400">growth</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
              <span>BOSY: {comparativeSummary.bosyTotals.overallIndependent.t}</span>
              <span>EOSY: {comparativeSummary.eosyTotals.overallIndependent.t}</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Assessed */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Total Assessed</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {totals.totalAssessed.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              21 Schools · {selectedPeriod === 'bosy' ? 'BOSY Pre-Test' : 'EOSY Post-Test'}
            </div>
          </div>

          {/* Card 2: At Grade Level */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">At Grade Level (GST)</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono flex items-baseline gap-2">
              <span>{totals.atGradeLevel.toLocaleString()}</span>
              <span className="text-xs font-normal text-emerald-300">
                ({totals.atGradeLevelPct.toFixed(1)}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              GST Score: 14 to 20
            </div>
          </div>

          {/* Card 3: 2-Level Down */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">2-Level Down</span>
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono flex items-baseline gap-2">
              <span>{totals.twoLevelDown.total.t.toLocaleString()}</span>
              <span className="text-xs font-normal text-amber-300">
                ({totals.twoLevelDown.pct.toFixed(1)}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              GST Score: 8 to 13
            </div>
          </div>

          {/* Card 4: 3-Level Down */}
          <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">3-Level Down</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono flex items-baseline gap-2">
              <span>{totals.threeLevelDown.total.t.toLocaleString()}</span>
              <span className="text-xs font-normal text-rose-300">
                ({totals.threeLevelDown.pct.toFixed(1)}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              GST Score: 0 to 7 (Priority Intervention)
            </div>
          </div>

        </div>
      )}

      {/* Interactive Charts Section */}
      {(displayMode === 'both' || displayMode === 'graphs') && (
        <div className="space-y-6">
          
          {/* Interactive Pie & Donut Visualizers */}
          {selectedPeriod === 'comparative' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieDonutChart
                title="BOSY Pre-Test Reading Tiers"
                subtitle={`Baseline assessment profile (${selectedLanguage.toUpperCase()} · ${selectedGrade === 'all' ? 'Combined Grades 4–6' : selectedGrade.toUpperCase()})`}
                data={comparativeBosySegments}
                centerLabel="BOSY Assessed"
                centerValue={comparativeSummary.bosyTotals.totalAssessed}
                centerSubtext={`${comparativeSummary.bosyTotals.atGradeLevelPct.toFixed(1)}% At Grade`}
              />
              <PieDonutChart
                title="EOSY Post-Test Reading Tiers"
                subtitle={`Post-test progression profile (${selectedLanguage.toUpperCase()} · ${selectedGrade === 'all' ? 'Combined Grades 4–6' : selectedGrade.toUpperCase()})`}
                data={comparativeEosySegments}
                centerLabel="EOSY Assessed"
                centerValue={comparativeSummary.eosyTotals.totalAssessed}
                centerSubtext={`${comparativeSummary.eosyTotals.atGradeLevelPct.toFixed(1)}% At Grade`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieDonutChart
                title={`${selectedPeriod === 'bosy' ? 'BOSY Pre-Test' : 'EOSY Post-Test'} Reading Level Tiers`}
                subtitle={`GST Score categories for ${selectedLanguage.toUpperCase()} (${selectedGrade === 'all' ? 'Combined Grades 4–6' : selectedGrade.toUpperCase()})`}
                data={readingTierSegments}
                centerLabel="Total Assessed"
                centerValue={totals.totalAssessed}
                centerSubtext={`${totals.atGradeLevelPct.toFixed(1)}% At Grade`}
              />
              <PieDonutChart
                title={`${selectedPeriod === 'bosy' ? 'BOSY Pre-Test' : 'EOSY Post-Test'} Reading Profiles`}
                subtitle={`Learner classification: Independent, Instructional, & Frustration`}
                data={readingProfileSegments}
                centerLabel="Total Readers"
                centerValue={totals.totalAssessed}
                centerSubtext={`${totals.totalAssessed > 0 ? ((totals.overallFrustration.t / totals.totalAssessed) * 100).toFixed(1) : 0}% Frustration`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Reading Profiling Tiers */}
          <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  <span>Reading Level Distribution</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedPeriod === 'comparative' 
                    ? `BOSY Pre-Test vs EOSY Post-Test Distribution (${selectedLanguage.toUpperCase()})` 
                    : `${selectedPeriod === 'bosy' ? 'BOSY Pre-Test' : 'EOSY Post-Test'} Tiers (${selectedLanguage.toUpperCase()})`}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedGrade.toUpperCase()}
              </span>
            </div>

            {/* Stacked Proportional Bar */}
            <div className="space-y-2">
              <div className="h-6 w-full flex rounded overflow-hidden shadow-inner font-mono text-[10px] text-white font-bold">
                <div 
                  style={{ width: `${totals.atGradeLevelPct}%` }} 
                  className="bg-emerald-600 flex items-center justify-center transition-all duration-500 overflow-hidden px-1"
                  title={`At Grade Level: ${totals.atGradeLevel} (${totals.atGradeLevelPct.toFixed(1)}%)`}
                >
                  {totals.atGradeLevelPct > 10 ? `${totals.atGradeLevelPct.toFixed(0)}%` : ''}
                </div>
                <div 
                  style={{ width: `${totals.twoLevelDown.pct}%` }} 
                  className="bg-amber-600 flex items-center justify-center transition-all duration-500 overflow-hidden px-1"
                  title={`2-Level Down: ${totals.twoLevelDown.total.t} (${totals.twoLevelDown.pct.toFixed(1)}%)`}
                >
                  {totals.twoLevelDown.pct > 10 ? `${totals.twoLevelDown.pct.toFixed(0)}%` : ''}
                </div>
                <div 
                  style={{ width: `${totals.threeLevelDown.pct}%` }} 
                  className="bg-rose-600 flex items-center justify-center transition-all duration-500 overflow-hidden px-1"
                  title={`3-Level Down: ${totals.threeLevelDown.total.t} (${totals.threeLevelDown.pct.toFixed(1)}%)`}
                >
                  {totals.threeLevelDown.pct > 10 ? `${totals.threeLevelDown.pct.toFixed(0)}%` : ''}
                </div>
              </div>

              {/* Legend with exact headcounts */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2">
                <div className="p-2 bg-emerald-950/30 border border-emerald-500/20 rounded">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    At Grade Level
                  </span>
                  <div className="text-sm font-black text-white mt-1">
                    {totals.atGradeLevel} <span className="text-[10px] text-slate-400 font-normal">({totals.atGradeLevelPct.toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="p-2 bg-amber-950/30 border border-amber-500/20 rounded">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    2-Level Down
                  </span>
                  <div className="text-sm font-black text-white mt-1">
                    {totals.twoLevelDown.total.t} <span className="text-[10px] text-slate-400 font-normal">({totals.twoLevelDown.pct.toFixed(1)}%)</span>
                  </div>
                </div>

                <div className="p-2 bg-rose-950/30 border border-rose-500/20 rounded">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    3-Level Down
                  </span>
                  <div className="text-sm font-black text-white mt-1">
                    {totals.threeLevelDown.total.t} <span className="text-[10px] text-slate-400 font-normal">({totals.threeLevelDown.pct.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade-by-grade horizontal comparative bars */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5 font-mono text-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Grade-Level Breakdown (At Grade Level Rate)
              </span>

              {/* Grade 4 */}
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Grade 4</span>
                  <span className="font-bold text-white">{g4Totals.atGradeLevel} / {g4Totals.totalAssessed} ({g4Totals.atGradeLevelPct.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                  <div style={{ width: `${g4Totals.atGradeLevelPct}%` }} className="h-full bg-emerald-500 rounded" />
                </div>
              </div>

              {/* Grade 5 */}
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Grade 5</span>
                  <span className="font-bold text-white">{g5Totals.atGradeLevel} / {g5Totals.totalAssessed} ({g5Totals.atGradeLevelPct.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                  <div style={{ width: `${g5Totals.atGradeLevelPct}%` }} className="h-full bg-emerald-500 rounded" />
                </div>
              </div>

              {/* Grade 6 */}
              <div>
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span>Grade 6</span>
                  <span className="font-bold text-white">{g6Totals.atGradeLevel} / {g6Totals.totalAssessed} ({g6Totals.atGradeLevelPct.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                  <div style={{ width: `${g6Totals.atGradeLevelPct}%` }} className="h-full bg-emerald-500 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Independent vs Instructional vs Frustration or Top Movers */}
          <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{selectedPeriod === 'comparative' ? 'Top Improved Schools' : 'Reading Profile Distribution'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedPeriod === 'comparative' 
                    ? 'Greatest net increase in At-Grade-Level readers' 
                    : 'Independent vs Instructional vs Frustration breakdown'}
                </p>
              </div>
            </div>

            {selectedPeriod === 'comparative' ? (
              <div className="space-y-3 font-mono text-xs">
                {topImprovedSchools.map((s, idx) => (
                  <div key={s.schoolId} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                      <div className="text-white font-bold">{s.schoolName}</div>
                      <div className="text-[10px] text-slate-400">
                        BOSY: {s.bosyAtGradeLevel} ({s.bosyAtGradeLevelPct.toFixed(1)}%) → EOSY: {s.eosyAtGradeLevel} ({s.eosyAtGradeLevelPct.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-bold">
                        +{s.atGradeLevelDiff} readers
                      </span>
                      <div className="text-[10px] text-emerald-400 mt-1 font-bold">
                        {s.atGradeLevelPctDiff > 0 ? `+${s.atGradeLevelPctDiff.toFixed(1)}%` : `${s.atGradeLevelPctDiff.toFixed(1)}%`} pt
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 3 Profile Cards */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded">
                    <div className="text-[10px] text-slate-400 uppercase">Independent</div>
                    <div className="text-lg font-black text-white mt-1">{totals.overallIndependent.t}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {totals.totalAssessed > 0 ? ((totals.overallIndependent.t / totals.totalAssessed) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded">
                    <div className="text-[10px] text-slate-400 uppercase">Instructional</div>
                    <div className="text-lg font-black text-white mt-1">{totals.overallInstructional.t}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {totals.totalAssessed > 0 ? ((totals.overallInstructional.t / totals.totalAssessed) * 100).toFixed(1) : 0}%
                    </div>
                  </div>

                  <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded">
                    <div className="text-[10px] text-rose-300 uppercase">Frustration</div>
                    <div className="text-lg font-black text-rose-400 mt-1">{totals.overallFrustration.t}</div>
                    <div className="text-[10px] text-rose-300 mt-0.5">
                      {totals.totalAssessed > 0 ? ((totals.overallFrustration.t / totals.totalAssessed) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>

                {/* Top 5 Leading Schools */}
                <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Highest At-Grade-Level Performance Rate
                  </span>
                  {topSchools.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-900/40 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold">#{idx + 1}</span>
                        <span className="text-slate-200">{s.name}</span>
                      </div>
                      <span className="font-bold text-emerald-400">
                        {s.atGradeLevel} ({s.pct.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
        </div>
      )}

      {/* Official Phil-IRI Consolidated Matrix Table */}
      {(displayMode === 'both' || displayMode === 'table') && (
        <div className="bg-[#08101e] border border-slate-800 rounded-lg overflow-hidden shadow-lg">
          
          {/* Table Header Bar with Search */}
          <div className="p-4 border-b border-slate-800 bg-[#060b14]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono text-xs text-slate-400 uppercase">
                Official Consolidated DepEd Matrix · {selectedLanguage.toUpperCase()} · {selectedPeriod === 'comparative' ? 'COMPARATIVE GROWTH' : selectedPeriod.toUpperCase()}
              </div>
              <h2 className="text-base font-bold text-white tracking-wide font-sans">
                {selectedPeriod === 'comparative'
                  ? `BOSY vs EOSY Comparative Matrix (${selectedGrade === 'all' ? 'Grades 4–6 Combined' : selectedGrade.toUpperCase()})`
                  : selectedGrade === 'all' 
                  ? `Grades 4–6 Combined Summary Matrix (${selectedLanguage === 'english' ? 'English' : 'Filipino'})` 
                  : `${selectedGrade.toUpperCase()} Detailed Reading Profile (${selectedLanguage === 'english' ? 'English' : 'Filipino'})`
                }
              </h2>
            </div>

            {/* School Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search school name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Render Either Comparative Table OR Standard 27-Column Matrix Table */}
          {selectedPeriod === 'comparative' ? (
            <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead className="bg-[#060b14] text-slate-300 font-mono sticky top-0 z-20 border-b border-slate-700 shadow-md">
                  <tr className="border-b border-slate-800 text-[11px]">
                    <th rowSpan={2} className="p-3 text-left min-w-[180px] bg-[#08101e] border-r border-slate-800 font-bold sticky left-0 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                      School Name
                    </th>
                    <th colSpan={3} className="p-2 border-r border-slate-800 bg-slate-900/90 text-slate-200 font-bold">
                      Total Assessed
                    </th>
                    <th colSpan={4} className="p-2 border-r border-slate-800 bg-emerald-950/40 text-emerald-300 font-bold">
                      At Grade Level (GST 14–20)
                    </th>
                    <th colSpan={3} className="p-2 border-r border-slate-800 bg-rose-950/40 text-rose-300 font-bold">
                      3-Level Down (0–7)
                    </th>
                    <th colSpan={3} className="p-2 border-r border-slate-800 bg-sky-950/40 text-sky-300 font-bold">
                      Overall Frustration
                    </th>
                    <th colSpan={3} className="p-2 bg-amber-950/40 text-amber-300 font-bold">
                      Overall Independent
                    </th>
                  </tr>
                  <tr className="border-b border-slate-700 text-[10px] text-slate-400">
                    <th className="p-1.5 w-12 border-r border-slate-800">BOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800">EOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800 text-white font-bold">Diff</th>

                    <th className="p-1.5 w-12 border-r border-slate-800">BOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800">EOSY</th>
                    <th className="p-1.5 w-14 border-r border-slate-800 text-emerald-400 font-bold">Gain</th>
                    <th className="p-1.5 w-14 border-r border-slate-800 text-emerald-400 font-bold">% Pt</th>

                    <th className="p-1.5 w-12 border-r border-slate-800">BOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800">EOSY</th>
                    <th className="p-1.5 w-14 border-r border-slate-800 text-rose-400 font-bold">Reduct.</th>

                    <th className="p-1.5 w-12 border-r border-slate-800">BOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800">EOSY</th>
                    <th className="p-1.5 w-14 border-r border-slate-800 text-sky-400 font-bold">Reduct.</th>

                    <th className="p-1.5 w-12 border-r border-slate-800">BOSY</th>
                    <th className="p-1.5 w-12 border-r border-slate-800">EOSY</th>
                    <th className="p-1.5 w-14 text-amber-400 font-bold">Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {filteredComparativeRows.map((r, idx) => (
                    <tr 
                      key={r.schoolId} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-[#08101e]' : 'bg-[#060b14]'
                      }`}
                    >
                      <td className="p-2.5 text-left font-sans font-semibold text-slate-200 border-r border-slate-800 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                        {r.schoolName}
                      </td>
                      <td className="p-2 text-slate-400 border-r border-slate-800/60">{r.bosyAssessed}</td>
                      <td className="p-2 text-white font-bold border-r border-slate-800/60">{r.eosyAssessed}</td>
                      <td className="p-2 text-slate-300 border-r border-slate-800">
                        {r.assessedDiff > 0 ? `+${r.assessedDiff}` : r.assessedDiff}
                      </td>

                      <td className="p-2 text-slate-400 border-r border-slate-800/60">{r.bosyAtGradeLevel}</td>
                      <td className="p-2 text-white font-bold border-r border-slate-800/60">{r.eosyAtGradeLevel}</td>
                      <td className="p-2 text-emerald-400 font-bold bg-emerald-950/20 border-r border-slate-800/60">
                        {r.atGradeLevelDiff > 0 ? `+${r.atGradeLevelDiff}` : r.atGradeLevelDiff}
                      </td>
                      <td className="p-2 text-emerald-300 font-bold bg-emerald-950/20 border-r border-slate-800">
                        {r.atGradeLevelPctDiff > 0 ? `+${r.atGradeLevelPctDiff.toFixed(1)}%` : `${r.atGradeLevelPctDiff.toFixed(1)}%`}
                      </td>

                      <td className="p-2 text-slate-400 border-r border-slate-800/60">{r.bosyThreeLevelDownTotal}</td>
                      <td className="p-2 text-white font-bold border-r border-slate-800/60">{r.eosyThreeLevelDownTotal}</td>
                      <td className={`p-2 font-bold border-r border-slate-800 ${r.threeLevelDownDiff < 0 ? 'text-emerald-400 bg-emerald-950/20' : 'text-slate-300'}`}>
                        {r.threeLevelDownDiff < 0 ? `${r.threeLevelDownDiff}` : `+${r.threeLevelDownDiff}`}
                      </td>

                      <td className="p-2 text-slate-400 border-r border-slate-800/60">{r.bosyFrustrationTotal}</td>
                      <td className="p-2 text-white font-bold border-r border-slate-800/60">{r.eosyFrustrationTotal}</td>
                      <td className={`p-2 font-bold border-r border-slate-800 ${r.frustrationDiff < 0 ? 'text-sky-400 bg-sky-950/20' : 'text-slate-300'}`}>
                        {r.frustrationDiff < 0 ? `${r.frustrationDiff}` : `+${r.frustrationDiff}`}
                      </td>

                      <td className="p-2 text-slate-400 border-r border-slate-800/60">{r.bosyIndependentTotal}</td>
                      <td className="p-2 text-white font-bold border-r border-slate-800/60">{r.eosyIndependentTotal}</td>
                      <td className="p-2 text-amber-400 font-bold bg-amber-950/20">
                        {r.independentDiff > 0 ? `+${r.independentDiff}` : r.independentDiff}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#050b14] border-t-2 border-emerald-500 font-mono text-xs font-bold text-white sticky bottom-0 z-20 shadow-[0_-2px_5px_rgba(0,0,0,0.5)]">
                  <tr>
                    <td className="p-3 text-left font-sans font-black text-emerald-400 border-r border-slate-800 sticky left-0 z-30 bg-[#050b14]">
                      DISTRICT TOTAL
                    </td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.bosyTotals.totalAssessed}</td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.eosyTotals.totalAssessed}</td>
                    <td className="p-2 border-r border-slate-800">
                      {comparativeSummary.eosyTotals.totalAssessed - comparativeSummary.bosyTotals.totalAssessed > 0 
                        ? `+${comparativeSummary.eosyTotals.totalAssessed - comparativeSummary.bosyTotals.totalAssessed}` 
                        : comparativeSummary.eosyTotals.totalAssessed - comparativeSummary.bosyTotals.totalAssessed}
                    </td>

                    <td className="p-2 border-r border-slate-800">{comparativeSummary.bosyTotals.atGradeLevel}</td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.eosyTotals.atGradeLevel}</td>
                    <td className="p-2 text-emerald-400 bg-emerald-950/40 border-r border-slate-800">
                      +{comparativeSummary.netAtGradeLevelGain}
                    </td>
                    <td className="p-2 text-emerald-400 bg-emerald-950/40 border-r border-slate-800">
                      +{comparativeSummary.netAtGradeLevelPctGain.toFixed(1)}%
                    </td>

                    <td className="p-2 border-r border-slate-800">{comparativeSummary.bosyTotals.threeLevelDown.total.t}</td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.eosyTotals.threeLevelDown.total.t}</td>
                    <td className="p-2 text-emerald-400 bg-emerald-950/40 border-r border-slate-800">
                      -{comparativeSummary.netThreeLevelDownReduction}
                    </td>

                    <td className="p-2 border-r border-slate-800">{comparativeSummary.bosyTotals.overallFrustration.t}</td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.eosyTotals.overallFrustration.t}</td>
                    <td className="p-2 text-sky-400 bg-sky-950/40 border-r border-slate-800">
                      -{comparativeSummary.netFrustrationReduction}
                    </td>

                    <td className="p-2 border-r border-slate-800">{comparativeSummary.bosyTotals.overallIndependent.t}</td>
                    <td className="p-2 border-r border-slate-800">{comparativeSummary.eosyTotals.overallIndependent.t}</td>
                    <td className="p-2 text-amber-400 bg-amber-950/40">
                      +{comparativeSummary.netIndependentGain}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead className="bg-[#060b14] text-slate-300 font-mono sticky top-0 z-20 border-b border-slate-700 shadow-md">
                  
                  {/* Row 1: High level headers */}
                  <tr className="border-b border-slate-800 text-[11px]">
                    <th rowSpan={3} className="p-3 text-left min-w-[180px] bg-[#08101e] border-r border-slate-800 font-bold sticky left-0 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                      School Name
                    </th>
                    <th rowSpan={3} className="p-2.5 min-w-[70px] border-r border-slate-800 bg-[#08101e]">
                      Total Assessed
                    </th>
                    <th rowSpan={3} className="p-2.5 min-w-[90px] border-r border-slate-800 bg-emerald-950/40 text-emerald-300">
                      At Grade Level (GST)<br />
                      <span className="text-[10px] text-slate-400 font-normal">Score 14–20</span>
                    </th>
                    <th colSpan={12} className="p-2 border-r border-slate-800 bg-amber-950/30 text-amber-300 font-bold">
                      2-Level Down (GST Score Between 8 to 13)
                    </th>
                    <th colSpan={12} className="p-2 bg-rose-950/30 text-rose-300 font-bold">
                      3-Level Down (GST Score Between 0 to 7)
                    </th>
                  </tr>

                  {/* Row 2: Category level headers */}
                  <tr className="border-b border-slate-800 text-[10px]">
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Independent</th>
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Instructional</th>
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Frustration</th>
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-amber-900/40 text-amber-200 font-bold">Total</th>
                    
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Independent</th>
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Instructional</th>
                    <th colSpan={3} className="p-1.5 border-r border-slate-800 bg-slate-900/90 text-slate-300">Frustration</th>
                    <th colSpan={3} className="p-1.5 bg-rose-900/40 text-rose-200 font-bold">Total</th>
                  </tr>

                  {/* Row 3: Gender headers (M / F / T) */}
                  <tr className="border-b border-slate-700 text-[9px] text-slate-400">
                    {/* 2-level down M/F/T */}
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800 text-amber-300">M</th><th className="p-1 w-7 border-r border-slate-800 text-amber-300">F</th><th className="p-1 w-9 border-r border-slate-800 bg-amber-950/60 text-amber-200 font-bold">T</th>
                    
                    {/* 3-level down M/F/T */}
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800">M</th><th className="p-1 w-7 border-r border-slate-800">F</th><th className="p-1 w-8 border-r border-slate-800 text-white font-bold bg-slate-900">T</th>
                    <th className="p-1 w-7 border-r border-slate-800 text-rose-300">M</th><th className="p-1 w-7 border-r border-slate-800 text-rose-300">F</th><th className="p-1 w-9 bg-rose-950/60 text-rose-200 font-bold">T</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {filteredRows.map((r, idx) => (
                    <tr 
                      key={r.schoolId} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-[#08101e]' : 'bg-[#060b14]'
                      }`}
                    >
                      {/* School Name */}
                      <td className="p-2.5 text-left font-sans font-semibold text-slate-200 border-r border-slate-800 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                        {r.schoolName}
                      </td>

                      {/* Total Assessed */}
                      <td className="p-2 font-bold text-white border-r border-slate-800">
                        {r.totalAssessed}
                      </td>

                      {/* At Grade Level */}
                      <td className="p-2 font-bold text-emerald-400 bg-emerald-950/20 border-r border-slate-800">
                        {r.atGradeLevel}
                      </td>

                      {/* 2-Level Down: Independent */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.independent.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.independent.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.twoLevelDown.independent.t}</td>

                      {/* 2-Level Down: Instructional */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.instructional.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.instructional.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.twoLevelDown.instructional.t}</td>

                      {/* 2-Level Down: Frustration */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.frustration.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.twoLevelDown.frustration.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.twoLevelDown.frustration.t}</td>

                      {/* 2-Level Down: Total */}
                      <td className="p-1.5 text-amber-300 border-r border-slate-800/60">{r.twoLevelDown.total.m}</td>
                      <td className="p-1.5 text-amber-300 border-r border-slate-800/60">{r.twoLevelDown.total.f}</td>
                      <td className="p-1.5 font-bold text-amber-300 bg-amber-950/40 border-r border-slate-800">{r.twoLevelDown.total.t}</td>

                      {/* 3-Level Down: Independent */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.independent.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.independent.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.threeLevelDown.independent.t}</td>

                      {/* 3-Level Down: Instructional */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.instructional.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.instructional.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.threeLevelDown.instructional.t}</td>

                      {/* 3-Level Down: Frustration */}
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.frustration.m}</td>
                      <td className="p-1.5 text-slate-400 border-r border-slate-800/60">{r.threeLevelDown.frustration.f}</td>
                      <td className="p-1.5 font-bold text-slate-200 bg-slate-900/60 border-r border-slate-800">{r.threeLevelDown.frustration.t}</td>

                      {/* 3-Level Down: Total */}
                      <td className="p-1.5 text-rose-300 border-r border-slate-800/60">{r.threeLevelDown.total.m}</td>
                      <td className="p-1.5 text-rose-300 border-r border-slate-800/60">{r.threeLevelDown.total.f}</td>
                      <td className="p-1.5 font-bold text-rose-300 bg-rose-950/40">{r.threeLevelDown.total.t}</td>
                    </tr>
                  ))}
                </tbody>

                {/* Table Footer: District Totals */}
                <tfoot className="bg-[#050b14] border-t-2 border-emerald-500 font-mono text-xs font-bold text-white sticky bottom-0 z-20 shadow-[0_-2px_5px_rgba(0,0,0,0.5)]">
                  <tr>
                    <td className="p-3 text-left font-sans font-black text-emerald-400 border-r border-slate-800 sticky left-0 z-30 bg-[#050b14]">
                      DISTRICT TOTAL
                    </td>
                    <td className="p-2 border-r border-slate-800">{totals.totalAssessed}</td>
                    <td className="p-2 text-emerald-400 bg-emerald-950/40 border-r border-slate-800">{totals.atGradeLevel}</td>
                    
                    {/* 2-Level Down Totals */}
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.independent.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.independent.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.twoLevelDown.independent.t}</td>
                    
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.instructional.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.instructional.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.twoLevelDown.instructional.t}</td>
                    
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.frustration.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.twoLevelDown.frustration.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.twoLevelDown.frustration.t}</td>
                    
                    <td className="p-1.5 text-amber-300 border-r border-slate-800/60">{totals.twoLevelDown.total.m}</td>
                    <td className="p-1.5 text-amber-300 border-r border-slate-800/60">{totals.twoLevelDown.total.f}</td>
                    <td className="p-1.5 text-amber-300 bg-amber-950/60 border-r border-slate-800">{totals.twoLevelDown.total.t}</td>

                    {/* 3-Level Down Totals */}
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.independent.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.independent.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.threeLevelDown.independent.t}</td>
                    
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.instructional.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.instructional.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.threeLevelDown.instructional.t}</td>
                    
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.frustration.m}</td>
                    <td className="p-1.5 border-r border-slate-800/60">{totals.threeLevelDown.frustration.f}</td>
                    <td className="p-1.5 bg-slate-900 border-r border-slate-800">{totals.threeLevelDown.frustration.t}</td>
                    
                    <td className="p-1.5 text-rose-300 border-r border-slate-800/60">{totals.threeLevelDown.total.m}</td>
                    <td className="p-1.5 text-rose-300 border-r border-slate-800/60">{totals.threeLevelDown.total.f}</td>
                    <td className="p-1.5 text-rose-300 bg-rose-950/60">{totals.threeLevelDown.total.t}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Table Footer Summary Stats */}
          <div className="p-3 border-t border-slate-800 bg-[#060b14] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div>
              Showing {selectedPeriod === 'comparative' ? filteredComparativeRows.length : filteredRows.length} of 21 schools in the District of Toboso
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                GST 14–20: At Grade Level
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                GST 8–13: 2-Level Down
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                GST 0–7: 3-Level Down
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
