/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { LeaveLedgerEntry, LeaveAdjustmentResponse } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';
import { devtools } from 'zustand/middleware';

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

type LeaveLedgerState = {
  leaveLedger: Array<LeaveLedgerEntry>;
  selectedLeaveBenefit: MutatedLeaveBenefit;
  response: ResponseLeaveLedger;

  loading: LoadingLeaveLedger;
  error: ErrorLeaveLedger;

  selectedLeaveLedger: Array<LeaveLedgerEntry>;
  setSelectedLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>, leaveApplicationId: string) => void;
  setLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>) => void;

  getLeaveLedger: () => void;
  getLeaveLedgerSuccess: (response: Array<LeaveLedgerEntry>) => void;
  getLeaveLedgerFail: (error: string) => void;

  setSelectedLeaveBenefit: (selectedLeaveBenefit: MutatedLeaveBenefit) => void;

  postLeaveAdjustment: LeaveAdjustmentResponse;
  setPostLeaveAdjustment: (postLeaveAdjustment: LeaveAdjustmentResponse) => void;

  errorLeaveAdjustment: string;
  setErrorLeaveAdjustment: (errorLeaveAdjustment: string) => void;

  emptyResponse: () => void;
};

export const useLeaveLedgerStore = create<LeaveLedgerState>()(
  devtools((set) => ({
    leaveLedger: [],
    selectedLeaveBenefit: {} as MutatedLeaveBenefit,
    response: { postResponse: {} as LeaveLedgerEntry },

    loading: {
      loadingEntry: false,
      loadingLedger: false,
    },
    error: { errorEntry: '', errorLedger: '' },

    selectedLeaveLedger: [] as Array<LeaveLedgerEntry>,
    setSelectedLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>, leaveApplicationId: string) => {
      set((state) => ({
        ...state,
        selectedLeaveLedger: leaveLedger.filter((ledger) => ledger.leaveApplicationId == leaveApplicationId),
      }));
    },
    setLeaveLedger: (leaveLedger: Array<LeaveLedgerEntry>) => {
      set((state) => ({
        ...state,
        leaveLedger: leaveLedger,
      }));
    },

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

    setSelectedLeaveBenefit: (selectedLeaveBenefit: MutatedLeaveBenefit) =>
      set((state) => ({ ...state, selectedLeaveBenefit })),

    postLeaveAdjustment: {} as LeaveAdjustmentResponse,
    setPostLeaveAdjustment: (postLeaveAdjustment) => set({ postLeaveAdjustment }),

    errorLeaveAdjustment: '',
    setErrorLeaveAdjustment: (errorLeaveAdjustment) => set({ errorLeaveAdjustment }),

    emptyResponse: () =>
      set({
        postLeaveAdjustment: {} as LeaveAdjustmentResponse,
        error: { errorEntry: '', errorLedger: '' },
        errorLeaveAdjustment: '',
      }),
  }))
);
