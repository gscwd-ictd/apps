import { create } from 'zustand';
import {
  GetPassSlip,
  PassSlipContents,
  PassSlipId,
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

  getPassSlip: PassSlipContents;
  applyPassSlipModalIsOpen: boolean;
  pendingPassSlipModalIsOpen: boolean;
  completedPassSlipModalIsOpen: boolean;
  passSlipList: GetPassSlip;
  tab: number;
  isGetPassSlipLoading: boolean;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  postPassSlipList: () => void;
  postPassSlipListSuccess: (response: PassSlipContents) => void;
  postPassSlipListFail: (error: string) => void;

  setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => void;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModal: boolean) => void;
  setCompletedPassSlipModalIsOpen: (completedPassSlipModal: boolean) => void;

  setGetPassSlip: (PassSlip: PassSlipContents) => void;
  setIsGetPassSlipLoading: (isLoading: boolean) => void;
  setTab: (tab: number) => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    passSlipEmployeeId: '',
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

    getPassSlip: {} as PassSlipContents,
    passSlipList: {} as GetPassSlip,

    //APPLY PASS SLIP MODAL
    applyPassSlipModalIsOpen: false,
    //PENDING PASS SLIP MODAL
    pendingPassSlipModalIsOpen: false,
    //COMPLETED PASS SLIP MODAL
    completedPassSlipModalIsOpen: false,
    //PENDING PASS SLIP LIST
    pendingPassSlipList: [],
    //COMPLETED PASS SLIP LIST
    fulfilledPassSlipList: [],
    isGetPassSlipLoading: true,
    tab: 1,

    setIsGetPassSlipLoading: (isGetPassSlipLoading: boolean) => {
      set((state) => ({ ...state, isGetPassSlipLoading }));
    },
    setPendingPassSlipList: (pendingPassSlipList: Array<PassSlipContents>) => {
      set((state) => ({ ...state, pendingPassSlipList }));
    },

    setFulfilledPassSlipList: (
      fulfilledPassSlipList: Array<PassSlipContents>
    ) => {
      set((state) => ({ ...state, fulfilledPassSlipList }));
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

    setPassSlipEmployeeId: (passSlipEmployeeId: string) => {
      set((state) => ({ ...state, passSlipEmployeeId }));
    },

    setGetPassSlip: (getPassSlip: PassSlipContents) => {
      set((state) => ({ ...state, getPassSlip }));
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
    getPassSlipListSuccess: (loading: boolean, response: GetPassSlip) => {
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
