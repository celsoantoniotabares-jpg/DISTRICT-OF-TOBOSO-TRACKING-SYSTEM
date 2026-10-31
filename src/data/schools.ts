import { SchoolRecord } from '../types';
import { CRLA_BOSY_SCHOOLS } from './crlaBosyData';
import { CRLA_EOSY_SCHOOLS } from './crlaEosyData';

/**
 * Official 21 Elementary Schools in the District of Toboso, SDO Negros Occidental.
 * Pre-populated with the exact official S.Y. 2025-2026 CRLA BOSY baseline data
 * AND official S.Y. 2025-2026 CRLA EOSY post-test data from DepEd.
 */
export const TOBOSO_SCHOOLS_INITIAL: SchoolRecord[] = CRLA_BOSY_SCHOOLS.map((sch, index) => {
  const eosyMatch = CRLA_EOSY_SCHOOLS.find(e => e.schoolId === sch.schoolId) || CRLA_EOSY_SCHOOLS[index];
  return {
    id: `sch-${sch.schoolId}`,
    order: sch.order,
    schoolId: sch.schoolId,
    name: sch.displayName,
    officialName: sch.officialName,
    level: 'Elementary' as const,
    barangay: `${sch.officialName.replace(' ES', '').replace('TOBOSO CENTRAL SCHOOL', 'Poblacion')}, Toboso`,
    headName: 'School Head / Teacher-In-Charge',
    headPosition: sch.officialName.includes('CENTRAL') ? 'Principal III' : 'Head Teacher / TIC',
    contactNumber: 'District Registered',
    encodingStatus: 'Completed' as const, // Pre-encoded with official BOSY and EOSY data
    lastEncodedDate: '2026-03-30 (BOSY & EOSY Official)',
    encodedBy: 'DepEd Toboso District CRLA Coordinator',
    bosy: {
      grade1: sch.grade1,
      grade2: sch.grade2,
      grade3: sch.grade3,
    },
    eosy: eosyMatch ? {
      grade1: eosyMatch.grade1,
      grade2: eosyMatch.grade2,
      grade3: eosyMatch.grade3,
    } : null,
    notes: 'Official CRLA BOSY Baseline & EOSY Post-Test Results verified.',
  };
});

