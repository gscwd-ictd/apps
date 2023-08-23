/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveLedgerEntry } from '../../../../libs/utils/src/lib/types/leave-ledger-entry.type';
import { devtools } from 'zustand/middleware';

export type LeaveLedgerState = {
  leaveLedger: Array<LeaveLedgerEntry>;
  vacationLeaveBalance: number;
  forcedLeaveBalance: number;
  sickLeaveBalance: number;
  specialPrivilegeLeaveBalance: number;

  loading: {
    loadingLeaveLedger: boolean;
  };
  error: {
    errorLeaveLedger: string;
  };

  setVacationLeaveBalance: (vacationLeaveBalance: number) => void;
  setForcedLeaveBalance: (forcedLeaveBalance: number) => void;
  setSickLeaveBalance: (sickLeaveBalance: number) => void;
  setSpecialPrivilegeLeaveBalance: (specialPrivilegeLeaveBalance: number) => void;

  getLeaveLedger: (loading: boolean) => void;
  getLeaveLedgerSuccess: (loading: boolean, response) => void;
  getLeaveLedgerFail: (loading: boolean, error: string) => void;
};

export const useLeaveLedgerStore = create<LeaveLedgerState>()(
  devtools((set) => ({
    leaveLedger: [],
    vacationLeaveBalance: 0,
    forcedLeaveBalance: 0,
    sickLeaveBalance: 0,
    specialPrivilegeLeaveBalance: 0,

    loading: {
      loadingLeaveLedger: false,
    },
    error: {
      errorLeaveLedger: '',
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

    //GET LEAVE ACTIONS
    getLeaveLedger: (loading: boolean) => {
      set((state) => ({
        ...state,
        leaves: [],
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
        leaves: response,
        loading: {
          ...state.loading,
          loadingLeaveLedger: loading,
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
  }))
);
