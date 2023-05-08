import { WorkExperience } from 'apps/job-portal/utils/types/data/work.type';
import create from 'zustand';

export type Accomplishment = {
  _id: string;
  accomplishment: string;
};

export type Duty = {
  _id: string;
  duty: string;
};

export type WorkExperienceSheet = WorkExperience & {
  immediateSupervisor: string;
  nameOfOffice: string;
  accomplishments: Array<Accomplishment>;
  duties: Array<Duty>;
  workExperienceId: string;
};

export type WorkExpSheetState = {
  selectedWorkExperience: WorkExperienceSheet;
  setSelectedWorkExperience: (
    selectedWorkExperience: WorkExperienceSheet
  ) => void;
  workExperiences: Array<WorkExperienceSheet>;
  setWorkExperiences: (workExperiences: Array<WorkExperienceSheet>) => void;
  workExperiencesSheet: Array<WorkExperienceSheet>;
  setWorkExperiencesSheet: (
    workExperiencesSheet: Array<WorkExperienceSheet>
  ) => void;
  workSheet: WorkExperienceSheet;
  setWorkSheet: (workSheet: WorkExperienceSheet) => void;
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  test: string;
  setTest: (test: string) => void;
  accomplishments: Array<Accomplishment>;
  setAccomplishments: (accomplishments: Array<Accomplishment>) => void;
  duties: Array<Duty>;
  setDuties: (duties: Array<Duty>) => void;
  noWorkExperience: boolean;
  setNoWorkExperience: (noWorkExperience: boolean) => void;
};

export const useWorkExpSheetStore = create<WorkExpSheetState>((set) => ({
  selectedWorkExperience: {} as WorkExperienceSheet,
  setSelectedWorkExperience: (selectedWorkExperience: WorkExperienceSheet) => {
    set((state) => ({ ...state, selectedWorkExperience }));
  },
  workExperiences: [],
  setWorkExperiences: (workExperiences: Array<WorkExperienceSheet>) => {
    set((state) => ({ ...state, workExperiences }));
  },
  workExperiencesSheet: [],
  setWorkExperiencesSheet: (
    workExperiencesSheet: Array<WorkExperienceSheet>
  ) => {
    set((state) => ({ ...state, workExperiencesSheet }));
  },
  workSheet: {
    isGovernmentService: false,
    monthlySalary: null,
    salaryGrade: '',
    isPresentWork: false,
    isSelected: false,
    accomplishments: [],
    duties: [],
    appointmentStatus: '',
    companyName: '',
    from: '',
    immediateSupervisor: '',
    positionTitle: '',
    to: '',
    workExperienceId: '',
    nameOfOffice: '',
    _id: '',
  } as WorkExperienceSheet,
  setWorkSheet: (workSheet: WorkExperienceSheet) => {
    set((state) => ({ ...state, workSheet }));
  },
  test: '',
  setTest: (test: string) => {
    set((state) => ({ ...state, test }));
  },
  isLoaded: false,
  setIsLoaded: (isLoaded: boolean) => {
    set((state) => ({ ...state, isLoaded }));
  },
  accomplishments: [],
  setAccomplishments: (accomplishments: Array<Accomplishment>) => {
    set((state) => ({ ...state, accomplishments }));
  },
  duties: [],
  setDuties: (duties: Array<Duty>) => {
    set((state) => ({ ...state, duties }));
  },
  noWorkExperience: false,
  setNoWorkExperience: (noWorkExperience: boolean) => {
    set((state) => ({ ...state, noWorkExperience }));
  },
}));
