/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveLedgerEntry } from '../../../../libs/utils/src/lib/types/leave-ledger-entry.type';
import { devtools } from 'zustand/middleware';

export type LeaveLedgerState = {
  leaveLedger: Array<LeaveLedgerEntry>;

  loading: {
    loadingLeaveLedger: boolean;
  };
  error: {
    errorLeaveLedger: string;
  };

  getLeaveLedger: (loading: boolean) => void;
  getLeaveLedgerSuccess: (loading: boolean, response) => void;
  getLeaveLedgerFail: (loading: boolean, error: string) => void;
};

export const useLeaveLedgerStore = create<LeaveLedgerState>()(
  devtools((set) => ({
    leaveLedger: [],
    loading: {
      loadingLeaveLedger: false,
    },
    error: {
      errorLeaveLedger: '',
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
