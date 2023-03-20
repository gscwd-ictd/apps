import { DutiesResponsibilities, DutyResponsibility } from '../types/dr.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type DutyResponsibilityList = Pick<
  DutyResponsibility,
  'odrId' | 'percentage' | 'pcplId'
>;

export type DutiesResponsibilitiesList = {
  core: Array<DutyResponsibilityList>;
  support: Array<DutyResponsibilityList>;
};

export const DUTIES_RESPONSIBILITIES: DutiesResponsibilities = {
  core: [],
  support: [],
};

export const DUTIES_RESPONSIBILITIES_LIST: DutiesResponsibilitiesList = {
  core: [],
  support: [],
};

type DnrLoading = {
  loadingDnrsOnCreate: boolean;
  loadingDnrsOnUpdate: boolean;
};

type DnrError = {
  errorDnrsOnCreate: string;
  errorDnrsOnUpdate: string;
};

export type DnrState = {
  // the original pool of dnrs per position, this is created for delete  reference and update reference
  originalPoolOfDnrs: Array<DutyResponsibility>;

  // currently available pool of dnrs
  availableDnrs: Array<DutyResponsibility>;

  // filtered currently available pool for dnrs
  filteredAvailableDnrs: Array<DutyResponsibility>;

  // these are the selected core dnrs on first load when updating
  initialSelectedCoreDnrs: Array<DutyResponsibility>;

  // these are the selected support dnrs on first load when updating
  initialSelectedSupportDnrs: Array<DutyResponsibility>;

  // these are all the selected dnrs on first load when updating
  initialSelectedDnrs: DutiesResponsibilities;

  // these are all the selected core and support dnrs
  selectedDnrs: DutiesResponsibilities;

  // all currently selected core dnrs
  selectedCoreDnrs: Array<DutyResponsibility>;

  // all currently selected support dnrs
  selectedSupportDnrs: Array<DutyResponsibility>;

  // loading state
  loading: DnrLoading;

  // error state
  error: DnrError;

  // set original pool
  setOriginalPoolOfDnrs: (
    originalPoolOfDnrs: Array<DutyResponsibility>
  ) => void;

  // set available dnrs
  setAvailableDnrs: (availableDnrs: Array<DutyResponsibility>) => void;

  // set filtered available dnrs
  setFilteredAvailableDnrs: (
    filteredAvailableDnrs: Array<DutyResponsibility>
  ) => void;

  // set selected dnrs
  setSelectedDnrs: (selectedDnrs: DutiesResponsibilities) => void;

  // set to default values, if modal is closed or changed selected position
  setDefaultValues: () => void;

  // get dnrs on create initial action
  getDnrsOnCreate: (loading: boolean) => void;

  // get dnrs on create action success
  getDnrsOnCreateSuccess: (response: Array<DutyResponsibility>) => void;

  // get dnrs on create action fail
  getDnrsOnCreateFail: (error: string) => void;
};

export const useDnrStore = create<DnrState>()(
  devtools((set) => ({
    originalPoolOfDnrs: [],
    availableDnrs: [],
    filteredAvailableDnrs: [],
    initialSelectedCoreDnrs: [],
    initialSelectedSupportDnrs: [],
    initialSelectedDnrs: DUTIES_RESPONSIBILITIES,
    selectedDnrs: DUTIES_RESPONSIBILITIES,
    selectedCoreDnrs: [],
    selectedSupportDnrs: [],
    loading: { loadingDnrsOnCreate: false, loadingDnrsOnUpdate: false },
    error: { errorDnrsOnCreate: '', errorDnrsOnUpdate: '' },

    setOriginalPoolOfDnrs: (originalPoolOfDnrs: Array<DutyResponsibility>) =>
      set((state) => ({ ...state, originalPoolOfDnrs })),

    setDefaultValues: () =>
      set((state) => ({
        ...state,
        originalPoolOfDnrs: [],
        availableDnrs: [],
        filteredAvailableDnrs: [],
        selectedDnrs: DUTIES_RESPONSIBILITIES,
        initialSelectedDnrs: DUTIES_RESPONSIBILITIES,
      })),

    setAvailableDnrs: (availableDnrs: Array<DutyResponsibility>) =>
      set((state) => ({ ...state, availableDnrs })),

    setFilteredAvailableDnrs: (
      filteredAvailableDnrs: Array<DutyResponsibility>
    ) => set((state) => ({ ...state, filteredAvailableDnrs })),

    setSelectedDnrs: (selectedDnrs: DutiesResponsibilities) =>
      set((state) => ({ ...state, selectedDnrs })),

    getDnrsOnCreate: (loading: boolean) =>
      set((state) => ({
        ...state,
        originalPoolOfDnrs: [],
        availableDnrs: [],
        filteredAvailableDnrs: [],
        loading: { ...state.loading, loadingDnrsOnCreate: loading },
        error: { ...state.error, errorDnrsOnCreate: '' },
      })),

    getDnrsOnCreateSuccess: (response: Array<DutyResponsibility>) =>
      set((state) => ({
        ...state,
        originalPoolOfDnrs: response,
        availableDnrs: response,
        filteredAvailableDnrs: response,
        loading: { ...state.loading, loadingDnrsOnCreate: false },
      })),

    getDnrsOnCreateFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingDnrsOnCreate: false },
        error: { ...state.error, errorDnrsOnCreate: error },
      })),
  }))
);
