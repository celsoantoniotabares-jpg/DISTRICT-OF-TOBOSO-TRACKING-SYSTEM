import { RMASchoolRecord, DISTRICT_RMA_TOTALS } from '../data/rmaData';

/**
 * DepEd DO 3, s. 2026 Annex A Artificial Intelligence Declaration Statement for RMA
 */
export const DEPED_RMA_AI_DECLARATION = `AI DECLARATION (DepEd Order No. 003, s. 2026, Annex A):
In strict compliance with DepEd guidelines on the ethical, transparent, and responsible use of Artificial Intelligence in basic education administration, this data consolidation and analytics portal utilizes automated computational aggregation and algorithmic synthesis solely to assist school heads, district supervisors, and numeracy focal persons in evidence-based curriculum decision-making. All underlying learner assessment data is directly derived from official teacher-administered Rapid Mathematics Assessment (RMA) instruments and has been cross-verified with official District of Toboso quality-assured matrices. No automated profiling of individual students is conducted.`;

/**
 * Downloads an HTML-formatted Word document (.doc) compatible with Microsoft Word in landscape.
 */
function downloadRMAWordDoc(filename: string, title: string, contentHtml: string, periodSubtitle: string = '') {
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
        th, td { border: 1pt solid #475569; padding: 4.5pt 6pt; text-align: center; font-size: 9pt; }
        th { background-color: #0f172a; color: #ffffff; font-weight: bold; }
        th.sub { background-color: #334155; }
        th.school-col { text-align: left; }
        td.school-name { text-align: left; font-weight: 600; }
        tr.total-row { background-color: #fef08a; font-weight: bold; }
        tr.total-row td { border-top: 2pt solid #0f172a; font-weight: bold; }
        tr:nth-child(even):not(.total-row) { background-color: #f8fafc; }
        .badge-danger { background-color: #fee2e2; color: #991b1b; font-weight: bold; }
        .badge-warn { background-color: #fef3c7; color: #92400e; font-weight: bold; }
        .badge-success { background-color: #dcfce7; color: #166534; font-weight: bold; }
        .ai-declaration-box { margin-top: 22pt; padding: 8pt 12pt; background-color: #f8fafc; border: 1pt solid #cbd5e1; border-left: 4pt solid #0284c7; font-size: 8pt; color: #475569; line-height: 1.4; text-align: justify; }
        .footer { margin-top: 14pt; font-size: 8pt; color: #64748b; text-align: center; border-top: 1pt solid #cbd5e1; padding-top: 6pt; }
        .summary-grid { display: table; width: 100%; margin-bottom: 12pt; }
        .summary-card { display: table-cell; padding: 8pt 12pt; background-color: #f1f5f9; border: 1pt solid #cbd5e1; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <div class="deped-tag">Republic of the Philippines · Department of Education</div>
        <div class="deped-tag">Region VI - Western Visayas / Negros Island Region (NIR) · Division of Negros Occidental</div>
        <div class="title">DISTRICT OF TOBOSO</div>
        <div class="subtitle">${title} ${periodSubtitle ? `· ${periodSubtitle}` : ''}</div>
        <div class="date">Official DepEd RMA Tracking System · S.Y. 2025-2026 · Generated on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      ${contentHtml}
      <div class="ai-declaration-box">
        <strong>COMPLIANCE NOTICE:</strong> ${DEPED_RMA_AI_DECLARATION}
      </div>
      <div class="footer">
        District of Toboso Rapid Mathematics Assessment (RMA) Monitoring & Evaluation System · Official DepEd Record
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

/**
 * 1. Export BOSY RMA Official Report
 */
export function exportRMABosyWord(schools: RMASchoolRecord[]) {
  const rows = schools.map(s => `
    <tr>
      <td>${s.order}</td>
      <td class="school-name">${s.officialName}</td>
      <td class="badge-danger">${s.bosy.notProficient}</td>
      <td class="badge-warn">${s.bosy.lowProficient}</td>
      <td style="font-weight: bold;">${s.bosy.total}</td>
    </tr>
  `).join('');

  const html = `
    <h3 style="color: #0f172a; margin-top: 0; text-transform: uppercase;">BOSY RMA RESULT (SCHOOL YEAR 2025- 2026)</h3>
    <p style="font-size: 8.5pt; color: #475569;">Baseline numeracy diagnostics identifying learners categorized under Not Proficient and Low Proficient tiers requiring immediate targeted interventions.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 35px;">NO.</th>
          <th class="school-col">NAME OF SCHOOL</th>
          <th style="background-color: #991b1b; color: white;">NOT PROFICIENT</th>
          <th style="background-color: #b45309; color: white;">LOW PROFICIENT</th>
          <th style="background-color: #0f172a; color: white;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-right: 12pt;">DISTRICT TOTAL</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.notProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.lowProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.total}</td>
        </tr>
      </tbody>
    </table>
  `;

  downloadRMAWordDoc(
    `DISTRICT_OF_TOBOSO_RMA_BOSY_SY2025_2026.doc`,
    'RAPID MATHEMATICS ASSESSMENT (RMA) BOSY RESULT',
    html,
    'S.Y. 2025-2026 BASELINE'
  );
}

/**
 * 2. Export EOSY RMA Official Report
 */
export function exportRMAEosyWord(schools: RMASchoolRecord[]) {
  const rows = schools.map(s => `
    <tr>
      <td>${s.order}</td>
      <td class="school-name">${s.officialName}</td>
      <td class="badge-danger">${s.eosy.notProficient}</td>
      <td class="badge-warn">${s.eosy.lowProficient}</td>
      <td style="font-weight: bold;">${s.eosy.total}</td>
    </tr>
  `).join('');

  const html = `
    <h3 style="color: #0f172a; margin-top: 0; text-transform: uppercase;">EOSY RMA RESULT (SCHOOL YEAR 2025- 2026)</h3>
    <p style="font-size: 8.5pt; color: #475569;">End-of-School-Year post-intervention assessment identifying retained numeracy priority learners across all 21 elementary stations.</p>
    <table>
      <thead>
        <tr>
          <th style="width: 35px;">NO.</th>
          <th class="school-col">NAME OF SCHOOL</th>
          <th style="background-color: #991b1b; color: white;">NOT PROFICIENT</th>
          <th style="background-color: #b45309; color: white;">LOW PROFICIENT</th>
          <th style="background-color: #0f172a; color: white;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-right: 12pt;">DISTRICT TOTAL</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.notProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.lowProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.total}</td>
        </tr>
      </tbody>
    </table>
  `;

  downloadRMAWordDoc(
    `DISTRICT_OF_TOBOSO_RMA_EOSY_SY2025_2026.doc`,
    'RAPID MATHEMATICS ASSESSMENT (RMA) EOSY RESULT',
    html,
    'S.Y. 2025-2026 POST-ASSESSMENT'
  );
}

/**
 * 3. Export Comparative Growth & Reduction Matrix
 */
export function exportRMAComparativeWord(schools: RMASchoolRecord[]) {
  const rows = schools.map(s => {
    const diffNP = s.eosy.notProficient - s.bosy.notProficient;
    const diffLP = s.eosy.lowProficient - s.bosy.lowProficient;
    const diffTotal = s.eosy.total - s.bosy.total;
    const pctReduction = s.bosy.total > 0 ? ((diffTotal / s.bosy.total) * 100).toFixed(1) : '0.0';

    return `
      <tr>
        <td>${s.order}</td>
        <td class="school-name">${s.officialName}</td>
        <td>${s.bosy.notProficient}</td>
        <td>${s.bosy.lowProficient}</td>
        <td style="font-weight: bold; background-color: #f1f5f9;">${s.bosy.total}</td>
        <td>${s.eosy.notProficient}</td>
        <td>${s.eosy.lowProficient}</td>
        <td style="font-weight: bold; background-color: #f1f5f9;">${s.eosy.total}</td>
        <td style="color: ${diffNP <= 0 ? '#166534' : '#991b1b'}; font-weight: bold;">${diffNP > 0 ? `+${diffNP}` : diffNP}</td>
        <td style="color: ${diffLP <= 0 ? '#166534' : '#991b1b'}; font-weight: bold;">${diffLP > 0 ? `+${diffLP}` : diffLP}</td>
        <td style="color: ${diffTotal <= 0 ? '#166534' : '#991b1b'}; font-weight: bold; background-color: ${diffTotal < 0 ? '#dcfce7' : '#f8fafc'};">
          ${diffTotal > 0 ? `+${diffTotal}` : diffTotal}
        </td>
        <td style="font-weight: bold; color: ${diffTotal <= 0 ? '#166534' : '#991b1b'};">
          ${pctReduction}%
        </td>
      </tr>
    `;
  }).join('');

  const totDiffNP = DISTRICT_RMA_TOTALS.netChange.notProficient;
  const totDiffLP = DISTRICT_RMA_TOTALS.netChange.lowProficient;
  const totDiff = DISTRICT_RMA_TOTALS.netChange.total;
  const totPct = DISTRICT_RMA_TOTALS.netChange.totalPct.toFixed(1);

  const html = `
    <h3 style="color: #0f172a; margin-top: 0; text-transform: uppercase;">RMA COMPARATIVE GROWTH & RECOVERY MATRIX (S.Y. 2025-2026)</h3>
    <p style="font-size: 8.5pt; color: #475569;">Official tracking of numeracy learning recovery across all 21 schools in the District of Toboso comparing Beginning of School Year (BOSY) against End of School Year (EOSY) data.</p>
    
    <div style="margin-bottom: 10pt; padding: 8pt; background-color: #f8fafc; border: 1pt solid #cbd5e1;">
      <strong>District Recovery Summary:</strong> 
      A total of <strong>${Math.abs(totDiff)}</strong> learners successfully moved out of Not Proficient and Low Proficient tiers, representing an overall district-wide intervention reduction of <strong>${Math.abs(Number(totPct))}%</strong>.
    </div>

    <table>
      <thead>
        <tr>
          <th rowspan="2" style="width: 30px;">NO.</th>
          <th rowspan="2" class="school-col">NAME OF SCHOOL</th>
          <th colspan="3" style="background-color: #334155; color: white;">BOSY BASELINE</th>
          <th colspan="3" style="background-color: #0f172a; color: white;">EOSY POST-ASSESSMENT</th>
          <th colspan="4" style="background-color: #166534; color: white;">RECOVERY / REDUCTION MATRIX</th>
        </tr>
        <tr>
          <th style="font-size: 8pt;">Not Prof</th>
          <th style="font-size: 8pt;">Low Prof</th>
          <th style="font-size: 8pt;">Total</th>
          <th style="font-size: 8pt;">Not Prof</th>
          <th style="font-size: 8pt;">Low Prof</th>
          <th style="font-size: 8pt;">Total</th>
          <th style="font-size: 8pt;">Δ Not Prof</th>
          <th style="font-size: 8pt;">Δ Low Prof</th>
          <th style="font-size: 8pt;">Net Δ Total</th>
          <th style="font-size: 8pt;">% Reduction</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-right: 12pt;">DISTRICT TOTAL</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.notProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.lowProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.bosy.total}</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.notProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.lowProficient}</td>
          <td>${DISTRICT_RMA_TOTALS.eosy.total}</td>
          <td>${totDiffNP}</td>
          <td>${totDiffLP}</td>
          <td>${totDiff}</td>
          <td>${totPct}%</td>
        </tr>
      </tbody>
    </table>
  `;

  downloadRMAWordDoc(
    `DISTRICT_OF_TOBOSO_RMA_COMPARATIVE_RECOVERY_SY2025_2026.doc`,
    'RMA COMPARATIVE GROWTH & LEARNING RECOVERY REPORT',
    html,
    'S.Y. 2025-2026 BOSY VS. EOSY'
  );
}

/**
 * 4. Export Individual School RMA Report
 */
export function exportIndividualSchoolRMAWord(school: RMASchoolRecord) {
  const diffNP = school.eosy.notProficient - school.bosy.notProficient;
  const diffLP = school.eosy.lowProficient - school.bosy.lowProficient;
  const diffTotal = school.eosy.total - school.bosy.total;
  const pctReduction = school.bosy.total > 0 ? ((diffTotal / school.bosy.total) * 100).toFixed(1) : '0.0';

  const html = `
    <h3 style="color: #0f172a; margin-top: 0; text-transform: uppercase;">${school.officialName}</h3>
    <p style="font-size: 9pt; color: #475569;">
      <strong>School ID:</strong> ${school.schoolId} &nbsp;|&nbsp; 
      <strong>Barangay / Location:</strong> ${school.barangay} &nbsp;|&nbsp; 
      <strong>Curriculum Area:</strong> Rapid Mathematics Assessment (RMA)
    </p>

    <table>
      <thead>
        <tr>
          <th>ASSESSMENT PERIOD</th>
          <th style="background-color: #991b1b; color: white;">NOT PROFICIENT</th>
          <th style="background-color: #b45309; color: white;">LOW PROFICIENT</th>
          <th style="background-color: #0f172a; color: white;">TOTAL AT-RISK</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: bold; text-align: left;">BOSY (Beginning of School Year Baseline)</td>
          <td>${school.bosy.notProficient}</td>
          <td>${school.bosy.lowProficient}</td>
          <td style="font-weight: bold;">${school.bosy.total}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; text-align: left;">EOSY (End of School Year Post-Test)</td>
          <td>${school.eosy.notProficient}</td>
          <td>${school.eosy.lowProficient}</td>
          <td style="font-weight: bold;">${school.eosy.total}</td>
        </tr>
        <tr style="background-color: #dcfce7; font-weight: bold;">
          <td style="text-align: left;">NET CHANGE (Intervention Impact)</td>
          <td style="color: ${diffNP <= 0 ? '#166534' : '#991b1b'};">${diffNP > 0 ? `+${diffNP}` : diffNP}</td>
          <td style="color: ${diffLP <= 0 ? '#166534' : '#991b1b'};">${diffLP > 0 ? `+${diffLP}` : diffLP}</td>
          <td style="color: ${diffTotal <= 0 ? '#166534' : '#991b1b'}; font-size: 10pt;">${diffTotal > 0 ? `+${diffTotal}` : diffTotal} (${pctReduction}%)</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 14pt; padding: 10pt; background-color: #f1f5f9; border: 1pt solid #cbd5e1;">
      <h4 style="margin: 0 0 6pt 0; text-transform: uppercase; font-size: 9pt; color: #0f172a;">School Numeracy Performance Notes:</h4>
      <p style="margin: 0; font-size: 8.5pt; color: #334155; line-height: 1.4;">
        ${diffTotal < 0 
          ? `The school achieved a notable reduction of ${Math.abs(diffTotal)} at-risk numeracy learners (${Math.abs(Number(pctReduction))}%), demonstrating significant mastery and transition from Not Proficient / Low Proficient bands into proficient numeracy competencies.`
          : diffTotal === 0 
          ? `The school maintained consistent baseline and post-assessment figures. Targeted remedial sessions and specialized numeracy learning kits are recommended for sustained intervention.`
          : `The school identified additional learners requiring numeracy support during post-assessment. Continued supplementary math instruction is advised.`
        }
      </p>
    </div>
  `;

  downloadRMAWordDoc(
    `${school.officialName.replace(/\s+/g, '_')}_RMA_OFFICIAL_REPORT.doc`,
    `${school.officialName} - RMA Official Assessment Report`,
    html,
    'S.Y. 2025-2026'
  );
}
