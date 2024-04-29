import { create } from 'zustand';
import { UpdatedDutiesResponsibilities, UpdatedDutyResponsibility } from '../types/dr.type';
import { devtools } from 'zustand/middleware';

export type UpdatedDutyResponsibilityList = Pick<UpdatedDutyResponsibility, 'pcplId'>;

export enum DrcTypes {
  CORE = 'core',
  SUPPORT = 'support',
}

export type UpdatedDutiesResponsibilitiesList = {
  core: Array<UpdatedDutyResponsibilityList>;
  support: Array<UpdatedDutyResponsibilityList>;
};

export const DUTIES_RESPONSIBILITIES: UpdatedDutiesResponsibilities = {
  core: [],
  support: [],
};

export const DUTIES_RESPONSIBILITIES_LIST: UpdatedDutiesResponsibilitiesList = {
  core: [],
  support: [],
};

type DrcLoading = {
  loadingExistingDrcs: boolean;
};

type DrcError = {
  errorExistingDrcs: string;
};

type ExistingDrcResponse = {
  postResponse: UpdatedDutiesResponsibilities;
  updateResponse: UpdatedDutiesResponsibilities;
};

export type DrcState = {
  // value of duties and responsibilities textarea
  dutyText: string;

  // value of the index for updating
  indexToUpdate: number | null;

  // these are all the initial drcs on first load when updating
  initialDrcsOnLoad: UpdatedDutiesResponsibilities;

  // these are all the initial core drcs on first load when updating
  initialCoreDrcsOnLoad: Array<UpdatedDutyResponsibility>;

  // these are all the initial support drcs on first load when updating
  initialSupportDrcsOnLoad: Array<UpdatedDutyResponsibility>;

  // these are all the added core and support drcs
  addedDrcs: UpdatedDutiesResponsibilities;

  // all currently added core drcs
  addedCoreDrcs: Array<UpdatedDutyResponsibility>;

  // all currently added support drcs
  addedSupportDrcs: Array<UpdatedDutyResponsibility>;

  // loading state
  loading: DrcLoading;

  // force mutate if true
  shouldMutate: boolean;

  // error state
  error: DrcError;

  // existing drcs is loaded
  existingDrcsIsLoaded: boolean;

  // selected drc type
  selectedDrcType: DrcTypes | null;

  // these are all the temporarily added core and support drcs
  tempAddedDrcs: UpdatedDutiesResponsibilities;

  // position available drcs on posting
  positionExistingDrcsOnPosting: ExistingDrcResponse;

  // updated position duties
  positionDuties: Array<{ pdId: string }>;

  // set updated position duties
  // setPositionDuties: (positionDuties: Array<{ pdId: string }>) => void;

  // set the value of duties and responsibilities text
  setDutyText: (dutyText: string) => void;

  // set the value of the index to update
  setIndexToUpdate: (indexToUpdate: number | null) => void;

  // set should mutate to false if mutate is done
  setShouldMutateFalse: () => void;

  // add temp drcs to added drcs
  addTempToAddedDrcs: () => void;

  // set default values if cancel button is clicked
  cancelTempDrcsAction: () => void;

  // cancel set duties and responsibilities page
  cancelDrcPage: () => void;

  // set temp drcs
  setTempAddedDrcs: (tempAddedDrcs: UpdatedDutiesResponsibilities) => void;

  // set selected drc type
  setSelectedDrcType: (selectedDrcType: DrcTypes | null) => void;

  // set added drcs
  setAddedDrcs: (addedDrcs: UpdatedDutiesResponsibilities) => void;

  // set to default values, if modal is closed or changed selected position
  setDefaultValues: () => void;

  // get existing drcs initial action
  getExistingDrcs: (loading: boolean) => void;

  // get existing drcs success
  getExistingDrcsSuccess: (response: UpdatedDutiesResponsibilities) => void;

  // get existing drcs fail
  getExistingDrcsFail: (error: string) => void;

  // post existing drcs success
  postDrcs: () => void;

  // post existing drcs success
  postDrcsSuccess: (response: UpdatedDutiesResponsibilities) => void;

  // post existing drcs fail
  postDrcsFail: (error: string) => void;
};

