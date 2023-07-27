/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import {
  LeaveBenefit,
  LeaveType,
} from 'libs/utils/src/lib/types/leave-benefits.type';
import { devtools } from 'zustand/middleware';

export type MutatedLeaveBenefit = Pick<
  LeaveBenefit,
  'id' | 'leaveName' | 'leaveType'
> & {
  maximumCredits: number | null;
};

type ResponseLeaveLedger = {
  postResponse: LeaveLedgerEntry;
};

type LoadingLeaveLedger = {
  loadingLedger: boolean;
  loadingEntry: boolean;
  loadingLeaveBenefits: boolean;
};

type ErrorLeaveLedger = {
  errorLedger: string;
  errorEntry: string;
  errorLeaveBenefits: string;
};

type LeaveLedgerState = {
  leaveLedger: Array<LeaveLedgerEntry>;
  selectedLeaveBenefit: MutatedLeaveBenefit;
  loading: LoadingLeaveLedger;
  error: ErrorLeaveLedger;
  response: ResponseLeaveLedger;
  leaveBenefits: Array<LeaveBenefit>;
  setSelectedLeaveBenefit: (selectedLeaveBenefit: MutatedLeaveBenefit) => void;
  getLeaveLedger: () => void;
  getLeaveLedgerSuccess: (response: Array<LeaveLedgerEntry>) => void;
  getLeaveLedgerFail: (error: string) => void;
  getLeaveBenefits: () => void;
  getLeaveBenefitsSuccess: (response: Array<LeaveBenefit>) => void;
  getLeaveBenefitsFail: (error: string) => void;
};

export const useLeaveLedgerStore = create<LeaveLedgerState>()(
  devtools((set) => ({
    leaveLedger: [],
    leaveBenefits: [],
    selectedLeaveBenefit: {} as MutatedLeaveBenefit,
    loading: {
      loadingEntry: false,
      loadingLedger: false,
      loadingLeaveBenefits: false,
    },
    error: { errorEntry: '', errorLedger: '', errorLeaveBenefits: '' },
    response: { postResponse: {} as LeaveLedgerEntry },

    getLeaveLedger: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLedger: true },
        leaveLedger: [],
        error: { ...state.error, errorLedger: '' },
      })),

    getLeaveLedgerSuccess: (response: Array<LeaveLedgerEntry>) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLedger: false },
        leaveLedger: response,
      })),

    getLeaveLedgerFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLedger: false },
        error: { ...state.error, errorLedger: error },
      })),

    getLeaveBenefits: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefits: true },
        leaveBenefits: [],
      })),

    getLeaveBenefitsSuccess: (response: Array<LeaveBenefit>) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefits: false },
        leaveBenefits: response,
      })),

    getLeaveBenefitsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingLeaveBenefits: false },
        error: { ...state.error, errorLeaveBenefits: error },
      })),

    setSelectedLeaveBenefit: (selectedLeaveBenefit: MutatedLeaveBenefit) =>
      set((state) => ({ ...state, selectedLeaveBenefit })),
  }))
);
