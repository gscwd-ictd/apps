import { DutiesResponsibilities, DutyResponsibility } from '../types/dr.type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Competency } from '../types/competency.type';
import {
  UpdateAvailableDrcs,
  UpdateFinalDrcs,
} from '../components/fixed/dr/utils/drcFunctions';

export type DutyResponsibilityList = Pick<
  DutyResponsibility,
  'odrId' | 'percentage' | 'pcplId'
>;

export enum DrcTypes {
  CORE = 'core',
  SUPPORT = 'support',
}

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
  loadingAvailableDnrs: boolean;
  loadingExistingDnrs: boolean;
};

type DnrError = {
  errorAvailableDnrs: string;
  errorExistingDnrs: string;
};

export type DnrState = {
  // the original pool of dnrs per position, this is created for delete  reference and update reference
  originalPoolOfDnrs: Array<DutyResponsibility>;

  // currently available pool of dnrs
  availableDnrs: Array<DutyResponsibility>;

  // filtered currently available pool for dnrs
  filteredAvailableDnrs: Array<DutyResponsibility>;

  // these are all the selected dnrs on first load when updating
  selectedDnrsOnLoad: DutiesResponsibilities;

  // these are the selected core dnrs on first load when updating
  selectedCoreDnrsOnLoad: Array<DutyResponsibility>;

  // these are the selected support dnrs on first load when updating
  selectedSupportDnrsOnLoad: Array<DutyResponsibility>;

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

  // available dnrs is loaded
  availableDnrsIsLoaded: boolean;

  // existing dnrs is loaded
  existingDnrsIsLoaded: boolean;

  // selected drc type
  selectedDrcType: DrcTypes | null;

  // filtered dnrs
  filteredDnrValue: string;

  // checked dnrs
  checkedDnrs: DutiesResponsibilities;

  // add checked dnrs to selected dnrs
  addCheckedToSelectedDnrs: () => void;

  // set default values if cancel button is clicked
  cancelCheckedDnrsAction: () => void;

  // cancel set duties and responsibilities page
  cancelDrcPage: () => void;

  // set checked dnrs
  setCheckedDnrs: (checkedDnrs: DutiesResponsibilities) => void;

  // set filtered dnrs
  setFilteredDnrValue: (filteredDnrValue: string) => void;

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

  // set selected drc type
  setSelectedDrcType: (selectedDrcType: DrcTypes) => void;

  // set selected dnrs
  setSelectedDnrs: (selectedDnrs: DutiesResponsibilities) => void;

  // set to default values, if modal is closed or changed selected position
  setDefaultValues: () => void;

  // get available dnrs initial action
  getAvailableDnrs: (loading: boolean) => void;

  // get available dnrs action success
  getAvailableDnrsSuccess: (response: Array<DutyResponsibility>) => void;

  // get available dnrs fail
  getAvailableDnrsFail: (error: string) => void;

  // get existing dnrs initial action
  getExistingDnrs: (loading: boolean) => void;

  // get existing dnrs success
  getExistingDnrsSuccess: (
    response: DutiesResponsibilities,
    pool: Array<DutyResponsibility>
  ) => void;

  // get existing dnrs fail
  getExistingDnrsFail: (error: string) => void;
};

