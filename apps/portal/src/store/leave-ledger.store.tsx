/* eslint-disable @nx/enforce-module-boundaries */
//this store is for the leave ledger table found under the completed leave modal
import { create } from 'zustand';
import { LeaveLedgerEntry } from '../../../../libs/utils/src/lib/types/leave-ledger-entry.type';
import { devtools } from 'zustand/middleware';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';

export type MutatedLeaveBenefit = Pick<LeaveBenefit, 'id' | 'leaveName' | 'leaveType'> & {
  maximumCredits: number | null;
};

type ResponseLeaveLedger = {
  postResponse: LeaveLedgerEntry;
};

type LoadingLeaveLedger = {
  loadingLedger: boolean;
  loadingEntry: boolean;
};

type ErrorLeaveLedger = {
  errorLedger: string;
  errorEntry: string;
};

export type LeaveLedgerState = {
  leaveLedger: Array<LeaveLedgerEntry>;
  vacationLeaveBalance: number;
  forcedLeaveBalance: number;
  sickLeaveBalance: number;
  specialPrivilegeLeaveBalance: number;
  wellnessLeaveBalance: number;

  selectedLeaveLedger: Array<LeaveLedgerEntry>;
  setSelectedLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>, leaveApplicationId: string) => void;

  loading: {
    loadingLeaveLedger: boolean;
    loading: LoadingLeaveLedger; //leave ledger modal
  };
  error: {
    errorLeaveLedger: string;
    error: ErrorLeaveLedger; //leave ledger modal
  };

  selectedLeaveBenefit: MutatedLeaveBenefit;
  response: ResponseLeaveLedger; //leave ledger modal

  leaveLedgerModalIsOpen: boolean;
  setLeaveLedgerModalIsOpen: (leaveLedgerModalIsOpen: boolean) => void;

  leaveLedgerPdfModalIsOpen: boolean;
  setLeaveLedgerPdfModalIsOpen: (leaveLedgerPdfModalIsOpen: boolean) => void;

  setVacationLeaveBalance: (vacationLeaveBalance: number) => void;
  setForcedLeaveBalance: (forcedLeaveBalance: number) => void;
  setSickLeaveBalance: (sickLeaveBalance: number) => void;
  setSpecialPrivilegeLeaveBalance: (specialPrivilegeLeaveBalance: number) => void;
  setWellnessLeaveBalance: (wellnessLeaveBalance: number) => void;

  getLeaveLedger: (loading: boolean) => void;
  getLeaveLedgerSuccess: (loading: boolean, response) => void;
  getLeaveLedgerFail: (loading: boolean, error: string) => void;

  selectedYear: string;
  setSelectedYear: (value: string) => void;
};

export const useLeaveLedgerStore = create<LeaveLedgerState>()(
  devtools((set) => ({
    leaveLedger: [],
    vacationLeaveBalance: 0,
    forcedLeaveBalance: 0,
    sickLeaveBalance: 0,
    specialPrivilegeLeaveBalance: 0,
    wellnessLeaveBalance: 0,
    selectedLeaveLedger: [] as Array<LeaveLedgerEntry>,

    selectedLeaveBenefit: {} as MutatedLeaveBenefit,
    response: { postResponse: {} as LeaveLedgerEntry },

    selectedYear: '',
    setSelectedYear: (selectedYear: string) => {
      set((state) => ({ ...state, selectedYear }));
    },

    loading: {
      loadingLeaveLedger: false,
      loading: {
        loadingEntry: false,
        loadingLedger: false,
      },
    },
    error: {
      errorLeaveLedger: '', //error for fetching leave ledger
      error: { errorEntry: '', errorLedger: '' },
    },

    leaveLedgerModalIsOpen: false,
    setLeaveLedgerModalIsOpen: (leaveLedgerModalIsOpen: boolean) => {
      set((state) => ({ ...state, leaveLedgerModalIsOpen }));
    },

    leaveLedgerPdfModalIsOpen: false,
    setLeaveLedgerPdfModalIsOpen: (leaveLedgerPdfModalIsOpen: boolean) => {
      set((state) => ({ ...state, leaveLedgerPdfModalIsOpen }));
    },

    setVacationLeaveBalance: (vacationLeaveBalance: number) => {
      set((state) => ({ ...state, vacationLeaveBalance }));
    },

    setForcedLeaveBalance: (forcedLeaveBalance: number) => {
      set((state) => ({ ...state, forcedLeaveBalance }));
    },

    setSickLeaveBalance: (sickLeaveBalance: number) => {
      set((state) => ({ ...state, sickLeaveBalance }));
    },

    setSpecialPrivilegeLeaveBalance: (specialPrivilegeLeaveBalance: number) => {
      set((state) => ({ ...state, specialPrivilegeLeaveBalance }));
    },

    setWellnessLeaveBalance: (wellnessLeaveBalance: number) => {
      set((state) => ({ ...state, wellnessLeaveBalance }));
    },

    //GET LEAVE ACTIONS
    getLeaveLedger: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaveLedger: [],
        loading: {
          ...state.loading,
          loadingLeaveLedger: loading,
        },
        error: {
          ...state.error,
          errorLeaveLedger: '',
        },
      }));
    },
    getLeaveLedgerSuccess: (loading: boolean, response: Array<LeaveLedgerEntry>) => {
      set((state) => ({
        ...state,
        leaveLedger: response,
        loading: {
          ...state.loading,
          loadingLeaveLedger: loading,
        },
        error: {
          ...state.error,
          errorLeaveLedger: '',
        },
      }));
    },
    getLeaveLedgerFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingLeaveLedger: loading,
        },
        error: {
          ...state.error,
          errorLeaveLedger: error,
        },
      }));
    },

    setSelectedLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>, leaveApplicationId: string) => {
      set((state) => ({
        selectedLeaveLedger: leaveLedger.filter((ledger) => ledger.leaveApplicationId == leaveApplicationId),
      }));
    },
  }))
);
