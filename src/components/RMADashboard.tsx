import React, { useState, useMemo } from 'react';
import { 
  Calculator, Download, Search, Filter, ArrowDownRight, 
  BarChart2, TableProperties, Sparkles, Award, FileDown,
  Layers, CheckCircle2, TrendingDown, Eye, Lock, ShieldCheck
} from 'lucide-react';
import { RMA_DISTRICT_DATA, DISTRICT_RMA_TOTALS, RMASchoolRecord } from '../data/rmaData';
import { RMAGraphs } from './RMAGraphs';
import { 
  exportRMABosyWord, 
  exportRMAEosyWord, 
  exportRMAComparativeWord, 
  exportIndividualSchoolRMAWord,
  DEPED_RMA_AI_DECLARATION
} from '../utils/rmaWordExport';
import { SchoolPasswordModal } from './SchoolPasswordModal';
import { useAssessmentData } from '../context/AssessmentDataContext';
import { SchoolDataEditorModal } from './SchoolDataEditorModal';
import { Edit3 } from 'lucide-react';

type RMAPeriod = 'comparative' | 'bosy' | 'eosy';
type RMADisplayMode = 'both' | 'graphs' | 'table';

export const RMADashboard: React.FC = () => {
  const { rmaData } = useAssessmentData();
  const [selectedPeriod, setSelectedPeriod] = useState<RMAPeriod>('comparative');
  const [displayMode, setDisplayMode] = useState<RMADisplayMode>('both');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'high_improvement' | 'zero_np' | 'unchanged'>('all');

  // School modal state
  const [selectedSchoolForModal, setSelectedSchoolForModal] = useState<RMASchoolRecord | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authenticatedSchool, setAuthenticatedSchool] = useState<RMASchoolRecord | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);

  // Filtered schools (from reactive context)
  const filteredSchools = useMemo(() => {
    return rmaData.filter(s => {
      const matchSearch = s.officialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.schoolId.includes(searchTerm) ||
                          s.barangay.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchSearch) return false;

      if (filterCategory === 'high_improvement') {
        const pct = s.bosy.total > 0 ? ((s.bosy.total - s.eosy.total) / s.bosy.total) * 100 : 0;
        return pct >= 75;
      }
      if (filterCategory === 'zero_np') {
        return s.eosy.notProficient === 0;
      }
      if (filterCategory === 'unchanged') {
        return s.bosy.total === s.eosy.total;
      }
      return true;
    });
  }, [rmaData, searchTerm, filterCategory]);

  const handleOpenSchoolAuth = (school: RMASchoolRecord) => {
    setSelectedSchoolForModal(school);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    if (selectedSchoolForModal) {
      setAuthenticatedSchool(selectedSchoolForModal);
      setShowAuthModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-[#0d1f38] via-[#0b1627] to-[#08101e] border border-blue-500/30 p-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Official Numeracy Assessment
              </span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-sky-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                S.Y. 2025–2026
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-wide font-sans flex items-center gap-2">
              <Calculator className="w-6 h-6 text-amber-400" />
              RAPID MATHEMATICS ASSESSMENT (RMA) PORTAL
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              District of Toboso · Division of Negros Occidental · BOSY Baseline &amp; EOSY Post-Assessment Analytics
            </p>
          </div>

          {/* Quick Word Document Export Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => exportRMABosyWord(RMA_DISTRICT_DATA)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>BOSY File (.doc)</span>
            </button>
            <button
              type="button"
              onClick={() => exportRMAEosyWord(RMA_DISTRICT_DATA)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>EOSY File (.doc)</span>
            </button>
            <button
              type="button"
              onClick={() => exportRMAComparativeWord(RMA_DISTRICT_DATA)}
              className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-600 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-300" />
              <span>Comparative Matrix (.doc)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Period Switcher, Display Mode & Filters */}
      <div className="bg-[#08101e] border border-slate-800 p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Period Selector with Distinct DepEd Colors */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#060b14] p-1.5 border border-slate-700 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedPeriod('bosy')}
              className={`px-3 py-1.5 transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                selectedPeriod === 'bosy'
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
              <span>B.O.S.Y. Baseline (1,722)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPeriod('eosy')}
              className={`px-3 py-1.5 transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                selectedPeriod === 'eosy'
                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
              <span>E.O.S.Y. Post-Test (555)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPeriod('comparative')}
              className={`px-3 py-1.5 transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                selectedPeriod === 'comparative'
                  ? 'bg-amber-600 text-white border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>BOSY vs. EOSY Growth Matrix</span>
            </button>
          </div>

          {/* Display Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#060b14] p-1 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDisplayMode('both')}
              className={`px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1 ${
                displayMode === 'both' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Both</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('graphs')}
              className={`px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1 ${
                displayMode === 'graphs' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Graphs Only</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('table')}
              className={`px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1 ${
                displayMode === 'table' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 text-emerald-400" />
              <span>Table Only</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800/80">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search school name, ID, or barangay..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#060b14] border border-slate-700 text-slate-200 placeholder:text-slate-400 text-xs font-mono pl-9 pr-4 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filter schools by performance category"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as any)}
              className="bg-[#060b14] border border-slate-700 text-slate-200 text-xs font-mono px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All 21 Schools</option>
              <option value="high_improvement">High Recovery (≥ 75% Reduction)</option>
              <option value="zero_np">Zero Not Proficient at EOSY (5 Schools)</option>
              <option value="unchanged">Unchanged Baseline (2 Schools)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Graphs View */}
      {(displayMode === 'both' || displayMode === 'graphs') && (
        <RMAGraphs 
          schools={RMA_DISTRICT_DATA} 
          period={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onSelectSchool={handleOpenSchoolAuth}
        />
      )}

      {/* Table View */}
      {(displayMode === 'both' || displayMode === 'table') && (
        <div className="bg-[#08101e] border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Table Header Bar */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white font-sans text-sm tracking-wide uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                {selectedPeriod === 'comparative' 
                  ? 'Official RMA Comparative Growth & Learning Recovery Matrix'
                  : selectedPeriod === 'bosy'
                  ? 'BOSY RMA RESULT (SCHOOL YEAR 2025- 2026)'
                  : 'EOSY RMA RESULT (SCHOOL YEAR 2025- 2026)'
                }
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Showing {filteredSchools.length} of {RMA_DISTRICT_DATA.length} elementary schools in the District of Toboso
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Security Access:</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Protected School Station</span>
              </span>
            </div>
          </div>

          {/* Actual Rendered Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              
              {/* COMPARATIVE MATRIX TABLE */}
              {selectedPeriod === 'comparative' && (
                <>
                  <thead>
                    <tr className="bg-[#ffff00] text-slate-950 font-bold border-b border-slate-900">
                      <th rowSpan={2} className="py-2.5 px-3 text-center border-r border-slate-900 w-10">NO.</th>
                      <th rowSpan={2} className="py-2.5 px-4 text-left border-r border-slate-900 min-w-[200px]">NAME OF SCHOOL</th>
                      <th colSpan={3} className="py-1.5 px-3 text-center border-r border-slate-900 bg-blue-900 text-white">
                        BOSY BASELINE (2025)
                      </th>
                      <th colSpan={3} className="py-1.5 px-3 text-center border-r border-slate-900 bg-slate-900 text-white">
                        EOSY POST-TEST (2026)
                      </th>
                      <th colSpan={3} className="py-1.5 px-3 text-center border-r border-slate-900 bg-emerald-900 text-white">
                        LEARNING RECOVERY / NET GAIN
                      </th>
                      <th rowSpan={2} className="py-2.5 px-3 text-center">ACTION</th>
                    </tr>
                    <tr className="bg-slate-900 text-slate-200 border-b border-slate-800 text-[11px]">
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-rose-300">Not Prof</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-amber-300">Low Prof</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 font-bold text-white">Total</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-rose-300">Not Prof</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-amber-300">Low Prof</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 font-bold text-white">Total</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-emerald-300">Δ NP</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 text-emerald-300">Δ LP</th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-800 font-bold text-emerald-400">Net Δ (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredSchools.map((school) => {
                      const diffNP = school.eosy.notProficient - school.bosy.notProficient;
                      const diffLP = school.eosy.lowProficient - school.bosy.lowProficient;
                      const diffTotal = school.eosy.total - school.bosy.total;
                      const pct = school.bosy.total > 0 ? ((diffTotal / school.bosy.total) * 100).toFixed(1) : '0.0';

                      return (
                        <tr key={school.schoolId} className="hover:bg-slate-900/80 transition-colors">
                          <td className="py-2 px-3 text-center text-slate-400 border-r border-slate-800">{school.order}</td>
                          <td className="py-2 px-4 text-left border-r border-slate-800 font-sans font-bold text-slate-200">
                            <div className="flex items-center justify-between">
                              <span>{school.officialName}</span>
                              {school.eosy.notProficient === 0 && (
                                <span className="text-[9px] px-1 bg-amber-950 text-amber-300 border border-amber-800 ml-2">
                                  0 NP
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 text-rose-400">{school.bosy.notProficient}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 text-amber-400">{school.bosy.lowProficient}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-white bg-slate-900/40">{school.bosy.total}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 text-rose-300">{school.eosy.notProficient}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 text-amber-300">{school.eosy.lowProficient}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-white bg-slate-900/40">{school.eosy.total}</td>
                          
                          <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-emerald-400">
                            {diffNP > 0 ? `+${diffNP}` : diffNP}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-emerald-400">
                            {diffLP > 0 ? `+${diffLP}` : diffLP}
                          </td>
                          <td className={`py-2 px-2 text-center border-r border-slate-800 font-bold ${
                            diffTotal < 0 ? 'text-emerald-400 bg-emerald-950/20' : diffTotal === 0 ? 'text-slate-400' : 'text-rose-400'
                          }`}>
                            {diffTotal > 0 ? `+${diffTotal}` : diffTotal} ({pct}%)
                          </td>

                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSchoolForModal(school);
                                  setShowAuthModal(true);
                                }}
                                title="Edit Numeracy Data (Password Protected)"
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenSchoolAuth(school)}
                                title="School Station Access"
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-400" />
                              </button>
                              <button
                                type="button"
                                onClick={() => exportIndividualSchoolRMAWord(school)}
                                title="Export Official RMA School Report (.doc)"
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                              >
                                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {/* DISTRICT COMPARATIVE TOTAL ROW */}
                    <tr className="bg-[#ffff00] text-slate-950 font-bold text-sm border-t-2 border-slate-900">
                      <td colSpan={2} className="py-3 px-4 text-right border-r border-slate-900 font-black">
                        DISTRICT TOTAL (21 SCHOOLS)
                      </td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.bosy.notProficient}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.bosy.lowProficient}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.bosy.total}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.eosy.notProficient}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.eosy.lowProficient}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900">{DISTRICT_RMA_TOTALS.eosy.total}</td>
                      <td className="py-3 px-2 text-center border-r border-slate-900 font-black text-emerald-900">
                        {DISTRICT_RMA_TOTALS.netChange.notProficient}
                      </td>
                      <td className="py-3 px-2 text-center border-r border-slate-900 font-black text-emerald-900">
                        {DISTRICT_RMA_TOTALS.netChange.lowProficient}
                      </td>
                      <td className="py-3 px-2 text-center border-r border-slate-900 font-black text-emerald-900">
                        {DISTRICT_RMA_TOTALS.netChange.total} ({DISTRICT_RMA_TOTALS.netChange.totalPct.toFixed(1)}%)
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => exportRMAComparativeWord(RMA_DISTRICT_DATA)}
                          className="px-2 py-1 bg-slate-950 text-white text-[10px] font-mono hover:bg-slate-900 cursor-pointer"
                        >
                          Export
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </>
              )}

              {/* SINGLE PERIOD TABLE (BOSY or EOSY) */}
              {(selectedPeriod === 'bosy' || selectedPeriod === 'eosy') && (
                <>
                  <thead>
                    <tr className="bg-[#ffff00] text-slate-950 font-bold border-b border-slate-900 text-xs">
                      <th className="py-2.5 px-3 text-center border-r border-slate-900 w-12">NO.</th>
                      <th className="py-2.5 px-4 text-left border-r border-slate-900 min-w-[220px]">NAME OF SCHOOL</th>
                      <th className="py-2.5 px-4 text-center border-r border-slate-900 bg-rose-900 text-white min-w-[150px]">
                        NOT PROFICIENT
                      </th>
                      <th className="py-2.5 px-4 text-center border-r border-slate-900 bg-amber-800 text-white min-w-[150px]">
                        LOW PROFICIENT
                      </th>
                      <th className="py-2.5 px-4 text-center border-r border-slate-900 bg-slate-950 text-white min-w-[120px]">
                        TOTAL
                      </th>
                      <th className="py-2.5 px-4 text-center min-w-[120px]">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredSchools.map((school) => {
                      const data = selectedPeriod === 'bosy' ? school.bosy : school.eosy;
                      return (
                        <tr key={school.schoolId} className="hover:bg-slate-900/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 border-r border-slate-800">{school.order}</td>
                          <td className="py-2.5 px-4 text-left border-r border-slate-800 font-sans font-bold text-slate-200">
                            {school.officialName}
                          </td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-800 text-rose-400 font-bold text-sm">
                            {data.notProficient}
                          </td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-800 text-amber-400 font-bold text-sm">
                            {data.lowProficient}
                          </td>
                          <td className="py-2.5 px-4 text-center border-r border-slate-800 font-bold text-white text-sm bg-slate-900/30">
                            {data.total}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => exportIndividualSchoolRMAWord(school)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-[11px] font-mono flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <FileDown className="w-3 h-3 text-emerald-400" />
                              <span>Export .doc</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* SINGLE PERIOD TOTAL ROW */}
                    <tr className="bg-[#ffff00] text-slate-950 font-bold text-sm border-t-2 border-slate-900">
                      <td colSpan={2} className="py-3 px-4 text-right border-r border-slate-900 font-black">
                        TOTAL
                      </td>
                      <td className="py-3 px-4 text-center border-r border-slate-900 font-black text-base">
                        {selectedPeriod === 'bosy' ? DISTRICT_RMA_TOTALS.bosy.notProficient : DISTRICT_RMA_TOTALS.eosy.notProficient}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-slate-900 font-black text-base">
                        {selectedPeriod === 'bosy' ? DISTRICT_RMA_TOTALS.bosy.lowProficient : DISTRICT_RMA_TOTALS.eosy.lowProficient}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-slate-900 font-black text-base">
                        {selectedPeriod === 'bosy' ? DISTRICT_RMA_TOTALS.bosy.total : DISTRICT_RMA_TOTALS.eosy.total}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => selectedPeriod === 'bosy' ? exportRMABosyWord(RMA_DISTRICT_DATA) : exportRMAEosyWord(RMA_DISTRICT_DATA)}
                          className="px-3 py-1 bg-slate-950 text-white text-xs font-mono hover:bg-slate-900 cursor-pointer"
                        >
                          Export All
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </>
              )}

            </table>
          </div>
        </div>
      )}

      {/* Official DepEd DO 3, s. 2026 Annex A AI Declaration Box */}
      <div className="bg-[#08101e] border-l-4 border-sky-500 border border-slate-800 p-4 font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase mb-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Compliance &amp; Artificial Intelligence Declaration</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-400">
          {DEPED_RMA_AI_DECLARATION}
        </p>
      </div>

      {/* School Security Station Modal */}
      {showAuthModal && selectedSchoolForModal && (
        <SchoolPasswordModal
          school={{
            name: selectedSchoolForModal.displayName,
            officialName: selectedSchoolForModal.officialName,
            schoolId: selectedSchoolForModal.schoolId,
            barangay: selectedSchoolForModal.barangay,
          }}
          onAuthenticated={handleAuthSuccess}
          onClose={() => {
            setShowAuthModal(false);
            setSelectedSchoolForModal(null);
          }}
        />
      )}

      {/* Authenticated School Details Modal */}
      {authenticatedSchool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#08101e] border border-slate-700 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Authenticated School Station
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {authenticatedSchool.officialName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  School ID: {authenticatedSchool.schoolId} · {authenticatedSchool.barangay}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthenticatedSchool(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-900 border border-slate-700"
              >
                Close
              </button>
            </div>

            {/* School RMA Scorecard */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-blue-950/40 border border-blue-900">
                <div className="text-slate-400 text-[10px] mb-1">BOSY BASELINE</div>
                <div className="text-xl font-bold text-white">{authenticatedSchool.bosy.total}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  NP: {authenticatedSchool.bosy.notProficient} | LP: {authenticatedSchool.bosy.lowProficient}
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-900">
                <div className="text-slate-400 text-[10px] mb-1">EOSY POST-TEST</div>
                <div className="text-xl font-bold text-emerald-400">{authenticatedSchool.eosy.total}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  NP: {authenticatedSchool.eosy.notProficient} | LP: {authenticatedSchool.eosy.lowProficient}
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Net At-Risk Reduction:</span>
                <span className="font-bold text-emerald-400">
                  {authenticatedSchool.eosy.total - authenticatedSchool.bosy.total} learners (
                  {authenticatedSchool.bosy.total > 0
                    ? (((authenticatedSchool.eosy.total - authenticatedSchool.bosy.total) / authenticatedSchool.bosy.total) * 100).toFixed(1)
                    : 0}%
                  )
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Authorized for official DepEd District numeracy reporting.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => exportIndividualSchoolRMAWord(authenticatedSchool)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download School RMA Report (.doc)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditorModal(true);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit RMA Numbers</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Data Editor Modal */}
      {showEditorModal && authenticatedSchool && (
        <SchoolDataEditorModal
          schoolId={authenticatedSchool.schoolId}
          schoolName={authenticatedSchool.displayName}
          initialDomain="rma"
          onClose={() => setShowEditorModal(false)}
        />
      )}

    </div>
  );
};
