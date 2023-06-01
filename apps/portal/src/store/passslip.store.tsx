/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import {
  PassSlip,
  PassSlipId,
  EmployeePassSlipList,
} from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';

export type PassSlipState = {
  //PASS SLIP TO SUBMIT
  passSlips: {
    forApproval: Array<PassSlip>;
    completed: Array<PassSlip>;
  };
  response: {
    postResponseApply: PassSlip;
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

  passSlip: PassSlip;
  applyPassSlipModalIsOpen: boolean;
  pendingPassSlipModalIsOpen: boolean;
  completedPassSlipModalIsOpen: boolean;
  tab: number;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  postPassSlipList: () => void;
  postPassSlipListSuccess: (response: PassSlip) => void;
  postPassSlipListFail: (error: string) => void;

  setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => void;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;
  setCompletedPassSlipModalIsOpen: (
    completedPassSlipModalIsOpen: boolean
  ) => void;

  getPassSlip: (PassSlip: PassSlip) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    passSlips: {
      forApproval: [],
      completed: [],
    },
    response: {
      postResponseApply: {} as PassSlip,
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

    passSlip: {} as PassSlip,

    //APPLY PASS SLIP MODAL
    applyPassSlipModalIsOpen: false,
    pendingPassSlipModalIsOpen: false,
    completedPassSlipModalIsOpen: false,

    tab: 1,

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

    getPassSlip: (passSlip: PassSlip) => {
      set((state) => ({ ...state, passSlip }));
    },

    //GET PASS SLIP ACTIONS
    getPassSlipList: (loading: boolean) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          forApproval: [],
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
    getPassSlipListSuccess: (
      loading: boolean,
      response: EmployeePassSlipList
    ) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          forApproval: response.forApproval,
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
        response: {
          ...state.response,
          postResponseApply: null,
        },
      }));
    },

    //POST PASS SLIP ACTIONS
    postPassSlipList: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as PassSlip,
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
    postPassSlipListSuccess: (response: PassSlip) => {
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

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponseApply: {} as PassSlip,
        },
        error: {
          ...state.error,
          errorResponse: '',
        },
      }));
    },
  }))
);
