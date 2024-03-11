/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { PassSlip, PassSlipId, EmployeePassSlipList } from '../../../../libs/utils/src/lib/types/pass-slip.type';
import { devtools } from 'zustand/middleware';

export type PassSlipCount = {
  passSlipCount: number;
};
export type PassSlipState = {
  //PASS SLIP TO SUBMIT
  passSlips: {
    allowedToApplyForNew: boolean;
    forApproval: Array<PassSlip>;
    completed: Array<PassSlip>;
  };
  response: {
    postResponse: PassSlip;
    patchResponse: PassSlip;
    cancelResponse: PassSlip;
  };

  loading: {
    loadingPassSlips: boolean;
    loadingPassSlipCount: boolean;
    loadingResponse: boolean;
  };
  error: {
    errorPassSlips: string;
    errorPassSlipCount: string;
    errorResponse: string;
  };

  passSlipCount: PassSlipCount;
  passSlip: PassSlip;
  cancelApplicationModalIsOpen: boolean;
  applyPassSlipModalIsOpen: boolean;
  pendingPassSlipModalIsOpen: boolean;
  completedPassSlipModalIsOpen: boolean;
  disputePassSlipModalIsOpen: boolean;
  tab: number;

  getPassSlipCount: (loading: boolean) => void;
  getPassSlipCountSuccess: (loading: boolean, response) => void;
  getPassSlipCountFail: (loading: boolean, error: string) => void;

  getPassSlipList: (loading: boolean) => void;
  getPassSlipListSuccess: (loading: boolean, response) => void;
  getPassSlipListFail: (loading: boolean, error: string) => void;

  cancelPassSlip: (loading: boolean) => void;
  cancelPassSlipSuccess: (response) => void;
  cancelPassSlipFail: (error: string) => void;

  postPassSlipList: () => void;
  postPassSlipListSuccess: (response: PassSlip) => void;
  postPassSlipListFail: (error: string) => void;

  //for dispute
  patchPassSlip: () => void;
  patchPassSlipSuccess: (response: PassSlip) => void;
  patchPassSlipFail: (error: string) => void;

  setCancelApplicationModalIsOpen: (cancelApplicationModalIsOpen: boolean) => void;
  setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => void;
  setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => void;
  setCompletedPassSlipModalIsOpen: (completedPassSlipModalIsOpen: boolean) => void;
  setDisputePassSlipModalIsOpen: (disputePassSlipModalIsOpen: boolean) => void;

  getPassSlip: (PassSlip: PassSlip) => void;
  setTab: (tab: number) => void;

  emptyResponseAndError: () => void;
};

export const usePassSlipStore = create<PassSlipState>()(
  devtools((set) => ({
    passSlips: {
      allowedToApplyForNew: false,
      forApproval: [],
      completed: [],
    },
    response: {
      patchResponse: {} as PassSlip,
      postResponse: {} as PassSlip,
      cancelResponse: {} as PassSlip,
    },
    loading: {
      loadingPassSlips: false,
      loadingPassSlipCount: false,
      loadingResponse: false,
    },
    error: {
      errorPassSlips: '',
      errorPassSlipCount: '',
      errorResponse: '',
    },

    passSlipCount: {} as PassSlipCount,

    passSlip: {} as PassSlip,

    //APPLY PASS SLIP MODAL
    applyPassSlipModalIsOpen: false,
    pendingPassSlipModalIsOpen: false,
    completedPassSlipModalIsOpen: false,
    disputePassSlipModalIsOpen: false,

    cancelApplicationModalIsOpen: false,

    tab: 1,

    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setCancelApplicationModalIsOpen: (cancelApplicationModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelApplicationModalIsOpen }));
    },

    setApplyPassSlipModalIsOpen: (applyPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, applyPassSlipModalIsOpen }));
    },

    setPendingPassSlipModalIsOpen: (pendingPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingPassSlipModalIsOpen }));
    },

    setCompletedPassSlipModalIsOpen: (completedPassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, completedPassSlipModalIsOpen }));
    },

    setDisputePassSlipModalIsOpen: (disputePassSlipModalIsOpen: boolean) => {
      set((state) => ({ ...state, disputePassSlipModalIsOpen }));
    },

    getPassSlip: (passSlip: PassSlip) => {
      set((state) => ({ ...state, passSlip }));
    },

    //GET PASS SLIP COUNT ACTIONS
    getPassSlipCount: (loading: boolean) => {
      set((state) => ({
        ...state,
        passSlipCount: {} as PassSlipCount,

        loading: {
          ...state.loading,
          loadingPassSlipCount: loading,
        },
        error: {
          ...state.error,
          errorPassSlipCount: '',
        },
      }));
    },
    getPassSlipCountSuccess: (loading: boolean, response: PassSlipCount) => {
      set((state) => ({
        ...state,
        passSlipCount: response,
        loading: {
          ...state.loading,
          loadingPassSlipCount: loading,
        },
      }));
    },
    getPassSlipCountFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPassSlipCount: loading,
        },
        error: {
          ...state.error,
          errorPassSlipCount: error,
        },
      }));
    },

    //GET PASS SLIP ACTIONS
    getPassSlipList: (loading: boolean) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          allowedToApplyForNew: false,
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
    getPassSlipListSuccess: (loading: boolean, response: EmployeePassSlipList) => {
      set((state) => ({
        ...state,
        passSlips: {
          ...state.passSlips,
          allowedToApplyForNew: response.allowedToApplyForNew,
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
          postResponse: null,
        },
      }));
    },

    //POST PASS SLIP ACTIONS
    postPassSlipList: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          postResponse: {} as PassSlip,
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
          postResponse: response,
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

    //PATCH PASS SLIP ACTIONS
    patchPassSlip: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: {} as PassSlip,
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
    patchPassSlipSuccess: (response: PassSlip) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchPassSlipFail: (error: string) => {
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

    //DELETE PASS SLIP ACTIONS
    cancelPassSlip: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelResponse: {} as PassSlip,
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
    cancelPassSlipSuccess: (response: PassSlip) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          cancelResponse: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    cancelPassSlipFail: (error: string) => {
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
          patchResponse: {} as PassSlip,
          postResponse: {} as PassSlip,
          cancelResponse: {} as PassSlip,
        },
        error: {
          ...state.error,
          errorResponse: '',
          errorPassSlips: '',
        },
      }));
    },
  }))
);
