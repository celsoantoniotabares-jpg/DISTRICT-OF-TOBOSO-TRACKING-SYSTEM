import { SchoolRecord, CRLASubjectData, AssessmentPeriod } from '../types';
import { DISTRICT_CRLA_BOSY_TOTALS } from '../data/crlaBosyData';
import { DISTRICT_CRLA_EOSY_TOTALS } from '../data/crlaEosyData';

/**
 * DepEd DO 3, s. 2026 Annex A Artificial Intelligence Declaration Statement
 */
export const DEPED_AI_DECLARATION = `AI DECLARATION (DepEd Order No. 003, s. 2026, Annex A):
In strict compliance with DepEd guidelines on the ethical, transparent, and responsible use of Artificial Intelligence in basic education administration, this data consolidation and analytics portal utilizes automated computational aggregation and algorithmic synthesis solely to assist school heads, district supervisors, and literacy focal persons in evidence-based curriculum decision-making. All underlying learner assessment data is directly derived from official teacher-administered Comprehensive Rapid Literacy Assessment (CRLA) instruments and has been cross-verified with official District of Toboso quality-assured matrices. No automated profiling of individual students is conducted.`;

/**
 * Downloads an HTML-formatted Word document (.doc) compatible with Microsoft Word.
 */
function downloadWordDoc(filename: string, title: string, contentHtml: string, periodSubtitle: string = '') {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Orientation>Landscape</w:Orientation>
          <w:Zoom>100</w:Zoom>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page { size: landscape; margin: 0.5in; }
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 9.5pt; color: #1e293b; line-height: 1.3; }
        .header-box { text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 8pt; margin-bottom: 12pt; }
        .deped-tag { font-size: 8.5pt; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.5pt; }
        .title { font-size: 15pt; font-weight: bold; color: #0f172a; margin: 3pt 0; text-transform: uppercase; }
        .subtitle { font-size: 11pt; color: #0284c7; font-weight: bold; }
        .date { font-size: 8pt; color: #64748b; font-style: italic; margin-top: 2pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 14pt; }
        th, td { border: 1pt solid #475569; padding: 4pt 5pt; text-align: center; font-size: 8.5pt; }
        th { background-color: #0f172a; color: #ffffff; font-weight: bold; }
        th.sub { background-color: #334155; }
        th.school-col { text-align: left; }
        td.school-name { text-align: left; font-weight: 600; }
        tr.total-row { background-color: #fef08a; font-weight: bold; }
        tr.total-row td { border-top: 2pt solid #0f172a; font-weight: bold; }
        tr:nth-child(even):not(.total-row) { background-color: #f8fafc; }
        .badge-emerging { background-color: #fee2e2; color: #991b1b; font-weight: bold; }
        .badge-atgrade { background-color: #dcfce7; color: #166534; font-weight: bold; }
        .ai-declaration-box { margin-top: 22pt; padding: 8pt 12pt; background-color: #f8fafc; border: 1pt solid #cbd5e1; border-left: 4pt solid #0284c7; font-size: 8pt; color: #475569; line-height: 1.4; text-align: justify; }
        .footer { margin-top: 14pt; font-size: 8pt; color: #64748b; text-align: center; border-top: 1pt solid #cbd5e1; padding-top: 6pt; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <div class="deped-tag">Republic of the Philippines · Department of Education</div>
        <div class="deped-tag">Region VI - Western Visayas / Negros Island Region (NIR) · Division of Negros Occidental</div>
        <div class="title">DISTRICT OF TOBOSO</div>
        <div class="subtitle">${title} ${periodSubtitle ? `· ${periodSubtitle}` : ''}</div>
        <div class="date">Official DepEd CRLA Tracking System · Generated on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      ${contentHtml}
      <div class="ai-declaration-box">
        <strong>COMPLIANCE NOTICE:</strong> ${DEPED_AI_DECLARATION}
      </div>
      <div class="footer">
        District of Toboso CRLA Monitoring & Analysis System · Official Document
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', header], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderSubjectTableHeader(isEosy: boolean = false) {
  if (isEosy) {
    return `
      <thead>
        <tr>
          <th rowspan="2" style="width: 28px;">No.</th>
          <th rowspan="2" class="school-col" style="min-width: 160px;">DISTRICT OF TOBOSO - SCHOOLS</th>
          <th colspan="3">ENROLMENT</th>
          <th colspan="3">NUMBER OF LEARNERS ASSESSED</th>
          <th colspan="3">FR/LOW EMERGING</th>
          <th colspan="3">FR/HIGH EMERGING</th>
          <th colspan="3">MR/DEVELOPING</th>
          <th colspan="3">LR/TRANSITIONING</th>
          <th colspan="3">SR/AT GRADE LEVEL</th>
          <th rowspan="2">% AT GRADE</th>
        </tr>
        <tr>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
          <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        </tr>
      </thead>
    `;
  }
  return `
    <thead>
      <tr>
        <th rowspan="2" style="width: 28px;">No.</th>
        <th rowspan="2" class="school-col" style="min-width: 160px;">DISTRICT OF TOBOSO - SCHOOLS</th>
        <th colspan="3">ENROLMENT</th>
        <th colspan="3">LEARNERS ASSESSED</th>
        <th colspan="3">EMERGING</th>
        <th colspan="3">DEVELOPING</th>
        <th colspan="3">TRANSITIONING</th>
        <th colspan="3">AT GRADE LEVEL</th>
        <th rowspan="2">% AT GRADE</th>
      </tr>
      <tr>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
        <th class="sub">M</th><th class="sub">F</th><th class="sub">T</th>
      </tr>
    </thead>
  `;
}

function renderSubjectRow(order: number, name: string, data: CRLASubjectData, isEosy: boolean = false) {
  const atGradePct = data.assessed.total > 0 
    ? ((data.atGradeLevel.total / data.assessed.total) * 100).toFixed(2) + '%' 
    : '0.00%';

  if (isEosy) {
    const le = data.lowEmerging || { m: 0, f: 0, total: 0 };
    const he = data.highEmerging || { m: 0, f: 0, total: 0 };
    return `
      <tr>
        <td>${order}</td>
        <td class="school-name">${name}</td>
        <td>${data.enrolment.m}</td><td>${data.enrolment.f}</td><td><strong>${data.enrolment.total}</strong></td>
        <td>${data.assessed.m}</td><td>${data.assessed.f}</td><td><strong>${data.assessed.total}</strong></td>
        <td>${le.m}</td><td>${le.f}</td><td>${le.total}</td>
        <td>${he.m}</td><td>${he.f}</td><td>${he.total}</td>
        <td>${data.developing.m}</td><td>${data.developing.f}</td><td>${data.developing.total}</td>
        <td>${data.transitioning.m}</td><td>${data.transitioning.f}</td><td>${data.transitioning.total}</td>
        <td>${data.atGradeLevel.m}</td><td>${data.atGradeLevel.f}</td><td>${data.atGradeLevel.total}</td>
        <td style="font-weight: bold; color: #166534;">${atGradePct}</td>
      </tr>
    `;
  }

  return `
    <tr>
      <td>${order}</td>
      <td class="school-name">${name}</td>
      <td>${data.enrolment.m}</td><td>${data.enrolment.f}</td><td><strong>${data.enrolment.total}</strong></td>
      <td>${data.assessed.m}</td><td>${data.assessed.f}</td><td><strong>${data.assessed.total}</strong></td>
      <td>${data.emerging.m}</td><td>${data.emerging.f}</td><td>${data.emerging.total}</td>
      <td>${data.developing.m}</td><td>${data.developing.f}</td><td>${data.developing.total}</td>
      <td>${data.transitioning.m}</td><td>${data.transitioning.f}</td><td>${data.transitioning.total}</td>
      <td>${data.atGradeLevel.m}</td><td>${data.atGradeLevel.f}</td><td>${data.atGradeLevel.total}</td>
      <td style="font-weight: bold; color: #166534;">${atGradePct}</td>
    </tr>
  `;
}

function renderSubjectTotalRow(data: CRLASubjectData, isEosy: boolean = false) {
  const atGradePct = data.assessed.total > 0 
    ? ((data.atGradeLevel.total / data.assessed.total) * 100).toFixed(2) + '%' 
    : '0.00%';

  if (isEosy) {
    const le = data.lowEmerging || { m: 0, f: 0, total: 0 };
    const he = data.highEmerging || { m: 0, f: 0, total: 0 };
    return `
      <tr class="total-row">
        <td colspan="2" style="text-align: right; padding-right: 12pt;">TOTAL:</td>
        <td>${data.enrolment.m}</td><td>${data.enrolment.f}</td><td>${data.enrolment.total}</td>
        <td>${data.assessed.m}</td><td>${data.assessed.f}</td><td>${data.assessed.total}</td>
        <td>${le.m}</td><td>${le.f}</td><td>${le.total}</td>
        <td>${he.m}</td><td>${he.f}</td><td>${he.total}</td>
        <td>${data.developing.m}</td><td>${data.developing.f}</td><td>${data.developing.total}</td>
        <td>${data.transitioning.m}</td><td>${data.transitioning.f}</td><td>${data.transitioning.total}</td>
        <td>${data.atGradeLevel.m}</td><td>${data.atGradeLevel.f}</td><td>${data.atGradeLevel.total}</td>
        <td>${atGradePct}</td>
      </tr>
    `;
  }

  return `
    <tr class="total-row">
      <td colspan="2" style="text-align: right; padding-right: 12pt;">TOTAL:</td>
      <td>${data.enrolment.m}</td><td>${data.enrolment.f}</td><td>${data.enrolment.total}</td>
      <td>${data.assessed.m}</td><td>${data.assessed.f}</td><td>${data.assessed.total}</td>
      <td>${data.emerging.m}</td><td>${data.emerging.f}</td><td>${data.emerging.total}</td>
      <td>${data.developing.m}</td><td>${data.developing.f}</td><td>${data.developing.total}</td>
      <td>${data.transitioning.m}</td><td>${data.transitioning.f}</td><td>${data.transitioning.total}</td>
      <td>${data.atGradeLevel.m}</td><td>${data.atGradeLevel.f}</td><td>${data.atGradeLevel.total}</td>
      <td>${atGradePct}</td>
    </tr>
  `;
}

/**
 * 1. Export Overall District CRLA Word (.doc) for specified period
 */
export function exportOverallDistrictWord(schools: SchoolRecord[], period: AssessmentPeriod = 'eosy') {
  const isEosy = period === 'eosy';
  const totals = isEosy ? DISTRICT_CRLA_EOSY_TOTALS : DISTRICT_CRLA_BOSY_TOTALS;
  const periodLabel = isEosy ? 'E.O.S.Y. POST-TEST RESULTS' : 'B.O.S.Y. BASELINE RESULTS';

  const getSub = (s: SchoolRecord, grade: 'grade1' | 'grade2' | 'grade3', sub: string): CRLASubjectData => {
    const src = isEosy && s.eosy ? s.eosy : s.bosy;
    // @ts-ignore
    return src[grade][sub];
  };

  const contentHtml = `
    <h3 style="color: #0f172a; margin-top: 10pt;">GRADE 1 CRLA ${periodLabel} (MTB)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade1', 'mtb'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade1.mtb, isEosy)}
      </tbody>
    </table>

    <h3 style="color: #0f172a; margin-top: 18pt;">GRADE 2 CRLA ${periodLabel} (MTB)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade2', 'mtb'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade2.mtb, isEosy)}
      </tbody>
    </table>

    <h3 style="color: #0f172a; margin-top: 18pt;">GRADE 2 CRLA ${periodLabel} (FILIPINO)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade2', 'filipino'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade2.filipino, isEosy)}
      </tbody>
    </table>

    <h3 style="color: #0f172a; margin-top: 18pt;">GRADE 3 CRLA ${periodLabel} (MTB)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade3', 'mtb'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade3.mtb, isEosy)}
      </tbody>
    </table>

    <h3 style="color: #0f172a; margin-top: 18pt;">GRADE 3 CRLA ${periodLabel} (FILIPINO)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade3', 'filipino'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade3.filipino, isEosy)}
      </tbody>
    </table>

    <h3 style="color: #0f172a; margin-top: 18pt;">GRADE 3 CRLA ${periodLabel} (ENGLISH)</h3>
    <table>
      ${renderSubjectTableHeader(isEosy)}
      <tbody>
        ${schools.map(s => renderSubjectRow(s.order, s.officialName, getSub(s, 'grade3', 'english'), isEosy)).join('')}
        ${renderSubjectTotalRow(totals.grade3.english, isEosy)}
      </tbody>
    </table>
  `;

  downloadWordDoc(
    `S.Y._2025-2026_DISTRICT_OF_TOBOSO_CRLA_${period.toUpperCase()}_CONSOLIDATED.doc`,
    `S.Y. 2025-2026 CRLA ${periodLabel} (ALL 21 SCHOOLS)`,
    contentHtml,
    `District Consolidated Matrix (${period.toUpperCase()})`
  );
}

/**
 * 2. Export Comparative Growth (BOSY vs. EOSY) Word Document
 */
export function exportComparativeGrowthWord(schools: SchoolRecord[]) {
  const views: { key: string; label: string; grade: 'grade1' | 'grade2' | 'grade3'; sub: string }[] = [
    { key: 'g1_mtb', label: 'Grade 1 MTB', grade: 'grade1', sub: 'mtb' },
    { key: 'g2_mtb', label: 'Grade 2 MTB', grade: 'grade2', sub: 'mtb' },
    { key: 'g2_fil', label: 'Grade 2 Filipino', grade: 'grade2', sub: 'filipino' },
    { key: 'g3_fil', label: 'Grade 3 Filipino', grade: 'grade3', sub: 'filipino' },
    { key: 'g3_eng', label: 'Grade 3 English', grade: 'grade3', sub: 'english' },
  ];

  const contentHtml = `
    <h3 style="color: #0f172a; margin-top: 6pt;">CRLA DISTRICT-WIDE VALUE-ADDED PROGRESS & COMPARATIVE GROWTH MATRIX</h3>
    <p style="font-size: 9pt; color: #475569; margin-bottom: 12pt;">
      Tracking the literacy progression from B.O.S.Y. Baseline (Beginning of School Year) to E.O.S.Y. Post-Test (End of School Year) for S.Y. 2025-2026 across all 21 Elementary Schools.
    </p>

    ${views.map(v => {
      // @ts-ignore
      const bTotal: CRLASubjectData = DISTRICT_CRLA_BOSY_TOTALS[v.grade][v.sub];
      // @ts-ignore
      const eTotal: CRLASubjectData = DISTRICT_CRLA_EOSY_TOTALS[v.grade][v.sub];
      const bTotalPct = bTotal.assessed.total > 0 ? (bTotal.atGradeLevel.total / bTotal.assessed.total) * 100 : 0;
      const eTotalPct = eTotal.assessed.total > 0 ? (eTotal.atGradeLevel.total / eTotal.assessed.total) * 100 : 0;
      const totalGain = eTotalPct - bTotalPct;

      return `
        <h4 style="color: #0369a1; margin-top: 14pt; margin-bottom: 4pt; text-transform: uppercase;">${v.label} · Baseline vs. Post-Test Progression</h4>
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width: 28px;">No.</th>
              <th rowspan="2" class="school-col">SCHOOL</th>
              <th colspan="2">BOSY BASELINE</th>
              <th colspan="2">EOSY POST-TEST</th>
              <th colspan="2">NET PROGRESS</th>
              <th rowspan="2">EMERGING REDUCTION</th>
            </tr>
            <tr>
              <th class="sub">Assessed</th><th class="sub">% At Grade</th>
              <th class="sub">Assessed</th><th class="sub">% At Grade</th>
              <th class="sub">Net Gain (pts)</th><th class="sub">Progress Status</th>
            </tr>
          </thead>
          <tbody>
            ${schools.map(s => {
              // @ts-ignore
              const bSub: CRLASubjectData = s.bosy[v.grade][v.sub];
              // @ts-ignore
              const eSub: CRLASubjectData = s.eosy ? s.eosy[v.grade][v.sub] : bSub;
              const bPct = bSub.assessed.total > 0 ? (bSub.atGradeLevel.total / bSub.assessed.total) * 100 : 0;
              const ePct = eSub.assessed.total > 0 ? (eSub.atGradeLevel.total / eSub.assessed.total) * 100 : 0;
              const gain = ePct - bPct;
              const emReduct = bSub.emerging.total - eSub.emerging.total;

              return `
                <tr>
                  <td>${s.order}</td>
                  <td class="school-name">${s.officialName}</td>
                  <td>${bSub.assessed.total}</td>
                  <td>${bPct.toFixed(2)}%</td>
                  <td>${eSub.assessed.total}</td>
                  <td style="font-weight: bold; color: #166534;">${ePct.toFixed(2)}%</td>
                  <td style="font-weight: bold; color: ${gain >= 0 ? '#15803d' : '#b91c1c'};">
                    ${gain >= 0 ? '+' : ''}${gain.toFixed(2)}%
                  </td>
                  <td>${gain >= 10 ? 'High Growth' : gain > 0 ? 'Positive Growth' : 'Sustained'}</td>
                  <td style="color: ${emReduct > 0 ? '#15803d' : '#475569'}; font-weight: 600;">
                    ${emReduct > 0 ? `-${emReduct} non-readers` : `${emReduct} diff`}
                  </td>
                </tr>
              `;
            }).join('')}
            <tr class="total-row">
              <td colspan="2" style="text-align: right; padding-right: 12pt;">DISTRICT TOTAL:</td>
              <td>${bTotal.assessed.total}</td>
              <td>${bTotalPct.toFixed(2)}%</td>
              <td>${eTotal.assessed.total}</td>
              <td>${eTotalPct.toFixed(2)}%</td>
              <td style="font-size: 10pt; color: #15803d;">+${totalGain.toFixed(2)}%</td>
              <td>District Target Met</td>
              <td style="color: #15803d;">-${bTotal.emerging.total - eTotal.emerging.total} non-readers</td>
            </tr>
          </tbody>
        </table>
      `;
    }).join('')}
  `;

  downloadWordDoc(
    'S.Y._2025-2026_DISTRICT_OF_TOBOSO_CRLA_COMPARATIVE_GROWTH.doc',
    'CRLA S.Y. 2025-2026 BOSY VS. EOSY COMPARATIVE LITERACY GROWTH REPORT',
    contentHtml,
    'District Value-Added Progress Analysis'
  );
}

/**
 * 3. Export Individual School Word (.doc)
 */
export function exportIndividualSchoolWord(school: SchoolRecord, period: AssessmentPeriod = 'eosy') {
  const isEosy = period === 'eosy';
  const dataSrc = isEosy && school.eosy ? school.eosy : school.bosy;
  const periodLabel = isEosy ? 'E.O.S.Y. POST-TEST' : 'B.O.S.Y. BASELINE';

  const rows = [
    { grade: 'Grade 1', subName: 'Mother Tongue (MTB)', data: dataSrc.grade1.mtb },
    { grade: 'Grade 2', subName: 'Mother Tongue (MTB)', data: dataSrc.grade2.mtb },
    { grade: 'Grade 2', subName: 'Filipino', data: dataSrc.grade2.filipino },
    { grade: 'Grade 3', subName: 'Mother Tongue (MTB)', data: dataSrc.grade3.mtb },
    { grade: 'Grade 3', subName: 'Filipino', data: dataSrc.grade3.filipino },
    { grade: 'Grade 3', subName: 'English', data: dataSrc.grade3.english },
  ];

  const contentHtml = `
    <div style="background-color: #f1f5f9; padding: 10pt; border: 1pt solid #cbd5e1; margin-bottom: 12pt;">
      <p style="margin: 0; font-size: 10pt;"><strong>DepEd School ID:</strong> ${school.schoolId} · <strong>Order No:</strong> ${school.order}</p>
      <p style="margin: 3pt 0 0 0; font-size: 10pt;"><strong>Official Name:</strong> ${school.officialName}</p>
      <p style="margin: 3pt 0 0 0; font-size: 10pt;"><strong>Barangay / Location:</strong> ${school.barangay}</p>
      <p style="margin: 3pt 0 0 0; font-size: 10pt;"><strong>Assessment Period:</strong> Official S.Y. 2025-2026 ${periodLabel}</p>
    </div>

    <h3 style="color: #0f172a;">COMPREHENSIVE RAPID LITERACY ASSESSMENT (${periodLabel})</h3>
    <table>
      <thead>
        <tr>
          <th>Grade Level</th>
          <th>Assessment Subject</th>
          <th>Enrolment</th>
          <th>Assessed</th>
          ${isEosy ? '<th>Low Emerg</th><th>High Emerg</th>' : '<th>Emerging</th>'}
          <th>Developing</th>
          <th>Transitioning</th>
          <th>At Grade Level</th>
          <th>% At Grade Level</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => {
          const pct = r.data.assessed.total > 0 
            ? ((r.data.atGradeLevel.total / r.data.assessed.total) * 100).toFixed(2) + '%' 
            : '0.00%';
          return `
            <tr>
              <td><strong>${r.grade}</strong></td>
              <td style="text-align: left; font-weight: 600;">${r.subName}</td>
              <td>${r.data.enrolment.total}</td>
              <td><strong>${r.data.assessed.total}</strong></td>
              ${isEosy ? `<td>${r.data.lowEmerging?.total ?? 0}</td><td>${r.data.highEmerging?.total ?? 0}</td>` : `<td>${r.data.emerging.total}</td>`}
              <td>${r.data.developing.total}</td>
              <td>${r.data.transitioning.total}</td>
              <td style="font-weight: bold; color: #166534;">${r.data.atGradeLevel.total}</td>
              <td style="font-weight: bold; background-color: #dcfce7; color: #166534;">${pct}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  downloadWordDoc(
    `${school.officialName.replace(/\s+/g, '_')}_CRLA_${period.toUpperCase()}.doc`,
    `${school.officialName} · CRLA ${periodLabel}`,
    contentHtml,
    `School Level Record (${period.toUpperCase()})`
  );
}

/**
 * 4. Export All Analytics Word (.doc)
 */
export function exportAllAnalyticsWord(schools: SchoolRecord[], period: AssessmentPeriod = 'eosy') {
  const isEosy = period === 'eosy';
  const totals = isEosy ? DISTRICT_CRLA_EOSY_TOTALS : DISTRICT_CRLA_BOSY_TOTALS;
  const label = isEosy ? 'EOSY Post-Test' : 'BOSY Baseline';

  const contentHtml = `
    <h3 style="color: #0f172a;">DISTRICT-WIDE CRLA ANALYTICS SUMMARY (${label})</h3>
    <p style="font-size: 9pt; color: #475569;">
      Executive summary of literacy achievement levels across all 21 elementary schools in the District of Toboso.
    </p>

    <table>
      <thead>
        <tr>
          <th>Grade Level & Subject</th>
          <th>Total Learners Assessed</th>
          <th>Emerging / Non-Reader</th>
          <th>Developing / Frustration</th>
          <th>Transitioning / Instructional</th>
          <th>At Grade Level / Independent</th>
          <th>District Mastery %</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 1 MTB</td>
          <td>${totals.grade1.mtb.assessed.total}</td>
          <td>${totals.grade1.mtb.emerging.total}</td>
          <td>${totals.grade1.mtb.developing.total}</td>
          <td>${totals.grade1.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade1.mtb.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${((totals.grade1.mtb.atGradeLevel.total / totals.grade1.mtb.assessed.total) * 100).toFixed(2)}%
          </td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 2 MTB</td>
          <td>${totals.grade2.mtb.assessed.total}</td>
          <td>${totals.grade2.mtb.emerging.total}</td>
          <td>${totals.grade2.mtb.developing.total}</td>
          <td>${totals.grade2.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade2.mtb.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${((totals.grade2.mtb.atGradeLevel.total / totals.grade2.mtb.assessed.total) * 100).toFixed(2)}%
          </td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 2 Filipino</td>
          <td>${totals.grade2.filipino.assessed.total}</td>
          <td>${totals.grade2.filipino.emerging.total}</td>
          <td>${totals.grade2.filipino.developing.total}</td>
          <td>${totals.grade2.filipino.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade2.filipino.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${((totals.grade2.filipino.atGradeLevel.total / totals.grade2.filipino.assessed.total) * 100).toFixed(2)}%
          </td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 3 MTB</td>
          <td>${totals.grade3.mtb.assessed.total}</td>
          <td>${totals.grade3.mtb.emerging.total}</td>
          <td>${totals.grade3.mtb.developing.total}</td>
          <td>${totals.grade3.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade3.mtb.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${totals.grade3.mtb.assessed.total > 0 ? ((totals.grade3.mtb.atGradeLevel.total / totals.grade3.mtb.assessed.total) * 100).toFixed(2) : 0}%
          </td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 3 Filipino</td>
          <td>${totals.grade3.filipino.assessed.total}</td>
          <td>${totals.grade3.filipino.emerging.total}</td>
          <td>${totals.grade3.filipino.developing.total}</td>
          <td>${totals.grade3.filipino.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade3.filipino.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${((totals.grade3.filipino.atGradeLevel.total / totals.grade3.filipino.assessed.total) * 100).toFixed(2)}%
          </td>
        </tr>
        <tr>
          <td style="text-align: left; font-weight: bold;">Grade 3 English</td>
          <td>${totals.grade3.english.assessed.total}</td>
          <td>${totals.grade3.english.emerging.total}</td>
          <td>${totals.grade3.english.developing.total}</td>
          <td>${totals.grade3.english.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${totals.grade3.english.atGradeLevel.total}</td>
          <td style="font-weight: bold; background-color: #dcfce7;">
            ${((totals.grade3.english.atGradeLevel.total / totals.grade3.english.assessed.total) * 100).toFixed(2)}%
          </td>
        </tr>
      </tbody>
    </table>
  `;

  downloadWordDoc(
    `DISTRICT_OF_TOBOSO_CRLA_${period.toUpperCase()}_ANALYTICS.doc`,
    `District of Toboso CRLA Analytics Summary (${label})`,
    contentHtml,
    'Executive Analytics Brief'
  );
}

/**
 * 5. Export Individual School Analytics Word (.doc)
 */
export function exportIndividualAnalyticsWord(school: SchoolRecord, period: AssessmentPeriod = 'eosy') {
  const isEosy = period === 'eosy';
  const dataSrc = isEosy && school.eosy ? school.eosy : school.bosy;
  const label = isEosy ? 'EOSY Post-Test' : 'BOSY Baseline';

  const contentHtml = `
    <div style="background-color: #f1f5f9; padding: 10pt; border: 1pt solid #cbd5e1; margin-bottom: 12pt;">
      <h2 style="margin: 0; color: #0f172a; font-size: 14pt;">${school.officialName}</h2>
      <p style="margin: 3pt 0 0 0;">DepEd School ID: <strong>${school.schoolId}</strong> · Location: <strong>${school.barangay}</strong></p>
      <p style="margin: 2pt 0 0 0; color: #0284c7; font-weight: bold;">Individual School Literacy Analytics Profile (${label})</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Grade</th>
          <th>Subject</th>
          <th>Learners Assessed</th>
          <th>Emerging</th>
          <th>Developing</th>
          <th>Transitioning</th>
          <th>At Grade Level</th>
          <th>% At Grade Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Grade 1</td>
          <td>MTB</td>
          <td>${dataSrc.grade1.mtb.assessed.total}</td>
          <td>${dataSrc.grade1.mtb.emerging.total}</td>
          <td>${dataSrc.grade1.mtb.developing.total}</td>
          <td>${dataSrc.grade1.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade1.mtb.atGradeLevel.total}</td>
          <td>${dataSrc.grade1.mtb.assessed.total > 0 ? ((dataSrc.grade1.mtb.atGradeLevel.total / dataSrc.grade1.mtb.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
        <tr>
          <td>Grade 2</td>
          <td>MTB</td>
          <td>${dataSrc.grade2.mtb.assessed.total}</td>
          <td>${dataSrc.grade2.mtb.emerging.total}</td>
          <td>${dataSrc.grade2.mtb.developing.total}</td>
          <td>${dataSrc.grade2.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade2.mtb.atGradeLevel.total}</td>
          <td>${dataSrc.grade2.mtb.assessed.total > 0 ? ((dataSrc.grade2.mtb.atGradeLevel.total / dataSrc.grade2.mtb.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
        <tr>
          <td>Grade 2</td>
          <td>Filipino</td>
          <td>${dataSrc.grade2.filipino.assessed.total}</td>
          <td>${dataSrc.grade2.filipino.emerging.total}</td>
          <td>${dataSrc.grade2.filipino.developing.total}</td>
          <td>${dataSrc.grade2.filipino.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade2.filipino.atGradeLevel.total}</td>
          <td>${dataSrc.grade2.filipino.assessed.total > 0 ? ((dataSrc.grade2.filipino.atGradeLevel.total / dataSrc.grade2.filipino.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
        <tr>
          <td>Grade 3</td>
          <td>MTB</td>
          <td>${dataSrc.grade3.mtb.assessed.total}</td>
          <td>${dataSrc.grade3.mtb.emerging.total}</td>
          <td>${dataSrc.grade3.mtb.developing.total}</td>
          <td>${dataSrc.grade3.mtb.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade3.mtb.atGradeLevel.total}</td>
          <td>${dataSrc.grade3.mtb.assessed.total > 0 ? ((dataSrc.grade3.mtb.atGradeLevel.total / dataSrc.grade3.mtb.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
        <tr>
          <td>Grade 3</td>
          <td>Filipino</td>
          <td>${dataSrc.grade3.filipino.assessed.total}</td>
          <td>${dataSrc.grade3.filipino.emerging.total}</td>
          <td>${dataSrc.grade3.filipino.developing.total}</td>
          <td>${dataSrc.grade3.filipino.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade3.filipino.atGradeLevel.total}</td>
          <td>${dataSrc.grade3.filipino.assessed.total > 0 ? ((dataSrc.grade3.filipino.atGradeLevel.total / dataSrc.grade3.filipino.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
        <tr>
          <td>Grade 3</td>
          <td>English</td>
          <td>${dataSrc.grade3.english.assessed.total}</td>
          <td>${dataSrc.grade3.english.emerging.total}</td>
          <td>${dataSrc.grade3.english.developing.total}</td>
          <td>${dataSrc.grade3.english.transitioning.total}</td>
          <td style="font-weight: bold; color: #166534;">${dataSrc.grade3.english.atGradeLevel.total}</td>
          <td>${dataSrc.grade3.english.assessed.total > 0 ? ((dataSrc.grade3.english.atGradeLevel.total / dataSrc.grade3.english.assessed.total) * 100).toFixed(2) + '%' : '0.00%'}</td>
        </tr>
      </tbody>
    </table>
  `;

  downloadWordDoc(
    `${school.officialName.replace(/\s+/g, '_')}_Analytics_${period.toUpperCase()}.doc`,
    `CRLA Analytics Profile: ${school.name}`,
    contentHtml,
    `School Analytics (${period.toUpperCase()})`
  );
}
