import React, { useState, useMemo } from 'react';
import { SchoolRecord } from '../types';
import { RMA_DISTRICT_DATA, RMASchoolRecord } from '../data/rmaData';
import { CRLA_BOSY_SCHOOLS } from '../data/crlaBosyData';
import { CRLA_EOSY_SCHOOLS } from '../data/crlaEosyData';
import { 
  PHIL_IRI_BOSY_DATA, 
  PHIL_IRI_EOSY_DATA, 
  PhilIriSchoolRow 
} from '../data/philIriData';
import { 
  BarChart2, 
  BookOpen, 
  Calculator, 
  Lock, 
  FileDown, 
  Search, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  School as SchoolIcon,
  BookOpenCheck
} from 'lucide-react';
import { PhilIriSeal } from './PhilIriSeal';
import { PieDonutChart, ChartSegment } from './PieDonutChart';
import { useAssessmentData } from '../context/AssessmentDataContext';
import { SchoolPasswordModal } from './SchoolPasswordModal';
import { SchoolDataEditorModal } from './SchoolDataEditorModal';
import { Edit3, RotateCcw } from 'lucide-react';

interface IndividualSchoolAnalyticsProps {
  schools?: SchoolRecord[];
  onOpenStation: (school: SchoolRecord) => void;
  onExportWord: (school: SchoolRecord) => void;
}

