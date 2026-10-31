import { 
  PhilIriSchoolRow, 
  computePhilIriTotals, 
  PHIL_IRI_BOSY_DATA, 
  PHIL_IRI_EOSY_DATA,
  computePhilIriComparative
} from '../data/philIriData';

/**
 * DepEd DO 3, s. 2026 Annex A Artificial Intelligence Declaration Statement for Phil-IRI
 */
export const DEPED_PHILIRI_AI_DECLARATION = `AI DECLARATION (DepEd Order No. 003, s. 2026, Annex A):
In strict compliance with DepEd guidelines on the ethical, transparent, and responsible use of Artificial Intelligence in basic education administration, this data consolidation and analytics portal utilizes automated computational aggregation and algorithmic synthesis solely to assist school heads, district supervisors, and literacy focal persons in evidence-based curriculum decision-making. All underlying learner assessment data is directly derived from official teacher-administered Philippine Informal Reading Inventory (Phil-IRI) instruments and has been cross-verified with official District of Toboso quality-assured matrices. No automated profiling of individual students is conducted.`;

function downloadWordDoc(filename: string, title: string, contentHtml: string, subtitle: string = '') {
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
        @page { size: landscape; margin: 0.4in; }
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 8.5pt; color: #1e293b; line-height: 1.25; }
        .header-box { text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 6pt; margin-bottom: 10pt; }
        .deped-tag { font-size: 8pt; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.5pt; }
        .title { font-size: 14pt; font-weight: bold; color: #0f172a; margin: 2pt 0; text-transform: uppercase; }
        .subtitle { font-size: 10.5pt; color: #0284c7; font-weight: bold; }
        .date { font-size: 7.5pt; color: #64748b; font-style: italic; margin-top: 2pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 12pt; }
        th, td { border: 1pt solid #475569; padding: 3pt 4pt; text-align: center; font-size: 8pt; }
        th { background-color: #0f172a; color: #ffffff; font-weight: bold; }
        th.sub { background-color: #334155; }
        th.sub2 { background-color: #475569; }
        th.school-col { text-align: left; }
        td.school-name { text-align: left; font-weight: 600; }
        tr.total-row { background-color: #fef08a; font-weight: bold; }
        tr.total-row td { border-top: 2pt solid #0f172a; font-weight: bold; }
        tr:nth-child(even):not(.total-row) { background-color: #f8fafc; }
        .ai-declaration-box { margin-top: 18pt; padding: 6pt 10pt; background-color: #f8fafc; border: 1pt solid #cbd5e1; border-left: 4pt solid #0284c7; font-size: 7.5pt; color: #475569; line-height: 1.35; text-align: justify; }
        .footer { margin-top: 10pt; font-size: 7.5pt; color: #64748b; text-align: center; border-top: 1pt solid #cbd5e1; padding-top: 4pt; }
        .gain { color: #059669; font-weight: bold; }
        .reduction { color: #2563eb; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <div class="deped-tag">Republic of the Philippines · Department of Education</div>
        <div class="deped-tag">Region VI - Western Visayas / Negros Island Region (NIR) · Division of Negros Occidental</div>
        <div class="title">DISTRICT OF TOBOSO · PROJECT RICHARD</div>
        <div class="subtitle">${title} ${subtitle ? `· ${subtitle}` : ''}</div>
        <div class="date">Official Consolidated Matrix · Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      ${contentHtml}
      <div class="ai-declaration-box">
        <strong>${DEPED_PHILIRI_AI_DECLARATION}</strong>
      </div>
      <div class="footer">
        Official Document of DepEd District of Toboso · School Year 2025–2026 · Project RICHARD Literacy Tracking System
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + header], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function renderPhilIriTable(rows: PhilIriSchoolRow[], gradeLabel: string, languageLabel: string, periodLabel: string): string {
  const totals = computePhilIriTotals(rows);

  let html = `
    <h3 style="font-size: 11pt; color: #0f172a; margin-top: 12pt; margin-bottom: 4pt; text-transform: uppercase;">
      ${languageLabel} ${gradeLabel} · ${periodLabel} Results
    </h3>
    <table>
      <thead>
        <tr>
          <th rowspan="3" class="school-col" style="width: 18%;">School / Learning Center</th>
          <th rowspan="3" style="width: 6%;">Total Assessed</th>
          <th rowspan="3" style="width: 8%;">At Grade Level (GST)<br><span style="font-size: 7pt; font-weight: normal;">Score 14–20</span></th>
          <th colspan="12" class="sub">2-Level Down (GST Score Between 8 to 13)</th>
          <th colspan="12" class="sub">3-Level Down (GST Score Between 0 to 7)</th>
        </tr>
        <tr>
          <th colspan="3" class="sub2">Independent</th>
          <th colspan="3" class="sub2">Instructional</th>
          <th colspan="3" class="sub2">Frustration</th>
          <th colspan="3" class="sub2">Total</th>
          <th colspan="3" class="sub2">Independent</th>
          <th colspan="3" class="sub2">Instructional</th>
          <th colspan="3" class="sub2">Frustration</th>
          <th colspan="3" class="sub2">Total</th>
        </tr>
        <tr>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
          <th>M</th><th>F</th><th>T</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((r) => {
    html += `
      <tr>
        <td class="school-name">${r.schoolName}</td>
        <td><strong>${r.totalAssessed}</strong></td>
        <td><strong>${r.atGradeLevel}</strong></td>
        <td>${r.twoLevelDown.independent.m}</td>
        <td>${r.twoLevelDown.independent.f}</td>
        <td>${r.twoLevelDown.independent.t}</td>
        <td>${r.twoLevelDown.instructional.m}</td>
        <td>${r.twoLevelDown.instructional.f}</td>
        <td>${r.twoLevelDown.instructional.t}</td>
        <td>${r.twoLevelDown.frustration.m}</td>
        <td>${r.twoLevelDown.frustration.f}</td>
        <td>${r.twoLevelDown.frustration.t}</td>
        <td>${r.twoLevelDown.total.m}</td>
        <td>${r.twoLevelDown.total.f}</td>
        <td><strong>${r.twoLevelDown.total.t}</strong></td>
        <td>${r.threeLevelDown.independent.m}</td>
        <td>${r.threeLevelDown.independent.f}</td>
        <td>${r.threeLevelDown.independent.t}</td>
        <td>${r.threeLevelDown.instructional.m}</td>
        <td>${r.threeLevelDown.instructional.f}</td>
        <td>${r.threeLevelDown.instructional.t}</td>
        <td>${r.threeLevelDown.frustration.m}</td>
        <td>${r.threeLevelDown.frustration.f}</td>
        <td>${r.threeLevelDown.frustration.t}</td>
        <td>${r.threeLevelDown.total.m}</td>
        <td>${r.threeLevelDown.total.f}</td>
        <td><strong>${r.threeLevelDown.total.t}</strong></td>
      </tr>
    `;
  });

  html += `
      <tr class="total-row">
        <td class="school-name">DISTRICT TOTAL</td>
        <td><strong>${totals.totalAssessed}</strong></td>
        <td><strong>${totals.atGradeLevel}</strong></td>
        <td>${totals.twoLevelDown.independent.m}</td>
        <td>${totals.twoLevelDown.independent.f}</td>
        <td><strong>${totals.twoLevelDown.independent.t}</strong></td>
        <td>${totals.twoLevelDown.instructional.m}</td>
        <td>${totals.twoLevelDown.instructional.f}</td>
        <td><strong>${totals.twoLevelDown.instructional.t}</strong></td>
        <td>${totals.twoLevelDown.frustration.m}</td>
        <td>${totals.twoLevelDown.frustration.f}</td>
        <td><strong>${totals.twoLevelDown.frustration.t}</strong></td>
        <td>${totals.twoLevelDown.total.m}</td>
        <td>${totals.twoLevelDown.total.f}</td>
        <td><strong>${totals.twoLevelDown.total.t}</strong></td>
        <td>${totals.threeLevelDown.independent.m}</td>
        <td>${totals.threeLevelDown.independent.f}</td>
        <td><strong>${totals.threeLevelDown.independent.t}</strong></td>
        <td>${totals.threeLevelDown.instructional.m}</td>
        <td>${totals.threeLevelDown.instructional.f}</td>
        <td><strong>${totals.threeLevelDown.instructional.t}</strong></td>
        <td>${totals.threeLevelDown.frustration.m}</td>
        <td>${totals.threeLevelDown.frustration.f}</td>
        <td><strong>${totals.threeLevelDown.frustration.t}</strong></td>
        <td>${totals.threeLevelDown.total.m}</td>
        <td>${totals.threeLevelDown.total.f}</td>
        <td><strong>${totals.threeLevelDown.total.t}</strong></td>
      </tr>
    </tbody>
  </table>
  `;

  return html;
}

function renderPhilIriComparativeTable(
  bosyRows: PhilIriSchoolRow[],
  eosyRows: PhilIriSchoolRow[],
  gradeLabel: string,
  languageLabel: string
): string {
  const comp = computePhilIriComparative(bosyRows, eosyRows);

  let html = `
    <h3 style="font-size: 11pt; color: #0f172a; margin-top: 12pt; margin-bottom: 4pt; text-transform: uppercase;">
      ${languageLabel} ${gradeLabel} · BOSY vs EOSY Comparative Growth Matrix
    </h3>
    <table style="font-size: 7.5pt;">
      <thead>
        <tr>
          <th rowspan="2" class="school-col" style="width: 16%;">School</th>
          <th colspan="3" class="sub">Total Assessed</th>
          <th colspan="4" class="sub">At Grade Level (GST 14–20)</th>
          <th colspan="3" class="sub">3-Level Down (0–7)</th>
          <th colspan="3" class="sub">Overall Frustration</th>
          <th colspan="3" class="sub">Overall Independent</th>
        </tr>
        <tr>
          <th>BOSY</th><th>EOSY</th><th>Diff</th>
          <th>BOSY</th><th>EOSY</th><th>Gain</th><th>% Pt</th>
          <th>BOSY</th><th>EOSY</th><th>Reduction</th>
          <th>BOSY</th><th>EOSY</th><th>Reduction</th>
          <th>BOSY</th><th>EOSY</th><th>Gain</th>
        </tr>
      </thead>
      <tbody>
  `;

  comp.rows.forEach(r => {
    const atGradeGainClass = r.atGradeLevelDiff > 0 ? 'gain' : '';
    const frustRedClass = r.frustrationDiff < 0 ? 'gain' : '';
    const threeRedClass = r.threeLevelDownDiff < 0 ? 'gain' : '';
    const indepGainClass = r.independentDiff > 0 ? 'gain' : '';

    html += `
      <tr>
        <td class="school-name">${r.schoolName}</td>
        <td>${r.bosyAssessed}</td>
        <td>${r.eosyAssessed}</td>
        <td>${r.assessedDiff > 0 ? `+${r.assessedDiff}` : r.assessedDiff}</td>
        <td>${r.bosyAtGradeLevel}</td>
        <td><strong>${r.eosyAtGradeLevel}</strong></td>
        <td class="${atGradeGainClass}"><strong>${r.atGradeLevelDiff > 0 ? `+${r.atGradeLevelDiff}` : r.atGradeLevelDiff}</strong></td>
        <td class="${atGradeGainClass}">${r.atGradeLevelPctDiff > 0 ? `+${r.atGradeLevelPctDiff.toFixed(1)}%` : `${r.atGradeLevelPctDiff.toFixed(1)}%`}</td>
        <td>${r.bosyThreeLevelDownTotal}</td>
        <td>${r.eosyThreeLevelDownTotal}</td>
        <td class="${threeRedClass}"><strong>${r.threeLevelDownDiff < 0 ? `${r.threeLevelDownDiff}` : `+${r.threeLevelDownDiff}`}</strong></td>
        <td>${r.bosyFrustrationTotal}</td>
        <td>${r.eosyFrustrationTotal}</td>
        <td class="${frustRedClass}"><strong>${r.frustrationDiff < 0 ? `${r.frustrationDiff}` : `+${r.frustrationDiff}`}</strong></td>
        <td>${r.bosyIndependentTotal}</td>
        <td>${r.eosyIndependentTotal}</td>
        <td class="${indepGainClass}"><strong>${r.independentDiff > 0 ? `+${r.independentDiff}` : r.independentDiff}</strong></td>
      </tr>
    `;
  });

  const bTot = comp.bosyTotals;
  const eTot = comp.eosyTotals;
  const bFrustTot = bTot.overallFrustration.t;
  const eFrustTot = eTot.overallFrustration.t;
  const bIndepTot = bTot.overallIndependent.t;
  const eIndepTot = eTot.overallIndependent.t;

  html += `
      <tr class="total-row">
        <td class="school-name">DISTRICT TOTAL</td>
        <td><strong>${bTot.totalAssessed}</strong></td>
        <td><strong>${eTot.totalAssessed}</strong></td>
        <td><strong>${eTot.totalAssessed - bTot.totalAssessed > 0 ? `+${eTot.totalAssessed - bTot.totalAssessed}` : eTot.totalAssessed - bTot.totalAssessed}</strong></td>
        <td><strong>${bTot.atGradeLevel}</strong></td>
        <td><strong>${eTot.atGradeLevel}</strong></td>
        <td class="gain"><strong>${comp.netAtGradeLevelGain > 0 ? `+${comp.netAtGradeLevelGain}` : comp.netAtGradeLevelGain}</strong></td>
        <td class="gain"><strong>${comp.netAtGradeLevelPctGain > 0 ? `+${comp.netAtGradeLevelPctGain.toFixed(1)}%` : `${comp.netAtGradeLevelPctGain.toFixed(1)}%`}</strong></td>
        <td><strong>${bTot.threeLevelDown.total.t}</strong></td>
        <td><strong>${eTot.threeLevelDown.total.t}</strong></td>
        <td class="gain"><strong>${eTot.threeLevelDown.total.t - bTot.threeLevelDown.total.t}</strong></td>
        <td><strong>${bFrustTot}</strong></td>
        <td><strong>${eFrustTot}</strong></td>
        <td class="gain"><strong>${eFrustTot - bFrustTot}</strong></td>
        <td><strong>${bIndepTot}</strong></td>
        <td><strong>${eIndepTot}</strong></td>
        <td class="gain"><strong>${eIndepTot - bIndepTot > 0 ? `+${eIndepTot - bIndepTot}` : eIndepTot - bIndepTot}</strong></td>
      </tr>
    </tbody>
  </table>
  `;

  return html;
}

export function exportSinglePhilIriWord(
  language: 'english' | 'filipino', 
  grade: 'grade4' | 'grade5' | 'grade6',
  period: 'bosy' | 'eosy' = 'eosy'
) {
  const gradeLabelMap = { grade4: 'Grade 4', grade5: 'Grade 5', grade6: 'Grade 6' };
  const langLabel = language === 'english' ? 'English' : 'Filipino';
  const gradeLabel = gradeLabelMap[grade];
  const periodLabel = period === 'bosy' ? 'Pre-Test (BOSY)' : 'Post-Test (EOSY)';
  const data = period === 'bosy' ? PHIL_IRI_BOSY_DATA : PHIL_IRI_EOSY_DATA;
  const rows = data[language][grade];

  const content = renderPhilIriTable(rows, gradeLabel, langLabel, periodLabel);
  const filename = `DepEd_Toboso_PhilIRI_${langLabel}_${grade.toUpperCase()}_${period.toUpperCase()}_SY2025_2026.doc`;
  downloadWordDoc(filename, `Philippine Informal Reading Inventory (Phil-IRI)`, content, `${langLabel} · ${gradeLabel} · ${periodLabel}`);
}

export function exportAllGradesPhilIriWord(
  language: 'english' | 'filipino',
  period: 'bosy' | 'eosy' = 'eosy'
) {
  const langLabel = language === 'english' ? 'English' : 'Filipino';
  const periodLabel = period === 'bosy' ? 'Pre-Test (BOSY)' : 'Post-Test (EOSY)';
  const data = period === 'bosy' ? PHIL_IRI_BOSY_DATA : PHIL_IRI_EOSY_DATA;

  let content = `
    <div style="margin-bottom: 15pt; background-color: #f1f5f9; padding: 8pt; border: 1pt solid #cbd5e1;">
      <strong>PHIL-IRI ${langLabel.toUpperCase()} CONSOLIDATED REPORT (${periodLabel.toUpperCase()})</strong>
      <p style="margin: 2pt 0 0 0; font-size: 8pt; color: #475569;">
        Official comprehensive district consolidation for the 21 elementary schools of the District of Toboso (Grades 4, 5, and 6).
      </p>
    </div>
  `;

  content += renderPhilIriTable(data[language].grade4, 'Grade 4', langLabel, periodLabel);
  content += '<br>';
  content += renderPhilIriTable(data[language].grade5, 'Grade 5', langLabel, periodLabel);
  content += '<br>';
  content += renderPhilIriTable(data[language].grade6, 'Grade 6', langLabel, periodLabel);

  const filename = `DepEd_Toboso_PhilIRI_${langLabel}_AllGrades_${period.toUpperCase()}_SY2025_2026.doc`;
  downloadWordDoc(filename, `Phil-IRI Comprehensive ${langLabel} Consolidated Report`, content, `Grades 4–6 Complete Matrix · ${periodLabel}`);
}

export function exportPhilIriComparativeWord(language: 'english' | 'filipino') {
  const langLabel = language === 'english' ? 'English' : 'Filipino';
  const bData = PHIL_IRI_BOSY_DATA[language];
  const eData = PHIL_IRI_EOSY_DATA[language];

  let content = `
    <div style="margin-bottom: 15pt; background-color: #f1f5f9; padding: 8pt; border: 1pt solid #cbd5e1;">
      <strong>PHIL-IRI ${langLabel.toUpperCase()} PRE-TEST (BOSY) VS POST-TEST (EOSY) COMPARATIVE GROWTH REPORT</strong>
      <p style="margin: 2pt 0 0 0; font-size: 8pt; color: #475569;">
        Year-round learner progression and reading level mobility across all 21 elementary schools in the District of Toboso.
      </p>
    </div>
  `;

  content += renderPhilIriComparativeTable(bData.grade4, eData.grade4, 'Grade 4', langLabel);
  content += '<br>';
  content += renderPhilIriComparativeTable(bData.grade5, eData.grade5, 'Grade 5', langLabel);
  content += '<br>';
  content += renderPhilIriComparativeTable(bData.grade6, eData.grade6, 'Grade 6', langLabel);

  const filename = `DepEd_Toboso_PhilIRI_${langLabel}_Comparative_Growth_SY2025_2026.doc`;
  downloadWordDoc(filename, `Phil-IRI Comparative Growth Report`, content, `${langLabel} · Grades 4–6 BOSY vs EOSY`);
}
