/**
 * DepEd District of Toboso RMA (Rapid Mathematics Assessment)
 * S.Y. 2025-2026 BOSY (Beginning of School Year) and EOSY (End of School Year) Official Data
 * Division of Negros Occidental - Negros Island Region (NIR)
 */

export interface RMALevelData {
  notProficient: number;
  lowProficient: number;
  total: number;
}

export interface RMASchoolRecord {
  order: number;
  schoolId: string;
  officialName: string;
  displayName: string;
  barangay: string;
  bosy: RMALevelData;
  eosy: RMALevelData;
}

export const RMA_DISTRICT_DATA: RMASchoolRecord[] = [
  {
    order: 1,
    schoolId: '117501',
    officialName: 'AMPARADO ES',
    displayName: 'AMPARADO Elementary School',
    barangay: 'Amparado, Toboso',
    bosy: { notProficient: 18, lowProficient: 35, total: 53 },
    eosy: { notProficient: 1, lowProficient: 6, total: 7 },
  },
  {
    order: 2,
    schoolId: '117502',
    officialName: 'BANDILA ES',
    displayName: 'BANDILA Elementary School',
    barangay: 'Bandila, Toboso',
    bosy: { notProficient: 23, lowProficient: 31, total: 54 },
    eosy: { notProficient: 15, lowProficient: 22, total: 37 },
  },
  {
    order: 3,
    schoolId: '117503',
    officialName: 'BUG-ANG ES',
    displayName: 'BUG-ANG Elementary School',
    barangay: 'Bug-ang, Toboso',
    bosy: { notProficient: 28, lowProficient: 153, total: 181 },
    eosy: { notProficient: 2, lowProficient: 30, total: 32 },
  },
  {
    order: 4,
    schoolId: '117504',
    officialName: 'CANUBGAN ES',
    displayName: 'CANUBGAN Elementary School',
    barangay: 'Canubgan, Toboso',
    bosy: { notProficient: 37, lowProficient: 41, total: 78 },
    eosy: { notProficient: 37, lowProficient: 41, total: 78 },
  },
  {
    order: 5,
    schoolId: '117505',
    officialName: 'DNALIS',
    displayName: 'Doña Nicole Antonio Lopez IS',
    barangay: 'DNALIS, Toboso',
    bosy: { notProficient: 27, lowProficient: 46, total: 73 },
    eosy: { notProficient: 1, lowProficient: 17, total: 18 },
  },
  {
    order: 6,
    schoolId: '117506',
    officialName: 'GEN.LUNA ES',
    displayName: 'GEN. LUNA Elementary School',
    barangay: 'General Luna, Toboso',
    bosy: { notProficient: 40, lowProficient: 37, total: 77 },
    eosy: { notProficient: 13, lowProficient: 27, total: 40 },
  },
  {
    order: 7,
    schoolId: '117507',
    officialName: 'HAYANGON ES',
    displayName: 'HAYANGON Elementary School',
    barangay: 'Hayangon, Toboso',
    bosy: { notProficient: 18, lowProficient: 22, total: 40 },
    eosy: { notProficient: 3, lowProficient: 7, total: 10 },
  },
  {
    order: 8,
    schoolId: '117508',
    officialName: 'LABILABI ES',
    displayName: 'LABILABI Elementary School',
    barangay: 'Labilabi, Toboso',
    bosy: { notProficient: 8, lowProficient: 29, total: 37 },
    eosy: { notProficient: 0, lowProficient: 2, total: 2 },
  },
  {
    order: 9,
    schoolId: '117509',
    officialName: 'MAGTICOL ES',
    displayName: 'MAGTICOL Elementary School',
    barangay: 'Magticol, Toboso',
    bosy: { notProficient: 14, lowProficient: 26, total: 40 },
    eosy: { notProficient: 3, lowProficient: 2, total: 5 },
  },
  {
    order: 10,
    schoolId: '117510',
    officialName: 'MAINIT ES',
    displayName: 'MAINIT Elementary School',
    barangay: 'Mainit, Toboso',
    bosy: { notProficient: 0, lowProficient: 17, total: 17 },
    eosy: { notProficient: 2, lowProficient: 3, total: 5 },
  },
  {
    order: 11,
    schoolId: '117511',
    officialName: 'POLOPANGYAN ES',
    displayName: 'POLOPANGYAN Elementary School',
    barangay: 'Polopangyan, Toboso',
    bosy: { notProficient: 53, lowProficient: 90, total: 143 },
    eosy: { notProficient: 0, lowProficient: 7, total: 7 },
  },
  {
    order: 12,
    schoolId: '117512',
    officialName: 'SALAMANCA ES',
    displayName: 'SALAMANCA Elementary School',
    barangay: 'Salamanca, Toboso',
    bosy: { notProficient: 41, lowProficient: 128, total: 169 },
    eosy: { notProficient: 4, lowProficient: 22, total: 26 },
  },
  {
    order: 13,
    schoolId: '117513',
    officialName: 'SAN ISIDRO ES',
    displayName: 'SAN ISIDRO Elementary School',
    barangay: 'San Isidro, Toboso',
    bosy: { notProficient: 45, lowProficient: 80, total: 125 },
    eosy: { notProficient: 2, lowProficient: 15, total: 17 },
  },
  {
    order: 14,
    schoolId: '117514',
    officialName: 'SOCORRO SY ESTRADA ES',
    displayName: 'SOCORRO SY ESTRADA Elementary School',
    barangay: 'Socorro, Toboso',
    bosy: { notProficient: 40, lowProficient: 24, total: 64 },
    eosy: { notProficient: 1, lowProficient: 11, total: 12 },
  },
  {
    order: 15,
    schoolId: '117515',
    officialName: 'STOP AGUINALDO ES',
    displayName: 'STOP AGUINALDO Elementary School',
    barangay: 'Aguinaldo, Toboso',
    bosy: { notProficient: 19, lowProficient: 112, total: 131 },
    eosy: { notProficient: 0, lowProficient: 6, total: 6 },
  },
  {
    order: 16,
    schoolId: '117516',
    officialName: 'TABUN-AC ES',
    displayName: 'TABUN-AC Elementary School',
    barangay: 'Tabun-ac, Toboso',
    bosy: { notProficient: 25, lowProficient: 23, total: 48 },
    eosy: { notProficient: 7, lowProficient: 8, total: 15 },
  },
  {
    order: 17,
    schoolId: '117517',
    officialName: 'TINIBAWAN ES',
    displayName: 'TINIBAWAN Elementary School',
    barangay: 'Tinibawan, Toboso',
    bosy: { notProficient: 9, lowProficient: 12, total: 21 },
    eosy: { notProficient: 2, lowProficient: 1, total: 3 },
  },
  {
    order: 18,
    schoolId: '117518',
    officialName: 'TOBOSO CS',
    displayName: 'TOBOSO Central School',
    barangay: 'Poblacion, Toboso',
    bosy: { notProficient: 96, lowProficient: 160, total: 256 },
    eosy: { notProficient: 43, lowProficient: 134, total: 177 },
  },
  {
    order: 19,
    schoolId: '117519',
    officialName: 'TORIL ES',
    displayName: 'TORIL Elementary School',
    barangay: 'Toril, Toboso',
    bosy: { notProficient: 4, lowProficient: 29, total: 33 },
    eosy: { notProficient: 0, lowProficient: 13, total: 13 },
  },
  {
    order: 20,
    schoolId: '117520',
    officialName: 'ULDARICO SUISON ES',
    displayName: 'ULDARICO SUISON Elementary School',
    barangay: 'Suison, Toboso',
    bosy: { notProficient: 17, lowProficient: 28, total: 45 },
    eosy: { notProficient: 2, lowProficient: 6, total: 8 },
  },
  {
    order: 21,
    schoolId: '117521',
    officialName: 'VERGARA ES',
    displayName: 'VERGARA Elementary School',
    barangay: 'Vergara, Toboso',
    bosy: { notProficient: 16, lowProficient: 21, total: 37 },
    eosy: { notProficient: 16, lowProficient: 21, total: 37 },
  },
];

export const DISTRICT_RMA_TOTALS = {
  bosy: {
    notProficient: 578,
    lowProficient: 1144,
    total: 1722,
  },
  eosy: {
    notProficient: 154,
    lowProficient: 401,
    total: 555,
  },
  netChange: {
    notProficient: 154 - 578, // -424
    notProficientPct: ((154 - 578) / 578) * 100, // -73.36%
    lowProficient: 401 - 1144, // -743
    lowProficientPct: ((401 - 1144) / 1144) * 100, // -64.95%
    total: 555 - 1722, // -1167
    totalPct: ((555 - 1722) / 1722) * 100, // -67.77%
  },
};
