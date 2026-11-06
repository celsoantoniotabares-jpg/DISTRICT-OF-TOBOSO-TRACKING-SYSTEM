import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, School, FileText, BarChart3, LogOut, 
  CheckCircle2, Clock, ShieldCheck, Download, Search, Filter, 
  Lock, ArrowRight, FileDown, BookOpen, BookOpenCheck, PieChart,
  BarChart2, TableProperties, Columns2, TrendingUp, ArrowUpRight,
  ChevronRight, Award, AlertCircle, Calculator
} from 'lucide-react';
import { DistrictSeal } from './DistrictSeal';
import { PhilIriSeal } from './PhilIriSeal';
import { SchoolRecord, MainMenuTab, CRLASubjectData, AssessmentPeriod } from '../types';
import { TOBOSO_SCHOOLS_INITIAL } from '../data/schools';
import { DISTRICT_CRLA_BOSY_TOTALS } from '../data/crlaBosyData';
import { DISTRICT_CRLA_EOSY_TOTALS } from '../data/crlaEosyData';
import { SchoolPasswordModal } from './SchoolPasswordModal';
import { SchoolEncodingModal } from './SchoolEncodingModal';
import { CRLAGraphs } from './CRLAGraphs';
import { RMADashboard } from './RMADashboard';
import { PhilIriDashboard } from './PhilIriDashboard';
import { IndividualSchoolAnalytics } from './IndividualSchoolAnalytics';
import { RMA_DISTRICT_DATA } from '../data/rmaData';
import { exportRMABosyWord, exportRMAEosyWord, exportRMAComparativeWord } from '../utils/rmaWordExport';
import { exportAllGradesPhilIriWord } from '../utils/philIriWordExport';
import { 
  exportOverallDistrictWord, 
  exportAllAnalyticsWord, 
  exportIndividualSchoolWord, 
  exportIndividualAnalyticsWord,
  exportComparativeGrowthWord,
  DEPED_AI_DECLARATION
} from '../utils/wordExport';

import { useAssessmentData } from '../context/AssessmentDataContext';
import { SchoolDataEditorModal } from './SchoolDataEditorModal';

interface MainPortalProps {
  onLockSession: () => void;
}

type CRLAViewSelection = 'g1_mtb' | 'g2_mtb' | 'g2_fil' | 'g3_mtb' | 'g3_fil' | 'g3_eng';

