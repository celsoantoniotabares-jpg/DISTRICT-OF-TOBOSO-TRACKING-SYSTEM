import React, { createContext, useContext, useState, useEffect } from 'react';
import { SchoolRecord } from '../types';
import { TOBOSO_SCHOOLS_INITIAL } from '../data/schools';
import { RMA_DISTRICT_DATA, RMASchoolRecord } from '../data/rmaData';
import { 
  PHIL_IRI_BOSY_DATA, 
  PHIL_IRI_EOSY_DATA, 
  PhilIriDataset, 
  PhilIriSchoolRow 
} from '../data/philIriData';

export interface PhilIriStore {
  bosy: {
    english: PhilIriDataset;
    filipino: PhilIriDataset;
  };
  eosy: {
    english: PhilIriDataset;
    filipino: PhilIriDataset;
  };
}

interface AssessmentDataContextType {
  // CRLA Schools
  schools: SchoolRecord[];
  updateSchoolCRLA: (schoolId: string, updatedRecord: SchoolRecord) => void;
  resetCRLA: () => void;

  // RMA Data
  rmaData: RMASchoolRecord[];
  updateSchoolRMA: (schoolId: string, updatedRecord: RMASchoolRecord) => void;
  resetRMA: () => void;

  // Phil-IRI Data
  philIriData: PhilIriStore;
  updateSchoolPhilIriRow: (
    period: 'bosy' | 'eosy',
    language: 'english' | 'filipino',
    grade: 'grade4' | 'grade5' | 'grade6',
    schoolId: string,
    updatedRow: PhilIriSchoolRow
  ) => void;
  resetPhilIri: () => void;

  // Global Reset
  resetAllToBaseline: () => void;
  hasCustomEdits: boolean;
}

const STORAGE_KEYS = {
  CRLA: 'deped_toboso_custom_crla_v1',
  RMA: 'deped_toboso_custom_rma_v1',
  PHIL_IRI: 'deped_toboso_custom_phil_iri_v1',
  EDIT_FLAG: 'deped_toboso_has_custom_edits'
};

const AssessmentDataContext = createContext<AssessmentDataContextType | undefined>(undefined);

export const AssessmentDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. CRLA State
  const [schools, setSchools] = useState<SchoolRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRLA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load custom CRLA data from localStorage', e);
    }
    return TOBOSO_SCHOOLS_INITIAL;
  });

  // 2. RMA State
  const [rmaData, setRmaData] = useState<RMASchoolRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RMA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load custom RMA data from localStorage', e);
    }
    return RMA_DISTRICT_DATA;
  });

  // 3. Phil-IRI State
  const [philIriData, setPhilIriData] = useState<PhilIriStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHIL_IRI);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load custom Phil-IRI data from localStorage', e);
    }
    return {
      bosy: {
        english: PHIL_IRI_BOSY_DATA.english,
        filipino: PHIL_IRI_BOSY_DATA.filipino,
      },
      eosy: {
        english: PHIL_IRI_EOSY_DATA.english,
        filipino: PHIL_IRI_EOSY_DATA.filipino,
      }
    };
  });

  const [hasCustomEdits, setHasCustomEdits] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.EDIT_FLAG) === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRLA, JSON.stringify(schools));
    } catch (e) {
      console.error(e);
    }
  }, [schools]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RMA, JSON.stringify(rmaData));
    } catch (e) {
      console.error(e);
    }
  }, [rmaData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHIL_IRI, JSON.stringify(philIriData));
    } catch (e) {
      console.error(e);
    }
  }, [philIriData]);

  const markEdited = () => {
    setHasCustomEdits(true);
    localStorage.setItem(STORAGE_KEYS.EDIT_FLAG, 'true');
  };

  // Updaters
  const updateSchoolCRLA = (schoolId: string, updatedRecord: SchoolRecord) => {
    setSchools(prev => prev.map(s => s.schoolId === schoolId ? updatedRecord : s));
    markEdited();
  };

  const resetCRLA = () => {
    setSchools(TOBOSO_SCHOOLS_INITIAL);
    localStorage.removeItem(STORAGE_KEYS.CRLA);
  };

  const updateSchoolRMA = (schoolId: string, updatedRecord: RMASchoolRecord) => {
    setRmaData(prev => prev.map(r => r.schoolId === schoolId ? updatedRecord : r));
    markEdited();
  };

  const resetRMA = () => {
    setRmaData(RMA_DISTRICT_DATA);
    localStorage.removeItem(STORAGE_KEYS.RMA);
  };

  const updateSchoolPhilIriRow = (
    period: 'bosy' | 'eosy',
    language: 'english' | 'filipino',
    grade: 'grade4' | 'grade5' | 'grade6',
    schoolId: string,
    updatedRow: PhilIriSchoolRow
  ) => {
    setPhilIriData(prev => {
      const currentList = prev[period][language][grade];
      const updatedList = currentList.map(row => row.schoolId === schoolId ? updatedRow : row);
      return {
        ...prev,
        [period]: {
          ...prev[period],
          [language]: {
            ...prev[period][language],
            [grade]: updatedList
          }
        }
      };
    });
    markEdited();
  };

  const resetPhilIri = () => {
    setPhilIriData({
      bosy: {
        english: PHIL_IRI_BOSY_DATA.english,
        filipino: PHIL_IRI_BOSY_DATA.filipino,
      },
      eosy: {
        english: PHIL_IRI_EOSY_DATA.english,
        filipino: PHIL_IRI_EOSY_DATA.filipino,
      }
    });
    localStorage.removeItem(STORAGE_KEYS.PHIL_IRI);
  };

  const resetAllToBaseline = () => {
    resetCRLA();
    resetRMA();
    resetPhilIri();
    setHasCustomEdits(false);
    localStorage.removeItem(STORAGE_KEYS.EDIT_FLAG);
  };

  return (
    <AssessmentDataContext.Provider
      value={{
        schools,
        updateSchoolCRLA,
        resetCRLA,
        rmaData,
        updateSchoolRMA,
        resetRMA,
        philIriData,
        updateSchoolPhilIriRow,
        resetPhilIri,
        resetAllToBaseline,
        hasCustomEdits
      }}
    >
      {children}
    </AssessmentDataContext.Provider>
  );
};

export const useAssessmentData = (): AssessmentDataContextType => {
  const context = useContext(AssessmentDataContext);
  if (!context) {
    throw new Error('useAssessmentData must be used within an AssessmentDataProvider');
  }
  return context;
};
