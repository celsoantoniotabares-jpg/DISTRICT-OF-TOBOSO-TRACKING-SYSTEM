import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, TrendingUp, ShieldCheck, BookOpen, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { SchoolRecord, CRLASubjectData, AssessmentPeriod } from '../types';
import { exportIndividualSchoolWord, exportIndividualAnalyticsWord } from '../utils/wordExport';

interface SchoolEncodingModalProps {
  school: SchoolRecord;
  onClose: () => void;
  onToggleStatus: (schoolId: string) => void;
}

export const SchoolEncodingModal: React.FC<SchoolEncodingModalProps> = ({
  school,
  onClose,
}) => {
  const [period, setPeriod] = useState<AssessmentPeriod>('eosy');
  const [activeGradeTab, setActiveGradeTab] = useState<'grade1' | 'grade2' | 'grade3' | 'progress'>('grade1');
  const [selectedSubTabG2, setSelectedSubTabG2] = useState<'mtb' | 'filipino'>('mtb');
  const [selectedSubTabG3, setSelectedSubTabG3] = useState<'mtb' | 'filipino' | 'english'>('mtb');

  const activePeriodData = period === 'eosy' && school.eosy ? school.eosy : school.bosy;
  const isEosy = period === 'eosy';

  const renderSubjectCard = (subjectTitle: string, data: CRLASubjectData, isPostTest: boolean = false) => {
    const assessed = data.assessed.total;
    const lowEm = data.lowEmerging?.total ?? 0;
    const highEm = data.highEmerging?.total ?? 0;
    const emergingTotal = data.emerging.total;

    const emergingPct = assessed > 0 ? ((emergingTotal / assessed) * 100).toFixed(1) : '0.0';
    const devPct = assessed > 0 ? ((data.developing.total / assessed) * 100).toFixed(1) : '0.0';
    const transPct = assessed > 0 ? ((data.transitioning.total / assessed) * 100).toFixed(1) : '0.0';
    const atGradePct = assessed > 0 ? ((data.atGradeLevel.total / assessed) * 100).toFixed(1) : '0.0';

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#08101e] border border-slate-800">
          <div>
            <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider">
              {subjectTitle} · {isPostTest ? 'E.O.S.Y. Post-Test' : 'B.O.S.Y. Baseline'} Assessment
            </span>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              Enrolment: <strong className="text-white">{data.enrolment.total}</strong> (M: {data.enrolment.m}, F: {data.enrolment.f}) · Assessed: <strong className="text-white">{data.assessed.total}</strong> (M: {data.assessed.m}, F: {data.assessed.f})
            </div>
          </div>
          <div className="font-mono text-xs text-right">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">
              Coverage: {assessed > 0 && data.enrolment.total > 0 ? ((assessed / data.enrolment.total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        {/* Performance Level Cards */}
        {isPostTest && data.lowEmerging ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            {/* Low Emerging */}
            <div className="p-3 bg-red-950/30 border border-red-500/40">
              <div className="text-[10px] text-red-400 uppercase font-semibold">1. Low Emerging</div>
              <div className="text-xl font-bold text-red-200 mt-1">{lowEm}</div>
              <div className="text-[10px] text-red-300/80 mt-0.5">
                {assessed > 0 ? ((lowEm / assessed) * 100).toFixed(1) : 0}% (M: {data.lowEmerging?.m}, F: {data.lowEmerging?.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Full Refresher</span>
            </div>

            {/* High Emerging */}
            <div className="p-3 bg-rose-950/30 border border-rose-500/40">
              <div className="text-[10px] text-rose-400 uppercase font-semibold">2. High Emerging</div>
              <div className="text-xl font-bold text-rose-200 mt-1">{highEm}</div>
              <div className="text-[10px] text-rose-300/80 mt-0.5">
                {assessed > 0 ? ((highEm / assessed) * 100).toFixed(1) : 0}% (M: {data.highEmerging?.m}, F: {data.highEmerging?.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Full Refresher</span>
            </div>

            {/* Developing */}
            <div className="p-3 bg-amber-950/20 border border-amber-500/30">
              <div className="text-[10px] text-amber-400 uppercase font-semibold">3. Developing</div>
              <div className="text-xl font-bold text-amber-200 mt-1">{data.developing.total}</div>
              <div className="text-[10px] text-amber-300/80 mt-0.5">
                {devPct}% (M: {data.developing.m}, F: {data.developing.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Moderate Refresher</span>
            </div>

            {/* Transitioning */}
            <div className="p-3 bg-blue-950/20 border border-blue-500/30">
              <div className="text-[10px] text-sky-400 uppercase font-semibold">4. Transitioning</div>
              <div className="text-xl font-bold text-sky-200 mt-1">{data.transitioning.total}</div>
              <div className="text-[10px] text-sky-300/80 mt-0.5">
                {transPct}% (M: {data.transitioning.m}, F: {data.transitioning.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Light Refresher</span>
            </div>

            {/* At Grade Level */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold">5. At Grade Level</div>
              <div className="text-xl font-bold text-emerald-200 mt-1">{data.atGradeLevel.total}</div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">
                {atGradePct}% (M: {data.atGradeLevel.m}, F: {data.atGradeLevel.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Scores / Ready</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            {/* Emerging */}
            <div className="p-3 bg-red-950/20 border border-red-500/30">
              <div className="text-[10px] text-red-400 uppercase font-semibold">1. Emerging</div>
              <div className="text-xl font-bold text-red-200 mt-1">{data.emerging.total}</div>
              <div className="text-[10px] text-red-300/80 mt-0.5">
                {emergingPct}% (M: {data.emerging.m}, F: {data.emerging.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Full Refresher</span>
            </div>

            {/* Developing */}
            <div className="p-3 bg-amber-950/20 border border-amber-500/30">
              <div className="text-[10px] text-amber-400 uppercase font-semibold">2. Developing</div>
              <div className="text-xl font-bold text-amber-200 mt-1">{data.developing.total}</div>
              <div className="text-[10px] text-amber-300/80 mt-0.5">
                {devPct}% (M: {data.developing.m}, F: {data.developing.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Moderate Refresher</span>
            </div>

            {/* Transitioning */}
            <div className="p-3 bg-blue-950/20 border border-blue-500/30">
              <div className="text-[10px] text-sky-400 uppercase font-semibold">3. Transitioning</div>
              <div className="text-xl font-bold text-sky-200 mt-1">{data.transitioning.total}</div>
              <div className="text-[10px] text-sky-300/80 mt-0.5">
                {transPct}% (M: {data.transitioning.m}, F: {data.transitioning.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Light Refresher</span>
            </div>

            {/* At Grade Level */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold">4. At Grade Level</div>
              <div className="text-xl font-bold text-emerald-200 mt-1">{data.atGradeLevel.total}</div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">
                {atGradePct}% (M: {data.atGradeLevel.m}, F: {data.atGradeLevel.f})
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Proficient / Ready</span>
            </div>
          </div>
        )}

        {/* Visual Reading Level Distribution Bar */}
        <div className="p-3 bg-[#08101e] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300 font-bold uppercase">School Reading Level Distribution</span>
            <span className="text-slate-400">Total Assessed: <strong className="text-white">{assessed}</strong></span>
          </div>
          <div className="h-3.5 w-full flex bg-slate-900 overflow-hidden border border-slate-700">
            {isPostTest && data.lowEmerging ? (
              <>
                <div style={{ width: `${(lowEm / (assessed || 1)) * 100}%` }} className="bg-red-600 h-full" title={`Low Emerging: ${lowEm}`} />
                <div style={{ width: `${(highEm / (assessed || 1)) * 100}%` }} className="bg-rose-500 h-full" title={`High Emerging: ${highEm}`} />
              </>
            ) : (
              <div style={{ width: `${emergingPct}%` }} className="bg-red-500 h-full" title={`Emerging: ${emergingTotal}`} />
            )}
            <div style={{ width: `${devPct}%` }} className="bg-amber-500 h-full" title={`Developing: ${data.developing.total}`} />
            <div style={{ width: `${transPct}%` }} className="bg-sky-500 h-full" title={`Transitioning: ${data.transitioning.total}`} />
            <div style={{ width: `${atGradePct}%` }} className="bg-emerald-500 h-full" title={`At Grade Level: ${data.atGradeLevel.total}`} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
            {isPostTest && data.lowEmerging ? (
              <>
                <span className="text-red-400">Low Emerging: {((lowEm / (assessed || 1)) * 100).toFixed(1)}%</span>
                <span className="text-rose-400">High Emerging: {((highEm / (assessed || 1)) * 100).toFixed(1)}%</span>
              </>
            ) : (
              <span className="text-red-400">Emerging: {emergingPct}%</span>
            )}
            <span className="text-amber-400">Developing: {devPct}%</span>
            <span className="text-sky-400">Transitioning: {transPct}%</span>
            <span className="text-emerald-400 font-bold">At Grade: {atGradePct}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b1426] border border-slate-800 border-t-2 border-t-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] font-sans my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-3 border-b border-slate-800 bg-[#080f1d] flex items-center justify-between font-mono text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-white">
              Authenticated School Station · DepEd CRLA Portal
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">
          
          {/* Identity Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="font-mono text-xs text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span>School Order #{school.order}</span>
                <span>·</span>
                <span>DepEd School ID: {school.schoolId}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                {school.name}
              </h2>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                Official Name: <strong className="text-slate-200">{school.officialName}</strong> · {school.barangay}
              </div>
            </div>

            {/* Assessment Period Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-[#060b14] border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setPeriod('bosy')}
                className={`px-3 py-1.5 border transition-all cursor-pointer ${
                  period === 'bosy'
                    ? 'bg-slate-700 text-white border-white/50 font-bold'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                B.O.S.Y. Baseline
              </button>
              <button
                type="button"
                onClick={() => setPeriod('eosy')}
                className={`px-3 py-1.5 border transition-all cursor-pointer ${
                  period === 'eosy'
                    ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50 font-bold shadow-sm'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                E.O.S.Y. Post-Test
              </button>
            </div>
          </div>

          {/* Grade Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveGradeTab('grade1')}
              className={`px-3.5 py-2 border font-medium transition-all cursor-pointer ${
                activeGradeTab === 'grade1'
                  ? 'bg-blue-900/50 text-white border-white/40 shadow-sm'
                  : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Grade 1 (MTB)
            </button>

            <button
              type="button"
              onClick={() => setActiveGradeTab('grade2')}
              className={`px-3.5 py-2 border font-medium transition-all cursor-pointer ${
                activeGradeTab === 'grade2'
                  ? 'bg-blue-900/50 text-white border-white/40 shadow-sm'
                  : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Grade 2 (MTB & Filipino)
            </button>

            <button
              type="button"
              onClick={() => setActiveGradeTab('grade3')}
              className={`px-3.5 py-2 border font-medium transition-all cursor-pointer ${
                activeGradeTab === 'grade3'
                  ? 'bg-blue-900/50 text-white border-white/40 shadow-sm'
                  : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Grade 3 (MTB, Filipino & English)
            </button>

            <button
              type="button"
              onClick={() => setActiveGradeTab('progress')}
              className={`px-3.5 py-2 border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGradeTab === 'progress'
                  ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50 shadow-sm'
                  : 'bg-[#08101e] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>BOSY vs. EOSY School Growth</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeGradeTab === 'grade1' && (
            <div className="space-y-4">
              {renderSubjectCard('Grade 1 · Mother Tongue (MTB)', activePeriodData.grade1.mtb, isEosy)}
            </div>
          )}

          {activeGradeTab === 'grade2' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Subject:</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubTabG2('mtb')}
                  className={`px-3 py-1 border text-xs cursor-pointer ${
                    selectedSubTabG2 === 'mtb'
                      ? 'bg-sky-900/50 text-sky-200 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  MTB (Mother Tongue)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubTabG2('filipino')}
                  className={`px-3 py-1 border text-xs cursor-pointer ${
                    selectedSubTabG2 === 'filipino'
                      ? 'bg-sky-900/50 text-sky-200 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Filipino
                </button>
              </div>

              {selectedSubTabG2 === 'mtb' && renderSubjectCard('Grade 2 · Mother Tongue (MTB)', activePeriodData.grade2.mtb, isEosy)}
              {selectedSubTabG2 === 'filipino' && renderSubjectCard('Grade 2 · Filipino', activePeriodData.grade2.filipino, isEosy)}
            </div>
          )}

          {activeGradeTab === 'grade3' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Subject:</span>
                <button
                  type="button"
                  onClick={() => setSelectedSubTabG3('mtb')}
                  className={`px-3 py-1 border text-xs cursor-pointer ${
                    selectedSubTabG3 === 'mtb'
                      ? 'bg-sky-900/50 text-sky-200 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  MTB (Mother Tongue)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubTabG3('filipino')}
                  className={`px-3 py-1 border text-xs cursor-pointer ${
                    selectedSubTabG3 === 'filipino'
                      ? 'bg-sky-900/50 text-sky-200 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Filipino
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubTabG3('english')}
                  className={`px-3 py-1 border text-xs cursor-pointer ${
                    selectedSubTabG3 === 'english'
                      ? 'bg-sky-900/50 text-sky-200 border-sky-500/50 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  English
                </button>
              </div>

              {selectedSubTabG3 === 'mtb' && renderSubjectCard('Grade 3 · Mother Tongue (MTB)', activePeriodData.grade3.mtb, isEosy)}
              {selectedSubTabG3 === 'filipino' && renderSubjectCard('Grade 3 · Filipino', activePeriodData.grade3.filipino, isEosy)}
              {selectedSubTabG3 === 'english' && renderSubjectCard('Grade 3 · English', activePeriodData.grade3.english, isEosy)}
            </div>
          )}

          {activeGradeTab === 'progress' && (
            <div className="p-4 bg-[#08101e] border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                    {school.name} · Literacy Growth Progression
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Comparison of BOSY Baseline vs. EOSY Post-Test Results
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead className="bg-[#060b14] text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                    <tr>
                      <th className="py-2 px-3 text-left">Grade & Subject</th>
                      <th className="py-2 px-3">BOSY %</th>
                      <th className="py-2 px-3 text-emerald-400 font-bold">EOSY %</th>
                      <th className="py-2 px-3">Net Gain</th>
                      <th className="py-2 px-3">Non-Reader Reduction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#060b14] text-slate-200">
                    {[
                      { label: 'Grade 1 MTB', b: school.bosy.grade1.mtb, e: school.eosy?.grade1.mtb },
                      { label: 'Grade 2 MTB', b: school.bosy.grade2.mtb, e: school.eosy?.grade2.mtb },
                      { label: 'Grade 2 Filipino', b: school.bosy.grade2.filipino, e: school.eosy?.grade2.filipino },
                      { label: 'Grade 3 MTB', b: school.bosy.grade3.mtb, e: school.eosy?.grade3.mtb },
                      { label: 'Grade 3 Filipino', b: school.bosy.grade3.filipino, e: school.eosy?.grade3.filipino },
                      { label: 'Grade 3 English', b: school.bosy.grade3.english, e: school.eosy?.grade3.english },
                    ].map((row, i) => {
                      const bPct = row.b.assessed.total > 0 ? (row.b.atGradeLevel.total / row.b.assessed.total) * 100 : 0;
                      const ePct = row.e && row.e.assessed.total > 0 ? (row.e.atGradeLevel.total / row.e.assessed.total) * 100 : 0;
                      const gain = ePct - bPct;
                      const emDiff = row.e ? row.b.emerging.total - row.e.emerging.total : 0;

                      return (
                        <tr key={i}>
                          <td className="py-2 px-3 text-left font-semibold text-white">{row.label}</td>
                          <td>{bPct.toFixed(1)}%</td>
                          <td className="font-bold text-emerald-400">{ePct.toFixed(1)}%</td>
                          <td className={`font-bold ${gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {gain >= 0 ? '+' : ''}{gain.toFixed(1)}% pts
                          </td>
                          <td className="text-slate-300">
                            {emDiff > 0 ? `-${emDiff} learners` : `${emDiff}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => exportIndividualSchoolWord(school, period)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/40 text-blue-200 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {period.toUpperCase()} CRLA (.doc)</span>
              </button>

              <button
                type="button"
                onClick={() => exportIndividualAnalyticsWord(school, period)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Analytics (.doc)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