export const MainPortal: React.FC<MainPortalProps> = ({ onLockSession }) => {
  const { schools, updateSchoolCRLA } = useAssessmentData();
  const [activeModule, setActiveModule] = useState<'crla' | 'rma' | 'philiri'>('philiri');
  const [activeTab, setActiveTab] = useState<MainMenuTab>('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<AssessmentPeriod>('eosy');
  const [selectedCRLAView, setSelectedCRLAView] = useState<CRLAViewSelection>('g1_mtb');
  const [dashboardDisplayMode, setDashboardDisplayMode] = useState<'both' | 'graphs' | 'table'>('both');
  const [showEditorForSchool, setShowEditorForSchool] = useState<SchoolRecord | null>(null);
  
  // Search & Filtering in Schools view
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // School security password modal state
  const [targetSchoolForAuth, setTargetSchoolForAuth] = useState<SchoolRecord | null>(null);
  const [authenticatedSchool, setAuthenticatedSchool] = useState<SchoolRecord | null>(null);

  // Statistics calculation
  const totalSchoolsCount = schools.length;
  const completedSchoolsCount = useMemo(() => 
    schools.filter(s => s.encodingStatus === 'Completed').length, 
    [schools]
  );
  const pendingSchoolsCount = totalSchoolsCount - completedSchoolsCount;

  // Active Subject Selector Helper
  const getSubjectDataForSchool = (school: SchoolRecord, view: CRLAViewSelection, period: AssessmentPeriod): CRLASubjectData => {
    const src = period === 'eosy' && school.eosy ? school.eosy : school.bosy;
    switch (view) {
      case 'g1_mtb': return src.grade1.mtb;
      case 'g2_mtb': return src.grade2.mtb;
      case 'g2_fil': return src.grade2.filipino;
      case 'g3_mtb': return src.grade3.mtb;
      case 'g3_fil': return src.grade3.filipino;
      case 'g3_eng': return src.grade3.english;
    }
  };

  const getDistrictTotalForView = (view: CRLAViewSelection, period: AssessmentPeriod): CRLASubjectData => {
    const src = period === 'eosy' ? DISTRICT_CRLA_EOSY_TOTALS : DISTRICT_CRLA_BOSY_TOTALS;
    switch (view) {
      case 'g1_mtb': return src.grade1.mtb;
      case 'g2_mtb': return src.grade2.mtb;
      case 'g2_fil': return src.grade2.filipino;
      case 'g3_mtb': return src.grade3.mtb;
      case 'g3_fil': return src.grade3.filipino;
      case 'g3_eng': return src.grade3.english;
    }
  };

  const currentViewTotal = getDistrictTotalForView(selectedCRLAView, selectedPeriod === 'bosy' ? 'bosy' : 'eosy');
  const bosyViewTotal = getDistrictTotalForView(selectedCRLAView, 'bosy');
  const eosyViewTotal = getDistrictTotalForView(selectedCRLAView, 'eosy');

  const bosyPct = bosyViewTotal.assessed.total > 0 ? (bosyViewTotal.atGradeLevel.total / bosyViewTotal.assessed.total) * 100 : 0;
  const eosyPct = eosyViewTotal.assessed.total > 0 ? (eosyViewTotal.atGradeLevel.total / eosyViewTotal.assessed.total) * 100 : 0;
  const districtGain = eosyPct - bosyPct;

  const viewTitles: Record<CRLAViewSelection, { grade: string; subject: string; short: string }> = {
    g1_mtb: { grade: 'Grade 1', subject: 'Mother Tongue (MTB)', short: 'G1 MTB' },
    g2_mtb: { grade: 'Grade 2', subject: 'Mother Tongue (MTB)', short: 'G2 MTB' },
    g2_fil: { grade: 'Grade 2', subject: 'Filipino', short: 'G2 Filipino' },
    g3_mtb: { grade: 'Grade 3', subject: 'Mother Tongue (MTB)', short: 'G3 MTB' },
    g3_fil: { grade: 'Grade 3', subject: 'Filipino', short: 'G3 Filipino' },
    g3_eng: { grade: 'Grade 3', subject: 'English', short: 'G3 English' },
  };

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.officialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.schoolId.includes(searchTerm) ||
                          s.barangay.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'All' || s.encodingStatus === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [schools, searchTerm, filterStatus]);

  // Handle clicking a school: opens password modal
  const handleSchoolClick = (school: SchoolRecord) => {
    setTargetSchoolForAuth(school);
  };

  // When school authentication is confirmed
  const handlePasswordSuccess = () => {
    if (targetSchoolForAuth) {
      setAuthenticatedSchool(targetSchoolForAuth);
      setTargetSchoolForAuth(null);
    }
  };

  const handleToggleSchoolStatus = (schoolId: string) => {
    const s = schools.find(x => x.id === schoolId || x.schoolId === schoolId);
    if (!s) return;
    const nextStatus = s.encodingStatus === 'Completed' ? 'Pending' : 'Completed';
    const updated: SchoolRecord = {
      ...s,
      encodingStatus: nextStatus,
      lastEncodedDate: nextStatus === 'Completed' ? '2026-03-30 (BOSY & EOSY Official)' : null,
      encodedBy: nextStatus === 'Completed' ? 'DepEd Toboso District CRLA Coordinator' : null,
    };
    updateSchoolCRLA(s.schoolId, updated);
    if (authenticatedSchool && (authenticatedSchool.id === schoolId || authenticatedSchool.schoolId === schoolId)) {
      setAuthenticatedSchool(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-white selection:text-slate-900">
      
      {/* LEFT SIDEBAR - MAIN MENU */}
      <aside className="w-full md:w-72 bg-[#08101e] border-r border-slate-800 flex flex-col shrink-0 z-20">
        
        {/* District Branding & Dual Logos */}
        <div className="p-4 border-b border-slate-800 bg-[#060b14]/70">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <DistrictSeal size={46} />
              <div className="shrink-0">
                <img 
                  src="/assets/aistudio/project_richard_logo_ecbcacea.png" 
                  alt="Project RICHARD" 
                  className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[9px] text-slate-400 font-semibold tracking-wider uppercase truncate">
                DepEd NIR · SDO Negros Occ.
              </div>
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide font-sans leading-tight truncate">
                DISTRICT OF TOBOSO
              </h1>
              <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider truncate">
                {activeModule === 'rma' 
                  ? 'Project RICHARD · RMA' 
                  : activeModule === 'philiri' 
                  ? 'Project RICHARD · Phil-IRI' 
                  : 'Project RICHARD · CRLA'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Program Switcher (3 Modules) */}
        <div className="p-3 border-b border-slate-800 bg-[#060b14]/90">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold mb-2 flex items-center justify-between">
            <span>Assessment Program</span>
            <span className="text-[9px] px-1 bg-slate-800 text-slate-300 border border-slate-700">S.Y. 2025-2026</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModule('crla')}
              className={`py-2 px-1 text-center font-mono font-bold text-[10px] sm:text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                activeModule === 'crla'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-300" />
              <span>CRLA</span>
              <span className="text-[9px] font-normal opacity-75">G1–3 Lit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('rma')}
              className={`py-2 px-1 text-center font-mono font-bold text-[10px] sm:text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                activeModule === 'rma'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-300" />
              <span>RMA</span>
              <span className="text-[9px] font-normal opacity-75">G1–3 Math</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('philiri')}
              className={`py-2 px-1 text-center font-mono font-bold text-[10px] sm:text-[11px] flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                activeModule === 'philiri'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Phil-IRI</span>
              <span className="text-[9px] font-normal opacity-75">G4–6 Read</span>
            </button>
          </div>
        </div>

        {/* Main Menu Navigation */}
        <div className="p-3 font-mono text-xs text-slate-400 uppercase tracking-wider px-4 pt-4">
          {activeModule === 'rma' 
            ? 'RMA Numeracy Menu' 
            : activeModule === 'philiri' 
            ? 'Phil-IRI Reading Menu' 
            : 'CRLA Literacy Menu'
          }
        </div>

        <nav className="flex-1 px-3 space-y-1.5 pb-4">
          
          {activeModule === 'crla' ? (
            <>
              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-mono font-medium transition-all cursor-pointer border ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-900/40 text-white border-white/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="tracking-wider uppercase">Dashboard (CRLA Portal)</span>
              </button>

              {/* 2. List of All Schools */}
              <button
                type="button"
                onClick={() => setActiveTab('schools')}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-mono font-medium transition-all cursor-pointer border ${
                  activeTab === 'schools'
                    ? 'bg-blue-900/40 text-white border-white/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <School className={`w-4 h-4 ${activeTab === 'schools' ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="tracking-wider uppercase">List of All Schools</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700">
                  {schools.length}
                </span>
              </button>

              {/* 3. Other Reports */}
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-mono font-medium transition-all cursor-pointer border ${
                  activeTab === 'reports'
                    ? 'bg-blue-900/40 text-white border-white/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'reports' ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="tracking-wider uppercase">Other Reports</span>
              </button>

              {/* 4. Individual Analytics for Each School */}
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-mono font-medium transition-all cursor-pointer border ${
                  activeTab === 'analytics'
                    ? 'bg-blue-900/40 text-white border-white/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-sky-400' : 'text-slate-400'}`} />
                <span className="tracking-wider uppercase">Individual Analytics</span>
              </button>
            </>
          ) : activeModule === 'philiri' ? (
            <>
              {/* Phil-IRI Specific Menu Items */}
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs font-mono font-medium bg-emerald-900/40 text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <PhilIriSeal size={20} className="shrink-0" />
                <span className="tracking-wider uppercase">Phil-IRI Reading Dashboard</span>
              </button>

              <div className="p-3 bg-slate-900/40 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5 mt-2">
                <div className="text-white font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>21 Schools Tracked</span>
                </div>
                <div>Grades: 4, 5, and 6</div>
                <div>Languages: English & Filipino</div>
                <div className="text-emerald-400 font-bold">GST & Profiling Matrix</div>
              </div>
            </>
          ) : (
            <>
              {/* RMA Specific Menu Items */}
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs font-mono font-medium bg-amber-900/40 text-white border border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.2)]"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span className="tracking-wider uppercase">RMA Numeracy Dashboard</span>
              </button>

              <div className="p-3 bg-slate-900/40 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5 mt-2">
                <div className="text-white font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>21 Schools Tracked</span>
                </div>
                <div>BOSY: 1,722 Learners</div>
                <div>EOSY: 555 Learners</div>
                <div className="text-emerald-400 font-bold">Net Reduction: -1,167 (-67.8%)</div>
              </div>
            </>
          )}

        </nav>

        {/* Global Word Export Quick Access */}
        <div className="p-3 mx-3 mb-3 bg-[#060b14] border border-slate-800 text-xs font-mono space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Download className="w-3 h-3 text-sky-400" />
            <span>Word Document Downloads</span>
          </div>

          {activeModule === 'crla' ? (
            <>
              <button
                type="button"
                onClick={() => exportOverallDistrictWord(schools, 'eosy')}
                className="w-full text-left py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Overall EOSY File (.doc)</span>
                <FileDown className="w-3 h-3 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => exportOverallDistrictWord(schools, 'bosy')}
                className="w-full text-left py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Overall BOSY File (.doc)</span>
                <FileDown className="w-3 h-3 text-sky-400" />
              </button>
              <button
                type="button"
                onClick={() => exportComparativeGrowthWord(schools)}
                className="w-full text-left py-1.5 px-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>BOSY vs EOSY Growth (.doc)</span>
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => exportAllAnalyticsWord(schools, selectedPeriod)}
                className="w-full text-left py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>District Analytics (.doc)</span>
                <FileDown className="w-3 h-3 text-slate-400" />
              </button>
            </>
          ) : activeModule === 'philiri' ? (
            <>
              <button
                type="button"
                onClick={() => exportAllGradesPhilIriWord('english')}
                className="w-full text-left py-1.5 px-2 bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/50 text-blue-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer font-bold"
              >
                <span>Phil-IRI English All (.doc)</span>
                <FileDown className="w-3 h-3 text-blue-400" />
              </button>
              <button
                type="button"
                onClick={() => exportAllGradesPhilIriWord('filipino')}
                className="w-full text-left py-1.5 px-2 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer font-bold"
              >
                <span>Phil-IRI Filipino All (.doc)</span>
                <FileDown className="w-3 h-3 text-emerald-400" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => exportRMAComparativeWord(RMA_DISTRICT_DATA)}
                className="w-full text-left py-1.5 px-2 bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer font-bold"
              >
                <span>RMA Comparative Matrix (.doc)</span>
                <FileDown className="w-3 h-3 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => exportRMABosyWord(RMA_DISTRICT_DATA)}
                className="w-full text-left py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>RMA BOSY Baseline (.doc)</span>
                <FileDown className="w-3 h-3 text-sky-400" />
              </button>
              <button
                type="button"
                onClick={() => exportRMAEosyWord(RMA_DISTRICT_DATA)}
                className="w-full text-left py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>RMA EOSY Post-Test (.doc)</span>
                <FileDown className="w-3 h-3 text-amber-400" />
              </button>
            </>
          )}
        </div>

        {/* Sidebar Footer & Lock Button */}
        <div className="p-4 border-t border-slate-800 bg-[#050912]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AUTHENTICATED</span>
            </span>
            <span className="text-slate-500 text-[10px]">MASTER: ASENSO</span>
          </div>
          <button
            type="button"
            onClick={onLockSession}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock / Return to Page 1</span>
          </button>
        </div>

      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="border-b border-slate-800 bg-[#08101e]/90 backdrop-blur-md px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30">
          <div>
            <div className="font-mono text-xs text-slate-400 flex items-center gap-2 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold text-[10px] uppercase tracking-wider">
                Project RICHARD
              </span>
              <span>·</span>
              <span>
                {activeModule === 'rma'
                  ? 'Rapid Mathematics Assessment (RMA) · S.Y. 2025–2026'
                  : activeModule === 'philiri'
                  ? 'Philippine Informal Reading Inventory (Phil-IRI) · S.Y. 2025–2026'
                  : 'Comprehensive Rapid Literacy Assessment (CRLA) · S.Y. 2025–2026'
                }
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-wide font-sans mt-0.5">
              {activeModule === 'rma' && 'District RMA Consolidated Results, Analytics & Recovery Matrix'}
              {activeModule === 'philiri' && 'District Phil-IRI Grades 4–6 Consolidated Reading Profiles & GST Matrix'}
              {activeModule === 'crla' && activeTab === 'dashboard' && 'District CRLA Consolidated Results & Analytics Dashboard'}
              {activeModule === 'crla' && activeTab === 'schools' && 'List of All 21 Elementary Schools in the District of Toboso'}
              {activeModule === 'crla' && activeTab === 'reports' && 'Official Word Documents (.doc) & Consolidated Reports'}
              {activeModule === 'crla' && activeTab === 'analytics' && 'Individual School CRLA Literacy Profiles'}
            </h2>
          </div>

          {/* Module Selector & Header Action Button */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex bg-[#060b14] p-1 border border-slate-800 rounded">
              <button
                type="button"
                onClick={() => setActiveModule('crla')}
                className={`px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold transition-all rounded ${
                  activeModule === 'crla' 
                    ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>CRLA</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('rma')}
                className={`px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold transition-all rounded ${
                  activeModule === 'rma' 
                    ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>RMA</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('philiri')}
                className={`px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer font-bold transition-all rounded ${
                  activeModule === 'philiri' 
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                <span>Phil-IRI</span>
              </button>
            </div>

            {activeModule === 'crla' ? (
              <button
                type="button"
                onClick={() => {
                  if (selectedPeriod === 'comparative') {
                    exportComparativeGrowthWord(schools);
                  } else {
                    exportOverallDistrictWord(schools, selectedPeriod);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white border border-white/20 flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(29,78,216,0.3)] rounded"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {selectedPeriod === 'comparative' 
                    ? 'Download Growth Matrix (.doc)' 
                    : `Download Overall ${selectedPeriod.toUpperCase()} (.doc)`
                  }
                </span>
              </button>
            ) : activeModule === 'philiri' ? (
              <button
                type="button"
                onClick={() => exportAllGradesPhilIriWord('english')}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white border border-white/20 flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold rounded"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Phil-IRI Word (.doc)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => exportRMAComparativeWord(RMA_DISTRICT_DATA)}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white border border-white/20 flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold rounded"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download RMA Growth (.doc)</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body based on Active Module & Tab */}
        <div className="p-5 sm:p-7 space-y-7 flex-1">
          {activeModule === 'rma' ? (
            <RMADashboard />
          ) : activeModule === 'philiri' ? (
            <PhilIriDashboard />
          ) : (
            <>
              {/* ============================================================ */}
              {/* TAB 1: DASHBOARD */}
              {/* ============================================================ */}
              {activeTab === 'dashboard' && (
                <div className="space-y-7 animate-in fade-in duration-200">
              
              {/* PRIMARY PERIOD SELECTOR BANNER */}
              <div className="p-4 bg-[#08101e] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
                      Assessment Period Selector
                    </span>
                    <span className="px-2 py-0.2 bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                      S.Y. 2025-2026
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Toggle between the Beginning of Year baseline, End of Year post-test, or the comparative value-added growth analysis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedPeriod('bosy')}
                    className={`px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedPeriod === 'bosy'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>B.O.S.Y. Baseline (2025)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPeriod('eosy')}
                    className={`px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedPeriod === 'eosy'
                        ? 'bg-emerald-900/60 text-white border-white/50 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>E.O.S.Y. Post-Test (2026)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPeriod('comparative')}
                    className={`px-3.5 py-2 border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedPeriod === 'comparative'
                        ? 'bg-purple-900/60 text-white border-white/50 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>BOSY vs EOSY Growth Matrix</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Completed Encoding */}
                <div className="relative bg-[#0b1426] border border-slate-800 border-t-2 border-t-emerald-400 p-5 shadow-lg">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-2">
                    <span className="uppercase tracking-wider">Completed District Encoding</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      21
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      / 21 Schools (100%)
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-emerald-400 font-mono">
                    All 21 Official Elementary Schools Encoded & Verified
                  </div>
                </div>

                {/* 2. District Mastery Rate */}
                <div className="relative bg-[#0b1426] border border-slate-800 border-t-2 border-t-sky-400 p-5 shadow-lg">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-2">
                    <span className="uppercase tracking-wider">
                      {selectedPeriod === 'comparative' ? 'Net Literacy Growth' : `${selectedPeriod.toUpperCase()} Mastery Rate`}
                    </span>
                    {selectedPeriod === 'comparative' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Award className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      {selectedPeriod === 'comparative' 
                        ? `+${districtGain.toFixed(1)}%` 
                        : `${((currentViewTotal.atGradeLevel.total / (currentViewTotal.assessed.total || 1)) * 100).toFixed(1)}%`
                      }
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {viewTitles[selectedCRLAView].short}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-emerald-400 font-mono">
                    {selectedPeriod === 'comparative' 
                      ? `Baseline: ${bosyPct.toFixed(1)}% → Post-Test: ${eosyPct.toFixed(1)}%`
                      : `${currentViewTotal.atGradeLevel.total} of ${currentViewTotal.assessed.total} Learners At Grade Level`
                    }
                  </div>
                </div>

                {/* 3. Non-Readers / Full Refreshers Reduction */}
                <div className="relative bg-[#0b1426] border border-slate-800 border-t-2 border-t-amber-400 p-5 shadow-lg">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-2">
                    <span className="uppercase tracking-wider">Intervention Impact</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-200 font-mono">
                      -{bosyViewTotal.emerging.total - eosyViewTotal.emerging.total}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Non-Readers Reduced
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-amber-300 font-mono">
                    Down from {bosyViewTotal.emerging.total} (BOSY) to {eosyViewTotal.emerging.total} (EOSY)
                  </div>
                </div>

              </div>

              {/* OVERALL ANALYSIS SECTION */}
              <div className="relative bg-[#0b1426] border border-slate-800 border-t-2 border-t-white p-6 shadow-xl">
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
                        Consolidated Analysis
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono text-xs text-slate-400">
                        {viewTitles[selectedCRLAView].grade} ({viewTitles[selectedCRLAView].subject})
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      District of Toboso CRLA Assessment Matrix
                    </h3>
                  </div>

                  {/* Display Mode: Graphs, Table, or Both */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#060b14] border border-slate-800 p-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setDashboardDisplayMode('both')}
                        className={`px-2.5 py-1 text-xs cursor-pointer ${
                          dashboardDisplayMode === 'both' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Both
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardDisplayMode('graphs')}
                        className={`px-2.5 py-1 text-xs cursor-pointer ${
                          dashboardDisplayMode === 'graphs' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Graphs
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardDisplayMode('table')}
                        className={`px-2.5 py-1 text-xs cursor-pointer ${
                          dashboardDisplayMode === 'table' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Table
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grade & Subject Selector Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 py-4 border-b border-slate-800 font-mono text-xs">
                  <span className="text-slate-400 text-[11px] mr-2 uppercase tracking-wider font-semibold">
                    Assessment Subject:
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g1_mtb')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g1_mtb'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 1 MTB
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g2_mtb')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g2_mtb'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 2 MTB
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g2_fil')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g2_fil'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 2 Filipino
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g3_mtb')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g3_mtb'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 3 MTB
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g3_fil')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g3_fil'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 3 Filipino
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCRLAView('g3_eng')}
                    className={`px-3 py-1.5 border transition-all cursor-pointer ${
                      selectedCRLAView === 'g3_eng'
                        ? 'bg-blue-900/60 text-white border-white/50 font-bold'
                        : 'bg-[#060b14] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Grade 3 English
                  </button>
                </div>

                {/* SECTION 1: VISUAL GRAPHS (PIE, DONUT, COMPARATIVE BARS) */}
                {(dashboardDisplayMode === 'both' || dashboardDisplayMode === 'graphs') && (
                  <div className="py-6 border-b border-slate-800">
                    <CRLAGraphs 
                      schools={schools} 
                      selectedView={selectedCRLAView}
                      period={selectedPeriod}
                      onSelectSchool={handleSchoolClick}
                    />
                  </div>
                )}

                {/* SECTION 2: CONSOLIDATED DATA MATRIX TABLE */}
                {(dashboardDisplayMode === 'both' || dashboardDisplayMode === 'table') && (
                  <div className="pt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                          <TableProperties className="w-4 h-4 text-sky-400" />
                          <span>
                            {selectedPeriod === 'comparative' 
                              ? `Comparative Growth Matrix: ${viewTitles[selectedCRLAView].grade} · ${viewTitles[selectedCRLAView].subject}`
                              : `Official 21 Schools Matrix: ${viewTitles[selectedCRLAView].grade} · ${viewTitles[selectedCRLAView].subject} (${selectedPeriod.toUpperCase()})`
                            }
                          </span>
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          Exact verified DepEd Toboso official records (Click any school row to access password-protected station)
                        </span>
                      </div>
                    </div>

                    {/* TABLE: COMPARATIVE PROGRESS VIEW */}
                    {selectedPeriod === 'comparative' ? (
                      <div className="overflow-x-auto border border-slate-800 shadow-md">
                        <table className="w-full text-center font-mono text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#080f1d] text-slate-300 border-b border-slate-800">
                              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-800 w-10">No.</th>
                              <th rowSpan={2} className="py-2.5 px-3 text-left border-r border-slate-800 min-w-[180px]">DISTRICT OF TOBOSO - SCHOOLS</th>
                              <th colSpan={2} className="py-2 px-2 border-r border-slate-800 bg-slate-900/60">B.O.S.Y. BASELINE</th>
                              <th colSpan={2} className="py-2 px-2 border-r border-slate-800 bg-emerald-950/40 text-emerald-300">E.O.S.Y. POST-TEST</th>
                              <th colSpan={2} className="py-2 px-2 border-r border-slate-800 bg-blue-950/40 text-sky-300">NET PROGRESS GAIN</th>
                              <th rowSpan={2} className="py-2.5 px-2">EMERGING REDUCTION</th>
                            </tr>
                            <tr className="bg-[#0b1426] text-[10px] text-slate-400 border-b border-slate-800 uppercase">
                              <th className="py-1 px-2 border-r border-slate-800">Assessed</th>
                              <th className="py-1 px-2 border-r border-slate-800">% At Grade</th>
                              <th className="py-1 px-2 border-r border-slate-800">Assessed</th>
                              <th className="py-1 px-2 border-r border-slate-800 text-emerald-300 font-bold">% At Grade</th>
                              <th className="py-1 px-2 border-r border-slate-800">Net Gain (pts)</th>
                              <th className="py-1 px-2 border-r border-slate-800">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-[#060b14] text-slate-200">
                            {schools.map(school => {
                              const bSub = getSubjectDataForSchool(school, selectedCRLAView, 'bosy');
                              const eSub = getSubjectDataForSchool(school, selectedCRLAView, 'eosy');
                              const bAssessed = bSub.assessed.total;
                              const eAssessed = eSub.assessed.total;
                              const bAtGradePct = bAssessed > 0 ? (bSub.atGradeLevel.total / bAssessed) * 100 : 0;
                              const eAtGradePct = eAssessed > 0 ? (eSub.atGradeLevel.total / eAssessed) * 100 : 0;
                              const gain = eAtGradePct - bAtGradePct;
                              const emReduct = bSub.emerging.total - eSub.emerging.total;

                              return (
                                <tr 
                                  key={school.id}
                                  onClick={() => handleSchoolClick(school)}
                                  className="hover:bg-blue-950/30 transition-colors cursor-pointer group"
                                >
                                  <td className="py-2 px-2 border-r border-slate-800 text-slate-400">{school.order}</td>
                                  <td className="py-2 px-3 text-left border-r border-slate-800 font-semibold text-white group-hover:text-sky-300 flex items-center justify-between">
                                    <span>{school.officialName}</span>
                                    <Lock className="w-3 h-3 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1" />
                                  </td>
                                  <td className="py-2 px-2 border-r border-slate-800">{bAssessed}</td>
                                  <td className="py-2 px-2 border-r border-slate-800">{bAtGradePct.toFixed(2)}%</td>
                                  <td className="py-2 px-2 border-r border-slate-800">{eAssessed}</td>
                                  <td className="py-2 px-2 border-r border-slate-800 font-bold text-emerald-400">{eAtGradePct.toFixed(2)}%</td>
                                  <td className={`py-2 px-2 border-r border-slate-800 font-bold ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {gain >= 0 ? '+' : ''}{gain.toFixed(2)}%
                                  </td>
                                  <td className="py-2 px-2 border-r border-slate-800 text-[10px]">
                                    <span className={`px-1.5 py-0.5 ${gain >= 15 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : gain > 0 ? 'bg-blue-950 text-sky-300 border border-blue-500/40' : 'bg-slate-900 text-slate-400'}`}>
                                      {gain >= 15 ? 'High Growth' : gain > 0 ? 'Progress' : 'Sustained'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-2 text-[11px] font-semibold text-emerald-400">
                                    {emReduct > 0 ? `-${emReduct} non-readers` : `${emReduct}`}
                                  </td>
                                </tr>
                              );
                            })}
                            
                            {/* TOTAL ROW */}
                            <tr className="bg-yellow-400 text-slate-950 font-bold border-t-2 border-slate-900">
                              <td colSpan={2} className="py-2.5 px-3 text-right uppercase tracking-wider pr-4">TOTAL / DISTRICT AVERAGE:</td>
                              <td className="py-2.5 px-2">{bosyViewTotal.assessed.total}</td>
                              <td className="py-2.5 px-2">{bosyPct.toFixed(2)}%</td>
                              <td className="py-2.5 px-2">{eosyViewTotal.assessed.total}</td>
                              <td className="py-2.5 px-2">{eosyPct.toFixed(2)}%</td>
                              <td className="py-2.5 px-2 text-emerald-950 font-extrabold">+{districtGain.toFixed(2)}%</td>
                              <td className="py-2.5 px-2">District Target Met</td>
                              <td className="py-2.5 px-2">-{bosyViewTotal.emerging.total - eosyViewTotal.emerging.total} non-readers</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : selectedPeriod === 'eosy' ? (
                      /* TABLE: EOSY OFFICIAL 5-TIER POST-TEST TABLE */
                      <div className="overflow-x-auto border border-slate-800 shadow-md">
                        <table className="w-full text-center font-mono text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-[#080f1d] text-slate-300 border-b border-slate-800">
                              <th rowSpan={2} className="py-2 px-1.5 border-r border-slate-800 w-8">No.</th>
                              <th rowSpan={2} className="py-2 px-2.5 text-left border-r border-slate-800 min-w-[170px]">DISTRICT OF TOBOSO - SCHOOLS</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800">ENROLMENT</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800">NUMBER OF LEARNERS ASSESSED</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-red-950/40 text-red-300">FR/LOW EMERGING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-rose-950/40 text-rose-300">FR/HIGH EMERGING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-amber-950/40 text-amber-300">MR/DEVELOPING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-blue-950/40 text-sky-300">LR/TRANSITIONING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-emerald-950/40 text-emerald-300">SR/AT GRADE LEVEL</th>
                              <th rowSpan={2} className="py-2 px-2 bg-yellow-400 text-slate-950 font-extrabold">% AT GRADE</th>
                            </tr>
                            <tr className="bg-[#0b1426] text-[9px] text-slate-400 border-b border-slate-800 uppercase">
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-white">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-white">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-red-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-rose-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-amber-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-sky-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-emerald-300">T</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-[#060b14] text-slate-200">
                            {schools.map(school => {
                              const sub = getSubjectDataForSchool(school, selectedCRLAView, 'eosy');
                              const assessed = sub.assessed.total;
                              const atGradePct = assessed > 0 ? ((sub.atGradeLevel.total / assessed) * 100).toFixed(2) + '%' : '0.00%';
                              const le = sub.lowEmerging || { m: 0, f: 0, total: 0 };
                              const he = sub.highEmerging || { m: 0, f: 0, total: 0 };

                              return (
                                <tr 
                                  key={school.id}
                                  onClick={() => handleSchoolClick(school)}
                                  className="hover:bg-blue-950/30 transition-colors cursor-pointer group"
                                >
                                  <td className="py-1.5 px-1 border-r border-slate-800 text-slate-400">{school.order}</td>
                                  <td className="py-1.5 px-2.5 text-left border-r border-slate-800 font-semibold text-white group-hover:text-sky-300 flex items-center justify-between">
                                    <span>{school.officialName}</span>
                                    <Lock className="w-2.5 h-2.5 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1" />
                                  </td>
                                  <td className="py-1.5 px-1">{sub.enrolment.m}</td><td className="py-1.5 px-1">{sub.enrolment.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-white">{sub.enrolment.total}</td>
                                  <td className="py-1.5 px-1">{sub.assessed.m}</td><td className="py-1.5 px-1">{sub.assessed.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-white">{sub.assessed.total}</td>
                                  <td className="py-1.5 px-1">{le.m}</td><td className="py-1.5 px-1">{le.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-red-300">{le.total}</td>
                                  <td className="py-1.5 px-1">{he.m}</td><td className="py-1.5 px-1">{he.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-rose-300">{he.total}</td>
                                  <td className="py-1.5 px-1">{sub.developing.m}</td><td className="py-1.5 px-1">{sub.developing.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-amber-300">{sub.developing.total}</td>
                                  <td className="py-1.5 px-1">{sub.transitioning.m}</td><td className="py-1.5 px-1">{sub.transitioning.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-sky-300">{sub.transitioning.total}</td>
                                  <td className="py-1.5 px-1">{sub.atGradeLevel.m}</td><td className="py-1.5 px-1">{sub.atGradeLevel.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-emerald-400">{sub.atGradeLevel.total}</td>
                                  <td className="py-1.5 px-2 font-bold text-emerald-400 bg-emerald-950/20">{atGradePct}</td>
                                </tr>
                              );
                            })}

                            {/* TOTAL ROW (MATCHES OFFICIAL SPREADSHEET YELLOW ROW) */}
                            <tr className="bg-yellow-400 text-slate-950 font-bold border-t-2 border-slate-900">
                              <td colSpan={2} className="py-2 px-3 text-right uppercase tracking-wider pr-4">TOTAL:</td>
                              <td>{eosyViewTotal.enrolment.m}</td><td>{eosyViewTotal.enrolment.f}</td><td className="border-r border-slate-900 font-extrabold">{eosyViewTotal.enrolment.total}</td>
                              <td>{eosyViewTotal.assessed.m}</td><td>{eosyViewTotal.assessed.f}</td><td className="border-r border-slate-900 font-extrabold">{eosyViewTotal.assessed.total}</td>
                              <td>{eosyViewTotal.lowEmerging?.m}</td><td>{eosyViewTotal.lowEmerging?.f}</td><td className="border-r border-slate-900">{eosyViewTotal.lowEmerging?.total}</td>
                              <td>{eosyViewTotal.highEmerging?.m}</td><td>{eosyViewTotal.highEmerging?.f}</td><td className="border-r border-slate-900">{eosyViewTotal.highEmerging?.total}</td>
                              <td>{eosyViewTotal.developing.m}</td><td>{eosyViewTotal.developing.f}</td><td className="border-r border-slate-900">{eosyViewTotal.developing.total}</td>
                              <td>{eosyViewTotal.transitioning.m}</td><td>{eosyViewTotal.transitioning.f}</td><td className="border-r border-slate-900">{eosyViewTotal.transitioning.total}</td>
                              <td>{eosyViewTotal.atGradeLevel.m}</td><td>{eosyViewTotal.atGradeLevel.f}</td><td className="border-r border-slate-900 font-extrabold">{eosyViewTotal.atGradeLevel.total}</td>
                              <td className="py-2 px-2 font-extrabold text-sm">{eosyPct.toFixed(2)}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* TABLE: BOSY BASELINE TABLE */
                      <div className="overflow-x-auto border border-slate-800 shadow-md">
                        <table className="w-full text-center font-mono text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-[#080f1d] text-slate-300 border-b border-slate-800">
                              <th rowSpan={2} className="py-2 px-1.5 border-r border-slate-800 w-8">No.</th>
                              <th rowSpan={2} className="py-2 px-2.5 text-left border-r border-slate-800 min-w-[170px]">DISTRICT OF TOBOSO - SCHOOLS</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800">ENROLMENT</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800">LEARNERS ASSESSED</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-red-950/40 text-red-300">EMERGING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-amber-950/40 text-amber-300">DEVELOPING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-blue-950/40 text-sky-300">TRANSITIONING</th>
                              <th colSpan={3} className="py-1 px-1 border-r border-slate-800 bg-emerald-950/40 text-emerald-300">AT GRADE LEVEL</th>
                              <th rowSpan={2} className="py-2 px-2 bg-yellow-400 text-slate-950 font-extrabold">% AT GRADE</th>
                            </tr>
                            <tr className="bg-[#0b1426] text-[9px] text-slate-400 border-b border-slate-800 uppercase">
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-white">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-white">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-red-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-amber-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-sky-300">T</th>
                              <th className="py-1 px-1 border-r border-slate-800">M</th><th className="py-1 px-1 border-r border-slate-800">F</th><th className="py-1 px-1 border-r border-slate-800 font-bold text-emerald-300">T</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 bg-[#060b14] text-slate-200">
                            {schools.map(school => {
                              const sub = getSubjectDataForSchool(school, selectedCRLAView, 'bosy');
                              const assessed = sub.assessed.total;
                              const atGradePct = assessed > 0 ? ((sub.atGradeLevel.total / assessed) * 100).toFixed(2) + '%' : '0.00%';

                              return (
                                <tr 
                                  key={school.id}
                                  onClick={() => handleSchoolClick(school)}
                                  className="hover:bg-blue-950/30 transition-colors cursor-pointer group"
                                >
                                  <td className="py-1.5 px-1 border-r border-slate-800 text-slate-400">{school.order}</td>
                                  <td className="py-1.5 px-2.5 text-left border-r border-slate-800 font-semibold text-white group-hover:text-sky-300 flex items-center justify-between">
                                    <span>{school.officialName}</span>
                                    <Lock className="w-2.5 h-2.5 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1" />
                                  </td>
                                  <td className="py-1.5 px-1">{sub.enrolment.m}</td><td className="py-1.5 px-1">{sub.enrolment.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-white">{sub.enrolment.total}</td>
                                  <td className="py-1.5 px-1">{sub.assessed.m}</td><td className="py-1.5 px-1">{sub.assessed.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-white">{sub.assessed.total}</td>
                                  <td className="py-1.5 px-1">{sub.emerging.m}</td><td className="py-1.5 px-1">{sub.emerging.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-red-300">{sub.emerging.total}</td>
                                  <td className="py-1.5 px-1">{sub.developing.m}</td><td className="py-1.5 px-1">{sub.developing.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-amber-300">{sub.developing.total}</td>
                                  <td className="py-1.5 px-1">{sub.transitioning.m}</td><td className="py-1.5 px-1">{sub.transitioning.f}</td><td className="py-1.5 px-1 border-r border-slate-800 text-sky-300">{sub.transitioning.total}</td>
                                  <td className="py-1.5 px-1">{sub.atGradeLevel.m}</td><td className="py-1.5 px-1">{sub.atGradeLevel.f}</td><td className="py-1.5 px-1 border-r border-slate-800 font-bold text-emerald-400">{sub.atGradeLevel.total}</td>
                                  <td className="py-1.5 px-2 font-bold text-emerald-400 bg-emerald-950/20">{atGradePct}</td>
                                </tr>
                              );
                            })}

                            {/* TOTAL ROW */}
                            <tr className="bg-yellow-400 text-slate-950 font-bold border-t-2 border-slate-900">
                              <td colSpan={2} className="py-2 px-3 text-right uppercase tracking-wider pr-4">TOTAL:</td>
                              <td>{bosyViewTotal.enrolment.m}</td><td>{bosyViewTotal.enrolment.f}</td><td className="border-r border-slate-900 font-extrabold">{bosyViewTotal.enrolment.total}</td>
                              <td>{bosyViewTotal.assessed.m}</td><td>{bosyViewTotal.assessed.f}</td><td className="border-r border-slate-900 font-extrabold">{bosyViewTotal.assessed.total}</td>
                              <td>{bosyViewTotal.emerging.m}</td><td>{bosyViewTotal.emerging.f}</td><td className="border-r border-slate-900">{bosyViewTotal.emerging.total}</td>
                              <td>{bosyViewTotal.developing.m}</td><td>{bosyViewTotal.developing.f}</td><td className="border-r border-slate-900">{bosyViewTotal.developing.total}</td>
                              <td>{bosyViewTotal.transitioning.m}</td><td>{bosyViewTotal.transitioning.f}</td><td className="border-r border-slate-900">{bosyViewTotal.transitioning.total}</td>
                              <td>{bosyViewTotal.atGradeLevel.m}</td><td>{bosyViewTotal.atGradeLevel.f}</td><td className="border-r border-slate-900 font-extrabold">{bosyViewTotal.atGradeLevel.total}</td>
                              <td className="py-2 px-2 font-extrabold text-sm">{bosyPct.toFixed(2)}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: LIST OF ALL SCHOOLS */}
          {/* ============================================================ */}
          {activeTab === 'schools' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#08101e] border border-slate-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by school name, 6-digit ID, or barangay..."
                    className="w-full bg-[#060b14] border border-slate-700 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                  <span className="text-white font-bold">{filteredSchools.length}</span> of {schools.length} Schools Listed
                </div>
              </div>

              {/* 21 Schools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchools.map((school) => {
                  const bG1 = school.bosy.grade1.mtb;
                  const eG1 = school.eosy?.grade1.mtb;
                  const bPct = bG1.assessed.total > 0 ? (bG1.atGradeLevel.total / bG1.assessed.total) * 100 : 0;
                  const ePct = eG1 && eG1.assessed.total > 0 ? (eG1.atGradeLevel.total / eG1.assessed.total) * 100 : 0;
                  const gain = ePct - bPct;

                  return (
                    <div
                      key={school.id}
                      onClick={() => handleSchoolClick(school)}
                      className="bg-[#0b1426] border border-slate-800 hover:border-sky-500/50 p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-lg relative"
                    >
                      <div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-2">
                          <span className="text-sky-400 font-bold">#{school.order} · ID: {school.schoolId}</span>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>100% Encoded</span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                          {school.officialName}
                        </h3>
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                          {school.barangay}
                        </div>

                        {/* Progression Snapshot */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>G1 MTB Progression:</span>
                            <span className="font-bold text-white">{bPct.toFixed(0)}% → <strong className="text-emerald-400">{ePct.toFixed(0)}%</strong></span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">Net Literacy Gain:</span>
                            <span className="text-emerald-400 font-bold">+{gain.toFixed(1)}% pts</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-sky-300">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Requires Password</span>
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: OTHER REPORTS */}
          {/* ============================================================ */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-[#0b1426] border border-slate-800 p-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4 mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
                    Official Document Center
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Downloadable DepEd CRLA Word Reports (.doc)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Download formatted Word documents matching DepEd quality-assured templates, complete with landscape formatting and compliance statements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  
                  {/* EOSY Consolidated Word */}
                  <div className="p-5 bg-[#08101e] border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-emerald-400 font-bold uppercase">District Matrix (EOSY)</span>
                        <FileDown className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        Official E.O.S.Y. 2025-2026 Consolidated Report
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Contains all 6 assessment tables (Grade 1 MTB, Grade 2 MTB/Filipino, Grade 3 MTB/Filipino/English) with 5-tier proficiency metrics for all 21 schools.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportOverallDistrictWord(schools, 'eosy')}
                      className="mt-4 w-full py-2.5 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download EOSY Consolidated (.doc)</span>
                    </button>
                  </div>

                  {/* BOSY Consolidated Word */}
                  <div className="p-5 bg-[#08101e] border border-slate-800 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-sky-400 font-bold uppercase">District Matrix (BOSY)</span>
                        <FileDown className="w-4 h-4 text-sky-400" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        Official B.O.S.Y. 2025-2026 Baseline Report
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Full baseline results across all 21 elementary schools collected at the beginning of the school year.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportOverallDistrictWord(schools, 'bosy')}
                      className="mt-4 w-full py-2.5 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 text-blue-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download BOSY Baseline (.doc)</span>
                    </button>
                  </div>

                  {/* Comparative Growth Word */}
                  <div className="p-5 bg-[#08101e] border border-slate-800 hover:border-purple-500/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-purple-400 font-bold uppercase">Progress Analysis</span>
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        BOSY vs. EOSY Comparative Growth Matrix
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        District-wide value-added literacy progression report showing net gains, reduction in non-readers, and school-by-school impact.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportComparativeGrowthWord(schools)}
                      className="mt-4 w-full py-2.5 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Growth Matrix (.doc)</span>
                    </button>
                  </div>

                  {/* District Executive Analytics Word */}
                  <div className="p-5 bg-[#08101e] border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-2">
                        <span className="text-amber-400 font-bold uppercase">Executive Brief</span>
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        District-Wide CRLA Analytics Brief
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Executive summaries and percentage mastery breakdowns suited for District Planning and Division reporting.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportAllAnalyticsWord(schools, selectedPeriod)}
                      className="mt-4 w-full py-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Analytics Brief (.doc)</span>
                    </button>
                  </div>

                </div>

                {/* AI DECLARATION DO 3, s. 2026 COMPLIANCE BOX */}
                <div className="mt-8 p-4 bg-[#060b14] border border-slate-800 border-l-4 border-l-sky-500">
                  <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DepEd Compliance Notice (DO 3, s. 2026 Annex A)</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed text-justify">
                    {DEPED_AI_DECLARATION}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: INDIVIDUAL ANALYTICS */}
          {/* ============================================================ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <IndividualSchoolAnalytics
                schools={schools}
                onOpenStation={handleSchoolClick}
                onExportWord={exportIndividualSchoolWord}
              />
            </div>
          )}
        </>
      )}

    </div>

      </main>

      {/* PASSWORD MODAL */}
      {targetSchoolForAuth && (
        <SchoolPasswordModal
          school={targetSchoolForAuth}
          onAuthenticated={handlePasswordSuccess}
          onClose={() => setTargetSchoolForAuth(null)}
        />
      )}

      {/* AUTHENTICATED SCHOOL ENCODING / REPORT MODAL */}
      {authenticatedSchool && (
        <SchoolEncodingModal
          school={authenticatedSchool}
          onClose={() => setAuthenticatedSchool(null)}
          onToggleStatus={handleToggleSchoolStatus}
        />
      )}

    </div>
  );
};
