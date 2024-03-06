/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type LeaveCalculatorSetting = {
  monetizationConstant: number | null;
};

export type LeaveMonetizationCalculatorState = {
  leaveCalculatorModalIsOpen: boolean;
  monetizationConstant: number | null;

  loading: {
    loadingMonetizationConstant: boolean;
  };
  error: {
    errorMonetizationConstant: string;
  };

  setLeaveCalculatorModalIsOpen: (leaveCalculatorModalIsOpen: boolean) => void;

  getMonetizationConstant: (loading: boolean) => void;
  getMonetizationConstantSuccess: (loading: boolean, response) => void;
  getMonetizationConstantFail: (loading: boolean, error: string) => void;
};

export const useLeaveMonetizationCalculatorStore = create<LeaveMonetizationCalculatorState>()(
  devtools((set) => ({
    leaveCalculatorModalIsOpen: false,
    monetizationConstant: null,

    loading: {
      loadingMonetizationConstant: false,
    },
    error: {
      errorMonetizationConstant: '',
    },

    setLeaveCalculatorModalIsOpen: (leaveCalculatorModalIsOpen: boolean) => {
      set((state) => ({ ...state, leaveCalculatorModalIsOpen }));
    },

    //GET PASS SLIP ACTIONS
    getMonetizationConstant: (loading: boolean) => {
      set((state) => ({
        ...state,
        monetizationConstant: 0,
        loading: {
          ...state.loading,
          loadingMonetizationConstant: loading,
        },
        error: {
          ...state.error,
          errorMonetizationConstant: '',
        },
      }));
    },
    getMonetizationConstantSuccess: (loading: boolean, response: LeaveCalculatorSetting) => {
      set((state) => ({
        ...state,
        monetizationConstant: response.monetizationConstant,
        loading: {
          ...state.loading,
          loadingMonetizationConstant: loading,
        },
      }));
    },
    getMonetizationConstantFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingMonetizationConstant: loading,
        },
        error: {
          ...state.error,
          errorMonetizationConstant: error,
        },
      }));
    },
  }))
);
