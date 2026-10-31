/**
 * DepEd District of Toboso CRLA (Comprehensive Rapid Literacy Assessment)
 * S.Y. 2025-2026 BOSY (Beginning of the School Year) Official Baseline Data
 * Division of Negros Occidental - Negros Island Region (NIR)
 */

export interface CRLAMetric {
  m: number;
  f: number;
  total: number;
}

export interface CRLASubjectData {
  enrolment: CRLAMetric;
  assessed: CRLAMetric;
  emerging: CRLAMetric;
  developing: CRLAMetric;
  transitioning: CRLAMetric;
  atGradeLevel: CRLAMetric;
}

export interface CRLASchoolRecord {
  order: number;
  officialName: string;
  displayName: string;
  schoolId: string;
  grade1: {
    mtb: CRLASubjectData;
  };
  grade2: {
    mtb: CRLASubjectData;
    filipino: CRLASubjectData;
  };
  grade3: {
    mtb: CRLASubjectData;
    filipino: CRLASubjectData;
    english: CRLASubjectData;
  };
}

export const CRLA_BOSY_SCHOOLS: CRLASchoolRecord[] = [
  {
    "order": 1,
    "officialName": "AMPARADO ES",
    "displayName": "AMPARADO Elementary School",
    "schoolId": "117501",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 22,
          "f": 9,
          "total": 31
        },
        "assessed": {
          "m": 22,
          "f": 9,
          "total": 31
        },
        "emerging": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "developing": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "transitioning": {
          "m": 6,
          "f": 1,
          "total": 7
        },
        "atGradeLevel": {
          "m": 8,
          "f": 4,
          "total": 12
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 14,
          "f": 10,
          "total": 24
        },
        "assessed": {
          "m": 14,
          "f": 10,
          "total": 24
        },
        "emerging": {
          "m": 5,
          "f": 3,
          "total": 8
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 2,
          "f": 0,
          "total": 2
        },
        "atGradeLevel": {
          "m": 7,
          "f": 7,
          "total": 14
        }
      },
      "filipino": {
        "enrolment": {
          "m": 14,
          "f": 10,
          "total": 24
        },
        "assessed": {
          "m": 14,
          "f": 10,
          "total": 24
        },
        "emerging": {
          "m": 5,
          "f": 3,
          "total": 8
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 2,
          "f": 0,
          "total": 2
        },
        "atGradeLevel": {
          "m": 7,
          "f": 7,
          "total": 14
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "assessed": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "emerging": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 5,
          "f": 1,
          "total": 6
        },
        "atGradeLevel": {
          "m": 9,
          "f": 9,
          "total": 18
        }
      },
      "filipino": {
        "enrolment": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "assessed": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "emerging": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "atGradeLevel": {
          "m": 13,
          "f": 9,
          "total": 22
        }
      },
      "english": {
        "enrolment": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "assessed": {
          "m": 15,
          "f": 11,
          "total": 26
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "transitioning": {
          "m": 7,
          "f": 2,
          "total": 9
        },
        "atGradeLevel": {
          "m": 5,
          "f": 8,
          "total": 13
        }
      }
    }
  },
  {
    "order": 2,
    "officialName": "BANDILA ES",
    "displayName": "BANDILA Elementary School",
    "schoolId": "117502",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 17,
          "f": 13,
          "total": 30
        },
        "assessed": {
          "m": 17,
          "f": 13,
          "total": 30
        },
        "emerging": {
          "m": 17,
          "f": 13,
          "total": 30
        },
        "developing": {
          "m": 3,
          "f": 3,
          "total": 6
        },
        "transitioning": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 24,
          "f": 13,
          "total": 37
        },
        "assessed": {
          "m": 24,
          "f": 13,
          "total": 37
        },
        "emerging": {
          "m": 16,
          "f": 8,
          "total": 24
        },
        "developing": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "transitioning": {
          "m": 5,
          "f": 3,
          "total": 8
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "filipino": {
        "enrolment": {
          "m": 24,
          "f": 13,
          "total": 37
        },
        "assessed": {
          "m": 24,
          "f": 13,
          "total": 37
        },
        "emerging": {
          "m": 17,
          "f": 8,
          "total": 25
        },
        "developing": {
          "m": 4,
          "f": 3,
          "total": 7
        },
        "transitioning": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "assessed": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "emerging": {
          "m": 6,
          "f": 1,
          "total": 7
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 6,
          "f": 9,
          "total": 15
        },
        "atGradeLevel": {
          "m": 5,
          "f": 8,
          "total": 13
        }
      },
      "filipino": {
        "enrolment": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "assessed": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "emerging": {
          "m": 5,
          "f": 0,
          "total": 5
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 8,
          "f": 9,
          "total": 17
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "assessed": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "emerging": {
          "m": 8,
          "f": 1,
          "total": 9
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 4,
          "f": 6,
          "total": 10
        },
        "atGradeLevel": {
          "m": 1,
          "f": 3,
          "total": 4
        }
      }
    }
  },
  {
    "order": 3,
    "officialName": "BUG ANG ES",
    "displayName": "Bug-ang Elementary School",
    "schoolId": "117503",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 47,
          "f": 52,
          "total": 99
        },
        "assessed": {
          "m": 47,
          "f": 52,
          "total": 99
        },
        "emerging": {
          "m": 36,
          "f": 28,
          "total": 64
        },
        "developing": {
          "m": 3,
          "f": 7,
          "total": 10
        },
        "transitioning": {
          "m": 6,
          "f": 17,
          "total": 23
        },
        "atGradeLevel": {
          "m": 2,
          "f": 0,
          "total": 2
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 40,
          "f": 65,
          "total": 105
        },
        "assessed": {
          "m": 40,
          "f": 65,
          "total": 105
        },
        "emerging": {
          "m": 17,
          "f": 22,
          "total": 39
        },
        "developing": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "transitioning": {
          "m": 17,
          "f": 32,
          "total": 49
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "filipino": {
        "enrolment": {
          "m": 40,
          "f": 65,
          "total": 105
        },
        "assessed": {
          "m": 40,
          "f": 65,
          "total": 105
        },
        "emerging": {
          "m": 17,
          "f": 20,
          "total": 37
        },
        "developing": {
          "m": 10,
          "f": 12,
          "total": 22
        },
        "transitioning": {
          "m": 13,
          "f": 31,
          "total": 44
        },
        "atGradeLevel": {
          "m": 0,
          "f": 2,
          "total": 2
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "assessed": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "emerging": {
          "m": 20,
          "f": 12,
          "total": 32
        },
        "developing": {
          "m": 11,
          "f": 11,
          "total": 22
        },
        "transitioning": {
          "m": 29,
          "f": 34,
          "total": 63
        },
        "atGradeLevel": {
          "m": 5,
          "f": 5,
          "total": 10
        }
      },
      "filipino": {
        "enrolment": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "assessed": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "emerging": {
          "m": 18,
          "f": 10,
          "total": 28
        },
        "developing": {
          "m": 14,
          "f": 11,
          "total": 25
        },
        "transitioning": {
          "m": 31,
          "f": 39,
          "total": 70
        },
        "atGradeLevel": {
          "m": 2,
          "f": 2,
          "total": 4
        }
      },
      "english": {
        "enrolment": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "assessed": {
          "m": 65,
          "f": 62,
          "total": 127
        },
        "emerging": {
          "m": 28,
          "f": 17,
          "total": 45
        },
        "developing": {
          "m": 8,
          "f": 7,
          "total": 15
        },
        "transitioning": {
          "m": 26,
          "f": 32,
          "total": 58
        },
        "atGradeLevel": {
          "m": 3,
          "f": 6,
          "total": 9
        }
      }
    }
  },
  {
    "order": 4,
    "officialName": "CANUBGAN ES",
    "displayName": "CANUBGAN Elementary School",
    "schoolId": "117504",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 22,
          "f": 15,
          "total": 37
        },
        "assessed": {
          "m": 22,
          "f": 15,
          "total": 37
        },
        "emerging": {
          "m": 12,
          "f": 7,
          "total": 19
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 9,
          "f": 5,
          "total": 14
        },
        "atGradeLevel": {
          "m": 0,
          "f": 3,
          "total": 3
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 14,
          "f": 19,
          "total": 33
        },
        "assessed": {
          "m": 14,
          "f": 19,
          "total": 33
        },
        "emerging": {
          "m": 9,
          "f": 7,
          "total": 16
        },
        "developing": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "transitioning": {
          "m": 3,
          "f": 8,
          "total": 11
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "filipino": {
        "enrolment": {
          "m": 14,
          "f": 19,
          "total": 33
        },
        "assessed": {
          "m": 14,
          "f": 19,
          "total": 33
        },
        "emerging": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "developing": {
          "m": 1,
          "f": 3,
          "total": 4
        },
        "transitioning": {
          "m": 3,
          "f": 8,
          "total": 11
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "assessed": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "emerging": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "developing": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "transitioning": {
          "m": 8,
          "f": 3,
          "total": 11
        },
        "atGradeLevel": {
          "m": 3,
          "f": 10,
          "total": 13
        }
      },
      "filipino": {
        "enrolment": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "assessed": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "emerging": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "developing": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "transitioning": {
          "m": 6,
          "f": 5,
          "total": 11
        },
        "atGradeLevel": {
          "m": 3,
          "f": 6,
          "total": 9
        }
      },
      "english": {
        "enrolment": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "assessed": {
          "m": 13,
          "f": 18,
          "total": 31
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "transitioning": {
          "m": 8,
          "f": 13,
          "total": 21
        },
        "atGradeLevel": {
          "m": 3,
          "f": 1,
          "total": 4
        }
      }
    }
  },
  {
    "order": 5,
    "officialName": "DON NICOLAS A. LIZARES ES",
    "displayName": "DON NICOLAS A. LIZARES Elementary School",
    "schoolId": "117505",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 38,
          "f": 27,
          "total": 65
        },
        "assessed": {
          "m": 38,
          "f": 27,
          "total": 65
        },
        "emerging": {
          "m": 14,
          "f": 6,
          "total": 20
        },
        "developing": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "transitioning": {
          "m": 14,
          "f": 13,
          "total": 27
        },
        "atGradeLevel": {
          "m": 7,
          "f": 7,
          "total": 14
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 30,
          "f": 31,
          "total": 61
        },
        "assessed": {
          "m": 30,
          "f": 31,
          "total": 61
        },
        "emerging": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "developing": {
          "m": 6,
          "f": 8,
          "total": 14
        },
        "transitioning": {
          "m": 8,
          "f": 4,
          "total": 12
        },
        "atGradeLevel": {
          "m": 10,
          "f": 13,
          "total": 23
        }
      },
      "filipino": {
        "enrolment": {
          "m": 30,
          "f": 31,
          "total": 61
        },
        "assessed": {
          "m": 30,
          "f": 31,
          "total": 61
        },
        "emerging": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "developing": {
          "m": 5,
          "f": 8,
          "total": 13
        },
        "transitioning": {
          "m": 9,
          "f": 3,
          "total": 12
        },
        "atGradeLevel": {
          "m": 10,
          "f": 14,
          "total": 24
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "assessed": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "emerging": {
          "m": 19,
          "f": 6,
          "total": 25
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 5,
          "f": 8,
          "total": 13
        },
        "atGradeLevel": {
          "m": 11,
          "f": 21,
          "total": 32
        }
      },
      "filipino": {
        "enrolment": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "assessed": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "emerging": {
          "m": 17,
          "f": 4,
          "total": 21
        },
        "developing": {
          "m": 3,
          "f": 0,
          "total": 3
        },
        "transitioning": {
          "m": 4,
          "f": 6,
          "total": 10
        },
        "atGradeLevel": {
          "m": 12,
          "f": 25,
          "total": 37
        }
      },
      "english": {
        "enrolment": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "assessed": {
          "m": 36,
          "f": 35,
          "total": 71
        },
        "emerging": {
          "m": 18,
          "f": 3,
          "total": 21
        },
        "developing": {
          "m": 3,
          "f": 3,
          "total": 6
        },
        "transitioning": {
          "m": 5,
          "f": 6,
          "total": 11
        },
        "atGradeLevel": {
          "m": 10,
          "f": 23,
          "total": 33
        }
      }
    }
  },
  {
    "order": 6,
    "officialName": "GENERAL LUNA ES",
    "displayName": "GENERAL LUNA Elementary School",
    "schoolId": "117506",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 18,
          "f": 13,
          "total": 31
        },
        "assessed": {
          "m": 18,
          "f": 13,
          "total": 31
        },
        "emerging": {
          "m": 11,
          "f": 6,
          "total": 17
        },
        "developing": {
          "m": 5,
          "f": 5,
          "total": 10
        },
        "transitioning": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 26,
          "f": 19,
          "total": 45
        },
        "assessed": {
          "m": 26,
          "f": 19,
          "total": 45
        },
        "emerging": {
          "m": 12,
          "f": 6,
          "total": 18
        },
        "developing": {
          "m": 8,
          "f": 3,
          "total": 11
        },
        "transitioning": {
          "m": 1,
          "f": 4,
          "total": 5
        },
        "atGradeLevel": {
          "m": 5,
          "f": 6,
          "total": 11
        }
      },
      "filipino": {
        "enrolment": {
          "m": 26,
          "f": 19,
          "total": 45
        },
        "assessed": {
          "m": 26,
          "f": 19,
          "total": 45
        },
        "emerging": {
          "m": 12,
          "f": 6,
          "total": 18
        },
        "developing": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "transitioning": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "atGradeLevel": {
          "m": 5,
          "f": 8,
          "total": 13
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "assessed": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "emerging": {
          "m": 8,
          "f": 2,
          "total": 10
        },
        "developing": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "transitioning": {
          "m": 5,
          "f": 1,
          "total": 6
        },
        "atGradeLevel": {
          "m": 8,
          "f": 7,
          "total": 15
        }
      },
      "filipino": {
        "enrolment": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "assessed": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "emerging": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "atGradeLevel": {
          "m": 9,
          "f": 7,
          "total": 16
        }
      },
      "english": {
        "enrolment": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "assessed": {
          "m": 21,
          "f": 12,
          "total": 33
        },
        "emerging": {
          "m": 5,
          "f": 1,
          "total": 6
        },
        "developing": {
          "m": 5,
          "f": 4,
          "total": 9
        },
        "transitioning": {
          "m": 5,
          "f": 1,
          "total": 6
        },
        "atGradeLevel": {
          "m": 6,
          "f": 6,
          "total": 12
        }
      }
    }
  },
  {
    "order": 7,
    "officialName": "HAYANGON ES",
    "displayName": "HAYANGON Elementary School",
    "schoolId": "117507",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 1,
          "f": 8,
          "total": 9
        },
        "assessed": {
          "m": 1,
          "f": 8,
          "total": 9
        },
        "emerging": {
          "m": 1,
          "f": 4,
          "total": 5
        },
        "developing": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "transitioning": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "assessed": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "emerging": {
          "m": 7,
          "f": 2,
          "total": 9
        },
        "developing": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "transitioning": {
          "m": 4,
          "f": 5,
          "total": 9
        },
        "atGradeLevel": {
          "m": 2,
          "f": 1,
          "total": 3
        }
      },
      "filipino": {
        "enrolment": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "assessed": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "emerging": {
          "m": 7,
          "f": 4,
          "total": 11
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 4,
          "f": 5,
          "total": 9
        },
        "atGradeLevel": {
          "m": 1,
          "f": 1,
          "total": 2
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "assessed": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 2,
          "f": 0,
          "total": 2
        },
        "transitioning": {
          "m": 13,
          "f": 6,
          "total": 19
        },
        "atGradeLevel": {
          "m": 4,
          "f": 2,
          "total": 6
        }
      },
      "filipino": {
        "enrolment": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "assessed": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "emerging": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 10,
          "f": 4,
          "total": 14
        },
        "atGradeLevel": {
          "m": 4,
          "f": 2,
          "total": 6
        }
      },
      "english": {
        "enrolment": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "assessed": {
          "m": 19,
          "f": 8,
          "total": 27
        },
        "emerging": {
          "m": 6,
          "f": 2,
          "total": 8
        },
        "developing": {
          "m": 10,
          "f": 6,
          "total": 16
        },
        "transitioning": {
          "m": 3,
          "f": 0,
          "total": 3
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    }
  },
  {
    "order": 8,
    "officialName": "LABI-LABI ES",
    "displayName": "LABI-LABI Elementary School",
    "schoolId": "117508",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 15,
          "f": 19,
          "total": 34
        },
        "assessed": {
          "m": 15,
          "f": 19,
          "total": 34
        },
        "emerging": {
          "m": 6,
          "f": 3,
          "total": 9
        },
        "developing": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "transitioning": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "atGradeLevel": {
          "m": 3,
          "f": 10,
          "total": 13
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 24,
          "f": 18,
          "total": 42
        },
        "assessed": {
          "m": 24,
          "f": 18,
          "total": 42
        },
        "emerging": {
          "m": 6,
          "f": 0,
          "total": 6
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "atGradeLevel": {
          "m": 14,
          "f": 16,
          "total": 30
        }
      },
      "filipino": {
        "enrolment": {
          "m": 24,
          "f": 18,
          "total": 42
        },
        "assessed": {
          "m": 24,
          "f": 18,
          "total": 42
        },
        "emerging": {
          "m": 6,
          "f": 0,
          "total": 6
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "atGradeLevel": {
          "m": 16,
          "f": 17,
          "total": 33
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "assessed": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "emerging": {
          "m": 6,
          "f": 5,
          "total": 11
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 3,
          "f": 3,
          "total": 6
        },
        "atGradeLevel": {
          "m": 14,
          "f": 18,
          "total": 32
        }
      },
      "filipino": {
        "enrolment": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "assessed": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "emerging": {
          "m": 3,
          "f": 4,
          "total": 7
        },
        "developing": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "transitioning": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "atGradeLevel": {
          "m": 16,
          "f": 20,
          "total": 36
        }
      },
      "english": {
        "enrolment": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "assessed": {
          "m": 27,
          "f": 28,
          "total": 55
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "transitioning": {
          "m": 8,
          "f": 4,
          "total": 12
        },
        "atGradeLevel": {
          "m": 13,
          "f": 18,
          "total": 31
        }
      }
    }
  },
  {
    "order": 9,
    "officialName": "MAGTICOL ES",
    "displayName": "MAGTICOL Elementary School",
    "schoolId": "117509",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 15,
          "total": 28
        },
        "assessed": {
          "m": 13,
          "f": 15,
          "total": 28
        },
        "emerging": {
          "m": 6,
          "f": 2,
          "total": 8
        },
        "developing": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "transitioning": {
          "m": 2,
          "f": 11,
          "total": 13
        },
        "atGradeLevel": {
          "m": 3,
          "f": 0,
          "total": 3
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 17,
          "f": 18,
          "total": 35
        },
        "assessed": {
          "m": 17,
          "f": 18,
          "total": 35
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "transitioning": {
          "m": 6,
          "f": 4,
          "total": 10
        },
        "atGradeLevel": {
          "m": 2,
          "f": 5,
          "total": 7
        }
      },
      "filipino": {
        "enrolment": {
          "m": 17,
          "f": 18,
          "total": 35
        },
        "assessed": {
          "m": 17,
          "f": 18,
          "total": 35
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 6,
          "f": 3,
          "total": 9
        },
        "atGradeLevel": {
          "m": 3,
          "f": 6,
          "total": 9
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "developing": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "transitioning": {
          "m": 5,
          "f": 4,
          "total": 9
        },
        "atGradeLevel": {
          "m": 8,
          "f": 10,
          "total": 18
        }
      },
      "filipino": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "developing": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "transitioning": {
          "m": 4,
          "f": 4,
          "total": 8
        },
        "atGradeLevel": {
          "m": 10,
          "f": 10,
          "total": 20
        }
      },
      "english": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 0,
          "f": 3,
          "total": 3
        },
        "transitioning": {
          "m": 3,
          "f": 4,
          "total": 7
        },
        "atGradeLevel": {
          "m": 11,
          "f": 10,
          "total": 21
        }
      }
    }
  },
  {
    "order": 10,
    "officialName": "MAINIT ES",
    "displayName": "MAINIT Elementary School",
    "schoolId": "117510",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 6,
          "f": 8,
          "total": 14
        },
        "assessed": {
          "m": 6,
          "f": 8,
          "total": 14
        },
        "emerging": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "assessed": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "emerging": {
          "m": 8,
          "f": 6,
          "total": 14
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 2,
          "f": 3,
          "total": 5
        },
        "atGradeLevel": {
          "m": 2,
          "f": 1,
          "total": 3
        }
      },
      "filipino": {
        "enrolment": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "assessed": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "emerging": {
          "m": 8,
          "f": 6,
          "total": 14
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 2,
          "f": 3,
          "total": 5
        },
        "atGradeLevel": {
          "m": 2,
          "f": 1,
          "total": 3
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "assessed": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "emerging": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "atGradeLevel": {
          "m": 4,
          "f": 3,
          "total": 7
        }
      },
      "filipino": {
        "enrolment": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "assessed": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "emerging": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 11,
          "f": 6,
          "total": 17
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "assessed": {
          "m": 14,
          "f": 7,
          "total": 21
        },
        "emerging": {
          "m": 6,
          "f": 1,
          "total": 7
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 6,
          "f": 6,
          "total": 12
        },
        "atGradeLevel": {
          "m": 1,
          "f": 0,
          "total": 1
        }
      }
    }
  },
  {
    "order": 11,
    "officialName": "POLOPANGYAN ES",
    "displayName": "POLOPANGYAN Elementary School",
    "schoolId": "117511",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 30,
          "f": 22,
          "total": 52
        },
        "assessed": {
          "m": 30,
          "f": 22,
          "total": 52
        },
        "emerging": {
          "m": 30,
          "f": 20,
          "total": 50
        },
        "developing": {
          "m": 0,
          "f": 2,
          "total": 18
        },
        "transitioning": {
          "m": 5,
          "f": 5,
          "total": 10
        },
        "atGradeLevel": {
          "m": 0,
          "f": 2,
          "total": 2
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 44,
          "f": 41,
          "total": 85
        },
        "assessed": {
          "m": 44,
          "f": 41,
          "total": 85
        },
        "emerging": {
          "m": 19,
          "f": 7,
          "total": 26
        },
        "developing": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "transitioning": {
          "m": 6,
          "f": 9,
          "total": 15
        },
        "atGradeLevel": {
          "m": 17,
          "f": 24,
          "total": 41
        }
      },
      "filipino": {
        "enrolment": {
          "m": 44,
          "f": 41,
          "total": 85
        },
        "assessed": {
          "m": 44,
          "f": 41,
          "total": 85
        },
        "emerging": {
          "m": 11,
          "f": 6,
          "total": 17
        },
        "developing": {
          "m": 2,
          "f": 0,
          "total": 2
        },
        "transitioning": {
          "m": 12,
          "f": 8,
          "total": 20
        },
        "atGradeLevel": {
          "m": 19,
          "f": 27,
          "total": 46
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "assessed": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "emerging": {
          "m": 7,
          "f": 2,
          "total": 9
        },
        "developing": {
          "m": 17,
          "f": 6,
          "total": 23
        },
        "transitioning": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "atGradeLevel": {
          "m": 11,
          "f": 19,
          "total": 30
        }
      },
      "filipino": {
        "enrolment": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "assessed": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "emerging": {
          "m": 11,
          "f": 5,
          "total": 16
        },
        "developing": {
          "m": 12,
          "f": 6,
          "total": 18
        },
        "transitioning": {
          "m": 7,
          "f": 8,
          "total": 15
        },
        "atGradeLevel": {
          "m": 13,
          "f": 20,
          "total": 33
        }
      },
      "english": {
        "enrolment": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "assessed": {
          "m": 43,
          "f": 39,
          "total": 82
        },
        "emerging": {
          "m": 5,
          "f": 0,
          "total": 5
        },
        "developing": {
          "m": 22,
          "f": 10,
          "total": 32
        },
        "transitioning": {
          "m": 10,
          "f": 14,
          "total": 24
        },
        "atGradeLevel": {
          "m": 6,
          "f": 15,
          "total": 21
        }
      }
    }
  },
  {
    "order": 12,
    "officialName": "SALAMANCA ES",
    "displayName": "SALAMANCA Elementary School",
    "schoolId": "117512",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 45,
          "f": 29,
          "total": 74
        },
        "assessed": {
          "m": 45,
          "f": 29,
          "total": 74
        },
        "emerging": {
          "m": 37,
          "f": 16,
          "total": 53
        },
        "developing": {
          "m": 6,
          "f": 8,
          "total": 14
        },
        "transitioning": {
          "m": 1,
          "f": 5,
          "total": 6
        },
        "atGradeLevel": {
          "m": 1,
          "f": 0,
          "total": 1
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 37,
          "f": 44,
          "total": 81
        },
        "assessed": {
          "m": 37,
          "f": 44,
          "total": 81
        },
        "emerging": {
          "m": 11,
          "f": 4,
          "total": 15
        },
        "developing": {
          "m": 6,
          "f": 2,
          "total": 8
        },
        "transitioning": {
          "m": 17,
          "f": 30,
          "total": 47
        },
        "atGradeLevel": {
          "m": 3,
          "f": 8,
          "total": 11
        }
      },
      "filipino": {
        "enrolment": {
          "m": 37,
          "f": 44,
          "total": 81
        },
        "assessed": {
          "m": 37,
          "f": 44,
          "total": 81
        },
        "emerging": {
          "m": 12,
          "f": 16,
          "total": 28
        },
        "developing": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "transitioning": {
          "m": 20,
          "f": 7,
          "total": 27
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "assessed": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "emerging": {
          "m": 23,
          "f": 17,
          "total": 40
        },
        "developing": {
          "m": 6,
          "f": 0,
          "total": 6
        },
        "transitioning": {
          "m": 11,
          "f": 12,
          "total": 23
        },
        "atGradeLevel": {
          "m": 5,
          "f": 19,
          "total": 24
        }
      },
      "filipino": {
        "enrolment": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "assessed": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "emerging": {
          "m": 25,
          "f": 16,
          "total": 41
        },
        "developing": {
          "m": 10,
          "f": 12,
          "total": 22
        },
        "transitioning": {
          "m": 9,
          "f": 16,
          "total": 25
        },
        "atGradeLevel": {
          "m": 1,
          "f": 7,
          "total": 8
        }
      },
      "english": {
        "enrolment": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "assessed": {
          "m": 45,
          "f": 48,
          "total": 93
        },
        "emerging": {
          "m": 20,
          "f": 12,
          "total": 32
        },
        "developing": {
          "m": 5,
          "f": 7,
          "total": 12
        },
        "transitioning": {
          "m": 18,
          "f": 20,
          "total": 38
        },
        "atGradeLevel": {
          "m": 2,
          "f": 9,
          "total": 11
        }
      }
    }
  },
  {
    "order": 13,
    "officialName": "SAN ISIDRO ES",
    "displayName": "SAN ISIDRO Elementary School",
    "schoolId": "117513",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 31,
          "f": 30,
          "total": 61
        },
        "assessed": {
          "m": 31,
          "f": 30,
          "total": 61
        },
        "emerging": {
          "m": 26,
          "f": 19,
          "total": 45
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 4,
          "f": 9,
          "total": 13
        },
        "atGradeLevel": {
          "m": 0,
          "f": 2,
          "total": 2
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 36,
          "f": 33,
          "total": 69
        },
        "assessed": {
          "m": 36,
          "f": 33,
          "total": 69
        },
        "emerging": {
          "m": 7,
          "f": 6,
          "total": 13
        },
        "developing": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "transitioning": {
          "m": 15,
          "f": 12,
          "total": 27
        },
        "atGradeLevel": {
          "m": 2,
          "f": 4,
          "total": 6
        }
      },
      "filipino": {
        "enrolment": {
          "m": 36,
          "f": 33,
          "total": 69
        },
        "assessed": {
          "m": 36,
          "f": 34,
          "total": 70
        },
        "emerging": {
          "m": 8,
          "f": 7,
          "total": 15
        },
        "developing": {
          "m": 9,
          "f": 1,
          "total": 10
        },
        "transitioning": {
          "m": 19,
          "f": 25,
          "total": 44
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "assessed": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "emerging": {
          "m": 11,
          "f": 4,
          "total": 15
        },
        "developing": {
          "m": 10,
          "f": 11,
          "total": 21
        },
        "transitioning": {
          "m": 12,
          "f": 14,
          "total": 26
        },
        "atGradeLevel": {
          "m": 4,
          "f": 8,
          "total": 12
        }
      },
      "filipino": {
        "enrolment": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "assessed": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "emerging": {
          "m": 12,
          "f": 0,
          "total": 12
        },
        "developing": {
          "m": 10,
          "f": 7,
          "total": 17
        },
        "transitioning": {
          "m": 15,
          "f": 24,
          "total": 39
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "assessed": {
          "m": 37,
          "f": 37,
          "total": 74
        },
        "emerging": {
          "m": 19,
          "f": 14,
          "total": 33
        },
        "developing": {
          "m": 5,
          "f": 6,
          "total": 11
        },
        "transitioning": {
          "m": 13,
          "f": 15,
          "total": 28
        },
        "atGradeLevel": {
          "m": 0,
          "f": 2,
          "total": 2
        }
      }
    }
  },
  {
    "order": 14,
    "officialName": "SOCORRO SY ESTRADA MEMORIAL ES",
    "displayName": "SOCORRO SY ESTRADA MEMORIAL Elementary School",
    "schoolId": "117514",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 10,
          "f": 17,
          "total": 27
        },
        "assessed": {
          "m": 10,
          "f": 17,
          "total": 27
        },
        "emerging": {
          "m": 6,
          "f": 5,
          "total": 11
        },
        "developing": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "transitioning": {
          "m": 1,
          "f": 9,
          "total": 10
        },
        "atGradeLevel": {
          "m": 2,
          "f": 1,
          "total": 3
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 20,
          "f": 9,
          "total": 29
        },
        "assessed": {
          "m": 20,
          "f": 9,
          "total": 29
        },
        "emerging": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "developing": {
          "m": 4,
          "f": 1,
          "total": 5
        },
        "transitioning": {
          "m": 8,
          "f": 1,
          "total": 9
        },
        "atGradeLevel": {
          "m": 8,
          "f": 6,
          "total": 14
        }
      },
      "filipino": {
        "enrolment": {
          "m": 20,
          "f": 9,
          "total": 29
        },
        "assessed": {
          "m": 20,
          "f": 9,
          "total": 29
        },
        "emerging": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "developing": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "transitioning": {
          "m": 6,
          "f": 1,
          "total": 7
        },
        "atGradeLevel": {
          "m": 11,
          "f": 6,
          "total": 17
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "assessed": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 6,
          "f": 4,
          "total": 10
        },
        "atGradeLevel": {
          "m": 9,
          "f": 16,
          "total": 25
        }
      },
      "filipino": {
        "enrolment": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "assessed": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 4,
          "f": 3,
          "total": 7
        },
        "atGradeLevel": {
          "m": 11,
          "f": 17,
          "total": 28
        }
      },
      "english": {
        "enrolment": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "assessed": {
          "m": 15,
          "f": 20,
          "total": 35
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 3,
          "f": 1,
          "total": 4
        },
        "transitioning": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "atGradeLevel": {
          "m": 9,
          "f": 17,
          "total": 26
        }
      }
    }
  },
  {
    "order": 15,
    "officialName": "STOP AGUINALDO ES",
    "displayName": "STOP AGUINALDO Elementary School",
    "schoolId": "117515",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 43,
          "f": 35,
          "total": 78
        },
        "assessed": {
          "m": 43,
          "f": 35,
          "total": 78
        },
        "emerging": {
          "m": 14,
          "f": 14,
          "total": 28
        },
        "developing": {
          "m": 19,
          "f": 10,
          "total": 29
        },
        "transitioning": {
          "m": 3,
          "f": 3,
          "total": 6
        },
        "atGradeLevel": {
          "m": 7,
          "f": 8,
          "total": 15
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 59,
          "f": 40,
          "total": 99
        },
        "assessed": {
          "m": 59,
          "f": 40,
          "total": 99
        },
        "emerging": {
          "m": 15,
          "f": 6,
          "total": 21
        },
        "developing": {
          "m": 3,
          "f": 3,
          "total": 6
        },
        "transitioning": {
          "m": 15,
          "f": 4,
          "total": 19
        },
        "atGradeLevel": {
          "m": 26,
          "f": 27,
          "total": 53
        }
      },
      "filipino": {
        "enrolment": {
          "m": 59,
          "f": 40,
          "total": 99
        },
        "assessed": {
          "m": 59,
          "f": 40,
          "total": 99
        },
        "emerging": {
          "m": 15,
          "f": 6,
          "total": 21
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 15,
          "f": 7,
          "total": 22
        },
        "atGradeLevel": {
          "m": 25,
          "f": 25,
          "total": 50
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "assessed": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "emerging": {
          "m": 6,
          "f": 2,
          "total": 8
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 14,
          "f": 4,
          "total": 18
        },
        "atGradeLevel": {
          "m": 33,
          "f": 26,
          "total": 59
        }
      },
      "filipino": {
        "enrolment": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "assessed": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "emerging": {
          "m": 6,
          "f": 2,
          "total": 8
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 12,
          "f": 4,
          "total": 16
        },
        "atGradeLevel": {
          "m": 35,
          "f": 26,
          "total": 61
        }
      },
      "english": {
        "enrolment": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "assessed": {
          "m": 53,
          "f": 32,
          "total": 85
        },
        "emerging": {
          "m": 7,
          "f": 3,
          "total": 10
        },
        "developing": {
          "m": 7,
          "f": 2,
          "total": 9
        },
        "transitioning": {
          "m": 8,
          "f": 6,
          "total": 14
        },
        "atGradeLevel": {
          "m": 31,
          "f": 21,
          "total": 52
        }
      }
    }
  },
  {
    "order": 16,
    "officialName": "TABUN-AC ES",
    "displayName": "TABUN-AC Elementary School",
    "schoolId": "117516",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 10,
          "f": 9,
          "total": 19
        },
        "assessed": {
          "m": 10,
          "f": 9,
          "total": 19
        },
        "emerging": {
          "m": 8,
          "f": 4,
          "total": 12
        },
        "developing": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "transitioning": {
          "m": 0,
          "f": 4,
          "total": 4
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 12,
          "f": 16,
          "total": 28
        },
        "assessed": {
          "m": 12,
          "f": 16,
          "total": 28
        },
        "emerging": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "atGradeLevel": {
          "m": 0,
          "f": 6,
          "total": 6
        }
      },
      "filipino": {
        "enrolment": {
          "m": 12,
          "f": 16,
          "total": 28
        },
        "assessed": {
          "m": 12,
          "f": 16,
          "total": 28
        },
        "emerging": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "developing": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "transitioning": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "atGradeLevel": {
          "m": 0,
          "f": 6,
          "total": 6
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "assessed": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "emerging": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "developing": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "transitioning": {
          "m": 2,
          "f": 5,
          "total": 7
        },
        "atGradeLevel": {
          "m": 7,
          "f": 5,
          "total": 12
        }
      },
      "filipino": {
        "enrolment": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "assessed": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "emerging": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 4,
          "f": 1,
          "total": 5
        },
        "atGradeLevel": {
          "m": 7,
          "f": 9,
          "total": 16
        }
      },
      "english": {
        "enrolment": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "assessed": {
          "m": 16,
          "f": 14,
          "total": 30
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "transitioning": {
          "m": 5,
          "f": 3,
          "total": 8
        },
        "atGradeLevel": {
          "m": 9,
          "f": 9,
          "total": 18
        }
      }
    }
  },
  {
    "order": 17,
    "officialName": "TINIBAWAN ES",
    "displayName": "TINIBAWAN Elementary School",
    "schoolId": "117517",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "assessed": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "emerging": {
          "m": 10,
          "f": 8,
          "total": 18
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 11,
          "f": 10,
          "total": 21
        },
        "assessed": {
          "m": 11,
          "f": 10,
          "total": 21
        },
        "emerging": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "developing": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "transitioning": {
          "m": 2,
          "f": 4,
          "total": 6
        },
        "atGradeLevel": {
          "m": 1,
          "f": 2,
          "total": 3
        }
      },
      "filipino": {
        "enrolment": {
          "m": 11,
          "f": 10,
          "total": 21
        },
        "assessed": {
          "m": 11,
          "f": 10,
          "total": 21
        },
        "emerging": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "developing": {
          "m": 4,
          "f": 2,
          "total": 6
        },
        "transitioning": {
          "m": 3,
          "f": 5,
          "total": 8
        },
        "atGradeLevel": {
          "m": 1,
          "f": 1,
          "total": 2
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "assessed": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "emerging": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "developing": {
          "m": 5,
          "f": 3,
          "total": 8
        },
        "transitioning": {
          "m": 2,
          "f": 7,
          "total": 9
        },
        "atGradeLevel": {
          "m": 0,
          "f": 2,
          "total": 2
        }
      },
      "filipino": {
        "enrolment": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "assessed": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "emerging": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "developing": {
          "m": 5,
          "f": 2,
          "total": 7
        },
        "transitioning": {
          "m": 2,
          "f": 10,
          "total": 12
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "assessed": {
          "m": 8,
          "f": 12,
          "total": 20
        },
        "emerging": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "developing": {
          "m": 5,
          "f": 4,
          "total": 9
        },
        "transitioning": {
          "m": 2,
          "f": 8,
          "total": 10
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    }
  },
  {
    "order": 18,
    "officialName": "TOBOSO CENTRAL SCHOOL",
    "displayName": "Toboso Central School",
    "schoolId": "117518",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 82,
          "f": 75,
          "total": 157
        },
        "assessed": {
          "m": 81,
          "f": 75,
          "total": 156
        },
        "emerging": {
          "m": 17,
          "f": 9,
          "total": 26
        },
        "developing": {
          "m": 13,
          "f": 10,
          "total": 23
        },
        "transitioning": {
          "m": 26,
          "f": 27,
          "total": 53
        },
        "atGradeLevel": {
          "m": 25,
          "f": 29,
          "total": 54
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 68,
          "f": 67,
          "total": 135
        },
        "assessed": {
          "m": 68,
          "f": 67,
          "total": 135
        },
        "emerging": {
          "m": 20,
          "f": 13,
          "total": 33
        },
        "developing": {
          "m": 14,
          "f": 5,
          "total": 19
        },
        "transitioning": {
          "m": 21,
          "f": 28,
          "total": 49
        },
        "atGradeLevel": {
          "m": 13,
          "f": 21,
          "total": 34
        }
      },
      "filipino": {
        "enrolment": {
          "m": 68,
          "f": 67,
          "total": 135
        },
        "assessed": {
          "m": 68,
          "f": 67,
          "total": 135
        },
        "emerging": {
          "m": 17,
          "f": 12,
          "total": 29
        },
        "developing": {
          "m": 12,
          "f": 6,
          "total": 18
        },
        "transitioning": {
          "m": 27,
          "f": 30,
          "total": 57
        },
        "atGradeLevel": {
          "m": 12,
          "f": 19,
          "total": 31
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "assessed": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "emerging": {
          "m": 18,
          "f": 10,
          "total": 28
        },
        "developing": {
          "m": 17,
          "f": 8,
          "total": 25
        },
        "transitioning": {
          "m": 32,
          "f": 24,
          "total": 56
        },
        "atGradeLevel": {
          "m": 25,
          "f": 41,
          "total": 66
        }
      },
      "filipino": {
        "enrolment": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "assessed": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "emerging": {
          "m": 11,
          "f": 6,
          "total": 17
        },
        "developing": {
          "m": 15,
          "f": 8,
          "total": 23
        },
        "transitioning": {
          "m": 38,
          "f": 27,
          "total": 65
        },
        "atGradeLevel": {
          "m": 28,
          "f": 42,
          "total": 70
        }
      },
      "english": {
        "enrolment": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "assessed": {
          "m": 92,
          "f": 83,
          "total": 175
        },
        "emerging": {
          "m": 5,
          "f": 1,
          "total": 6
        },
        "developing": {
          "m": 32,
          "f": 18,
          "total": 50
        },
        "transitioning": {
          "m": 24,
          "f": 27,
          "total": 51
        },
        "atGradeLevel": {
          "m": 31,
          "f": 37,
          "total": 68
        }
      }
    }
  },
  {
    "order": 19,
    "officialName": "TORIL ES",
    "displayName": "TORIL Elementary School",
    "schoolId": "117519",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 17,
          "f": 8,
          "total": 25
        },
        "assessed": {
          "m": 17,
          "f": 8,
          "total": 25
        },
        "emerging": {
          "m": 10,
          "f": 2,
          "total": 12
        },
        "developing": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "transitioning": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "atGradeLevel": {
          "m": 4,
          "f": 4,
          "total": 8
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 12,
          "f": 13,
          "total": 25
        },
        "assessed": {
          "m": 12,
          "f": 13,
          "total": 25
        },
        "emerging": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "developing": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "transitioning": {
          "m": 3,
          "f": 4,
          "total": 7
        },
        "atGradeLevel": {
          "m": 3,
          "f": 5,
          "total": 8
        }
      },
      "filipino": {
        "enrolment": {
          "m": 12,
          "f": 13,
          "total": 25
        },
        "assessed": {
          "m": 12,
          "f": 13,
          "total": 25
        },
        "emerging": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "developing": {
          "m": 3,
          "f": 2,
          "total": 5
        },
        "transitioning": {
          "m": 3,
          "f": 4,
          "total": 7
        },
        "atGradeLevel": {
          "m": 3,
          "f": 5,
          "total": 8
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "assessed": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "emerging": {
          "m": 1,
          "f": 3,
          "total": 4
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "atGradeLevel": {
          "m": 1,
          "f": 8,
          "total": 9
        }
      },
      "filipino": {
        "enrolment": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "assessed": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "emerging": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "developing": {
          "m": 1,
          "f": 0,
          "total": 1
        },
        "transitioning": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "atGradeLevel": {
          "m": 9,
          "f": 8,
          "total": 17
        }
      },
      "english": {
        "enrolment": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "assessed": {
          "m": 12,
          "f": 11,
          "total": 23
        },
        "emerging": {
          "m": 1,
          "f": 1,
          "total": 2
        },
        "developing": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "transitioning": {
          "m": 2,
          "f": 3,
          "total": 5
        },
        "atGradeLevel": {
          "m": 8,
          "f": 5,
          "total": 13
        }
      }
    }
  },
  {
    "order": 20,
    "officialName": "ULDARICO ES",
    "displayName": "ULDARICO Elementary School",
    "schoolId": "117520",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 11,
          "total": 24
        },
        "assessed": {
          "m": 13,
          "f": 11,
          "total": 24
        },
        "emerging": {
          "m": 13,
          "f": 11,
          "total": 24
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 21,
          "f": 15,
          "total": 36
        },
        "assessed": {
          "m": 15,
          "f": 15,
          "total": 30
        },
        "emerging": {
          "m": 11,
          "f": 5,
          "total": 16
        },
        "developing": {
          "m": 0,
          "f": 7,
          "total": 7
        },
        "transitioning": {
          "m": 2,
          "f": 6,
          "total": 8
        },
        "atGradeLevel": {
          "m": 1,
          "f": 3,
          "total": 4
        }
      },
      "filipino": {
        "enrolment": {
          "m": 21,
          "f": 15,
          "total": 36
        },
        "assessed": {
          "m": 21,
          "f": 15,
          "total": 36
        },
        "emerging": {
          "m": 8,
          "f": 5,
          "total": 13
        },
        "developing": {
          "m": 4,
          "f": 4,
          "total": 8
        },
        "transitioning": {
          "m": 3,
          "f": 7,
          "total": 10
        },
        "atGradeLevel": {
          "m": 0,
          "f": 5,
          "total": 5
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 13,
          "f": 19,
          "total": 32
        },
        "assessed": {
          "m": 13,
          "f": 19,
          "total": 32
        },
        "emerging": {
          "m": 5,
          "f": 5,
          "total": 10
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 8,
          "f": 14,
          "total": 22
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "filipino": {
        "enrolment": {
          "m": 5,
          "f": 5,
          "total": 10
        },
        "assessed": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "emerging": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "developing": {
          "m": 8,
          "f": 14,
          "total": 22
        },
        "transitioning": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 13,
          "f": 19,
          "total": 32
        },
        "assessed": {
          "m": 13,
          "f": 19,
          "total": 32
        },
        "emerging": {
          "m": 5,
          "f": 7,
          "total": 12
        },
        "developing": {
          "m": 0,
          "f": 2,
          "total": 2
        },
        "transitioning": {
          "m": 0,
          "f": 14,
          "total": 14
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    }
  },
  {
    "order": 21,
    "officialName": "VERGARA ES",
    "displayName": "VERGARA Elementary School",
    "schoolId": "117521",
    "grade1": {
      "mtb": {
        "enrolment": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "assessed": {
          "m": 12,
          "f": 10,
          "total": 22
        },
        "emerging": {
          "m": 12,
          "f": 9,
          "total": 21
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    },
    "grade2": {
      "mtb": {
        "enrolment": {
          "m": 11,
          "f": 13,
          "total": 24
        },
        "assessed": {
          "m": 11,
          "f": 13,
          "total": 24
        },
        "emerging": {
          "m": 7,
          "f": 5,
          "total": 12
        },
        "developing": {
          "m": 0,
          "f": 1,
          "total": 1
        },
        "transitioning": {
          "m": 2,
          "f": 1,
          "total": 3
        },
        "atGradeLevel": {
          "m": 2,
          "f": 6,
          "total": 8
        }
      },
      "filipino": {
        "enrolment": {
          "m": 11,
          "f": 13,
          "total": 24
        },
        "assessed": {
          "m": 11,
          "f": 13,
          "total": 24
        },
        "emerging": {
          "m": 8,
          "f": 6,
          "total": 14
        },
        "developing": {
          "m": 0,
          "f": 0,
          "total": 0
        },
        "transitioning": {
          "m": 1,
          "f": 2,
          "total": 3
        },
        "atGradeLevel": {
          "m": 2,
          "f": 5,
          "total": 7
        }
      }
    },
    "grade3": {
      "mtb": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 4,
          "f": 5,
          "total": 9
        },
        "developing": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "transitioning": {
          "m": 3,
          "f": 6,
          "total": 9
        },
        "atGradeLevel": {
          "m": 5,
          "f": 4,
          "total": 9
        }
      },
      "filipino": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 5,
          "f": 7,
          "total": 12
        },
        "developing": {
          "m": 2,
          "f": 2,
          "total": 4
        },
        "transitioning": {
          "m": 7,
          "f": 8,
          "total": 15
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      },
      "english": {
        "enrolment": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "assessed": {
          "m": 14,
          "f": 17,
          "total": 31
        },
        "emerging": {
          "m": 8,
          "f": 9,
          "total": 17
        },
        "developing": {
          "m": 1,
          "f": 4,
          "total": 5
        },
        "transitioning": {
          "m": 5,
          "f": 4,
          "total": 9
        },
        "atGradeLevel": {
          "m": 0,
          "f": 0,
          "total": 0
        }
      }
    }
  }
];

