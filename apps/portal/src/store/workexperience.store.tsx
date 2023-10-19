import { create } from 'zustand';
import { WorkExperience } from '../types/workexp.type';
import { devtools } from 'zustand/middleware';
import { JobApplicationDetailsResponse } from '../types/vacancies.type';

export type WorkExpState = {
  loading: {
    loadingJobOpening: boolean;
    loadingIfApplied: boolean;
    loadingWorkExperience: boolean;
    loadingApplyJob: boolean;
  };
  error: {
    errorJobOpening: string;
    errorIfApplied: string;
    errorWorkExperience: string;
    errorApplyJob: string;
    errorCaptcha: string;
    errorMessage: string;
  };
  response: {
    responseApplyJob: JobApplicationDetailsResponse;
  };

  captchaModalIsOpen: boolean;
  setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => void;

  hasApplied: boolean;
  setHasApplied: (hasApplied: boolean) => void;

  postJobApplication: () => void;
  postJobApplicationSuccess: (response) => void;
  postJobApplicationFail: (error: string) => void;

  setloadingJobOpening: (loading: boolean) => void;
  setloadingifApplied: (loading: boolean) => void;
  setloadingWorkExperience: (loading: boolean) => void;
  setloadingApplyJob: (loading: boolean) => void;

  setErrorJobOpening: (error: string) => void;
  setErrorIfApplied: (error: string) => void;
  setErrorWorkExperience: (error: string) => void;
  setErrorApplyJob: (error: string) => void;
  setErrorCaptcha: (error: string) => void;
  setErrorMessage: (error: string) => void;

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
  deleteAccomplishment: (workExperienceId: string, indexForDelete: number) => void;
  deleteDuty: (workExperienceId: string, indexForDelete: number) => void;
  editAccomplishment: (workExperienceId: string, indexForEdit: number, newAccomplishment: string) => void;
  editDuty: (workExperienceId: string, indexForEdit: number, newDuty: string) => void;

  emptyResponseAndError: () => void;
};

export const useWorkExpStore = create<WorkExpState>()(
  devtools((set) => ({
    loading: {
      loadingJobOpening: false,
      loadingIfApplied: false,
      loadingWorkExperience: false,
      loadingApplyJob: false,
    },
    error: {
      errorJobOpening: '',
      errorIfApplied: '',
      errorWorkExperience: '',
      errorApplyJob: '',
      errorCaptcha: '',
      errorMessage: '',
    },
    response: {
      responseApplyJob: {} as JobApplicationDetailsResponse,
    },

    hasApplied: false,
    setHasApplied: (hasApplied: boolean) => {
      set((state) => ({ ...state, hasApplied }));
    },

    captchaModalIsOpen: false,
    setCaptchaModalIsOpen: (captchaModalIsOpen: boolean) => {
      set((state) => ({ ...state, captchaModalIsOpen }));
    },

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
        workExperience: state.workExperience.filter((exp) => exp.basic.workExperienceId !== workExperienceId),
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
          exp.basic.workExperienceId === workExperienceId ? { ...exp, basic: { ...exp.basic, supervisor: name } } : exp
        ),
      }));
    },
    inputOffice: (name: string, workExperienceId: string) => {
      set((state) => ({
        workExperience: state.workExperience.map((exp) =>
          exp.basic.workExperienceId === workExperienceId ? { ...exp, basic: { ...exp.basic, office: name } } : exp
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
                accomplishments: exp.accomplishments.filter((a, index) => index !== indexForDelete),
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
    editAccomplishment: (workExperienceId: string, indexForEdit: number, newAccomplishment: string) => {
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
    editDuty: (workExperienceId: string, indexForEdit: number, newDuty: string) => {
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

    setloadingJobOpening: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingJobOpening: loading,
        },
      }));
    },

    setloadingifApplied: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingIfApplied: loading,
        },
      }));
    },

    setloadingWorkExperience: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingWorkExperience: loading,
        },
      }));
    },

    setloadingApplyJob: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingApplyJob: loading,
        },
      }));
    },

    setErrorJobOpening: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorJobOpening: error,
        },
      }));
    },

    setErrorIfApplied: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorIfApplied: error,
        },
      }));
    },

    setErrorWorkExperience: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorWorkExperience: error,
        },
      }));
    },

    setErrorApplyJob: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorApplyJob: error,
        },
      }));
    },

    setErrorCaptcha: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorCaptcha: error,
        },
      }));
    },

    setErrorMessage: (error: string) => {
      set((state) => ({
        ...state,
        error: {
          ...state.error,
          errorMessage: error,
        },
      }));
    },

    //POST JOB APPLICATION ACTION - apply for position
    postJobApplication: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseApplyJob: {} as JobApplicationDetailsResponse,
        },
        loading: {
          ...state.loading,
          loadingApplyJob: true,
        },
        error: {
          ...state.error,
          errorApplyJob: '',
        },
      }));
    },
    postJobApplicationSuccess: (response: JobApplicationDetailsResponse) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseApplyJob: response,
        },
        loading: {
          ...state.loading,
          loadingApplyJob: false,
        },
      }));
    },
    postJobApplicationFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingApplyJob: false,
        },
        error: {
          ...state.error,
          errorApplyJob: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          responseApplyJob: {} as JobApplicationDetailsResponse,
        },
        error: {
          ...state.error,
          errorApplyJob: '',
        },
      }));
    },
  }))
);
