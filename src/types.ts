/**
 * DepEd District of Toboso Data Tracking System Types
 * Division of Negros Occidental, NIR (Negros Island Region)
 */

export type SchoolLevel = 'Elementary' | 'Junior High School' | 'Senior High School' | 'Integrated';

export type EncodingStatus = 'Completed' | 'Pending';

export type AssessmentModule = 'crla' | 'rma';

export type AssessmentPeriod = 'bosy' | 'eosy' | 'comparative';

export interface RMALevelData {
  notProficient: number;
  lowProficient: number;
  total: number;
}

export interface CRLAMetric {
  m: number;
  f: number;
  total: number;
}

export interface CRLASubjectData {
  enrolment: CRLAMetric;
  assessed: CRLAMetric;
  lowEmerging?: CRLAMetric;
  highEmerging?: CRLAMetric;
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

export interface SchoolRecord {
  id: string;
  order: number;
  schoolId: string; // 6-digit DepEd ID
  name: string;
  officialName: string;
  level: SchoolLevel;
  barangay: string;
  headName: string;
  headPosition: string;
  contactNumber: string;
  encodingStatus: EncodingStatus;
  lastEncodedDate: string | null;
  encodedBy: string | null;
  // BOSY CRLA Data
  bosy: {
    grade1: { mtb: CRLASubjectData };
    grade2: { mtb: CRLASubjectData; filipino: CRLASubjectData };
    grade3: { mtb: CRLASubjectData; filipino: CRLASubjectData; english: CRLASubjectData };
  };
  // Official EOSY CRLA Data
  eosy?: {
    grade1: { mtb: CRLASubjectData };
    grade2: { mtb: CRLASubjectData; filipino: CRLASubjectData };
    grade3: { mtb: CRLASubjectData; filipino: CRLASubjectData; english: CRLASubjectData };
  } | null;
  notes?: string;
}

export type MainMenuTab = 'dashboard' | 'schools' | 'reports' | 'analytics';