export const DISTRICT_CRLA_BOSY_TOTALS = {
  grade1: {
    mtb: {
    "enrolment": {
        "m": 502,
        "f": 433,
        "total": 935
    },
    "assessed": {
        "m": 501,
        "f": 433,
        "total": 934
    },
    "emerging": {
        "m": 293,
        "f": 193,
        "total": 486
    },
    "developing": {
        "m": 70,
        "f": 61,
        "total": 147
    },
    "transitioning": {
        "m": 84,
        "f": 119,
        "total": 203
    },
    "atGradeLevel": {
        "m": 62,
        "f": 70,
        "total": 132
    }
}
  },
  grade2: {
    mtb: {
    "enrolment": {
        "m": 545,
        "f": 514,
        "total": 1059
    },
    "assessed": {
        "m": 539,
        "f": 514,
        "total": 1053
    },
    "emerging": {
        "m": 192,
        "f": 119,
        "total": 311
    },
    "developing": {
        "m": 81,
        "f": 62,
        "total": 143
    },
    "transitioning": {
        "m": 143,
        "f": 166,
        "total": 309
    },
    "atGradeLevel": {
        "m": 118,
        "f": 161,
        "total": 279
    }
},
    filipino: {
    "enrolment": {
        "m": 545,
        "f": 514,
        "total": 1059
    },
    "assessed": {
        "m": 545,
        "f": 515,
        "total": 1060
    },
    "emerging": {
        "m": 183,
        "f": 132,
        "total": 315
    },
    "developing": {
        "m": 78,
        "f": 52,
        "total": 130
    },
    "transitioning": {
        "m": 157,
        "f": 155,
        "total": 312
    },
    "atGradeLevel": {
        "m": 117,
        "f": 155,
        "total": 272
    }
}
  },
  grade3: {
    mtb: {
    "enrolment": {
        "m": 585,
        "f": 540,
        "total": 1125
    },
    "assessed": {
        "m": 585,
        "f": 540,
        "total": 1125
    },
    "emerging": {
        "m": 142,
        "f": 84,
        "total": 226
    },
    "developing": {
        "m": 84,
        "f": 49,
        "total": 133
    },
    "transitioning": {
        "m": 185,
        "f": 174,
        "total": 359
    },
    "atGradeLevel": {
        "m": 171,
        "f": 241,
        "total": 412
    }
},
    filipino: {
    "enrolment": {
        "m": 577,
        "f": 526,
        "total": 1103
    },
    "assessed": {
        "m": 572,
        "f": 521,
        "total": 1093
    },
    "emerging": {
        "m": 128,
        "f": 68,
        "total": 196
    },
    "developing": {
        "m": 97,
        "f": 71,
        "total": 168
    },
    "transitioning": {
        "m": 182,
        "f": 180,
        "total": 362
    },
    "atGradeLevel": {
        "m": 173,
        "f": 210,
        "total": 383
    }
},
    english: {
    "enrolment": {
        "m": 585,
        "f": 540,
        "total": 1125
    },
    "assessed": {
        "m": 585,
        "f": 540,
        "total": 1125
    },
    "emerging": {
        "m": 142,
        "f": 72,
        "total": 214
    },
    "developing": {
        "m": 121,
        "f": 92,
        "total": 213
    },
    "transitioning": {
        "m": 165,
        "f": 190,
        "total": 355
    },
    "atGradeLevel": {
        "m": 149,
        "f": 190,
        "total": 339
    }
}
  }
};
