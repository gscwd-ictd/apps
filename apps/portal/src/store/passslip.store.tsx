import { create } from 'zustand';
import {
  PassSlipContents,
  PassSlipId,
  PassSlipList,
} from '../types/passslip.type';
import { devtools } from 'zustand/middleware';

export type PassSlipState = {
  //PASS SLIP TO SUBMIT
  passSlips: {
    onGoing: Array<PassSlipContents>;
    completed: Array<PassSlipContents>;
  };
  response: {
    postResponseApply: PassSlipContents;
    deleteResponseCancel: PassSlipId;
  };
  loading: {
    loadingPassSlips: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorPassSlips: string;
    errorResponse: string;
  };

  passSlip: PassSlipContents;
  applyPassSlipModalIsOpen: boolean;
  pendingPassSlipModalIsOpen: boolean;
  completedPassSlipModalIsOpen: boolean;
  tab: number;
  isGetPassSlipLoading: boolean;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  postPassSlipList: () => void;
  postPassSlipListSuccess: (response: PassSlipContents) => void;
  postPassSlipListFail: (error: string) => void;

  setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => void;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;
  setCompletedPassSlipModalIsOpen: (
    completedPassSlipModalIsOpen: boolean
  ) => void;

  getPassSlip: (PassSlip: PassSlipContents) => void;
  setIsGetPassSlipLoading: (isLoading: boolean) => void;
  setTab: (tab: number) => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    passSlips: {
      onGoing: [],
      completed: [],
    },
    response: {
      postResponseApply: {} as PassSlipContents,
      deleteResponseCancel: {} as PassSlipId,
    },
    loading: {
      loadingPassSlips: false,
      loadingResponse: false,
    },
    error: {
      errorPassSlips: '',
      errorResponse: '',
    },

    passSlip: {} as PassSlipContents,

    //APPLY PASS SLIP MODAL
    applyPassSlipModalIsOpen: false,
    pendingPassSlipModalIsOpen: false,
    completedPassSlipModalIsOpen: false,

    isGetPassSlipLoading: true,
    tab: 1,

    setIsGetPassSlipLoading: (isGetPassSlipLoading: boolean) => {
      set((state) => ({ ...state, isGetPassSlipLoading }));
    },

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, applyPassSlipModalIsOpen }));
    },

    setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingPassSlipModalIsOpen }));
    },

    setCompletedPassSlipModalIsOpen: (
      completedPassSlipModalIsOpen: boolean
    ) => {
      set((state) => ({ ...state, completedPassSlipModalIsOpen }));
    },

    getPassSlip: (passSlip: PassSlipContents) => {
      set((state) => ({ ...state, passSlip }));
    },

    //GET PASS SLIP ACTIONS
    getPassSlipList: (loading: boolean) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          onGoing: [],
          completed: [],
        },
        loading: {
          ...state.loading,
          loadingPassSlips: loading,
        },
        error: {
          ...state.error,
          errorPassSlips: '',
        },
      }));
    },
    getPassSlipListSuccess: (loading: boolean, response: PassSlipList) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          onGoing: response.ongoing,
          completed: response.completed,
        },
        loading: {
          ...state.loading,
          loadingPassSlips: loading,
        },
      }));
    },
    getPassSlipListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPassSlips: loading,
        },
        error: {
          ...state.error,
          errorPassSlips: error,
        },
      }));
    },

    //POST PASS SLIP ACTIONS
    postPassSlipList: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as PassSlipContents,
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
    postPassSlipListSuccess: (response: PassSlipContents) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    postPassSlipListFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        error: {
          ...state.error,
          errorResponse: error,
        },
      }));
    },
  }))
);
