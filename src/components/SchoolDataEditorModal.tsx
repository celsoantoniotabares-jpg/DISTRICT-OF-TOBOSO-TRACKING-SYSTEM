import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Save, RotateCcw, 
  ShieldCheck, Calculator, BookOpen, BookOpenCheck, Edit3 
} from 'lucide-react';
import { SchoolRecord, CRLASubjectData } from '../types';
import { RMASchoolRecord } from '../data/rmaData';
import { PhilIriSchoolRow } from '../data/philIriData';
import { useAssessmentData } from '../context/AssessmentDataContext';
import { PhilIriSeal } from './PhilIriSeal';

interface SchoolDataEditorModalProps {
  schoolId: string;
  schoolName: string;
  onClose: () => void;
  initialDomain?: 'crla' | 'rma' | 'philiri';
}

export const SchoolDataEditorModal: React.FC<SchoolDataEditorModalProps> = ({
  schoolId,
  schoolName,
  onClose,
  initialDomain = 'crla'
}) => {
  const { 
    schools, 
    updateSchoolCRLA, 
    rmaData, 
    updateSchoolRMA, 
    philIriData, 
    updateSchoolPhilIriRow 
  } = useAssessmentData();

  const [activeTab, setActiveTab] = useState<'crla' | 'rma' | 'philiri'>(initialDomain);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // CRLA state
  const crlaRecord = schools.find(s => s.schoolId === schoolId);
  const [crlaPeriod, setCrlaPeriod] = useState<'bosy' | 'eosy'>('eosy');
  const [crlaGrade, setCrlaGrade] = useState<'grade1' | 'grade2' | 'grade3'>('grade1');
  const [crlaSubject, setCrlaSubject] = useState<'mtb' | 'filipino' | 'english'>('mtb');

  // RMA state
  const rmaRecord = rmaData.find(r => r.schoolId === schoolId);
  const [rmaDraft, setRmaDraft] = useState<RMASchoolRecord | null>(() => {
    return rmaRecord ? JSON.parse(JSON.stringify(rmaRecord)) : null;
  });

  // Phil-IRI state
  const [philIriPeriod, setPhilIriPeriod] = useState<'bosy' | 'eosy'>('eosy');
  const [philIriLang, setPhilIriLang] = useState<'english' | 'filipino'>('english');
  const [philIriGrade, setPhilIriGrade] = useState<'grade4' | 'grade5' | 'grade6'>('grade4');

  const philIriCurrentRow = philIriData[philIriPeriod][philIriLang][philIriGrade].find(r => r.schoolId === schoolId);
  const [philIriDraft, setPhilIriDraft] = useState<PhilIriSchoolRow | null>(() => {
    return philIriCurrentRow ? JSON.parse(JSON.stringify(philIriCurrentRow)) : null;
  });

  // Keep draft in sync when Phil-IRI filters change
  const handlePhilIriFilterChange = (
    nextPeriod: 'bosy' | 'eosy',
    nextLang: 'english' | 'filipino',
    nextGrade: 'grade4' | 'grade5' | 'grade6'
  ) => {
    setPhilIriPeriod(nextPeriod);
    setPhilIriLang(nextLang);
    setPhilIriGrade(nextGrade);
    const row = philIriData[nextPeriod][nextLang][nextGrade].find(r => r.schoolId === schoolId);
    if (row) {
      setPhilIriDraft(JSON.parse(JSON.stringify(row)));
    }
  };

  // Draft copy of CRLA for editing
  const [crlaDraft, setCrlaDraft] = useState<SchoolRecord | null>(() => {
    return crlaRecord ? JSON.parse(JSON.stringify(crlaRecord)) : null;
  });

  // Helper to get active CRLA subject data from draft
  const getActiveCrlaSubject = (): CRLASubjectData | null => {
    if (!crlaDraft) return null;
    const targetPeriod = crlaPeriod === 'eosy' && crlaDraft.eosy ? crlaDraft.eosy : crlaDraft.bosy;
    if (!targetPeriod) return null;

    if (crlaGrade === 'grade1') return targetPeriod.grade1.mtb;
    if (crlaGrade === 'grade2') {
      return crlaSubject === 'filipino' ? targetPeriod.grade2.filipino : targetPeriod.grade2.mtb;
    }
    if (crlaGrade === 'grade3') {
      if (crlaSubject === 'filipino') return targetPeriod.grade3.filipino;
      if (crlaSubject === 'english') return targetPeriod.grade3.english;
      return targetPeriod.grade3.mtb;
    }
    return null;
  };

  const updateActiveCrlaSubjectField = (
    field: 'enrolment' | 'assessed' | 'emerging' | 'developing' | 'transitioning' | 'atGradeLevel',
    subField: 'm' | 'f',
    val: number
  ) => {
    if (!crlaDraft) return;
    const next = JSON.parse(JSON.stringify(crlaDraft)) as SchoolRecord;
    const targetPeriod = crlaPeriod === 'eosy' && next.eosy ? next.eosy : next.bosy;
    if (!targetPeriod) return;

    let targetSubject: CRLASubjectData | null = null;
    if (crlaGrade === 'grade1') targetSubject = targetPeriod.grade1.mtb;
    else if (crlaGrade === 'grade2') {
      targetSubject = crlaSubject === 'filipino' ? targetPeriod.grade2.filipino : targetPeriod.grade2.mtb;
    } else if (crlaGrade === 'grade3') {
      if (crlaSubject === 'filipino') targetSubject = targetPeriod.grade3.filipino;
      else if (crlaSubject === 'english') targetSubject = targetPeriod.grade3.english;
      else targetSubject = targetPeriod.grade3.mtb;
    }

    if (targetSubject) {
      targetSubject[field][subField] = Math.max(0, val);
      targetSubject[field].total = targetSubject[field].m + targetSubject[field].f;
      setCrlaDraft(next);
    }
  };

  // Save Handlers
  const handleSaveCRLA = () => {
    if (crlaDraft) {
      updateSchoolCRLA(schoolId, crlaDraft);
      setSaveSuccessMsg('CRLA Literacy numbers saved and recalculated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSaveRMA = () => {
    if (rmaDraft) {
      updateSchoolRMA(schoolId, rmaDraft);
      setSaveSuccessMsg('RMA Numeracy numbers saved and recalculated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleSavePhilIri = () => {
    if (philIriDraft) {
      // Recalculate totals inside draft
      const d = JSON.parse(JSON.stringify(philIriDraft)) as PhilIriSchoolRow;
      d.twoLevelDown.total.m = d.twoLevelDown.independent.m + d.twoLevelDown.instructional.m + d.twoLevelDown.frustration.m;
      d.twoLevelDown.total.f = d.twoLevelDown.independent.f + d.twoLevelDown.instructional.f + d.twoLevelDown.frustration.f;
      d.twoLevelDown.total.t = d.twoLevelDown.total.m + d.twoLevelDown.total.f;

      d.threeLevelDown.total.m = d.threeLevelDown.independent.m + d.threeLevelDown.instructional.m + d.threeLevelDown.frustration.m;
      d.threeLevelDown.total.f = d.threeLevelDown.independent.f + d.threeLevelDown.instructional.f + d.threeLevelDown.frustration.f;
      d.threeLevelDown.total.t = d.threeLevelDown.total.m + d.threeLevelDown.total.f;

      d.totalAssessed = d.atGradeLevel + d.twoLevelDown.total.t + d.threeLevelDown.total.t;

      updateSchoolPhilIriRow(philIriPeriod, philIriLang, philIriGrade, schoolId, d);
      setPhilIriDraft(d);
      setSaveSuccessMsg('Phil-IRI Reading numbers saved and recalculated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b1426] border border-slate-700 shadow-2xl font-mono text-xs my-auto max-h-[94vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-[#08101e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase text-sm tracking-wide">
                  Edit Assessment Data: {schoolName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px]">
                  ID: {schoolId}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Authorized Personnel Edit Station · Real-time auto-recalculation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assessment Domain Navigation Tabs */}
        <div className="flex items-center justify-between p-2 bg-[#060b14] border-b border-slate-800 gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('crla')}
              className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all cursor-pointer font-bold ${
                activeTab === 'crla' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. CRLA Literacy (G1–3)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rma')}
              className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all cursor-pointer font-bold ${
                activeTab === 'rma' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>2. RMA Numeracy (G1–3)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('philiri')}
              className={`px-3 py-1.5 rounded flex items-center gap-2 transition-all cursor-pointer font-bold ${
                activeTab === 'philiri' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>3. Phil-IRI Reading (G4–6)</span>
            </button>
          </div>

          {saveSuccessMsg && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 text-[11px] animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* ========================================================= */}
          {/* DOMAIN 1: CRLA LITERACY EDITOR */}
          {/* ========================================================= */}
          {activeTab === 'crla' && crlaDraft && (
            <div className="space-y-4">
              {/* Period & Grade Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 uppercase mr-1">Period:</span>
                  <button
                    type="button"
                    onClick={() => setCrlaPeriod('bosy')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      crlaPeriod === 'bosy' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BOSY Baseline
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrlaPeriod('eosy')}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      crlaPeriod === 'eosy' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EOSY Post-Test
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 uppercase mr-1">Grade:</span>
                  <button
                    type="button"
                    onClick={() => { setCrlaGrade('grade1'); setCrlaSubject('mtb'); }}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      crlaGrade === 'grade1' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 1
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCrlaGrade('grade2'); setCrlaSubject('mtb'); }}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      crlaGrade === 'grade2' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 2
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCrlaGrade('grade3'); setCrlaSubject('mtb'); }}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      crlaGrade === 'grade3' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 3
                  </button>
                </div>

                {crlaGrade !== 'grade1' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 uppercase mr-1">Subject:</span>
                    <button
                      type="button"
                      onClick={() => setCrlaSubject('mtb')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        crlaSubject === 'mtb' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      MTB
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrlaSubject('filipino')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        crlaSubject === 'filipino' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Filipino
                    </button>
                    {crlaGrade === 'grade3' && (
                      <button
                        type="button"
                        onClick={() => setCrlaSubject('english')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          crlaSubject === 'english' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        English
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Editable Fields Table */}
              {(() => {
                const sub = getActiveCrlaSubject();
                if (!sub) return <div className="text-slate-400">No subject data found.</div>;

                const fields: Array<{ key: 'emerging' | 'developing' | 'transitioning' | 'atGradeLevel'; label: string; desc: string; color: string }> = [
                  { key: 'emerging', label: 'Emerging', desc: 'Full Intervention Non-Reader', color: 'text-rose-400' },
                  { key: 'developing', label: 'Developing', desc: 'Moderate Refresher Support', color: 'text-amber-400' },
                  { key: 'transitioning', label: 'Transitioning', desc: 'Light Refresher Support', color: 'text-sky-400' },
                  { key: 'atGradeLevel', label: 'Grade Ready', desc: 'Target Proficiency Met', color: 'text-emerald-400' }
                ];

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-slate-900/40 rounded border border-slate-800">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Total Enrolment (Male / Female)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={sub.enrolment.m}
                            onChange={(e) => updateActiveCrlaSubjectField('enrolment', 'm', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                          />
                          <input
                            type="number"
                            min="0"
                            value={sub.enrolment.f}
                            onChange={(e) => updateActiveCrlaSubjectField('enrolment', 'f', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                          />
                          <span className="text-slate-400 text-xs">= Total: <strong className="text-white">{sub.enrolment.total}</strong></span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Total Assessed (Male / Female)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={sub.assessed.m}
                            onChange={(e) => updateActiveCrlaSubjectField('assessed', 'm', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                          />
                          <input
                            type="number"
                            min="0"
                            value={sub.assessed.f}
                            onChange={(e) => updateActiveCrlaSubjectField('assessed', 'f', parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                          />
                          <span className="text-slate-400 text-xs">= Total: <strong className="text-white">{sub.assessed.total}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-800 rounded overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-[#060b14] text-slate-400 border-b border-slate-800 text-[11px]">
                          <tr>
                            <th className="p-2.5">Proficiency Category</th>
                            <th className="p-2.5 w-28">Male (M)</th>
                            <th className="p-2.5 w-28">Female (F)</th>
                            <th className="p-2.5 w-24">Total</th>
                            <th className="p-2.5 w-24">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-[#08101e]">
                          {fields.map(f => {
                            const mVal = sub[f.key].m;
                            const fVal = sub[f.key].f;
                            const tVal = sub[f.key].total;
                            const pct = sub.assessed.total > 0 ? ((tVal / sub.assessed.total) * 100).toFixed(1) : '0.0';

                            return (
                              <tr key={f.key} className="hover:bg-slate-900/50">
                                <td className="p-2.5">
                                  <span className={`font-bold block ${f.color}`}>{f.label}</span>
                                  <span className="text-[10px] text-slate-500">{f.desc}</span>
                                </td>
                                <td className="p-2.5">
                                  <input
                                    type="number"
                                    min="0"
                                    value={mVal}
                                    onChange={(e) => updateActiveCrlaSubjectField(f.key, 'm', parseInt(e.target.value) || 0)}
                                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                                  />
                                </td>
                                <td className="p-2.5">
                                  <input
                                    type="number"
                                    min="0"
                                    value={fVal}
                                    onChange={(e) => updateActiveCrlaSubjectField(f.key, 'f', parseInt(e.target.value) || 0)}
                                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                                  />
                                </td>
                                <td className="p-2.5 font-bold text-white">
                                  {tVal}
                                </td>
                                <td className="p-2.5 font-bold text-slate-300">
                                  {pct}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSaveCRLA}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-2 shadow-md cursor-pointer transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Recalculate CRLA</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ========================================================= */}
          {/* DOMAIN 2: RMA NUMERACY EDITOR */}
          {/* ========================================================= */}
          {activeTab === 'rma' && rmaDraft && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-xs text-amber-400 font-bold block">
                  Rapid Mathematics Assessment (RMA) Numbers for Grades 1–3
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update baseline (BOSY) and post-test (EOSY) non-proficient and low-proficient counts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BOSY RMA Editor */}
                <div className="p-4 bg-[#08101e] border border-slate-800 rounded space-y-3">
                  <div className="font-bold text-slate-200 border-b border-slate-800 pb-2">
                    Pre-Test (BOSY) Baseline Numeracy
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Total Learners Tracked</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.bosy.total}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          bosy: { ...rmaDraft.bosy, total: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-rose-400 block mb-1">Not Proficient (Scores 0–10)</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.bosy.notProficient}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          bosy: { ...rmaDraft.bosy, notProficient: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-amber-400 block mb-1">Low Proficient (Scores 11–15)</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.bosy.lowProficient}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          bosy: { ...rmaDraft.bosy, lowProficient: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* EOSY RMA Editor */}
                <div className="p-4 bg-[#08101e] border border-slate-800 rounded space-y-3">
                  <div className="font-bold text-emerald-400 border-b border-slate-800 pb-2">
                    Post-Test (EOSY) Numeracy
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Total Learners Tracked</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.eosy.total}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          eosy: { ...rmaDraft.eosy, total: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-rose-400 block mb-1">Not Proficient (Scores 0–10)</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.eosy.notProficient}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          eosy: { ...rmaDraft.eosy, notProficient: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-amber-400 block mb-1">Low Proficient (Scores 11–15)</label>
                      <input
                        type="number"
                        min="0"
                        value={rmaDraft.eosy.lowProficient}
                        onChange={(e) => setRmaDraft({
                          ...rmaDraft,
                          eosy: { ...rmaDraft.eosy, lowProficient: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveRMA}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Recalculate RMA</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* DOMAIN 3: PHIL-IRI READING EDITOR */}
          {/* ========================================================= */}
          {activeTab === 'philiri' && philIriDraft && (
            <div className="space-y-4">
              {/* Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 uppercase mr-1">Period:</span>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange('bosy', philIriLang, philIriGrade)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      philIriPeriod === 'bosy' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BOSY Baseline
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange('eosy', philIriLang, philIriGrade)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      philIriPeriod === 'eosy' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EOSY Post-Test
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 uppercase mr-1">Language:</span>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange(philIriPeriod, 'english', philIriGrade)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      philIriLang === 'english' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange(philIriPeriod, 'filipino', philIriGrade)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      philIriLang === 'filipino' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Filipino
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 uppercase mr-1">Grade:</span>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange(philIriPeriod, philIriLang, 'grade4')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      philIriGrade === 'grade4' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 4
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange(philIriPeriod, philIriLang, 'grade5')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      philIriGrade === 'grade5' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 5
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhilIriFilterChange(philIriPeriod, philIriLang, 'grade6')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      philIriGrade === 'grade6' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Grade 6
                  </button>
                </div>
              </div>

              {/* At Grade Level */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold block text-xs">
                    At Grade Level (GST Score 14 to 20)
                  </span>
                  <span className="text-[11px] text-slate-400">Readers who mastered grade-level competency</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={philIriDraft.atGradeLevel}
                    onChange={(e) => setPhilIriDraft({
                      ...philIriDraft,
                      atGradeLevel: parseInt(e.target.value) || 0
                    })}
                    className="w-24 px-2.5 py-1 bg-slate-950 border border-emerald-500/50 text-white rounded font-bold text-right"
                  />
                  <span className="text-slate-400 text-xs">learners</span>
                </div>
              </div>

              {/* 2-Level Down Table */}
              <div className="border border-slate-800 rounded overflow-hidden">
                <div className="p-2.5 bg-amber-950/30 border-b border-slate-800 text-amber-300 font-bold flex justify-between">
                  <span>2-Level Down (GST Score 8 to 13)</span>
                  <span className="text-slate-400 text-[10px]">Moderate Reading Support</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#060b14] text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">Reading Profile</th>
                      <th className="p-2.5 w-28">Male (M)</th>
                      <th className="p-2.5 w-28">Female (F)</th>
                      <th className="p-2.5 w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#08101e]">
                    <tr>
                      <td className="p-2.5 font-bold text-sky-400">Independent</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.independent.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              independent: {
                                ...philIriDraft.twoLevelDown.independent,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.twoLevelDown.independent.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.independent.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              independent: {
                                ...philIriDraft.twoLevelDown.independent,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.twoLevelDown.independent.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.twoLevelDown.independent.m + philIriDraft.twoLevelDown.independent.f}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Instructional</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.instructional.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              instructional: {
                                ...philIriDraft.twoLevelDown.instructional,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.twoLevelDown.instructional.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.instructional.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              instructional: {
                                ...philIriDraft.twoLevelDown.instructional,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.twoLevelDown.instructional.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.twoLevelDown.instructional.m + philIriDraft.twoLevelDown.instructional.f}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-bold text-rose-400">Frustration</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.frustration.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              frustration: {
                                ...philIriDraft.twoLevelDown.frustration,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.twoLevelDown.frustration.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.twoLevelDown.frustration.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            twoLevelDown: {
                              ...philIriDraft.twoLevelDown,
                              frustration: {
                                ...philIriDraft.twoLevelDown.frustration,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.twoLevelDown.frustration.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.twoLevelDown.frustration.m + philIriDraft.twoLevelDown.frustration.f}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3-Level Down Table */}
              <div className="border border-slate-800 rounded overflow-hidden">
                <div className="p-2.5 bg-rose-950/30 border-b border-slate-800 text-rose-300 font-bold flex justify-between">
                  <span>3-Level Down (GST Score 0 to 7)</span>
                  <span className="text-slate-400 text-[10px]">High Remediation Priority</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#060b14] text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">Reading Profile</th>
                      <th className="p-2.5 w-28">Male (M)</th>
                      <th className="p-2.5 w-28">Female (F)</th>
                      <th className="p-2.5 w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#08101e]">
                    <tr>
                      <td className="p-2.5 font-bold text-sky-400">Independent</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.independent.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              independent: {
                                ...philIriDraft.threeLevelDown.independent,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.threeLevelDown.independent.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.independent.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              independent: {
                                ...philIriDraft.threeLevelDown.independent,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.threeLevelDown.independent.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.threeLevelDown.independent.m + philIriDraft.threeLevelDown.independent.f}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Instructional</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.instructional.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              instructional: {
                                ...philIriDraft.threeLevelDown.instructional,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.threeLevelDown.instructional.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.instructional.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              instructional: {
                                ...philIriDraft.threeLevelDown.instructional,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.threeLevelDown.instructional.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.threeLevelDown.instructional.m + philIriDraft.threeLevelDown.instructional.f}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-2.5 font-bold text-rose-400">Frustration</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.frustration.m}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              frustration: {
                                ...philIriDraft.threeLevelDown.frustration,
                                m: parseInt(e.target.value) || 0,
                                t: (parseInt(e.target.value) || 0) + philIriDraft.threeLevelDown.frustration.f
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={philIriDraft.threeLevelDown.frustration.f}
                          onChange={(e) => setPhilIriDraft({
                            ...philIriDraft,
                            threeLevelDown: {
                              ...philIriDraft.threeLevelDown,
                              frustration: {
                                ...philIriDraft.threeLevelDown.frustration,
                                f: parseInt(e.target.value) || 0,
                                t: philIriDraft.threeLevelDown.frustration.m + (parseInt(e.target.value) || 0)
                              }
                            }
                          })}
                          className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 text-white rounded font-bold"
                        />
                      </td>
                      <td className="p-2.5 font-bold text-white">
                        {philIriDraft.threeLevelDown.frustration.m + philIriDraft.threeLevelDown.frustration.f}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePhilIri}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Recalculate Phil-IRI</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#08101e] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Station Password Authenticated · DepEd Toboso</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
