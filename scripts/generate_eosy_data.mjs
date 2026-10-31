import fs from 'fs';
import { g1_mtb, g2_mtb, g2_fil, g3_mtb, g3_fil, g3_eng } from './verify_all_eosy.mjs';

const schoolsMeta = [
  { order: 1, officialName: "AMPARADO ES", displayName: "Amparado ES", schoolId: "117501" },
  { order: 2, officialName: "BANDILA ES", displayName: "Bandila ES", schoolId: "117502" },
  { order: 3, officialName: "BUG-ANG ES", displayName: "Bug-ang ES", schoolId: "117503" },
  { order: 4, officialName: "CANUBGAN ES", displayName: "Canubgan ES", schoolId: "117504" },
  { order: 5, officialName: "DON NICOLAS A. LIZARES INTEGRATED SCHOOL", displayName: "Don Nicolas A. Lizares IS", schoolId: "500445" },
  { order: 6, officialName: "GENERAL LUNA ES", displayName: "General Luna ES", schoolId: "117506" },
  { order: 7, officialName: "HAYANGON ES", displayName: "Hayangon ES", schoolId: "117507" },
  { order: 8, officialName: "LABILABI ES", displayName: "Labilabi ES", schoolId: "117508" },
  { order: 9, officialName: "MAGTICOL ES", displayName: "Magticol ES", schoolId: "117509" },
  { order: 10, officialName: "MAINIT ES", displayName: "Mainit ES", schoolId: "117510" },
  { order: 11, officialName: "POLOPANGYAN ES", displayName: "Polopangyan ES", schoolId: "117511" },
  { order: 12, officialName: "SALAMANCA ES", displayName: "Salamanca ES", schoolId: "117512" },
  { order: 13, officialName: "SAN ISIDRO ES", displayName: "San Isidro ES", schoolId: "117513" },
  { order: 14, officialName: "SOCORRO SY ESTRADA MES", displayName: "Socorro Sy Estrada MES", schoolId: "117514" },
  { order: 15, officialName: "STOP AGUINALDO ES", displayName: "Stop Aguinaldo ES", schoolId: "117515" },
  { order: 16, officialName: "TABUN-AC ES", displayName: "Tabun-ac ES", schoolId: "117516" },
  { order: 17, officialName: "TINIBAWAN ES", displayName: "Tinibawan ES", schoolId: "117517" },
  { order: 18, officialName: "TOBOSO CENTRAL SCHOOL", displayName: "Toboso Central School", schoolId: "117518" },
  { order: 19, officialName: "TORIL ES", displayName: "Toril ES", schoolId: "117519" },
  { order: 20, officialName: "ULDARICO SUISON ES", displayName: "Uldarico Suison ES", schoolId: "117520" },
  { order: 21, officialName: "VERGARA ES", displayName: "Vergara ES", schoolId: "117521" }
];

function buildSubject(row) {
  const [name, en_m, en_f, as_m, as_f, le_m, le_f, he_m, he_f, dev_m, dev_f, tr_m, tr_f, ag_m, ag_f] = row;
  const em_m = le_m + he_m;
  const em_f = le_f + he_f;
  return {
    enrolment: { m: en_m, f: en_f, total: en_m + en_f },
    assessed: { m: as_m, f: as_f, total: as_m + as_f },
    lowEmerging: { m: le_m, f: le_f, total: le_m + le_f },
    highEmerging: { m: he_m, f: he_f, total: he_m + he_f },
    emerging: { m: em_m, f: em_f, total: em_m + em_f },
    developing: { m: dev_m, f: dev_f, total: dev_m + dev_f },
    transitioning: { m: tr_m, f: tr_f, total: tr_m + tr_f },
    atGradeLevel: { m: ag_m, f: ag_f, total: ag_m + ag_f }
  };
}

const schools = schoolsMeta.map((meta, i) => {
  return {
    order: meta.order,
    officialName: meta.officialName,
    displayName: meta.displayName,
    schoolId: meta.schoolId,
    grade1: {
      mtb: buildSubject(g1_mtb[i])
    },
    grade2: {
      mtb: buildSubject(g2_mtb[i]),
      filipino: buildSubject(g2_fil[i])
    },
    grade3: {
      mtb: buildSubject(g3_mtb[i]),
      filipino: buildSubject(g3_fil[i]),
      english: buildSubject(g3_eng[i])
    }
  };
});

function sumSubject(list, selector) {
  const subjects = list.map(selector);
  const sumMetric = (key) => ({
    m: subjects.reduce((acc, s) => acc + s[key].m, 0),
    f: subjects.reduce((acc, s) => acc + s[key].f, 0),
    total: subjects.reduce((acc, s) => acc + s[key].total, 0)
  });
  return {
    enrolment: sumMetric('enrolment'),
    assessed: sumMetric('assessed'),
    lowEmerging: sumMetric('lowEmerging'),
    highEmerging: sumMetric('highEmerging'),
    emerging: sumMetric('emerging'),
    developing: sumMetric('developing'),
    transitioning: sumMetric('transitioning'),
    atGradeLevel: sumMetric('atGradeLevel')
  };
}

const districtTotals = {
  grade1: {
    mtb: sumSubject(schools, s => s.grade1.mtb)
  },
  grade2: {
    mtb: sumSubject(schools, s => s.grade2.mtb),
    filipino: sumSubject(schools, s => s.grade2.filipino)
  },
  grade3: {
    mtb: sumSubject(schools, s => s.grade3.mtb),
    filipino: sumSubject(schools, s => s.grade3.filipino),
    english: sumSubject(schools, s => s.grade3.english)
  }
};

const output = `/**
 * DepEd District of Toboso CRLA (Comprehensive Rapid Literacy Assessment)
 * S.Y. 2025-2026 E.O.S.Y. (End of School Year) Official Post-Test Results
 * Division of Negros Occidental - Negros Island Region (NIR)
 * 
 * Extracted and verified from official DepEd District of Toboso E.O.S.Y. reports:
 * - Grade 1 MTB
 * - Grade 2 MTB & Filipino
 * - Grade 3 MTB, Filipino, and English
 */

import { CRLASchoolRecord, CRLASubjectData } from '../types';

export const CRLA_EOSY_SCHOOLS: CRLASchoolRecord[] = ${JSON.stringify(schools, null, 2)};

export const DISTRICT_CRLA_EOSY_TOTALS = ${JSON.stringify(districtTotals, null, 2)};
`;

fs.writeFileSync('src/data/crlaEosyData.ts', output);
console.log('src/data/crlaEosyData.ts written successfully!');