export const useUpdatedDrcStore = create<DrcState>()(
  devtools((set, get) => ({
    initialCoreDrcsOnLoad: [],
    initialSupportDrcsOnLoad: [],
    initialDrcsOnLoad: DUTIES_RESPONSIBILITIES,
    addedDrcs: DUTIES_RESPONSIBILITIES,
    addedCoreDrcs: [],
    addedSupportDrcs: [],
    existingDrcsIsLoaded: false,
    selectedDrcType: null,
    tempAddedDrcs: DUTIES_RESPONSIBILITIES,
    positionExistingDrcsOnPosting: { postResponse: DUTIES_RESPONSIBILITIES, updateResponse: DUTIES_RESPONSIBILITIES },
    loading: { loadingExistingDrcs: false },
    error: { errorExistingDrcs: '' },
    dutyText: '',
    shouldMutate: false,
    indexToUpdate: null,
    positionDuties: [],

    setIndexToUpdate: (indexToUpdate) => set({ indexToUpdate }),
    setDutyText: (dutyText) => set({ dutyText }),
    setShouldMutateFalse: () => set((state) => ({ ...state, shouldMutate: false })),
    setTempAddedDrcs: (tempAddedDrcs) => set({ tempAddedDrcs }),
    setSelectedDrcType: (selectedDrcType) => set({ selectedDrcType }),
    setDefaultValues: () =>
      set((state) => ({
        ...state,
        addedDrcs: DUTIES_RESPONSIBILITIES,
        initialDrcsOnLoad: DUTIES_RESPONSIBILITIES,
        dutyText: '',
      })),
    setAddedDrcs: (addedDrcs) => set({ addedDrcs }),

    getExistingDrcs: (loading: boolean) =>
      set((state) => ({
        ...state,
        existingDrcsIsLoaded: false,
        addedDrcs: DUTIES_RESPONSIBILITIES,
        addedCoreDrcs: [],
        addedSupportDrcs: [],
        initialDrcsOnLoad: DUTIES_RESPONSIBILITIES,
        initialCoreDrcsOnLoad: [],
        initialSupportDrcsOnLoad: [],
        loading: { ...state.loading, loadingExistingDrcs: loading },
        error: { ...state.error, errorExistingDrcs: '' },
      })),

    getExistingDrcsSuccess: (response: UpdatedDutiesResponsibilities) =>
      set((state) => ({
        ...state,
        addedDrcs: response,
        initialDrcsOnLoad: response,
        initialCoreDrcsOnLoad: response.core,
        initialSupportDrcsOnLoad: response.support,
        addedCoreDrcs: response.core,
        addedSupportDrcs: response.support,
        loading: { ...state.loading, loadingExistingDrcs: false },
        existingDrcsIsLoaded: true,
      })),

    getExistingDrcsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingExistingDrcs: false,
          error: { ...state.error, errorExistingDrcs: error },
          existingDrcsIsLoaded: false,
        },
      })),

    cancelTempDrcsAction: () =>
      set((state) => ({
        ...state,
        tempAddedDrcs: { core: [], support: [] },
        loading: { ...state.loading, loadingExistingDrcs: false },
      })),
    cancelDrcPage: () =>
      set((state) => ({ ...state, existingDrcsIsLoaded: false, addedDrcs: DUTIES_RESPONSIBILITIES })),

    addTempToAddedDrcs: () => {
      // const updatedPdIds = get().addedCoreDrcs.filter((adrc) =>
      //   get().tempAddedDrcs.core.filter((tdrc) => tdrc.duty !== adrc.duty)
      // );

      set((state) => ({
        ...state,
        indexToUpdate: null,
        dutyText: '',
        addedDrcs: {
          core: get().tempAddedDrcs.core.map((drc) => {
            return { ...drc, onEdit: false };
          }),
          support: get().tempAddedDrcs.support.map((drc) => {
            return { ...drc, onEdit: false };
          }),
        },
        // positionDuties: updatedPdIds.map((pdrc) => {
        //   return { pdId: pdrc.pdId };
        // }),
        tempAddedDrcs: { core: [], support: [] },
        selectedDrcType: null,
      }));
    },

    postDrcs: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingExistingDrcs: true },
        error: { ...state.error, errorExistingDrcs: '' },
      })),

    postDrcsSuccess: (response: UpdatedDutiesResponsibilities) =>
      set((state) => ({
        ...state,

        positionExistingDrcsOnPosting: {
          ...state.positionExistingDrcsOnPosting,
          postResponse: response,
        },

        loading: { ...state.loading, loadingExistingDrcs: false },
        existingDrcsIsLoaded: false,
      })),

    postDrcsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingExistingDrcs: false },
        error: { ...state.error, errorExistingDrcs: error },
      })),
  }))
);
