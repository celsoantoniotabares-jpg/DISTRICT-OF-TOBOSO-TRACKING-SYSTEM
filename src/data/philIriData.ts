// Official Phil-IRI (Philippine Informal Reading Inventory) Data
// District of Toboso · SDO Negros Occidental · DepEd NIR
// Grades 4, 5, and 6 for English and Filipino

export interface GenderCount {
  m: number;
  f: number;
  t: number;
}

export interface PhilIriSchoolRow {
  schoolId: string;
  schoolName: string;
  totalAssessed: number;
  atGradeLevel: number; // GST Score 14 to 20
  twoLevelDown: {
    independent: GenderCount;
    instructional: GenderCount;
    frustration: GenderCount;
    total: GenderCount;
  };
  threeLevelDown: {
    independent: GenderCount;
    instructional: GenderCount;
    frustration: GenderCount;
    total: GenderCount;
  };
}

export interface PhilIriDataset {
  grade4: PhilIriSchoolRow[];
  grade5: PhilIriSchoolRow[];
  grade6: PhilIriSchoolRow[];
}

// ----------------------------------------------------
// GRADE 4 ENGLISH
// ----------------------------------------------------
const G4_ENGLISH: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 29,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 6, f: 5, t: 11 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 9, f: 7, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 8, f: 5, t: 13 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 134,
    atGradeLevel: 111,
    twoLevelDown: {
      independent: { m: 3, f: 2, t: 5 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 6, f: 4, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 1, t: 4 },
      instructional: { m: 6, f: 1, t: 7 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 10, f: 3, t: 13 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 42,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 10, f: 8, t: 18 },
      instructional: { m: 8, f: 5, t: 13 },
      frustration: { m: 5, f: 1, t: 6 },
      total: { m: 23, f: 14, t: 37 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 59,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 4, f: 7, t: 11 },
      instructional: { m: 17, f: 15, t: 32 },
      frustration: { m: 6, f: 2, t: 8 },
      total: { m: 27, f: 24, t: 51 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 1, f: 0, t: 1 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 35,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 4, f: 5, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 5, t: 12 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 18,
    atGradeLevel: 1,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 3, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 4, t: 11 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 24,
    atGradeLevel: 1,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 3, f: 3, t: 6 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 7, f: 7, t: 14 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 4, f: 2, t: 6 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 4, t: 9 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 65,
    atGradeLevel: 38,
    twoLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 5, f: 5, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 4, t: 5 },
      instructional: { m: 6, f: 4, t: 10 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 9, f: 8, t: 17 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 33,
    atGradeLevel: 10,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 3, f: 0, t: 3 },
      total: { m: 9, f: 4, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 4, f: 2, t: 6 },
      total: { m: 4, f: 6, t: 10 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 12,
    atGradeLevel: 6,
    twoLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 4, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 68,
    atGradeLevel: 46,
    twoLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 3, f: 4, t: 7 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 5, f: 7, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 2, f: 5, t: 7 },
      total: { m: 3, f: 7, t: 10 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 72,
    atGradeLevel: 9,
    twoLevelDown: {
      independent: { m: 6, f: 8, t: 14 },
      instructional: { m: 7, f: 11, t: 18 },
      frustration: { m: 4, f: 2, t: 6 },
      total: { m: 17, f: 21, t: 38 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 5, t: 9 },
      instructional: { m: 4, f: 7, t: 11 },
      frustration: { m: 3, f: 3, t: 6 },
      total: { m: 11, f: 15, t: 26 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 71,
    atGradeLevel: 18,
    twoLevelDown: {
      independent: { m: 5, f: 4, t: 9 },
      instructional: { m: 11, f: 3, t: 14 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 19, f: 9, t: 28 }
    },
    threeLevelDown: {
      independent: { m: 7, f: 3, t: 10 },
      instructional: { m: 8, f: 2, t: 10 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 18, f: 7, t: 25 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 37,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 4, f: 8, t: 12 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 10, t: 15 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 3, f: 5, t: 8 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 92,
    atGradeLevel: 39,
    twoLevelDown: {
      independent: { m: 10, f: 8, t: 18 },
      instructional: { m: 7, f: 7, t: 14 },
      frustration: { m: 4, f: 2, t: 6 },
      total: { m: 21, f: 17, t: 38 }
    },
    threeLevelDown: {
      independent: { m: 7, f: 6, t: 13 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 2, t: 2 },
      total: { m: 7, f: 8, t: 15 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 25,
    atGradeLevel: 19,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 5, f: 1, t: 6 },
      total: { m: 5, f: 1, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 19,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 2, f: 5, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 4, f: 2, t: 6 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 7, f: 5, t: 12 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 153,
    atGradeLevel: 22,
    twoLevelDown: {
      independent: { m: 9, f: 10, t: 19 },
      instructional: { m: 10, f: 18, t: 28 },
      frustration: { m: 12, f: 9, t: 21 },
      total: { m: 31, f: 37, t: 68 }
    },
    threeLevelDown: {
      independent: { m: 6, f: 12, t: 18 },
      instructional: { m: 7, f: 18, t: 25 },
      frustration: { m: 11, f: 9, t: 20 },
      total: { m: 24, f: 39, t: 63 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 28,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 6, f: 4, t: 10 },
      total: { m: 7, f: 8, t: 15 }
    },
    threeLevelDown: {
      independent: { m: 10, f: 1, t: 11 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 6, f: 5, t: 11 },
      total: { m: 10, f: 7, t: 17 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 29,
    atGradeLevel: 13,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 6, f: 3, t: 9 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 8, f: 5, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 3, f: 0, t: 3 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 29,
    atGradeLevel: 6,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 2, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 5, f: 5, t: 10 },
      frustration: { m: 2, f: 5, t: 7 },
      total: { m: 8, f: 10, t: 18 }
    }
  }
];

// ----------------------------------------------------
// GRADE 4 FILIPINO
// ----------------------------------------------------
const G4_FILIPINO: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 29,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 4, f: 4, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 6, t: 7 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 7, f: 7, t: 14 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 134,
    atGradeLevel: 119,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 3, f: 2, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 5, f: 0, t: 4 }, // as shown in official sheet
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 7, f: 3, t: 10 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 42,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 6, f: 7, t: 13 },
      instructional: { m: 8, f: 4, t: 12 },
      frustration: { m: 3, f: 0, t: 3 },
      total: { m: 17, f: 11, t: 28 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 45,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 3, f: 10, t: 13 },
      frustration: { m: 10, f: 3, t: 13 },
      total: { m: 14, f: 14, t: 28 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 1, f: 4, t: 5 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 35,
    atGradeLevel: 21,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 4, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 4, t: 7 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 18,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 5, f: 2, t: 7 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 3, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 1, f: 0, t: 1 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 27,
    atGradeLevel: 2,
    twoLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 1, f: 2, t: 3 },
      total: { m: 6, f: 8, t: 14 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 3, t: 7 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 6, f: 5, t: 11 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 65,
    atGradeLevel: 42,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 7, f: 6, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 1, t: 1 },
      frustration: { m: 3, f: 1, t: 4 },
      total: { m: 3, f: 2, t: 5 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 33,
    atGradeLevel: 24,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 0, t: 3 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 0, f: 4, t: 4 },
      total: { m: 0, f: 6, t: 6 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 12,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 2, f: 4, t: 6 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 5, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 68,
    atGradeLevel: 52,
    twoLevelDown: {
      independent: { m: 7, f: 4, t: 11 },
      instructional: { m: 3, f: 3, t: 6 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 10, f: 8, t: 18 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 0, f: 3, t: 3 },
      frustration: { m: 2, f: 5, t: 7 },
      total: { m: 6, f: 10, t: 16 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 72,
    atGradeLevel: 19,
    twoLevelDown: {
      independent: { m: 6, f: 7, t: 13 },
      instructional: { m: 4, f: 10, t: 14 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 13, f: 19, t: 32 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 4, t: 8 },
      instructional: { m: 3, f: 7, t: 10 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 9, f: 12, t: 21 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 71,
    atGradeLevel: 33,
    twoLevelDown: {
      independent: { m: 6, f: 6, t: 12 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 10, f: 9, t: 19 }
    },
    threeLevelDown: {
      independent: { m: 5, f: 4, t: 9 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 4, f: 3, t: 7 },
      total: { m: 10, f: 9, t: 19 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 37,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 4, f: 8, t: 12 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 10, t: 15 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 3, f: 5, t: 8 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 26,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 5, t: 7 },
      frustration: { m: 4, f: 1, t: 5 },
      total: { m: 6, f: 6, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 153,
    atGradeLevel: 38,
    twoLevelDown: {
      independent: { m: 13, f: 12, t: 25 },
      instructional: { m: 15, f: 12, t: 27 },
      frustration: { m: 5, f: 2, t: 7 },
      total: { m: 33, f: 26, t: 59 }
    },
    threeLevelDown: {
      independent: { m: 12, f: 11, t: 23 },
      instructional: { m: 15, f: 11, t: 26 },
      frustration: { m: 5, f: 2, t: 7 },
      total: { m: 32, f: 24, t: 56 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 28,
    atGradeLevel: 8,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 3, f: 5, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 1, f: 4, t: 5 },
      total: { m: 4, f: 8, t: 12 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 29,
    atGradeLevel: 23,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 1, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 0, t: 2 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 29,
    atGradeLevel: 4,
    twoLevelDown: {
      independent: { m: 3, f: 1, t: 4 },
      instructional: { m: 5, f: 8, t: 13 },
      frustration: { m: 1, f: 2, t: 3 },
      total: { m: 9, f: 11, t: 20 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 3, f: 2, t: 5 }
    }
  }
];

// ----------------------------------------------------
// GRADE 5 ENGLISH
// ----------------------------------------------------
const G5_ENGLISH: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 30,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 2, f: 8, t: 10 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 3, f: 11, t: 14 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 5, f: 3, t: 8 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 9, f: 7, t: 16 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 102,
    atGradeLevel: 90,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 4, f: 0, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 3, t: 8 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 35,
    atGradeLevel: 4,
    twoLevelDown: {
      independent: { m: 3, f: 6, t: 9 },
      instructional: { m: 9, f: 8, t: 17 },
      frustration: { m: 4, f: 1, t: 5 },
      total: { m: 16, f: 15, t: 31 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 66,
    atGradeLevel: 9,
    twoLevelDown: {
      independent: { m: 1, f: 9, t: 10 },
      instructional: { m: 20, f: 12, t: 32 },
      frustration: { m: 6, f: 8, t: 14 },
      total: { m: 27, f: 29, t: 56 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 0, f: 1, t: 1 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 37,
    atGradeLevel: 16,
    twoLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 1, f: 5, t: 6 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 8, t: 11 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 1, f: 4, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 7, t: 10 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 21,
    atGradeLevel: 3,
    twoLevelDown: {
      independent: { m: 3, f: 1, t: 4 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 8, f: 2, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 5, f: 3, t: 8 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 17,
    atGradeLevel: 6,
    twoLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 3, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 4, f: 1, t: 5 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 55,
    atGradeLevel: 28,
    twoLevelDown: {
      independent: { m: 4, f: 1, t: 5 },
      instructional: { m: 3, f: 4, t: 7 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 8, f: 5, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 1, t: 5 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 9, f: 5, t: 14 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 17,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 3, t: 3 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 0, t: 2 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 6, f: 1, t: 7 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 21,
    atGradeLevel: 8,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 4, f: 1, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 5, f: 2, t: 7 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 5, f: 3, t: 8 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 53,
    atGradeLevel: 23,
    twoLevelDown: {
      independent: { m: 4, f: 1, t: 5 },
      instructional: { m: 3, f: 4, t: 7 },
      frustration: { m: 6, f: 2, t: 8 },
      total: { m: 13, f: 7, t: 20 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 5, t: 5 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 3, f: 7, t: 10 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 78,
    atGradeLevel: 10,
    twoLevelDown: {
      independent: { m: 4, f: 6, t: 10 },
      instructional: { m: 10, f: 12, t: 22 },
      frustration: { m: 7, f: 1, t: 8 },
      total: { m: 21, f: 19, t: 40 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 7, f: 10, t: 17 },
      frustration: { m: 3, f: 1, t: 4 },
      total: { m: 13, f: 15, t: 28 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 68,
    atGradeLevel: 16,
    twoLevelDown: {
      independent: { m: 5, f: 5, t: 10 },
      instructional: { m: 7, f: 5, t: 12 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 14, f: 11, t: 25 }
    },
    threeLevelDown: {
      independent: { m: 5, f: 4, t: 9 },
      instructional: { m: 6, f: 6, t: 12 },
      frustration: { m: 4, f: 2, t: 6 },
      total: { m: 15, f: 12, t: 27 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 41,
    atGradeLevel: 21,
    twoLevelDown: {
      independent: { m: 6, f: 3, t: 9 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 8, f: 4, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 4, f: 0, t: 4 },
      total: { m: 7, f: 1, t: 8 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 75,
    atGradeLevel: 21,
    twoLevelDown: {
      independent: { m: 16, f: 10, t: 26 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 21, f: 11, t: 32 }
    },
    threeLevelDown: {
      independent: { m: 10, f: 6, t: 16 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 13, f: 9, t: 22 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 19,
    atGradeLevel: 11,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 0, f: 4, t: 4 },
      total: { m: 2, f: 6, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 18,
    atGradeLevel: 1,
    twoLevelDown: {
      independent: { m: 0, f: 3, t: 3 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 2, f: 5, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 4, f: 2, t: 6 },
      frustration: { m: 1, f: 2, t: 3 },
      total: { m: 5, f: 4, t: 9 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 159,
    atGradeLevel: 42,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 11, f: 12, t: 23 },
      frustration: { m: 24, f: 12, t: 36 },
      total: { m: 35, f: 24, t: 59 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 10, f: 11, t: 21 },
      frustration: { m: 24, f: 13, t: 37 },
      total: { m: 34, f: 24, t: 58 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 33,
    atGradeLevel: 3,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 4, f: 7, t: 11 },
      total: { m: 7, f: 9, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 1, f: 5, t: 6 },
      frustration: { m: 5, f: 4, t: 9 },
      total: { m: 6, f: 9, t: 15 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 35,
    atGradeLevel: 11,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 3, f: 0, t: 3 },
      total: { m: 5, f: 4, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 6, f: 4, t: 10 },
      frustration: { m: 0, f: 5, t: 5 },
      total: { m: 6, f: 9, t: 15 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 25,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 4, f: 4, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 0, t: 2 },
      instructional: { m: 5, f: 3, t: 8 },
      frustration: { m: 6, f: 1, t: 7 },
      total: { m: 13, f: 4, t: 17 }
    }
  }
];

// ----------------------------------------------------
// GRADE 5 FILIPINO
// ----------------------------------------------------
const G5_FILIPINO: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 30,
    atGradeLevel: 6,
    twoLevelDown: {
      independent: { m: 3, f: 0, t: 3 },
      instructional: { m: 4, f: 2, t: 6 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 7, f: 3, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 6, f: 3, t: 9 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 9, f: 5, t: 14 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 102,
    atGradeLevel: 86,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 2, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 6, f: 6, t: 12 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 35,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 12, f: 9, t: 21 },
      instructional: { m: 4, f: 0, t: 4 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 17, f: 10, t: 27 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 66,
    atGradeLevel: 20,
    twoLevelDown: {
      independent: { m: 5, f: 7, t: 12 },
      instructional: { m: 5, f: 11, t: 16 },
      frustration: { m: 3, f: 7, t: 10 },
      total: { m: 13, f: 25, t: 38 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 3, f: 5, t: 8 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 5, t: 8 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 37,
    atGradeLevel: 19,
    twoLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 5, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 1, f: 5, t: 6 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 3, f: 7, t: 10 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 21,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 0, f: 2, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 5, t: 8 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 4, f: 4, t: 8 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 20,
    atGradeLevel: 6,
    twoLevelDown: {
      independent: { m: 2, f: 4, t: 6 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 4, f: 6, t: 10 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 2, t: 4 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 54,
    atGradeLevel: 36,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 9, f: 3, t: 12 },
      total: { m: 14, f: 4, t: 18 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 8, f: 2, t: 10 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 14, f: 4, t: 18 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 16,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 1, f: 1, t: 2 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 21,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 5, f: 2, t: 7 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 6, f: 3, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 3, f: 2, t: 5 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 4, f: 3, t: 7 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 53,
    atGradeLevel: 29,
    twoLevelDown: {
      independent: { m: 5, f: 3, t: 8 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 8, f: 4, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 2, t: 5 },
      instructional: { m: 5, f: 2, t: 7 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 8, f: 4, t: 12 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 78,
    atGradeLevel: 24,
    twoLevelDown: {
      independent: { m: 7, f: 8, t: 15 },
      instructional: { m: 7, f: 10, t: 17 },
      frustration: { m: 5, f: 0, t: 5 },
      total: { m: 19, f: 18, t: 37 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 3, f: 4, t: 7 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 8, f: 9, t: 17 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 68,
    atGradeLevel: 31,
    twoLevelDown: {
      independent: { m: 4, f: 4, t: 8 },
      instructional: { m: 4, f: 3, t: 7 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 10, f: 8, t: 18 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 2, f: 2, t: 4 },
      total: { m: 9, f: 10, t: 19 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 41,
    atGradeLevel: 21,
    twoLevelDown: {
      independent: { m: 6, f: 3, t: 9 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 8, f: 4, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 4, f: 0, t: 4 },
      total: { m: 7, f: 1, t: 8 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 18,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 0, f: 2, t: 2 },
      total: { m: 2, f: 4, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 159,
    atGradeLevel: 46,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 16, f: 14, t: 30 },
      frustration: { m: 18, f: 8, t: 26 },
      total: { m: 34, f: 22, t: 56 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 16, f: 13, t: 29 },
      frustration: { m: 19, f: 9, t: 28 },
      total: { m: 35, f: 22, t: 57 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 33,
    atGradeLevel: 7,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 3, f: 4, t: 7 },
      frustration: { m: 2, f: 3, t: 5 },
      total: { m: 7, f: 10, t: 17 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 5, f: 5, t: 10 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 35,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 3, f: 5, t: 8 },
      frustration: { m: 2, f: 4, t: 6 },
      total: { m: 6, f: 11, t: 17 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 4, f: 0, t: 4 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 25,
    atGradeLevel: 11,
    twoLevelDown: {
      independent: { m: 3, f: 3, t: 6 },
      instructional: { m: 5, f: 1, t: 6 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 9, f: 5, t: 14 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  }
];

// ----------------------------------------------------
// GRADE 6 ENGLISH
// ----------------------------------------------------
const G6_ENGLISH: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 35,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 3, f: 3, t: 6 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 9, f: 7, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 5, f: 6, t: 11 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 10, f: 9, t: 19 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 93,
    atGradeLevel: 84,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 1, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 0, t: 2 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 4, f: 1, t: 5 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 17,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 9, f: 4, t: 13 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 12, f: 5, t: 17 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 52,
    atGradeLevel: 14,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 10, f: 12, t: 22 },
      frustration: { m: 7, f: 4, t: 11 },
      total: { m: 19, f: 19, t: 38 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 30,
    atGradeLevel: 16,
    twoLevelDown: {
      independent: { m: 3, f: 1, t: 4 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 2, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 5, f: 0, t: 5 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 14,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 2, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 2, t: 5 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 24,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 2, f: 3, t: 5 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 8, f: 5, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 5, f: 1, t: 6 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 8, f: 3, t: 11 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 44,
    atGradeLevel: 25,
    twoLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 5, f: 4, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 7, f: 3, t: 10 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 17,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 1, f: 0, t: 1 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 1, t: 5 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 9, f: 2, t: 11 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 19,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 3, f: 4, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 51,
    atGradeLevel: 36,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 4, t: 6 },
      frustration: { m: 5, f: 2, t: 7 },
      total: { m: 7, f: 6, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 0, f: 1, t: 1 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 85,
    atGradeLevel: 5,
    twoLevelDown: {
      independent: { m: 5, f: 5, t: 10 },
      instructional: { m: 22, f: 9, t: 31 },
      frustration: { m: 8, f: 0, t: 8 },
      total: { m: 35, f: 14, t: 49 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 15, f: 5, t: 20 },
      frustration: { m: 3, f: 1, t: 4 },
      total: { m: 21, f: 10, t: 31 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 60,
    atGradeLevel: 17,
    twoLevelDown: {
      independent: { m: 6, f: 4, t: 10 },
      instructional: { m: 8, f: 1, t: 9 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 16, f: 6, t: 22 }
    },
    threeLevelDown: {
      independent: { m: 5, f: 5, t: 10 },
      instructional: { m: 6, f: 1, t: 7 },
      frustration: { m: 2, f: 2, t: 4 },
      total: { m: 13, f: 8, t: 21 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 20,
    atGradeLevel: 13,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 5, f: 0, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 0, t: 3 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 65,
    atGradeLevel: 28,
    twoLevelDown: {
      independent: { m: 13, f: 8, t: 21 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 17, f: 10, t: 27 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 4, t: 8 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 6, f: 4, t: 10 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 24,
    atGradeLevel: 8,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 5, f: 6, t: 11 },
      frustration: { m: 4, f: 1, t: 5 },
      total: { m: 9, f: 7, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 16,
    atGradeLevel: 1,
    twoLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 2, f: 4, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 2, f: 2, t: 4 },
      total: { m: 5, f: 4, t: 9 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 150,
    atGradeLevel: 16,
    twoLevelDown: {
      independent: { m: 2, f: 4, t: 6 },
      instructional: { m: 23, f: 27, t: 50 },
      frustration: { m: 10, f: 4, t: 14 },
      total: { m: 35, f: 35, t: 70 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 21, f: 27, t: 48 },
      frustration: { m: 10, f: 4, t: 14 },
      total: { m: 32, f: 32, t: 64 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 31,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 5, f: 8, t: 13 },
      total: { m: 9, f: 10, t: 19 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 3, f: 3, t: 6 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 6, f: 6, t: 12 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 21,
    atGradeLevel: 2,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 3, f: 7, t: 10 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 8, t: 11 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 5, f: 0, t: 5 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 7, f: 1, t: 8 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 21,
    atGradeLevel: 2,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 2, f: 2, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 2, f: 4, t: 6 },
      frustration: { m: 3, f: 0, t: 3 },
      total: { m: 9, f: 6, t: 15 }
    }
  }
];

// ----------------------------------------------------
// GRADE 6 FILIPINO
// ----------------------------------------------------
const G6_FILIPINO: PhilIriSchoolRow[] = [
  {
    schoolId: '116130',
    schoolName: 'BANDILA ES',
    totalAssessed: 36,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 8, f: 4, t: 12 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 8, f: 4, t: 12 }
    },
    threeLevelDown: {
      independent: { m: 13, f: 7, t: 20 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 16, f: 8, t: 24 }
    }
  },
  {
    schoolId: '116131',
    schoolName: 'BUG-ANG ES',
    totalAssessed: 93,
    atGradeLevel: 79,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 3, f: 1, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 4, f: 1, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 7, f: 3, t: 10 }
    }
  },
  {
    schoolId: '116132',
    schoolName: 'CANUBGAN ES',
    totalAssessed: 17,
    atGradeLevel: 1,
    twoLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 8, f: 2, t: 10 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 11, f: 5, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116133',
    schoolName: 'DNALES',
    totalAssessed: 52,
    atGradeLevel: 21,
    twoLevelDown: {
      independent: { m: 3, f: 8, t: 11 },
      instructional: { m: 1, f: 3, t: 4 },
      frustration: { m: 1, f: 2, t: 3 },
      total: { m: 5, f: 13, t: 18 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 2, t: 3 },
      instructional: { m: 3, f: 6, t: 9 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 8, t: 13 }
    }
  },
  {
    schoolId: '116134',
    schoolName: 'GEN. LUNA ES',
    totalAssessed: 30,
    atGradeLevel: 15,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 4, f: 2, t: 6 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 3, f: 1, t: 4 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 7, f: 2, t: 9 }
    }
  },
  {
    schoolId: '116135',
    schoolName: 'HAYANGON ES',
    totalAssessed: 14,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 2, t: 4 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 1, f: 1, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 5, t: 10 }
    }
  },
  {
    schoolId: '116136',
    schoolName: 'H.B. AMAPARADO ES',
    totalAssessed: 24,
    atGradeLevel: 2,
    twoLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 6, f: 7, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 6, f: 3, t: 9 }
    }
  },
  {
    schoolId: '116137',
    schoolName: 'LABILABI ES',
    totalAssessed: 44,
    atGradeLevel: 12,
    twoLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 4, f: 4, t: 8 },
      frustration: { m: 10, f: 10, t: 20 },
      total: { m: 16, f: 16, t: 32 }
    },
    threeLevelDown: {
      independent: { m: 6, f: 4, t: 10 },
      instructional: { m: 10, f: 8, t: 18 },
      frustration: { m: 2, f: 2, t: 4 },
      total: { m: 18, f: 14, t: 32 }
    }
  },
  {
    schoolId: '116138',
    schoolName: 'MAGTICOL ES',
    totalAssessed: 19,
    atGradeLevel: 13,
    twoLevelDown: {
      independent: { m: 2, f: 0, t: 2 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 5, f: 0, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 1, f: 0, t: 1 }
    }
  },
  {
    schoolId: '116139',
    schoolName: 'MAINIT ES',
    totalAssessed: 19,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 2, t: 2 },
      instructional: { m: 2, f: 5, t: 7 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 7, t: 9 }
    },
    threeLevelDown: {
      independent: { m: 1, f: 3, t: 4 },
      instructional: { m: 3, f: 3, t: 6 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 4, f: 6, t: 10 }
    }
  },
  {
    schoolId: '116140',
    schoolName: 'POLOPANGYAN ES',
    totalAssessed: 51,
    atGradeLevel: 39,
    twoLevelDown: {
      independent: { m: 0, f: 1, t: 1 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 3, f: 4, t: 7 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 1, t: 3 },
      instructional: { m: 0, f: 1, t: 1 },
      frustration: { m: 0, f: 1, t: 1 },
      total: { m: 2, f: 3, t: 5 }
    }
  },
  {
    schoolId: '116141',
    schoolName: 'SALAMANCA ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116142',
    schoolName: 'SAN ISIDRO ES',
    totalAssessed: 60,
    atGradeLevel: 29,
    twoLevelDown: {
      independent: { m: 4, f: 7, t: 11 },
      instructional: { m: 0, f: 1, t: 1 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 6, f: 9, t: 15 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 5, t: 7 },
      instructional: { m: 1, f: 2, t: 3 },
      frustration: { m: 4, f: 2, t: 6 },
      total: { m: 7, f: 9, t: 16 }
    }
  },
  {
    schoolId: '116143',
    schoolName: 'SOCORRO SEMES',
    totalAssessed: 20,
    atGradeLevel: 13,
    twoLevelDown: {
      independent: { m: 1, f: 0, t: 1 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 5, f: 0, t: 5 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 0, t: 2 }
    }
  },
  {
    schoolId: '116144',
    schoolName: 'STOP AGUINALDO ES',
    totalAssessed: 65,
    atGradeLevel: 28,
    twoLevelDown: {
      independent: { m: 10, f: 9, t: 19 },
      instructional: { m: 2, f: 1, t: 3 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 14, f: 10, t: 24 }
    },
    threeLevelDown: {
      independent: { m: 5, f: 4, t: 9 },
      instructional: { m: 2, f: 0, t: 2 },
      frustration: { m: 2, f: 0, t: 2 },
      total: { m: 9, f: 4, t: 13 }
    }
  },
  {
    schoolId: '116145',
    schoolName: 'TABUN-AC ES',
    totalAssessed: 25,
    atGradeLevel: 9,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 7, f: 6, t: 13 },
      frustration: { m: 2, f: 1, t: 3 },
      total: { m: 9, f: 7, t: 16 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116146',
    schoolName: 'TINIBAWAN ES',
    totalAssessed: 0,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  },
  {
    schoolId: '116147',
    schoolName: 'TOBOSO CS',
    totalAssessed: 150,
    atGradeLevel: 45,
    twoLevelDown: {
      independent: { m: 4, f: 4, t: 8 },
      instructional: { m: 11, f: 8, t: 19 },
      frustration: { m: 15, f: 10, t: 25 },
      total: { m: 30, f: 22, t: 52 }
    },
    threeLevelDown: {
      independent: { m: 3, f: 4, t: 7 },
      instructional: { m: 11, f: 9, t: 20 },
      frustration: { m: 16, f: 10, t: 26 },
      total: { m: 30, f: 23, t: 53 }
    }
  },
  {
    schoolId: '116148',
    schoolName: 'TORIL ES',
    totalAssessed: 31,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 5, f: 7, t: 12 },
      frustration: { m: 3, f: 2, t: 5 },
      total: { m: 10, f: 11, t: 21 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 2, t: 4 },
      instructional: { m: 2, f: 2, t: 4 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 5, f: 5, t: 10 }
    }
  },
  {
    schoolId: '116149',
    schoolName: 'ULDARICO SUISON ES',
    totalAssessed: 21,
    atGradeLevel: 0,
    twoLevelDown: {
      independent: { m: 1, f: 1, t: 2 },
      instructional: { m: 1, f: 0, t: 1 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 2, f: 1, t: 3 }
    },
    threeLevelDown: {
      independent: { m: 2, f: 8, t: 10 },
      instructional: { m: 6, f: 1, t: 7 },
      frustration: { m: 1, f: 0, t: 1 },
      total: { m: 9, f: 9, t: 18 }
    }
  },
  {
    schoolId: '116150',
    schoolName: 'VERGARA ES',
    totalAssessed: 21,
    atGradeLevel: 8,
    twoLevelDown: {
      independent: { m: 4, f: 2, t: 6 },
      instructional: { m: 2, f: 3, t: 5 },
      frustration: { m: 1, f: 1, t: 2 },
      total: { m: 7, f: 6, t: 13 }
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 }
    }
  }
];

export const PHIL_IRI_EOSY_DATA = {
  english: {
    grade4: G4_ENGLISH,
    grade5: G5_ENGLISH,
    grade6: G6_ENGLISH
  },
  filipino: {
    grade4: G4_FILIPINO,
    grade5: G5_FILIPINO,
    grade6: G6_FILIPINO
  }
};

export const PHIL_IRI_DATA = PHIL_IRI_EOSY_DATA;

export { PHIL_IRI_BOSY_DATA } from './philIriBosyData';

export interface PhilIriSummaryTotals {
  totalAssessed: number;
  atGradeLevel: number;
  atGradeLevelPct: number;
  twoLevelDown: {
    independent: GenderCount;
    instructional: GenderCount;
    frustration: GenderCount;
    total: GenderCount;
    pct: number;
  };
  threeLevelDown: {
    independent: GenderCount;
    instructional: GenderCount;
    frustration: GenderCount;
    total: GenderCount;
    pct: number;
  };
  overallIndependent: GenderCount;
  overallInstructional: GenderCount;
  overallFrustration: GenderCount;
}

export function computePhilIriTotals(rows: PhilIriSchoolRow[]): PhilIriSummaryTotals {
  const initial: PhilIriSummaryTotals = {
    totalAssessed: 0,
    atGradeLevel: 0,
    atGradeLevelPct: 0,
    twoLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 },
      pct: 0
    },
    threeLevelDown: {
      independent: { m: 0, f: 0, t: 0 },
      instructional: { m: 0, f: 0, t: 0 },
      frustration: { m: 0, f: 0, t: 0 },
      total: { m: 0, f: 0, t: 0 },
      pct: 0
    },
    overallIndependent: { m: 0, f: 0, t: 0 },
    overallInstructional: { m: 0, f: 0, t: 0 },
    overallFrustration: { m: 0, f: 0, t: 0 }
  };

  rows.forEach(r => {
    initial.totalAssessed += r.totalAssessed;
    initial.atGradeLevel += r.atGradeLevel;

    // 2-level down
    initial.twoLevelDown.independent.m += r.twoLevelDown.independent.m;
    initial.twoLevelDown.independent.f += r.twoLevelDown.independent.f;
    initial.twoLevelDown.independent.t += r.twoLevelDown.independent.t;

    initial.twoLevelDown.instructional.m += r.twoLevelDown.instructional.m;
    initial.twoLevelDown.instructional.f += r.twoLevelDown.instructional.f;
    initial.twoLevelDown.instructional.t += r.twoLevelDown.instructional.t;

    initial.twoLevelDown.frustration.m += r.twoLevelDown.frustration.m;
    initial.twoLevelDown.frustration.f += r.twoLevelDown.frustration.f;
    initial.twoLevelDown.frustration.t += r.twoLevelDown.frustration.t;

    initial.twoLevelDown.total.m += r.twoLevelDown.total.m;
    initial.twoLevelDown.total.f += r.twoLevelDown.total.f;
    initial.twoLevelDown.total.t += r.twoLevelDown.total.t;

    // 3-level down
    initial.threeLevelDown.independent.m += r.threeLevelDown.independent.m;
    initial.threeLevelDown.independent.f += r.threeLevelDown.independent.f;
    initial.threeLevelDown.independent.t += r.threeLevelDown.independent.t;

    initial.threeLevelDown.instructional.m += r.threeLevelDown.instructional.m;
    initial.threeLevelDown.instructional.f += r.threeLevelDown.instructional.f;
    initial.threeLevelDown.instructional.t += r.threeLevelDown.instructional.t;

    initial.threeLevelDown.frustration.m += r.threeLevelDown.frustration.m;
    initial.threeLevelDown.frustration.f += r.threeLevelDown.frustration.f;
    initial.threeLevelDown.frustration.t += r.threeLevelDown.frustration.t;

    initial.threeLevelDown.total.m += r.threeLevelDown.total.m;
    initial.threeLevelDown.total.f += r.threeLevelDown.total.f;
    initial.threeLevelDown.total.t += r.threeLevelDown.total.t;
  });

  // Overall Independent, Instructional, Frustration
  initial.overallIndependent = {
    m: initial.twoLevelDown.independent.m + initial.threeLevelDown.independent.m,
    f: initial.twoLevelDown.independent.f + initial.threeLevelDown.independent.f,
    t: initial.twoLevelDown.independent.t + initial.threeLevelDown.independent.t
  };

  initial.overallInstructional = {
    m: initial.twoLevelDown.instructional.m + initial.threeLevelDown.instructional.m,
    f: initial.twoLevelDown.instructional.f + initial.threeLevelDown.instructional.f,
    t: initial.twoLevelDown.instructional.t + initial.threeLevelDown.instructional.t
  };

  initial.overallFrustration = {
    m: initial.twoLevelDown.frustration.m + initial.threeLevelDown.frustration.m,
    f: initial.twoLevelDown.frustration.f + initial.threeLevelDown.frustration.f,
    t: initial.twoLevelDown.frustration.t + initial.threeLevelDown.frustration.t
  };

  if (initial.totalAssessed > 0) {
    initial.atGradeLevelPct = (initial.atGradeLevel / initial.totalAssessed) * 100;
    initial.twoLevelDown.pct = (initial.twoLevelDown.total.t / initial.totalAssessed) * 100;
    initial.threeLevelDown.pct = (initial.threeLevelDown.total.t / initial.totalAssessed) * 100;
  }

  return initial;
}

export interface PhilIriComparativeRow {
  schoolId: string;
  schoolName: string;
  // Assessed
  bosyAssessed: number;
  eosyAssessed: number;
  assessedDiff: number;
  // At Grade Level (GST 14-20)
  bosyAtGradeLevel: number;
  eosyAtGradeLevel: number;
  atGradeLevelDiff: number;
  bosyAtGradeLevelPct: number;
  eosyAtGradeLevelPct: number;
  atGradeLevelPctDiff: number;
  // 2-Level Down (Scores 8-13)
  bosyTwoLevelDownTotal: number;
  eosyTwoLevelDownTotal: number;
  twoLevelDownDiff: number;
  // 3-Level Down (Scores 0-7)
  bosyThreeLevelDownTotal: number;
  eosyThreeLevelDownTotal: number;
  threeLevelDownDiff: number;
  // Total Frustration (Needs Intensive Reading Intervention)
  bosyFrustrationTotal: number;
  eosyFrustrationTotal: number;
  frustrationDiff: number; // Negative is good (reduction in struggling readers)
  // Total Independent Readers
  bosyIndependentTotal: number;
  eosyIndependentTotal: number;
  independentDiff: number;
}

export interface PhilIriComparativeSummary {
  bosyTotals: PhilIriSummaryTotals;
  eosyTotals: PhilIriSummaryTotals;
  netAtGradeLevelGain: number;
  netAtGradeLevelPctGain: number;
  netFrustrationReduction: number;
  netThreeLevelDownReduction: number;
  netIndependentGain: number;
  rows: PhilIriComparativeRow[];
}

export function computePhilIriComparative(
  bosyRows: PhilIriSchoolRow[],
  eosyRows: PhilIriSchoolRow[]
): PhilIriComparativeSummary {
  const bosyMap = new Map<string, PhilIriSchoolRow>();
  bosyRows.forEach(r => bosyMap.set(r.schoolId, r));

  const eosyMap = new Map<string, PhilIriSchoolRow>();
  eosyRows.forEach(r => eosyMap.set(r.schoolId, r));

  const rows: PhilIriComparativeRow[] = [];

  // Union of school IDs preserving order
  const allSchoolIds: string[] = [];
  bosyRows.forEach(r => {
    if (!allSchoolIds.includes(r.schoolId)) allSchoolIds.push(r.schoolId);
  });
  eosyRows.forEach(r => {
    if (!allSchoolIds.includes(r.schoolId)) allSchoolIds.push(r.schoolId);
  });

  allSchoolIds.forEach(id => {
    const b = bosyMap.get(id);
    const e = eosyMap.get(id);
    const schoolName = b?.schoolName || e?.schoolName || '';

    const bAssessed = b?.totalAssessed || 0;
    const eAssessed = e?.totalAssessed || 0;

    const bAtGrade = b?.atGradeLevel || 0;
    const eAtGrade = e?.atGradeLevel || 0;
    const bAtGradePct = bAssessed > 0 ? (bAtGrade / bAssessed) * 100 : 0;
    const eAtGradePct = eAssessed > 0 ? (eAtGrade / eAssessed) * 100 : 0;

    const b2Lvl = b ? b.twoLevelDown.total.t : 0;
    const e2Lvl = e ? e.twoLevelDown.total.t : 0;

    const b3Lvl = b ? b.threeLevelDown.total.t : 0;
    const e3Lvl = e ? e.threeLevelDown.total.t : 0;

    const bFrust = b ? (b.twoLevelDown.frustration.t + b.threeLevelDown.frustration.t) : 0;
    const eFrust = e ? (e.twoLevelDown.frustration.t + e.threeLevelDown.frustration.t) : 0;

    const bIndep = b ? (b.twoLevelDown.independent.t + b.threeLevelDown.independent.t) : 0;
    const eIndep = e ? (e.twoLevelDown.independent.t + e.threeLevelDown.independent.t) : 0;

    rows.push({
      schoolId: id,
      schoolName,
      bosyAssessed: bAssessed,
      eosyAssessed: eAssessed,
      assessedDiff: eAssessed - bAssessed,
      bosyAtGradeLevel: bAtGrade,
      eosyAtGradeLevel: eAtGrade,
      atGradeLevelDiff: eAtGrade - bAtGrade,
      bosyAtGradeLevelPct: bAtGradePct,
      eosyAtGradeLevelPct: eAtGradePct,
      atGradeLevelPctDiff: eAtGradePct - bAtGradePct,
      bosyTwoLevelDownTotal: b2Lvl,
      eosyTwoLevelDownTotal: e2Lvl,
      twoLevelDownDiff: e2Lvl - b2Lvl,
      bosyThreeLevelDownTotal: b3Lvl,
      eosyThreeLevelDownTotal: e3Lvl,
      threeLevelDownDiff: e3Lvl - b3Lvl,
      bosyFrustrationTotal: bFrust,
      eosyFrustrationTotal: eFrust,
      frustrationDiff: eFrust - bFrust,
      bosyIndependentTotal: bIndep,
      eosyIndependentTotal: eIndep,
      independentDiff: eIndep - bIndep
    });
  });

  const bosyTotals = computePhilIriTotals(bosyRows);
  const eosyTotals = computePhilIriTotals(eosyRows);

  return {
    bosyTotals,
    eosyTotals,
    netAtGradeLevelGain: eosyTotals.atGradeLevel - bosyTotals.atGradeLevel,
    netAtGradeLevelPctGain: eosyTotals.atGradeLevelPct - bosyTotals.atGradeLevelPct,
    netFrustrationReduction: bosyTotals.overallFrustration.t - eosyTotals.overallFrustration.t,
    netThreeLevelDownReduction: bosyTotals.threeLevelDown.total.t - eosyTotals.threeLevelDown.total.t,
    netIndependentGain: eosyTotals.overallIndependent.t - bosyTotals.overallIndependent.t,
    rows
  };
}
