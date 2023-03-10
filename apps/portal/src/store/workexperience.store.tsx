import { create } from 'zustand';
import { WorkExperience } from '../types/workexp.type';

export type WorkExpState = {
  workExperience: Array<WorkExperience>;
  withRelevantExperience: boolean;
  setWithRelevantExperience: (withExperience: boolean) => void;
  resetWorkExperience: () => void;
  addWorkExperience: (workExperience: WorkExperience) => void;
  removeWorkExperience: (workExperienceId: string) => void;
  inputSupervisor: (name: string, workExperienceId: string) => void;
  inputOffice: (name: string, workExperienceId: string) => void;
  addAccomplishment: (workExperienceId: string, name: string) => void;
  addDuty: (workExperienceId: string, name: string) => void;
  deleteAccomplishment: (
    workExperienceId: string,
    indexForDelete: number
  ) => void;
  deleteDuty: (workExperienceId: string, indexForDelete: number) => void;
  editAccomplishment: (
    workExperienceId: string,
    indexForEdit: number,
    newAccomplishment: string
  ) => void;
  editDuty: (
    workExperienceId: string,
    indexForEdit: number,
    newDuty: string
  ) => void;
};

export const useWorkExpStore = create<WorkExpState>((set) => ({
  workExperience: [] as Array<WorkExperience>,
  withRelevantExperience: false,
  resetWorkExperience: () => {
    set((state) => ({
      workExperience: [],
    }));
  },
  addWorkExperience: (newExp: WorkExperience) => {
    set((state) => ({
      workExperience: [...state.workExperience, newExp],
    }));
  },
  removeWorkExperience: (workExperienceId: string) => {
    set((state) => ({
      workExperience: state.workExperience.filter(
        (exp) => exp.basic.workExperienceId !== workExperienceId
      ),
    }));
  },
  setWithRelevantExperience: (withExperience: boolean) => {
    set((state) => ({
      withRelevantExperience: withExperience,
    }));
  },
  inputSupervisor: (name: string, workExperienceId: string) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? { ...exp, basic: { ...exp.basic, supervisor: name } }
          : exp
      ),
    }));
  },
  inputOffice: (name: string, workExperienceId: string) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? { ...exp, basic: { ...exp.basic, office: name } }
          : exp
      ),
    }));
  },
  addAccomplishment: (workExperienceId: string, accomplishment: string) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? {
              ...exp,
              accomplishments: [...exp.accomplishments, { accomplishment }],
            }
          : exp
      ),
    }));
  },
  addDuty: (duty: string, workExperienceId: string) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? {
              ...exp,
              duties: [...exp.duties, { duty }],
            }
          : exp
      ),
    }));
  },
  deleteAccomplishment: (workExperienceId: string, indexForDelete: number) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? {
              ...exp,
              accomplishments: exp.accomplishments.filter(
                (a, index) => index !== indexForDelete
              ),
            }
          : exp
      ),
    }));
  },
  deleteDuty: (workExperienceId: string, indexForDelete: number) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.basic.workExperienceId === workExperienceId
          ? {
              ...exp,
              duties: exp.duties.filter((d, index) => index !== indexForDelete),
            }
          : exp
      ),
    }));
  },
  editAccomplishment: (
    workExperienceId: string,
    indexForEdit: number,
    newAccomplishment: string
  ) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) => {
        if (exp.basic.workExperienceId === workExperienceId) {
          return {
            ...exp,
            accomplishments: exp.accomplishments.map((a, index) => {
              if (index === indexForEdit) {
                return {
                  ...a,
                  accomplishment: newAccomplishment,
                };
              }
              return a;
            }),
          };
        }
        return exp;
      }),
    }));
  },
  editDuty: (
    workExperienceId: string,
    indexForEdit: number,
    newDuty: string
  ) => {
    set((state) => ({
      workExperience: state.workExperience.map((exp) => {
        if (exp.basic.workExperienceId === workExperienceId) {
          return {
            ...exp,
            duties: exp.duties.map((d, index) => {
              if (index === indexForEdit) {
                return {
                  ...d,
                  duty: newDuty,
                };
              }
              return d;
            }),
          };
        }
        return exp;
      }),
    }));
  },
}));