export const IndividualSchoolAnalytics: React.FC<IndividualSchoolAnalyticsProps> = ({
  schools: propSchools,
  onOpenStation,
  onExportWord
}) => {
  const { 
    schools: ctxSchools, 
    rmaData, 
    philIriData, 
    resetAllToBaseline, 
    hasCustomEdits 
  } = useAssessmentData();
  
  const schools = ctxSchools || propSchools;
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.schoolId || '116130');
  const [activeDomain, setActiveDomain] = useState<'overview' | 'crla' | 'rma' | 'philiri'>('overview');
  const [philIriLang, setPhilIriLang] = useState<'english' | 'filipino'>('english');
  const [searchTerm, setSearchTerm] = useState('');

  // Password-protected editor state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editorDomain, setEditorDomain] = useState<'crla' | 'rma' | 'philiri'>('crla');

  // Selected school record
  const currentSchool = useMemo(() => {
    return schools.find(s => s.schoolId === selectedSchoolId) || schools[0];
  }, [schools, selectedSchoolId]);

  // CRLA Data for this school (reads live from reactive schools context)
  const crlaData = useMemo(() => {
    if (!currentSchool) return null;
    const bosy = currentSchool.bosy;
    const eosy = currentSchool.eosy;

    const sumCRLA = (record?: typeof bosy) => {
      if (!record) return { total: 0, emerging: 0, developing: 0, transitioning: 0, atGradeLevel: 0 };
      const subjects = [
        record.grade1.mtb,
        record.grade2.mtb,
        record.grade2.filipino,
        record.grade3.mtb,
        record.grade3.filipino,
        record.grade3.english
      ];

      let total = 0;
      let emerging = 0;
      let developing = 0;
      let transitioning = 0;
      let atGradeLevel = 0;

      subjects.forEach(sub => {
        if (!sub) return;
        total += sub.assessed.total;
        emerging += sub.emerging.total;
        developing += sub.developing.total;
        transitioning += sub.transitioning.total;
        atGradeLevel += sub.atGradeLevel.total;
      });

      return { total, emerging, developing, transitioning, atGradeLevel };
    };

    const b = sumCRLA(bosy);
    const e = sumCRLA(eosy || undefined);

    return {
      bosy: b,
      eosy: e,
      bosyAtGradePct: b.total > 0 ? (b.atGradeLevel / b.total) * 100 : 0,
      eosyAtGradePct: e.total > 0 ? (e.atGradeLevel / e.total) * 100 : 0,
      emergingReduction: b.emerging - e.emerging,
      atGradeGain: e.atGradeLevel - b.atGradeLevel
    };
  }, [currentSchool]);

  // RMA Data for this school (reads live from context)
  const currentRmaData = useMemo<RMASchoolRecord | undefined>(() => {
    if (!currentSchool) return undefined;
    return rmaData.find(r => r.schoolId === currentSchool.schoolId);
  }, [currentSchool, rmaData]);

  // Phil-IRI Data for this school across Grades 4, 5, 6 (reads live from context)
  const currentPhilIriData = useMemo(() => {
    if (!currentSchool) return null;

    const bData = philIriData.bosy[philIriLang];
    const eData = philIriData.eosy[philIriLang];

    const g4B = bData.grade4.find(r => r.schoolId === currentSchool.schoolId);
    const g5B = bData.grade5.find(r => r.schoolId === currentSchool.schoolId);
    const g6B = bData.grade6.find(r => r.schoolId === currentSchool.schoolId);

    const g4E = eData.grade4.find(r => r.schoolId === currentSchool.schoolId);
    const g5E = eData.grade5.find(r => r.schoolId === currentSchool.schoolId);
    const g6E = eData.grade6.find(r => r.schoolId === currentSchool.schoolId);

    const sumRows = (rows: (PhilIriSchoolRow | undefined)[]) => {
      let assessed = 0;
      let atGrade = 0;
      let twoLvl = 0;
      let threeLvl = 0;
      let frustration = 0;
      let independent = 0;

      rows.forEach(r => {
        if (!r) return;
        assessed += r.totalAssessed;
        atGrade += r.atGradeLevel;
        twoLvl += r.twoLevelDown.total.t;
        threeLvl += r.threeLevelDown.total.t;
        frustration += r.twoLevelDown.frustration.t + r.threeLevelDown.frustration.t;
        independent += r.twoLevelDown.independent.t + r.threeLevelDown.independent.t;
      });

      return {
        assessed,
        atGrade,
        twoLvl,
        threeLvl,
        frustration,
        independent,
        atGradePct: assessed > 0 ? (atGrade / assessed) * 100 : 0
      };
    };

    const bosyTotals = sumRows([g4B, g5B, g6B]);
    const eosyTotals = sumRows([g4E, g5E, g6E]);

    return {
      bosyTotals,
      eosyTotals,
      atGradeGain: eosyTotals.atGrade - bosyTotals.atGrade,
      atGradePctGain: eosyTotals.atGradePct - bosyTotals.atGradePct,
      frustrationReduction: bosyTotals.frustration - eosyTotals.frustration,
      threeLvlReduction: bosyTotals.threeLvl - eosyTotals.threeLvl
    };
  }, [currentSchool, philIriLang, philIriData]);

  // Filtered schools for quick search switcher
  const filteredSchoolsList = useMemo(() => {
    if (!searchTerm.trim()) return schools;
    const term = searchTerm.toLowerCase();
    return schools.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.schoolId.includes(term) ||
      s.barangay.toLowerCase().includes(term)
    );
  }, [schools, searchTerm]);

  // CRLA Segments (BOSY and EOSY)
  const crlaBosySegments: ChartSegment[] = useMemo(() => {
    if (!crlaData) return [];
    return [
      { id: 'c-b-emg', label: 'Emerging', subLabel: 'Full Intervention', value: crlaData.bosy.emerging, color: '#f43f5e' },
      { id: 'c-b-dev', label: 'Developing', subLabel: 'Moderate Support', value: crlaData.bosy.developing, color: '#f59e0b' },
      { id: 'c-b-trn', label: 'Transitioning', subLabel: 'Light Support', value: crlaData.bosy.transitioning, color: '#3b82f6' },
      { id: 'c-b-grd', label: 'Grade Ready', subLabel: 'Target Mastered', value: crlaData.bosy.atGradeLevel, color: '#10b981' }
    ];
  }, [crlaData]);

  const crlaEosySegments: ChartSegment[] = useMemo(() => {
    if (!crlaData) return [];
    return [
      { id: 'c-e-emg', label: 'Emerging', subLabel: 'Full Intervention', value: crlaData.eosy.emerging, color: '#f43f5e' },
      { id: 'c-e-dev', label: 'Developing', subLabel: 'Moderate Support', value: crlaData.eosy.developing, color: '#f59e0b' },
      { id: 'c-e-trn', label: 'Transitioning', subLabel: 'Light Support', value: crlaData.eosy.transitioning, color: '#3b82f6' },
      { id: 'c-e-grd', label: 'Grade Ready', subLabel: 'Target Mastered', value: crlaData.eosy.atGradeLevel, color: '#10b981' }
    ];
  }, [crlaData]);

  // RMA Segments (BOSY and EOSY)
  const rmaBosySegments: ChartSegment[] = useMemo(() => {
    if (!currentRmaData) return [];
    const notProf = currentRmaData.bosy.notProficient;
    const lowProf = currentRmaData.bosy.lowProficient;
    const prof = Math.max(0, currentRmaData.bosy.total - notProf - lowProf);
    return [
      { id: 'r-b-not', label: 'Not Proficient', subLabel: 'Scores 0–10', value: notProf, color: '#f43f5e' },
      { id: 'r-b-low', label: 'Low Proficient', subLabel: 'Scores 11–15', value: lowProf, color: '#f59e0b' },
      { id: 'r-b-prf', label: 'Proficient / Near', subLabel: 'Scores 16–20', value: prof, color: '#10b981' }
    ];
  }, [currentRmaData]);

  const rmaEosySegments: ChartSegment[] = useMemo(() => {
    if (!currentRmaData) return [];
    const notProf = currentRmaData.eosy.notProficient;
    const lowProf = currentRmaData.eosy.lowProficient;
    const prof = Math.max(0, currentRmaData.eosy.total - notProf - lowProf);
    return [
      { id: 'r-e-not', label: 'Not Proficient', subLabel: 'Scores 0–10', value: notProf, color: '#f43f5e' },
      { id: 'r-e-low', label: 'Low Proficient', subLabel: 'Scores 11–15', value: lowProf, color: '#f59e0b' },
      { id: 'r-e-prf', label: 'Proficient / Near', subLabel: 'Scores 16–20', value: prof, color: '#10b981' }
    ];
  }, [currentRmaData]);

  // Phil-IRI Segments (BOSY and EOSY)
  const philIriBosySegments: ChartSegment[] = useMemo(() => {
    if (!currentPhilIriData) return [];
    const b = currentPhilIriData.bosyTotals;
    return [
      { id: 'p-b-grd', label: 'At Grade Level', subLabel: 'GST Score 14–20', value: b.atGrade, color: '#10b981' },
      { id: 'p-b-two', label: '2-Level Down', subLabel: 'GST Score 8–13', value: b.twoLvl, color: '#f59e0b' },
      { id: 'p-b-thr', label: '3-Level Down', subLabel: 'GST Score 0–7', value: b.threeLvl, color: '#f43f5e' }
    ];
  }, [currentPhilIriData]);

  const philIriEosySegments: ChartSegment[] = useMemo(() => {
    if (!currentPhilIriData) return [];
    const e = currentPhilIriData.eosyTotals;
    return [
      { id: 'p-e-grd', label: 'At Grade Level', subLabel: 'GST Score 14–20', value: e.atGrade, color: '#10b981' },
      { id: 'p-e-two', label: '2-Level Down', subLabel: 'GST Score 8–13', value: e.twoLvl, color: '#f59e0b' },
      { id: 'p-e-thr', label: '3-Level Down', subLabel: 'GST Score 0–7', value: e.threeLvl, color: '#f43f5e' }
    ];
  }, [currentPhilIriData]);

  // Overview Assessment Volume Segments
  const overviewVolumeSegments: ChartSegment[] = useMemo(() => {
    const crlaCount = crlaData?.eosy.total || 0;
    const rmaCount = currentRmaData?.eosy.total || 0;
    const philIriCount = currentPhilIriData?.eosyTotals.assessed || 0;
    return [
      { id: 'o-crla', label: 'CRLA Literacy', subLabel: 'Grades 1–3 Assessed', value: crlaCount, color: '#3b82f6' },
      { id: 'o-rma', label: 'RMA Numeracy', subLabel: 'Grades 1–3 Tracked', value: rmaCount, color: '#f59e0b' },
      { id: 'o-pili', label: 'Phil-IRI Reading', subLabel: 'Grades 4–6 Assessed', value: philIriCount, color: '#10b981' }
    ];
  }, [crlaData, currentRmaData, currentPhilIriData]);

  if (!currentSchool) return null;

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Directory & School Selector Bar */}
      <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block">
            Official School Inspection & Multi-Domain Analytics
          </span>
          <h2 className="text-lg font-bold text-white font-sans mt-0.5 flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-sky-400" />
            <span>{currentSchool.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 font-mono font-normal">
              DepEd ID: {currentSchool.schoolId}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Barangay: <span className="text-slate-200">{currentSchool.barangay}</span> · District Order: #{currentSchool.order}
          </p>
        </div>

        {/* Action Buttons: Edit School Data, Open Station & Export Word */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditorDomain(activeDomain === 'overview' ? 'crla' : activeDomain);
              setShowPasswordModal(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-2 shadow-md transition-all cursor-pointer border border-emerald-400"
            title="Password protected editing station"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit School Data</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStation(currentSchool)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded flex items-center gap-2 shadow-md transition-all cursor-pointer border border-sky-400"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open School Station</span>
          </button>

          <button
            type="button"
            onClick={() => onExportWord(currentSchool)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <FileDown className="w-3.5 h-3.5 text-sky-400" />
            <span>Download School Word (.doc)</span>
          </button>

          {hasCustomEdits && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all assessment numbers back to official DepEd Toboso baseline?')) {
                  resetAllToBaseline();
                }
              }}
              className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 rounded flex items-center gap-1.5 cursor-pointer"
              title="Revert back to verified baseline numbers"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Baseline</span>
            </button>
          )}
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-950 border border-slate-800 rounded">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveDomain('overview')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
              activeDomain === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Combined Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveDomain('crla')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDomain === 'crla'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span>CRLA Literacy (G1–3)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDomain('rma')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDomain === 'rma'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>RMA Numeracy (G1–3)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDomain('philiri')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDomain === 'philiri'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Phil-IRI Reading (G4–6)</span>
          </button>
        </div>

        {/* Phil-IRI language switcher when in philiri domain */}
        {activeDomain === 'philiri' && (
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              type="button"
              onClick={() => setPhilIriLang('english')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                philIriLang === 'english' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setPhilIriLang('filipino')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                philIriLang === 'filipino' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Filipino
            </button>
          </div>
        )}
      </div>

      {/* Multi-Domain Interactive Graphs Content */}
      <div className="space-y-6">
        
        {/* DOMAIN 1: COMBINED OVERVIEW */}
        {activeDomain === 'overview' && (
          <div className="space-y-6">
            
            {/* 3 Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* CRLA Summary Card */}
              <div className="p-4 bg-[#08101e] border border-blue-900/40 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="uppercase font-bold text-sky-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> CRLA Literacy
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Grades 1–3
                  </span>
                </div>
                {crlaData && (
                  <div>
                    <div className="text-xl font-black text-white">
                      {crlaData.eosy.total} Assessed
                    </div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-emerald-400">
                        <span>Grade Ready Rate:</span>
                        <span className="font-bold">{crlaData.eosyAtGradePct.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Full Intervention (Emerging):</span>
                        <span className="font-bold">{crlaData.eosy.emerging} learners</span>
                      </div>
                      <div className="flex justify-between text-sky-300 pt-1 border-t border-slate-800 text-[10px]">
                        <span>Full Intervention Reduction:</span>
                        <span className="font-bold">
                          {crlaData.emergingReduction > 0 ? `-${crlaData.emergingReduction}` : `+${Math.abs(crlaData.emergingReduction)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RMA Summary Card */}
              <div className="p-4 bg-[#08101e] border border-amber-900/40 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" /> RMA Numeracy
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Grades 1–3
                  </span>
                </div>
                {currentRmaData && (
                  <div>
                    <div className="text-xl font-black text-white">
                      {currentRmaData.eosy.total} Learners Tracked
                    </div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-rose-400">
                        <span>Not Proficient (BOSY):</span>
                        <span className="font-bold">{currentRmaData.bosy.notProficient}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Not Proficient (EOSY):</span>
                        <span className="font-bold">{currentRmaData.eosy.notProficient}</span>
                      </div>
                      <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800 text-[10px]">
                        <span>Struggling Learners Reduction:</span>
                        <span className="font-bold">
                          -{currentRmaData.bosy.notProficient - currentRmaData.eosy.notProficient}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phil-IRI Summary Card */}
              <div className="p-4 bg-[#08101e] border border-emerald-900/40 rounded-lg">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <BookOpenCheck className="w-4 h-4" /> Phil-IRI Reading
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Grades 4–6 ({philIriLang.toUpperCase()})
                  </span>
                </div>
                {currentPhilIriData && (
                  <div>
                    <div className="text-xl font-black text-white">
                      {currentPhilIriData.eosyTotals.assessed} Assessed
                    </div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-emerald-400">
                        <span>At Grade Level:</span>
                        <span className="font-bold">
                          {currentPhilIriData.eosyTotals.atGrade} ({currentPhilIriData.eosyTotals.atGradePct.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Frustration Readers:</span>
                        <span className="font-bold">{currentPhilIriData.eosyTotals.frustration}</span>
                      </div>
                      <div className="flex justify-between text-emerald-300 pt-1 border-t border-slate-800 text-[10px]">
                        <span>At-Grade-Level Net Gain:</span>
                        <span className="font-bold">
                          {currentPhilIriData.atGradeGain >= 0 ? `+${currentPhilIriData.atGradeGain}` : `${currentPhilIriData.atGradeGain}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Assessment Volume Donut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieDonutChart
                title="Assessed Learners by Program"
                subtitle={`Total learner enrollment tracked across assessments at ${currentSchool.name}`}
                data={overviewVolumeSegments}
                centerLabel="Total Assessed"
                centerValue={overviewVolumeSegments.reduce((s, c) => s + c.value, 0)}
                centerSubtext="3 DepEd Assessments"
              />
              <div className="p-4 bg-[#08101e] border border-slate-800 rounded-lg flex flex-col justify-between">
                <div className="border-b border-slate-800 pb-2.5 mb-3">
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Assessment Performance Summary
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    District benchmark metrics for {currentSchool.name}
                  </p>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-sky-400 font-bold block text-[11px]">CRLA Grade Ready Rate</span>
                      <span className="text-[10px] text-slate-400">Post-test literacy mastery</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400">
                      {crlaData?.eosyAtGradePct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-bold block text-[11px]">RMA Proficient Ratio</span>
                      <span className="text-[10px] text-slate-400">
                        Scores 11–20 developing/transitioning
                      </span>
                    </div>
                    <span className="text-sm font-black text-emerald-400">
                      {currentRmaData && currentRmaData.eosy.total > 0
                        ? (((currentRmaData.eosy.total - currentRmaData.eosy.notProficient) / currentRmaData.eosy.total) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold block text-[11px]">Phil-IRI At-Grade Rate</span>
                      <span className="text-[10px] text-slate-400">Grades 4–6 GST score 14–20</span>
                    </div>
                    <span className="text-sm font-black text-emerald-400">
                      {currentPhilIriData ? currentPhilIriData.eosyTotals.atGradePct.toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Longitudinal Growth Comparison Chart */}
            <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    <span>School Cross-Domain Mastery Progression (BOSY vs EOSY)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Comparing proficiency percentages from beginning-of-school-year (BOSY) to end-of-school-year (EOSY)
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {/* CRLA Literacy Progression Bar */}
                {crlaData && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold">1. CRLA Literacy Grade Ready Rate</span>
                      <span className="text-sky-300">
                        BOSY {crlaData.bosyAtGradePct.toFixed(1)}% → <strong className="text-emerald-400">EOSY {crlaData.eosyAtGradePct.toFixed(1)}%</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-400">Pre-Test (BOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div style={{ width: `${crlaData.bosyAtGradePct}%` }} className="h-full bg-blue-600 rounded" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-emerald-400 font-bold">Post-Test (EOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div style={{ width: `${crlaData.eosyAtGradePct}%` }} className="h-full bg-emerald-500 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RMA Mathematics Reduction Bar */}
                {currentRmaData && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold">2. RMA Mathematics Not-Proficient Reduction</span>
                      <span className="text-amber-300">
                        BOSY {currentRmaData.bosy.notProficient} learners → <strong className="text-emerald-400">EOSY {currentRmaData.eosy.notProficient} learners</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-400">Pre-Test (BOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div style={{ width: `${currentRmaData.bosy.total > 0 ? (currentRmaData.bosy.notProficient / currentRmaData.bosy.total) * 100 : 0}%` }} className="h-full bg-rose-600 rounded" />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-emerald-400 font-bold">Post-Test (EOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div style={{ width: `${currentRmaData.eosy.total > 0 ? (currentRmaData.eosy.notProficient / currentRmaData.eosy.total) * 100 : 0}%` }} className="h-full bg-emerald-500 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phil-IRI Reading Progression Bar */}
                {currentPhilIriData && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-bold">3. Phil-IRI Reading At-Grade-Level Rate ({philIriLang.toUpperCase()})</span>
                      <span className="text-emerald-300">
                        BOSY {currentPhilIriData.bosyTotals.atGradePct.toFixed(1)}% → <strong className="text-emerald-400">EOSY {currentPhilIriData.eosyTotals.atGradePct.toFixed(1)}%</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-400">Pre-Test (BOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div 
                            style={{ width: `${currentPhilIriData.bosyTotals.atGradePct}%` }} 
                            className="h-full bg-teal-600 rounded" 
                          />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-emerald-400 font-bold">Post-Test (EOSY)</div>
                        <div className="h-4 w-full bg-slate-900 rounded overflow-hidden">
                          <div 
                            style={{ width: `${currentPhilIriData.eosyTotals.atGradePct}%` }} 
                            className="h-full bg-emerald-500 rounded" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* DOMAIN 2: CRLA LITERACY DEEP DIVE */}
        {activeDomain === 'crla' && crlaData && (
          <div className="space-y-6">
            <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span>CRLA 4-Tier Distribution for {currentSchool.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Detailed progression across Emerging (Full Intervention), Developing, Transitioning, and Grade Ready
                  </p>
                </div>
              </div>

              {/* CRLA Pie & Donut Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieDonutChart
                  title="CRLA Pre-Test (BOSY) 4-Tier Donut"
                  subtitle={`Baseline 4-tier literacy breakdown for ${currentSchool.name}`}
                  data={crlaBosySegments}
                  centerLabel="BOSY Assessed"
                  centerValue={crlaData.bosy.total}
                  centerSubtext={`${crlaData.bosyAtGradePct.toFixed(1)}% Grade Ready`}
                />
                <PieDonutChart
                  title="CRLA Post-Test (EOSY) 4-Tier Donut"
                  subtitle={`Post-intervention 4-tier literacy breakdown for ${currentSchool.name}`}
                  data={crlaEosySegments}
                  centerLabel="EOSY Assessed"
                  centerValue={crlaData.eosy.total}
                  centerSubtext={`${crlaData.eosyAtGradePct.toFixed(1)}% Grade Ready`}
                />
              </div>

              {/* 4-Tier Visual Stack: BOSY vs EOSY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* BOSY CRLA */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Pre-Test (BOSY) Profile</span>
                    <span className="text-slate-400">{crlaData.bosy.total} learners</span>
                  </div>
                  {crlaData.bosy.total > 0 && (
                    <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                      <div style={{ width: `${(crlaData.bosy.emerging / crlaData.bosy.total) * 100}%` }} className="bg-rose-600 flex items-center justify-center">
                        {crlaData.bosy.emerging > 0 ? `${crlaData.bosy.emerging}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.bosy.developing / crlaData.bosy.total) * 100}%` }} className="bg-amber-600 flex items-center justify-center">
                        {crlaData.bosy.developing > 0 ? `${crlaData.bosy.developing}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.bosy.transitioning / crlaData.bosy.total) * 100}%` }} className="bg-blue-600 flex items-center justify-center">
                        {crlaData.bosy.transitioning > 0 ? `${crlaData.bosy.transitioning}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.bosy.atGradeLevel / crlaData.bosy.total) * 100}%` }} className="bg-emerald-600 flex items-center justify-center">
                        {crlaData.bosy.atGradeLevel > 0 ? `${crlaData.bosy.atGradeLevel}` : ''}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">Emerging (Full):</span>
                      <strong className="text-white">{crlaData.bosy.emerging}</strong>
                    </div>
                    <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded">
                      <span className="text-emerald-400 block">Grade Ready:</span>
                      <strong className="text-white">{crlaData.bosy.atGradeLevel}</strong> ({crlaData.bosyAtGradePct.toFixed(1)}%)
                    </div>
                  </div>
                </div>

                {/* EOSY CRLA */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-400">Post-Test (EOSY) Profile</span>
                    <span className="text-slate-400">{crlaData.eosy.total} learners</span>
                  </div>
                  {crlaData.eosy.total > 0 && (
                    <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                      <div style={{ width: `${(crlaData.eosy.emerging / crlaData.eosy.total) * 100}%` }} className="bg-rose-600 flex items-center justify-center">
                        {crlaData.eosy.emerging > 0 ? `${crlaData.eosy.emerging}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.eosy.developing / crlaData.eosy.total) * 100}%` }} className="bg-amber-600 flex items-center justify-center">
                        {crlaData.eosy.developing > 0 ? `${crlaData.eosy.developing}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.eosy.transitioning / crlaData.eosy.total) * 100}%` }} className="bg-blue-600 flex items-center justify-center">
                        {crlaData.eosy.transitioning > 0 ? `${crlaData.eosy.transitioning}` : ''}
                      </div>
                      <div style={{ width: `${(crlaData.eosy.atGradeLevel / crlaData.eosy.total) * 100}%` }} className="bg-emerald-600 flex items-center justify-center">
                        {crlaData.eosy.atGradeLevel > 0 ? `${crlaData.eosy.atGradeLevel}` : ''}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">Emerging (Full):</span>
                      <strong className="text-white">{crlaData.eosy.emerging}</strong>
                    </div>
                    <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded">
                      <span className="text-emerald-400 block">Grade Ready:</span>
                      <strong className="text-white">{crlaData.eosy.atGradeLevel}</strong> ({crlaData.eosyAtGradePct.toFixed(1)}%)
                    </div>
                  </div>
                </div>

              </div>

              {/* Net Delta Badge */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Net Reading Intervention Impact:
                </span>
                <span className="text-white">
                  Emerging reduced by <strong className="text-emerald-400">{crlaData.emergingReduction}</strong> learners · Grade Ready increased by <strong className="text-emerald-400">+{crlaData.atGradeGain}</strong> learners
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 3: RMA NUMERACY DEEP DIVE */}
        {activeDomain === 'rma' && currentRmaData && (
          <div className="space-y-6">
            <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>RMA Mathematics Progression for {currentSchool.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Not Proficient vs Low Proficient baseline vs post-test reduction
                  </p>
                </div>
              </div>

              {/* RMA Pie & Donut Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieDonutChart
                  title="RMA Pre-Test (BOSY) Numeracy Donut"
                  subtitle={`Baseline numeracy proficiency for ${currentSchool.name}`}
                  data={rmaBosySegments}
                  centerLabel="BOSY Tracked"
                  centerValue={currentRmaData.bosy.total}
                  centerSubtext={`${currentRmaData.bosy.notProficient} Struggling`}
                />
                <PieDonutChart
                  title="RMA Post-Test (EOSY) Numeracy Donut"
                  subtitle={`Post-intervention numeracy proficiency for ${currentSchool.name}`}
                  data={rmaEosySegments}
                  centerLabel="EOSY Tracked"
                  centerValue={currentRmaData.eosy.total}
                  centerSubtext={`${currentRmaData.eosy.notProficient} Struggling`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* BOSY RMA */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Pre-Test (BOSY) Results</span>
                    <span className="text-slate-400">{currentRmaData.bosy.total} learners</span>
                  </div>
                  <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                    <div style={{ width: `${currentRmaData.bosy.total > 0 ? (currentRmaData.bosy.notProficient / currentRmaData.bosy.total) * 100 : 0}%` }} className="bg-rose-600 flex items-center justify-center">
                      {currentRmaData.bosy.notProficient}
                    </div>
                    <div style={{ width: `${currentRmaData.bosy.total > 0 ? (currentRmaData.bosy.lowProficient / currentRmaData.bosy.total) * 100 : 0}%` }} className="bg-amber-600 flex items-center justify-center">
                      {currentRmaData.bosy.lowProficient}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">Not Proficient:</span>
                      <strong>{currentRmaData.bosy.notProficient}</strong>
                    </div>
                    <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded">
                      <span className="text-amber-400 block">Low Proficient:</span>
                      <strong>{currentRmaData.bosy.lowProficient}</strong>
                    </div>
                  </div>
                </div>

                {/* EOSY RMA */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-400">Post-Test (EOSY) Results</span>
                    <span className="text-slate-400">{currentRmaData.eosy.total} learners</span>
                  </div>
                  <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                    <div style={{ width: `${currentRmaData.eosy.total > 0 ? (currentRmaData.eosy.notProficient / currentRmaData.eosy.total) * 100 : 0}%` }} className="bg-rose-600 flex items-center justify-center">
                      {currentRmaData.eosy.notProficient}
                    </div>
                    <div style={{ width: `${currentRmaData.eosy.total > 0 ? (currentRmaData.eosy.lowProficient / currentRmaData.eosy.total) * 100 : 0}%` }} className="bg-amber-600 flex items-center justify-center">
                      {currentRmaData.eosy.lowProficient}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">Not Proficient:</span>
                      <strong>{currentRmaData.eosy.notProficient}</strong>
                    </div>
                    <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded">
                      <span className="text-amber-400 block">Low Proficient:</span>
                      <strong>{currentRmaData.eosy.lowProficient}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* RMA Delta */}
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  Net Numeracy Shift:
                </span>
                <span className="text-white">
                  Not Proficient reduced from {currentRmaData.bosy.notProficient} to {currentRmaData.eosy.notProficient} (Reduction of <strong className="text-emerald-400">{currentRmaData.bosy.notProficient - currentRmaData.eosy.notProficient}</strong> learners)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 4: PHIL-IRI READING DEEP DIVE */}
        {activeDomain === 'philiri' && currentPhilIriData && (
          <div className="space-y-6">
            <div className="p-5 bg-[#08101e] border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <PhilIriSeal size={36} />
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Phil-IRI Reading Profile for {currentSchool.name} ({philIriLang.toUpperCase()})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Grades 4, 5, and 6 Group Screening Test (GST) & Proficiency Profiling
                    </p>
                  </div>
                </div>
              </div>

              {/* Phil-IRI Pie & Donut Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieDonutChart
                  title="Phil-IRI Pre-Test (BOSY) Reading Tiers"
                  subtitle={`Baseline reading levels for ${currentSchool.name} (${philIriLang.toUpperCase()})`}
                  data={philIriBosySegments}
                  centerLabel="BOSY Assessed"
                  centerValue={currentPhilIriData.bosyTotals.assessed}
                  centerSubtext={`${currentPhilIriData.bosyTotals.atGradePct.toFixed(1)}% At Grade`}
                />
                <PieDonutChart
                  title="Phil-IRI Post-Test (EOSY) Reading Tiers"
                  subtitle={`Post-test reading levels for ${currentSchool.name} (${philIriLang.toUpperCase()})`}
                  data={philIriEosySegments}
                  centerLabel="EOSY Assessed"
                  centerValue={currentPhilIriData.eosyTotals.assessed}
                  centerSubtext={`${currentPhilIriData.eosyTotals.atGradePct.toFixed(1)}% At Grade`}
                />
              </div>

              {/* Stacked Bars BOSY vs EOSY for Phil-IRI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* BOSY Phil-IRI */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Pre-Test (BOSY) Level Stack</span>
                    <span className="text-slate-400">{currentPhilIriData.bosyTotals.assessed} readers</span>
                  </div>
                  {currentPhilIriData.bosyTotals.assessed > 0 ? (
                    <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                      <div 
                        style={{ width: `${(currentPhilIriData.bosyTotals.atGrade / currentPhilIriData.bosyTotals.assessed) * 100}%` }} 
                        className="bg-emerald-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.bosyTotals.atGrade}
                      </div>
                      <div 
                        style={{ width: `${(currentPhilIriData.bosyTotals.twoLvl / currentPhilIriData.bosyTotals.assessed) * 100}%` }} 
                        className="bg-amber-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.bosyTotals.twoLvl}
                      </div>
                      <div 
                        style={{ width: `${(currentPhilIriData.bosyTotals.threeLvl / currentPhilIriData.bosyTotals.assessed) * 100}%` }} 
                        className="bg-rose-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.bosyTotals.threeLvl}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-slate-500 text-center">No BOSY readers encoded</div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded">
                      <span className="text-emerald-400 block">At Grade:</span>
                      <strong>{currentPhilIriData.bosyTotals.atGrade}</strong>
                    </div>
                    <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded">
                      <span className="text-amber-400 block">2-Level Down:</span>
                      <strong>{currentPhilIriData.bosyTotals.twoLvl}</strong>
                    </div>
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">3-Level Down:</span>
                      <strong>{currentPhilIriData.bosyTotals.threeLvl}</strong>
                    </div>
                  </div>
                </div>

                {/* EOSY Phil-IRI */}
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-400">Post-Test (EOSY) Level Stack</span>
                    <span className="text-slate-400">{currentPhilIriData.eosyTotals.assessed} readers</span>
                  </div>
                  {currentPhilIriData.eosyTotals.assessed > 0 ? (
                    <div className="h-5 w-full flex rounded overflow-hidden text-[9px] font-bold text-white">
                      <div 
                        style={{ width: `${(currentPhilIriData.eosyTotals.atGrade / currentPhilIriData.eosyTotals.assessed) * 100}%` }} 
                        className="bg-emerald-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.eosyTotals.atGrade}
                      </div>
                      <div 
                        style={{ width: `${(currentPhilIriData.eosyTotals.twoLvl / currentPhilIriData.eosyTotals.assessed) * 100}%` }} 
                        className="bg-amber-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.eosyTotals.twoLvl}
                      </div>
                      <div 
                        style={{ width: `${(currentPhilIriData.eosyTotals.threeLvl / currentPhilIriData.eosyTotals.assessed) * 100}%` }} 
                        className="bg-rose-600 flex items-center justify-center"
                      >
                        {currentPhilIriData.eosyTotals.threeLvl}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-slate-500 text-center">No EOSY readers encoded</div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded">
                      <span className="text-emerald-400 block">At Grade:</span>
                      <strong>{currentPhilIriData.eosyTotals.atGrade}</strong>
                    </div>
                    <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded">
                      <span className="text-amber-400 block">2-Level Down:</span>
                      <strong>{currentPhilIriData.eosyTotals.twoLvl}</strong>
                    </div>
                    <div className="p-2 bg-rose-950/40 border border-rose-800/40 rounded">
                      <span className="text-rose-400 block">3-Level Down:</span>
                      <strong>{currentPhilIriData.eosyTotals.threeLvl}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Phil-IRI Delta */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Reading Mobility Impact:
                </span>
                <span className="text-white">
                  At-Grade-Level readers gained: <strong className="text-emerald-400">+{currentPhilIriData.atGradeGain}</strong> · Frustration readers reduced by: <strong className="text-emerald-400">{currentPhilIriData.frustrationReduction}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Quick Switcher Directory of All 21 Schools */}
      <div className="bg-[#08101e] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
              School Quick Switcher
            </span>
            <span className="text-xs text-white">Click any school to inspect its interactive graphs & stats immediately</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredSchoolsList.map(s => {
            const isSelected = s.schoolId === currentSchool.schoolId;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSchoolId(s.schoolId)}
                className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-950/70 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                    : 'bg-[#0b1426] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-500 block">#{s.order} · {s.schoolId}</span>
                  <span className={`text-xs font-bold block ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                    {s.officialName}
                  </span>
                  <span className="text-[10px] text-slate-400">{s.barangay}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isSelected && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500 text-white font-bold">
                      ACTIVE
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStation(s);
                    }}
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-sky-400 cursor-pointer"
                    title="Open Security Station"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Password Gate for Editing */}
      {showPasswordModal && (
        <SchoolPasswordModal
          school={currentSchool}
          onAuthenticated={() => {
            setShowPasswordModal(false);
            setShowEditorModal(true);
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {/* Interactive Data Editor Modal */}
      {showEditorModal && (
        <SchoolDataEditorModal
          schoolId={currentSchool.schoolId}
          schoolName={currentSchool.name}
          initialDomain={editorDomain}
          onClose={() => setShowEditorModal(false)}
        />
      )}

    </div>
  );
};