export const useDnrStore = create<DnrState>()(
  devtools((set, get) => ({
    originalPoolOfDnrs: [],
    availableDnrs: [],
    filteredAvailableDnrs: [],
    selectedCoreDnrsOnLoad: [],
    selectedSupportDnrsOnLoad: [],
    selectedDnrsOnLoad: DUTIES_RESPONSIBILITIES,
    selectedDnrs: DUTIES_RESPONSIBILITIES,
    selectedCoreDnrs: [],
    selectedSupportDnrs: [],
    availableDnrsIsLoaded: false,
    existingDnrsIsLoaded: false,
    selectedDrcType: null,
    filteredDnrValue: '',
    checkedDnrs: DUTIES_RESPONSIBILITIES,
    setCheckedDnrs: (checkedDnrs: DutiesResponsibilities) =>
      set((state) => ({ ...state, checkedDnrs })),

    setFilteredDnrValue: (filteredDnrValue: string) =>
      set((state) => ({ ...state, filteredDnrValue })),
    loading: { loadingAvailableDnrs: false, loadingExistingDnrs: false },
    error: { errorAvailableDnrs: '', errorExistingDnrs: '' },
    setSelectedDrcType: (selectedDrcType: DrcTypes) =>
      set((state) => ({ ...state, selectedDrcType })),
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
    getAvailableDnrs: (loading: boolean) =>
      set((state) => ({
        ...state,
        originalPoolOfDnrs: [],
        availableDnrs: [],
        availableDnrsIsLoaded: false,
        existingDnrsIsLoaded: false,
        filteredAvailableDnrs: [],
        loading: { ...state.loading, loadingAvailableDnrs: loading },
        error: { ...state.error, errorAvailableDnrs: '' },
      })),
    getAvailableDnrsSuccess: (response: Array<DutyResponsibility>) =>
      set((state) => ({
        ...state,
        originalPoolOfDnrs: response,
        availableDnrs: response,
        availableDnrsIsLoaded: true,
        existingDnrsIsLoaded: false,
        filteredAvailableDnrs: response,
        loading: { ...state.loading, loadingAvailableDnrs: false },
      })),
    getAvailableDnrsFail: (error: string) =>
      set((state) => ({
        ...state,
        availableDnrsIsLoaded: true,
        existingDnrsIsLoaded: false,
        loading: { ...state.loading, loadingAvailableDnrs: false },
        error: { ...state.error, errorAvailableDnrs: error },
      })),
    getExistingDnrs: (loading: boolean) =>
      set((state) => ({
        ...state,
        existingDnrsIsLoaded: false,
        selectedDnrs: DUTIES_RESPONSIBILITIES,
        selectedCoreDnrs: [],
        selectedSupportDnrs: [],
        selectedDnrsOnLoad: DUTIES_RESPONSIBILITIES,
        selectedCoreDnrsOnLoad: [],
        selectedSupportDnrsOnLoad: [],
        loading: { ...state.loading, loadingExistingDnrs: loading },
        error: { ...state.error, errorExistingDnrs: '' },
      })),
    getExistingDnrsSuccess: (
      response: DutiesResponsibilities,
      pool: Array<DutyResponsibility>
    ) =>
      set((state) => ({
        ...state,
        selectedDnrs: response,
        selectedDnrsOnLoad: response,
        selectedCoreDnrs: response.core,
        selectedSupportDnrs: response.support,
        selectedCoreDnrsOnLoad: response.core,
        selectedSupportDnrsOnLoad: response.support,
        originalPoolOfDnrs: pool,
        loading: { ...state.loading, loadingExistingDnrs: false },
        existingDnrsIsLoaded: true,
      })),
    getExistingDnrsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingExistingDnrs: false },
        error: { ...state.error, errorExistingDnrs: error },
        existingDnrsIsLoaded: true,
      })),

    cancelCheckedDnrsAction: () => {
      const tempFilteredAvailableDnrs = get().filteredAvailableDnrs;
      tempFilteredAvailableDnrs.map((dr: DutyResponsibility) => {
        dr.state = false;
        dr.competency = {} as Competency;
        dr.percentage = 0;
      });
      set((state) => ({
        ...state,
        checkedDnrs: { core: [], support: [] },
        filteredAvailableDnrs: tempFilteredAvailableDnrs,
        loading: { ...state.loading, loadingExistingDnrs: false },
        availableDnrs: tempFilteredAvailableDnrs,
      }));
    },

    cancelDrcPage: () =>
      set((state) => ({
        ...state,
        availableDnrsIsLoaded: false,
        existingDnrsIsLoaded: false,
        selectedDnrs: DUTIES_RESPONSIBILITIES,
      })),

    addCheckedToSelectedDnrs: async () => {
      const updatedDnrs = await UpdateAvailableDrcs(
        get().availableDnrs, // get state of available dnrs
        get().selectedDnrs, // get state of selected dnrs
        get().checkedDnrs // get state of checked dnrs
      );

      set((state) => ({
        ...state,
        availableDnrs: updatedDnrs.availableDnrs,
        filteredAvailableDnrs: updatedDnrs.availableDnrs,
        loading: { ...state.loading, loadingExistingDnrs: false },
        selectedDnrs: { core: updatedDnrs.core, support: updatedDnrs.support },
        checkedDnrs: { core: [], support: [] },
        selectedDrcType: null,
      }));
    },
  }))
);
